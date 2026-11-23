<?php

namespace App\Services;

use App\Helpers\AgregasiScope;
use App\Helpers\HitungAgregat;
use App\Helpers\RekapWilayah;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use App\Models\TransactionSirculation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * Angka sistem untuk Rekap Sirkulasi Wilayah: nilai bawaan tiap sel sebelum
 * staf kontrol menimpanya dengan angka WA kasir.
 * Rancangan: .agents/rekap_sirkulasi_wilayah.md
 *
 * Rumus tiap kolom SAMA dengan Rekap 2 (RekapTrait::getDataRekapDua), termasuk
 * gerbang alur baru vs alur lama. Bedanya hanya satuannya: Rekap 2 menghitung
 * satu kantor untuk sebulan, di sini satu wilayah untuk satu tanggal. Satu
 * wilayah bisa berisi 33 kantor dan 320 kelompok, jadi getDataRekapDua TIDAK
 * boleh dipanggil per kantor.
 *
 * Kalau angkanya berbeda dari Rekap 2, yang salah ada di sini — Rekap 2 yang
 * jadi patokan, bukan sebaliknya.
 */
class AngkaRekapWilayah
{
    /** Kolom nol, dipakai sebagai titik awal penjumlahan. */
    private const KOSONG = ['drop' => 0, 'storting' => 0, 'cm' => 0, 'mb' => 0, 'ml' => 0];

    /**
     * @return array<int, array<string, int>> branch_id => kolom KOLOM_HARIAN
     *         plus saldo_lama_cm & saldo_lama_mb
     */
    public static function untukWilayah(int $wilayah, string $tanggal): array
    {
        $tanggal = Carbon::parse($tanggal)->toDateString();
        $periode = Carbon::parse($tanggal)->startOfMonth()->toDateString();

        $kantor = Branch::where('wilayah', $wilayah)->where('isactive', true)
            ->orderBy('unit')->pluck('unit', 'id');

        if ($kantor->isEmpty()) {
            return [];
        }

        $grouping = TransactionLoanOfficerGrouping::whereIn('branch_id', $kantor->keys())
            ->get(['id', 'branch_id']);

        // gid => branch_id. Mutasi kelompok diabaikan di sini: dicek 2026-11-23,
        // 2.199 mutasi dan NOL yang lintas kantor, jadi penjumlahan per kantor
        // tidak berubah. Kalau nanti ada mutasi lintas kantor, drop harus
        // disaring Mutasi::saring seperti di RekapTrait.
        $milikKantor = $grouping->pluck('branch_id', 'id');

        // Gerbang per KANTOR, bukan per wilayah: satu wilayah bisa bercampur.
        $alurBaru = $kantor->keys()
            ->mapWithKeys(fn ($id) => [$id => AgregasiScope::pakaiAgregatBaru($id, $periode)]);

        $gidBaru = $grouping->filter(fn ($g) => $alurBaru[$g->branch_id])->pluck('id');
        $gidLama = $grouping->reject(fn ($g) => $alurBaru[$g->branch_id])->pluck('id');

        $awal = self::saldoAwal($gidBaru, $gidLama, $milikKantor, $periode);
        $gerak = self::dropStorting($gidBaru, $gidLama, $milikKantor, $periode, $tanggal);

        $dropCm = self::dropBulan($wilayah, RekapWilayah::bulanRujukan($tanggal, 'cm'));
        $dropMb = self::dropBulan($wilayah, RekapWilayah::bulanRujukan($tanggal, 'mb'));

        $hasil = [];
        foreach ($kantor as $id => $unit) {
            $a = $awal[$id] ?? ['sirkulasi' => 0, 'cm' => 0, 'mb' => 0, 'ml' => 0];
            $hari = $gerak[$id]['hari'] ?? self::KOSONG;
            $bulan = $gerak[$id]['bulan'] ?? self::KOSONG;

            $hasil[$id] = [
                'drop' => $hari['drop'],
                'total_drop' => $bulan['drop'],
                'storting' => $hari['storting'],
                'total_storting' => $bulan['storting'],
                'sirkulasi' => RekapWilayah::sirkulasiBerjalan($a['sirkulasi'], $bulan['drop'], $bulan['storting']),

                'angsuran_cm' => $hari['cm'],
                'total_angsuran_cm' => $bulan['cm'],
                'saldo_cm' => $a['cm'] - $bulan['cm'],

                'angsuran_mb' => $hari['mb'],
                'total_angsuran_mb' => $bulan['mb'],
                'saldo_mb' => $a['mb'] - $bulan['mb'],

                'angsuran_ml' => $hari['ml'],
                'total_angsuran_ml' => $bulan['ml'],
                'saldo_ml' => $a['ml'] - $bulan['ml'],

                // Saldo awal bulan, dipakai kolom tambahan di tanggal 1.
                'awal_sirkulasi' => $a['sirkulasi'],
                'awal_cm' => $a['cm'],
                'awal_mb' => $a['mb'],
                'awal_ml' => $a['ml'],

                'saldo_lama_cm' => RekapWilayah::saldoLama($dropCm[$id] ?? 0),
                'saldo_lama_mb' => RekapWilayah::saldoLama($dropMb[$id] ?? 0),
            ];
        }

        return $hasil;
    }

    /**
     * Saldo awal bulan per kantor. Alur baru dari transaction_monthly_closings
     * (awal_*), alur lama dari transaction_sirculations — sama dengan
     * getDataRekapDua, termasuk rentang sebulan untuk jalur lama.
     */
    private static function saldoAwal($gidBaru, $gidLama, $milikKantor, string $periode): array
    {
        $hasil = [];
        $tambah = function ($gid, $sirkulasi, $cm, $mb, $ml) use (&$hasil, $milikKantor) {
            $b = $milikKantor[$gid] ?? null;
            if ($b === null) {
                return;
            }
            $hasil[$b] ??= ['sirkulasi' => 0, 'cm' => 0, 'mb' => 0, 'ml' => 0];
            $hasil[$b]['sirkulasi'] += (int) $sirkulasi;
            $hasil[$b]['cm'] += (int) $cm;
            $hasil[$b]['mb'] += (int) $mb;
            $hasil[$b]['ml'] += (int) $ml;
        };

        if ($gidBaru->isNotEmpty()) {
            TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $gidBaru)
                ->whereDate('periode', $periode)
                ->get(['transaction_loan_officer_grouping_id', 'awal_total', 'awal_cm', 'awal_mb', 'awal_ml'])
                ->each(fn ($r) => $tambah(
                    $r->transaction_loan_officer_grouping_id,
                    $r->awal_total, $r->awal_cm, $r->awal_mb, $r->awal_ml
                ));
        }

        if ($gidLama->isNotEmpty()) {
            TransactionSirculation::whereIn('transaction_loan_officer_grouping_id', $gidLama)
                ->whereBetween('date', [$periode, Carbon::parse($periode)->endOfMonth()->toDateString()])
                ->get(['transaction_loan_officer_grouping_id', 'amount', 'cm_amount', 'mb_amount', 'ml_amount'])
                ->each(fn ($r) => $tambah(
                    $r->transaction_loan_officer_grouping_id,
                    $r->amount, $r->cm_amount, $r->mb_amount, $r->ml_amount
                ));
        }

        return $hasil;
    }

    /**
     * Drop & storting per kantor: 'hari' (tanggal itu) dan 'bulan' (tanggal 1
     * s/d tanggal itu).
     *
     * @return array<int, array{hari: array<string,int>, bulan: array<string,int>}>
     */
    private static function dropStorting($gidBaru, $gidLama, $milikKantor, string $periode, string $tanggal): array
    {
        $hasil = [];
        // Satu titik masuk untuk kedua alur: tambahkan angka satu kelompok satu
        // tanggal, lalu tabel ini yang memilah 'hari' dan 'bulan'.
        $tambah = function ($gid, string $t, array $v) use (&$hasil, $milikKantor, $tanggal) {
            $b = $milikKantor[$gid] ?? null;
            if ($b === null) {
                return;
            }
            $hasil[$b] ??= ['hari' => self::KOSONG, 'bulan' => self::KOSONG];
            foreach (self::KOSONG as $k => $_) {
                $hasil[$b]['bulan'][$k] += (int) ($v[$k] ?? 0);
                if ($t === $tanggal) {
                    $hasil[$b]['hari'][$k] += (int) ($v[$k] ?? 0);
                }
            }
        };

        if ($gidBaru->isNotEmpty()) {
            self::alurBaru($gidBaru, $milikKantor, $periode, $tanggal, $tambah);
        }

        if ($gidLama->isNotEmpty()) {
            self::alurLama($gidLama, $periode, $tanggal, $tambah);
        }

        return $hasil;
    }

    /**
     * Alur baru, sama dengan getDataRekapDua: hari yang SUDAH dikunci dibaca
     * dari transaction_daily_closings (angka final yang dibekukan trigger),
     * sisanya dihitung langsung lewat HitungAgregat.
     *
     * Bedanya dari Rekap 2: batas "mulai hitung langsung" ditentukan PER
     * KANTOR, bukan satu untuk seluruh wilayah. Dicek 2026-11-23, Sidoarjo 5
     * belum terkunci sejak 2 November; kalau batasnya disatukan, satu kantor
     * itu memaksa 31 kantor lain dihitung ulang 19 hari (2,66 detik) padahal
     * angkanya sudah beku.
     */
    private static function alurBaru($gidBaru, $milikKantor, string $periode, string $tanggal, callable $tambah): void
    {
        $baris = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $gidBaru)
            ->whereBetween('date', [$periode, $tanggal])
            ->get(['transaction_loan_officer_grouping_id', 'date', 'kasir_lock_at',
                'drop', 'storting', 'storting_cm', 'storting_mb', 'storting_ml']);

        // Batas per kelompok: hari terbuka pertama, atau sehari sesudah kunci
        // terakhir. Lalu diambil yang paling awal di tiap kantor.
        $perGid = $baris->groupBy('transaction_loan_officer_grouping_id');

        $mulaiLive = [];
        foreach ($perGid as $gid => $isi) {
            $b = $milikKantor[$gid] ?? null;
            if ($b === null) {
                continue;
            }
            $terkunci = $isi->whereNotNull('kasir_lock_at');
            $batas = $terkunci->isEmpty()
                ? $periode
                : Carbon::parse($terkunci->max('date'))->addDay()->toDateString();
            $terbuka = $isi->whereNull('kasir_lock_at')
                ->min(fn ($r) => Carbon::parse($r->date)->toDateString());

            $mulaiLive[$b] = min($mulaiLive[$b] ?? $tanggal, $terbuka ?? $batas, $batas);
        }
        // Kelompok tanpa satu baris closing pun: tidak ada yang beku, hitung semua.
        // Dicek lewat $perGid, bukan $baris->contains() di dalam loop: 320
        // kelompok x 5.220 baris memakan 5,9 detik.
        foreach ($gidBaru as $gid) {
            $b = $milikKantor[$gid] ?? null;
            if ($b !== null && !isset($perGid[$gid])) {
                $mulaiLive[$b] = $periode;
            }
        }

        // Yang sudah beku dan masih di bawah batas kantornya: pakai angka closing.
        foreach ($baris->whereNotNull('kasir_lock_at') as $r) {
            $b = $milikKantor[$r->transaction_loan_officer_grouping_id] ?? null;
            $t = Carbon::parse($r->date)->toDateString();
            if ($b !== null && $t < ($mulaiLive[$b] ?? $periode)) {
                $tambah($r->transaction_loan_officer_grouping_id, $t, [
                    'drop' => $r->drop,
                    'storting' => $r->storting,
                    'cm' => $r->storting_cm,
                    'mb' => $r->storting_mb,
                    'ml' => $r->storting_ml,
                ]);
            }
        }

        // Sisanya dihitung langsung. Kantor dikelompokkan menurut batasnya
        // supaya satu kantor yang tertinggal tidak menarik yang lain.
        $perBatas = [];
        foreach ($gidBaru as $gid) {
            $b = $milikKantor[$gid] ?? null;
            $mulai = $b === null ? null : ($mulaiLive[$b] ?? $periode);
            if ($mulai !== null && $mulai <= $tanggal) {
                $perBatas[$mulai][] = $gid;
            }
        }
        foreach ($perBatas as $mulai => $ids) {
            foreach (HitungAgregat::harianBanyak($ids, $mulai, $tanggal) as $kunci => $v) {
                [$gid, $t] = explode('|', $kunci);
                $tambah($gid, $t, [
                    'drop' => $v['drop'] ?? 0,
                    'storting' => $v['storting'] ?? 0,
                    'cm' => $v['storting_cm'] ?? 0,
                    'mb' => $v['storting_mb'] ?? 0,
                    'ml' => $v['storting_ml'] ?? 0,
                ]);
            }
        }
    }

    /** Alur lama: langsung dari transaksi, sama dengan getDataRekapDua. */
    private static function alurLama($gidLama, string $periode, string $tanggal, callable $tambah): void
    {
        TransactionLoanInstalment::whereIn('transaction_loan_officer_grouping_id', $gidLama)
            ->whereBetween('transaction_date', [$periode, $tanggal])
            ->groupBy('transaction_loan_officer_grouping_id', 'transaction_date')
            ->selectRaw('transaction_loan_officer_grouping_id AS g, transaction_date AS d,
                SUM(nominal) AS storting,
                SUM(CASE WHEN status = 2 THEN nominal ELSE 0 END) AS cm,
                SUM(CASE WHEN status = 3 THEN nominal ELSE 0 END) AS mb,
                SUM(CASE WHEN status = 4 THEN nominal ELSE 0 END) AS ml')
            ->toBase()->get()
            ->each(fn ($r) => $tambah($r->g, Carbon::parse($r->d)->toDateString(), [
                'storting' => $r->storting, 'cm' => $r->cm, 'mb' => $r->mb, 'ml' => $r->ml,
            ]));

        TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $gidLama)
            ->where('status', 'success')
            ->whereBetween('drop_date', [$periode, $tanggal])
            ->groupBy('transaction_loan_officer_grouping_id', 'drop_date')
            ->selectRaw('transaction_loan_officer_grouping_id AS g, drop_date AS d, SUM(nominal_drop) AS n')
            ->toBase()->get()
            ->each(fn ($r) => $tambah($r->g, Carbon::parse($r->d)->toDateString(), ['drop' => $r->n]));
    }

    /**
     * Berapa kelompok di tiap kantor yang sudah di-TTD kasir dan di-ACC kepala
     * mantri pada tanggal itu. Dipakai staf kontrol sebagai penanda: kantor
     * yang kasirnya sendiri belum tanda tangan biasanya angkanya belum final.
     *
     * @return array<int, array{kasir: int, km: int, kelompok: int}>
     */
    public static function ttdKantor(int $wilayah, string $tanggal): array
    {
        $tanggal = Carbon::parse($tanggal)->toDateString();
        $periode = Carbon::parse($tanggal)->startOfMonth()->toDateString();

        $kantor = Branch::where('wilayah', $wilayah)->where('isactive', true)->pluck('id');
        $grouping = TransactionLoanOfficerGrouping::whereIn('branch_id', $kantor)->get(['id', 'branch_id']);
        $milikKantor = $grouping->pluck('branch_id', 'id');

        $hasil = [];
        foreach ($grouping as $g) {
            $hasil[$g->branch_id] ??= ['kasir' => 0, 'km' => 0, 'kelompok' => 0];
            $hasil[$g->branch_id]['kelompok']++;
        }

        $alurBaru = $kantor->mapWithKeys(fn ($id) => [$id => AgregasiScope::pakaiAgregatBaru($id, $periode)]);
        $gidBaru = $grouping->filter(fn ($g) => $alurBaru[$g->branch_id])->pluck('id');
        $gidLama = $grouping->reject(fn ($g) => $alurBaru[$g->branch_id])->pluck('id');

        $hitung = function ($gid, bool $kasir, bool $km) use (&$hasil, $milikKantor) {
            $b = $milikKantor[$gid] ?? null;
            if ($b === null) {
                return;
            }
            $hasil[$b]['kasir'] += $kasir ? 1 : 0;
            $hasil[$b]['km'] += $km ? 1 : 0;
        };

        if ($gidBaru->isNotEmpty()) {
            TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $gidBaru)
                ->whereDate('date', $tanggal)
                ->get(['transaction_loan_officer_grouping_id', 'kasir_lock_at', 'kepala_approval_at'])
                ->each(fn ($r) => $hitung(
                    $r->transaction_loan_officer_grouping_id,
                    $r->kasir_lock_at !== null,
                    $r->kepala_approval_at !== null
                ));
        }

        if ($gidLama->isNotEmpty()) {
            \App\Models\TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $gidLama)
                ->whereDate('date', $tanggal)
                ->get(['transaction_loan_officer_grouping_id', 'daily_kasir_approval', 'daily_kepala_approval'])
                ->each(fn ($r) => $hitung(
                    $r->transaction_loan_officer_grouping_id,
                    (bool) $r->daily_kasir_approval,
                    (bool) $r->daily_kepala_approval
                ));
        }

        return $hasil;
    }

    /**
     * Jumlah drop per kantor pada satu bulan, untuk saldo lama CM/MB.
     *
     * Sumbernya transaction_loans, bukan transaction_monthly_closings.drop:
     * closing hanya ada sejak periode Oktober 2026 sedangkan CM/MB butuh bulan
     * yang lebih lama, dan drop Oktober di closing sudah menyimpang 834,8 juta
     * dari transaksinya (Sidoarjo 2 dan Solo 1). Lihat spec §6.
     *
     * Angkanya tetap sepanjang bulan, jadi boleh disimpan sementara.
     *
     * @return array<int, int> branch_id => jumlah drop
     */
    private static function dropBulan(int $wilayah, string $periode): array
    {
        return Cache::remember("rekap_wilayah:drop:$wilayah:$periode", now()->addHours(6), function () use ($wilayah, $periode) {
            $akhir = Carbon::parse($periode)->endOfMonth()->toDateString();

            return TransactionLoan::join(
                'transaction_loan_officer_groupings as g',
                'g.id', '=', 'transaction_loans.transaction_loan_officer_grouping_id'
            )
                ->join('branches as b', 'b.id', '=', 'g.branch_id')
                ->where('b.wilayah', $wilayah)
                ->where('transaction_loans.status', 'success')
                ->whereBetween('transaction_loans.drop_date', [$periode, $akhir])
                ->groupBy('g.branch_id')
                ->selectRaw('g.branch_id AS b, SUM(transaction_loans.nominal_drop) AS n')
                ->toBase()->get()
                ->mapWithKeys(fn ($r) => [(int) $r->b => (int) $r->n])
                ->all();
        });
    }
}
