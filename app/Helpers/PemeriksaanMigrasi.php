<?php

namespace App\Helpers;

use App\Models\TransactionSaldoAdjustment;
use App\Models\WorkDay;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Pemeriksaan satu kantor sebelum dimigrasikan: anomali data, usulan tanggal
 * kunci otomatis, dan pratinjau angka harian yang akan dikunci.
 *
 * Cakupannya transaksi sejak bulan mulai (dan pinjaman yang masih hidup).
 * Masalah pada pinjaman lama yang sudah lunas adalah fosil — tidak ikut.
 *
 * Anomali MENAHAN = sesudah hari dikunci, datanya tidak bisa dibetulkan lagi
 * atau angkanya hilang dari rekap. PERINGATAN = ditampilkan, tidak menahan.
 */
class PemeriksaanMigrasi
{
    private const CONTOH = 50;

    /**
     * @return array<int, array{kode:string,judul:string,menahan:bool,jumlah:int,contoh:array}>
     */
    public static function anomali(int $branchId, Carbon $mulai): array
    {
        $ids = self::grouping($branchId)->keys()->all();
        if (empty($ids)) {
            return [];
        }

        $mulai = $mulai->toDateString();
        $hariIni = Carbon::today()->toDateString();
        $libur = self::tanggalLibur($mulai, $hariIni);

        $pinjaman = fn() => DB::table('transaction_loans as l')
            ->join('transaction_loan_officer_groupings as g', 'g.id', '=', 'l.transaction_loan_officer_grouping_id')
            ->leftJoin('transaction_manage_customers as m', 'm.id', '=', 'l.transaction_manage_customer_id')
            ->leftJoin('transaction_customers as c', 'c.id', '=', 'm.transaction_customer_id');
        $angsuran = fn() => $pinjaman()->join('transaction_loan_instalments as i', 'i.transaction_loan_id', '=', 'l.id');

        $kolomAngsuran = ['l.id', 'c.nama', 'g.kelompok', 'l.hari', 'i.transaction_date as tanggal', 'i.nominal'];
        $kolomPinjaman = ['l.id', 'c.nama', 'g.kelompok', 'l.hari', 'l.drop_date as tanggal', 'l.pinjaman as nominal'];

        $hasil = [];
        // $buku: halaman tempat membetulkan baris - 'storting' (buku angsuran),
        // 'transaksi' (buku drop), 'penyesuaian', atau null; string atau fn($r).
        $tambah = function (string $kode, string $judul, bool $menahan, $baris, ?callable $ket = null, $buku = null) use (&$hasil) {
            $baris = collect($baris)->values();
            $hasil[] = [
                'kode' => $kode,
                'judul' => $judul,
                'menahan' => $menahan,
                'jumlah' => $baris->count(),
                'contoh' => $baris->take(self::CONTOH)->map(fn($r) => [
                    'id' => $r->id,
                    'nama' => $r->nama,
                    'kelompok' => $r->kelompok,
                    'hari' => $r->hari,
                    'tanggal' => $r->tanggal ? Carbon::parse($r->tanggal)->toDateString() : null,
                    'nominal' => (int) $r->nominal,
                    'ket' => $ket ? $ket($r) : null,
                    'buku' => is_callable($buku) ? $buku($r) : $buku,
                ])->all(),
            ];
        };

        // 1. Tanggal di masa depan.
        $tambah('masa_depan', 'Angsuran / drop bertanggal di masa depan', true, collect()
            ->merge($angsuran()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->where('i.transaction_date', '>', $hariIni)->get([...$kolomAngsuran, DB::raw("'angsuran' as ket")]))
            ->merge($pinjaman()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->where('l.drop_date', '>', $hariIni)->get([...$kolomPinjaman, DB::raw("'drop' as ket")])),
            fn($r) => $r->ket, fn($r) => $r->ket === 'drop' ? 'transaksi' : 'storting');

        // 2. Angsuran sebelum tanggal drop.
        $tambah('sebelum_drop', 'Angsuran bertanggal sebelum tanggal drop', true,
            $angsuran()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->where('l.drop_date', '>=', $mulai)
                ->whereColumn('i.transaction_date', '<', 'l.drop_date')
                ->get([...$kolomAngsuran, 'l.drop_date']),
            fn($r) => 'drop ' . Carbon::parse($r->drop_date)->toDateString(), 'storting');

        // 3. Saldo minus pada pinjaman yang masih ditagih sejak bulan mulai.
        $tambah('saldo_minus', 'Saldo minus (angsuran + pemutihan melebihi pinjaman)', true,
            $pinjaman()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->where('l.status', 'success')
                ->whereExists(fn($q) => $q->select(DB::raw(1))->from('transaction_loan_instalments as x')
                    ->whereColumn('x.transaction_loan_id', 'l.id')->where('x.transaction_date', '>=', $mulai))
                ->whereRaw('l.pinjaman
                    - (SELECT IFNULL(SUM(nominal),0) FROM transaction_loan_instalments WHERE transaction_loan_id = l.id)
                    - (SELECT IFNULL(SUM(nominal),0) FROM transaction_white_offs WHERE transaction_loan_id = l.id) < 0')
                ->get([...$kolomPinjaman, DB::raw('l.pinjaman
                    - (SELECT IFNULL(SUM(nominal),0) FROM transaction_loan_instalments WHERE transaction_loan_id = l.id)
                    - (SELECT IFNULL(SUM(nominal),0) FROM transaction_white_offs WHERE transaction_loan_id = l.id) AS saldo')]),
            fn($r) => 'saldo ' . number_format($r->saldo, 0, ',', '.'), 'storting');

        // 4. Pinjaman berjalan tanpa hari tagih: tidak ikut portofolio.
        $tambah('tanpa_hari', 'Pinjaman berjalan tanpa hari tagih', true,
            $pinjaman()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->where('l.status', 'success')->whereNull('l.hari')
                ->whereRaw('l.pinjaman
                    - (SELECT IFNULL(SUM(nominal),0) FROM transaction_loan_instalments WHERE transaction_loan_id = l.id)
                    - (SELECT IFNULL(SUM(nominal),0) FROM transaction_white_offs WHERE transaction_loan_id = l.id) > 0')
                ->get($kolomPinjaman), null, 'transaksi');

        // 5. Angsuran pada pinjaman yang tidak success.
        $tambah('bukan_success', 'Angsuran pada pinjaman yang tidak berstatus success', true,
            $angsuran()->whereIn('i.transaction_loan_officer_grouping_id', $ids)
                ->where('i.transaction_date', '>=', $mulai)
                ->where('l.status', '<>', 'success')
                ->get([...$kolomAngsuran, 'l.status']),
            fn($r) => 'status ' . $r->status, 'transaksi');

        // 6. Kelompok angsuran berbeda dengan kelompok pinjaman (dua arah).
        $beda = fn($sisi) => $angsuran()
            ->join('transaction_loan_officer_groupings as gi', 'gi.id', '=', 'i.transaction_loan_officer_grouping_id')
            ->whereIn($sisi, $ids)
            ->where('i.transaction_date', '>=', $mulai)
            ->whereColumn('i.transaction_loan_officer_grouping_id', '<>', 'l.transaction_loan_officer_grouping_id')
            ->get([...$kolomAngsuran, 'i.id as angsuran_id', 'gi.kelompok as kelompok_angsuran', 'gi.branch_id as kantor_angsuran']);
        $tambah('kelompok_beda', 'Kelompok angsuran berbeda dengan kelompok pinjaman', true,
            $beda('i.transaction_loan_officer_grouping_id')->merge($beda('l.transaction_loan_officer_grouping_id'))->unique('angsuran_id'),
            fn($r) => 'tercatat di kelompok ' . $r->kelompok_angsuran . ((int) $r->kantor_angsuran !== $branchId ? ' (kantor lain)' : ''), 'storting');

        // 7. Transaksi di hari libur: tidak punya baris harian.
        $tambah('hari_libur', 'Angsuran / drop di hari Minggu atau hari libur', true, collect()
            ->merge($angsuran()->whereIn('i.transaction_loan_officer_grouping_id', $ids)
                ->whereIn('i.transaction_date', $libur)->get([...$kolomAngsuran, DB::raw("'angsuran' as ket")]))
            ->merge($pinjaman()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->where('l.status', 'success')
                ->whereIn('l.drop_date', $libur)->get([...$kolomPinjaman, DB::raw("'drop' as ket")])),
            fn($r) => $r->ket, fn($r) => $r->ket === 'drop' ? 'transaksi' : 'storting');

        // 9. Pengajuan yang tanggal dropnya sudah lewat tapi belum diputuskan.
        //    Peringatan (keputusan mas 2026-10-05); di hari yang dikunci
        //    trigger tl_kunci_before_update membekukan statusnya.
        $tambah('menggantung', 'Pengajuan menggantung (open/acc, drop sudah lewat) — status beku begitu harinya dikunci', false,
            $pinjaman()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->whereIn('l.status', ['open', 'acc'])
                ->where('l.drop_date', '>=', $mulai)->where('l.drop_date', '<', $hariIni)
                ->orderBy('l.drop_date')
                ->get([...$kolomPinjaman, 'l.status']),
            fn($r) => 'status ' . $r->status, 'transaksi');

        // 11. Rekap harian lama dobel: kasbon/transport disalin dari salah satunya.
        $tambah('rekap_dobel', 'Rekap harian lama dobel (kelompok × tanggal sama)', true,
            DB::table('transaction_daily_recaps as r')
                ->join('transaction_loan_officer_groupings as g', 'g.id', '=', 'r.transaction_loan_officer_grouping_id')
                ->whereIn('r.transaction_loan_officer_grouping_id', $ids)
                ->where('r.date', '>=', $mulai)
                ->groupBy('r.transaction_loan_officer_grouping_id', 'r.date', 'g.kelompok')
                ->havingRaw('COUNT(*) > 1')
                ->get([DB::raw('NULL as id'), DB::raw('NULL as nama'), 'g.kelompok', DB::raw('NULL as hari'),
                    'r.date as tanggal', DB::raw('SUM(r.kasbon + r.transport) as nominal'), DB::raw('COUNT(*) as n')]),
            fn($r) => $r->n . ' baris');

        // 12. Rekap harian lama di hari libur: tidak punya baris harian baru,
        //     jadi kasbon/transportnya tidak ikut tersalin. Menahan hanya kalau
        //     ada nilainya; rekap libur yang isinya nol cukup ditampilkan.
        $rekapLibur = DB::table('transaction_daily_recaps as r')
            ->join('transaction_loan_officer_groupings as g', 'g.id', '=', 'r.transaction_loan_officer_grouping_id')
            ->whereIn('r.transaction_loan_officer_grouping_id', $ids)
            ->whereIn('r.date', $libur)
            ->get([DB::raw('NULL as id'), DB::raw('NULL as nama'), 'g.kelompok', DB::raw('NULL as hari'),
                'r.date as tanggal', DB::raw('IFNULL(r.kasbon,0) + IFNULL(r.transport,0) as nominal'), 'r.kasbon', 'r.transport']);
        $tambah('rekap_libur', 'Rekap harian lama di hari Minggu atau hari libur', $rekapLibur->contains(fn($r) => $r->nominal != 0),
            $rekapLibur, fn($r) => 'kasbon ' . (int) $r->kasbon . ', transport ' . (int) $r->transport);

        // --- Peringatan ---

        // 8. Satu pinjaman, lebih dari satu pemutihan.
        $tambah('pemutihan_ganda', 'Pinjaman dengan lebih dari satu pemutihan', false,
            $pinjaman()->whereIn('l.transaction_loan_officer_grouping_id', $ids)
                ->join('transaction_white_offs as w', 'w.transaction_loan_id', '=', 'l.id')
                ->groupBy('l.id', 'c.nama', 'g.kelompok', 'l.hari')
                ->havingRaw('COUNT(*) > 1')
                ->get(['l.id', 'c.nama', 'g.kelompok', 'l.hari', DB::raw('MAX(w.transaction_date) as tanggal'),
                    DB::raw('SUM(w.nominal) as nominal'), DB::raw('COUNT(*) as n')]),
            fn($r) => $r->n . ' pemutihan', 'storting');

        // 10. Penyesuaian yang menunggu persetujuan: belum dihitung di saldo.
        $tambah('penyesuaian_menunggu', 'Penyesuaian saldo menunggu persetujuan', false,
            $pinjaman()->join('transaction_saldo_adjustments as a', 'a.transaction_loan_id', '=', 'l.id')
                ->whereIn('a.transaction_loan_officer_grouping_id', $ids)
                ->whereIn('a.jenis', TransactionSaldoAdjustment::WAJIB_PERSETUJUAN)
                ->whereNull('a.approved_at')
                ->get(['l.id', 'c.nama', 'g.kelompok', 'l.hari', 'a.berlaku_bulan as tanggal', 'a.nominal', 'a.jenis']),
            fn($r) => $r->jenis, 'penyesuaian');

        // 13. Angsuran bernominal nol.
        $tambah('angsuran_nol', 'Angsuran bernominal 0', false,
            $angsuran()->whereIn('i.transaction_loan_officer_grouping_id', $ids)
                ->where('i.transaction_date', '>=', $mulai)->where('i.nominal', 0)
                ->orderBy('i.transaction_date')
                ->get($kolomAngsuran), null, 'storting');

        // 14. Angsuran kembar: pinjaman & tanggal sama.
        $tambah('angsuran_kembar', 'Angsuran kembar (pinjaman & tanggal sama)', false,
            $angsuran()->whereIn('i.transaction_loan_officer_grouping_id', $ids)
                ->where('i.transaction_date', '>=', $mulai)
                ->groupBy('l.id', 'c.nama', 'g.kelompok', 'l.hari', 'i.transaction_date')
                ->havingRaw('COUNT(*) > 1')
                ->get(['l.id', 'c.nama', 'g.kelompok', 'l.hari', 'i.transaction_date as tanggal',
                    DB::raw('SUM(i.nominal) as nominal'), DB::raw('COUNT(*) as n')]),
            fn($r) => $r->n . ' baris', 'storting');

        return $hasil;
    }

    /** Jumlah anomali yang menahan migrasi. */
    public static function jumlahMenahan(array $anomali): int
    {
        return collect($anomali)->where('menahan', true)->sum('jumlah');
    }

    /**
     * Usulan tanggal kunci otomatis: tanggal terakhir sejak bulan mulai yang
     * sudah dikunci kasir di alur lama, paling lambat kemarin.
     */
    public static function usulanKunci(int $branchId, Carbon $mulai): ?string
    {
        $tgl = DB::table('transaction_daily_recaps')
            ->whereIn('transaction_loan_officer_grouping_id', self::grouping($branchId)->keys())
            ->where('date', '>=', $mulai->toDateString())
            ->where('date', '<', Carbon::today()->toDateString())
            ->whereNotNull('daily_kasir_approval')
            ->max('date');

        return $tgl ? Carbon::parse($tgl)->toDateString() : null;
    }

    /**
     * Pratinjau angka yang akan dikunci: drop & storting hasil hitung ulang
     * dari sumber dibandingkan rekap harian lama, per tanggal.
     *
     * @return array<int, array<string,mixed>>
     */
    public static function pratinjau(int $branchId, Carbon $mulai, Carbon $sampai): array
    {
        $kelompok = self::grouping($branchId);
        $ids = $kelompok->keys()->all();
        if (empty($ids)) {
            return [];
        }

        $baru = HitungAgregat::harianBanyak($ids, $mulai, $sampai);
        $lama = DB::table('transaction_daily_recaps')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('date', [$mulai->toDateString(), $sampai->toDateString()])
            ->get(['transaction_loan_officer_grouping_id as g', 'date', 'drop', 'storting'])
            ->groupBy(fn($r) => $r->g . '|' . Carbon::parse($r->date)->toDateString());

        $hasil = [];
        for ($t = $mulai->copy(); $t->lte($sampai); $t->addDay()) {
            $tgl = $t->toDateString();
            $hari = ['tanggal' => $tgl, 'drop_baru' => 0, 'drop_lama' => 0, 'storting_baru' => 0, 'storting_lama' => 0, 'beda' => []];

            foreach ($ids as $g) {
                $b = $baru["$g|$tgl"] ?? null;
                $l = $lama->get("$g|$tgl");
                if (!$b && !$l) {
                    continue;
                }
                $angka = [
                    'kelompok' => $kelompok[$g],
                    'drop_baru' => (int) ($b['drop'] ?? 0),
                    'drop_lama' => (int) ($l?->sum('drop') ?? 0),
                    'storting_baru' => (int) ($b['storting'] ?? 0),
                    'storting_lama' => (int) ($l?->sum('storting') ?? 0),
                ];
                foreach (['drop_baru', 'drop_lama', 'storting_baru', 'storting_lama'] as $k) {
                    $hari[$k] += $angka[$k];
                }
                if ($angka['drop_baru'] !== $angka['drop_lama'] || $angka['storting_baru'] !== $angka['storting_lama']) {
                    $hari['beda'][] = $angka;
                }
            }

            if ($hari['drop_baru'] || $hari['drop_lama'] || $hari['storting_baru'] || $hari['storting_lama']) {
                $hasil[] = $hari;
            }
        }

        return $hasil;
    }

    /** grouping_id => kelompok */
    private static function grouping(int $branchId)
    {
        return DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $branchId)->orderBy('kelompok')->pluck('kelompok', 'id');
    }

    /** Tanggal bukan hari kerja dari $dari s/d $sampai. */
    private static function tanggalLibur(string $dari, string $sampai): array
    {
        $kerja = [];
        for ($b = Carbon::parse($dari)->startOfMonth(); $b->lte(Carbon::parse($sampai)); $b->addMonth()) {
            foreach (WorkDay::hariKerjaBulan($b) as $t) {
                $kerja[$t->toDateString()] = true;
            }
        }

        $libur = [];
        for ($t = Carbon::parse($dari); $t->lte(Carbon::parse($sampai)); $t->addDay()) {
            if (!isset($kerja[$t->toDateString()])) {
                $libur[] = $t->toDateString();
            }
        }

        return $libur;
    }
}
