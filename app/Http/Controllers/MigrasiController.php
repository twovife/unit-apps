<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\TransactionSaldoAdjustment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Perkakas persiapan migrasi ke alur agregasi baru.
 *
 * Isinya laporan BACA-SAJA. Tidak ada satu pun method di sini yang menulis ke
 * tabel transaksi. Lihat .agents/agregasi_rekap.md.
 */
class MigrasiController extends Controller
{
    /**
     * Berapa bulan jarak minimal drop_date supaya sebuah pinjaman terhitung ML.
     * Golongan: selisih 0-2 lancar, 3 CM, 4 MB, >=5 ML.
     */
    private const SELISIH_BULAN_ML = 5;

    /**
     * Stock-take ML: bandingkan `ml_amount` (kuota yang dinyatakan kantor)
     * dengan saldo ML dari data nyata, per (kelompok, hari).
     *
     * Grain (kelompok, hari) disengaja — menggabungkannya per mantri
     * menyembunyikan selisih antar hari yang saling meniadakan. Diukur Juli
     * 2026: Rp 1,11 miliar hilang dari pandangan kalau digabung.
     * Lihat §13.3.
     *
     * Laporan ini TIDAK memaksa angka cocok dan tidak menulis apa pun. Yang
     * dipakai dari selisihnya cuma arah (buka/tutup pintu input ML) dan
     * besarnya (kuota saat terbuka).
     */
    public function stockTakeMl(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Laporan ini untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();

        $groupings = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)
            ->orderBy('kelompok')
            ->get(['id', 'kelompok']);

        $groupingIds = $groupings->pluck('id')->all();

        $diminta = Carbon::now()->startOfMonth();
        $mundur = false;

        if ($request->filled('periode')) {
            // Pilihan eksplisit user selalu menang - termasuk kalau bulannya
            // memang kosong, karena "kosong" itu sendiri informasi.
            $periode = Carbon::parse($request->periode)->startOfMonth();
        } else {
            $periode = $this->periodeTerakhirBerdata($groupingIds, $diminta);
            $mundur = !$periode->equalTo($diminta);
        }

        // ML pada periode P = selisih bulan >= 5, yaitu drop_date jatuh
        // sebelum awal bulan (P - 4). Contoh P = Juli 2026 -> batas 1 Maret
        // 2026: drop Februari (selisih 5) masuk, drop Maret (selisih 4, masih
        // MB) tidak.
        $batasMl = $periode->copy()->subMonthsNoOverflow(self::SELISIH_BULAN_ML - 1);

        $baris = $groupings->isEmpty()
            ? collect()
            : $this->susunBarisStockTake($groupings, $periode, $batasMl);

        return Inertia::render('Migrasi/StockTakeMl', [
            'datas' => $baris->values(),
            'server_filter' => [
                'periode' => $periode->format('Y-m-d'),
                'periode_diminta' => $diminta->format('Y-m-d'),
                'periode_mundur' => $mundur,
                'batas_ml' => $batasMl->format('Y-m-d'),
                'branch_id' => $scope->branch_id,
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                'mulai_pendataan_baru' => AgregasiScope::tanggalMulai($scope->branch_id)?->format('Y-m-d'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
            ],
            'ringkasan' => $this->ringkas($baris),
        ]);
    }

    /**
     * Kesiapan closing lama: telusuri hari demi hari dari tanggal 1, berhenti
     * di hari pertama yang salah satu approval-nya belum ada.
     *
     * KENAPA BERHENTI, BUKAN MENGHITUNG TOTAL
     * ---------------------------------------
     * Rekap harian hanya bisa dipercaya sebagai rangkaian. Kalau tanggal 5
     * belum diteken kasir, angka tanggal 6 ke atas tidak otomatis batal — tapi
     * saldo berjalannya sudah tidak bisa ditelusuri lewat rantai yang utuh.
     * Jadi yang berguna diketahui bukan "berapa hari yang lengkap", melainkan
     * "sampai hari ke berapa rantainya masih utuh".
     *
     * Angka 22 dari 27 hari terisi bisa terdengar bagus, padahal kalau yang
     * bolong justru hari pertama, rantainya putus sejak awal.
     */
    public function kesiapanClosing(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Laporan ini untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();

        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : Carbon::now()->startOfMonth();

        $groupings = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)
            ->orderBy('kelompok')
            ->get(['id', 'kelompok']);

        $rekap = DB::table('transaction_daily_recaps')
            ->whereIn('transaction_loan_officer_grouping_id', $groupings->pluck('id'))
            ->whereBetween('date', [
                $periode->toDateString(),
                $periode->copy()->endOfMonth()->toDateString(),
            ])
            ->orderBy('date')
            ->get([
                'transaction_loan_officer_grouping_id AS g',
                'date',
                'drop',
                'storting',
                'daily_kepala_approval AS kepala',
                'daily_kasir_approval AS kasir',
            ])
            ->groupBy('g');

        $datas = $groupings->map(function ($g) use ($rekap) {
            $baris = $rekap->get($g->id, collect());
            $putus = false;

            $hari = $baris->map(function ($r) use (&$putus) {
                $adaKepala = $r->kepala !== null;
                $adaKasir = $r->kasir !== null;
                $lengkap = $adaKepala && $adaKasir;

                // Begitu satu hari tidak lengkap, seluruh hari sesudahnya
                // ditandai "di luar rantai" - bukan karena angkanya salah,
                // tapi karena tidak lagi bisa ditelusuri sebagai rangkaian.
                $diLuarRantai = $putus;
                if (!$lengkap) {
                    $putus = true;
                }

                return [
                    'tanggal' => Carbon::parse($r->date)->toDateString(),
                    'drop' => (int) $r->drop,
                    'storting' => (int) $r->storting,
                    'kepala' => $adaKepala,
                    'kasir' => $adaKasir,
                    'lengkap' => $lengkap,
                    'di_luar_rantai' => $diLuarRantai,
                ];
            })->values();

            $utuhSampai = null;
            foreach ($hari as $h) {
                if (!$h['lengkap']) {
                    break;
                }
                $utuhSampai = $h['tanggal'];
            }

            return [
                'kelompok' => $g->kelompok,
                'hari' => $hari,
                'jumlah_hari' => $hari->count(),
                'jumlah_lengkap' => $hari->where('lengkap', true)->count(),
                'utuh_sampai' => $utuhSampai,
                'putus_di' => $hari->firstWhere('lengkap', false)['tanggal'] ?? null,
            ];
        })->values();

        return Inertia::render('Migrasi/KesiapanClosing', [
            'datas' => $datas,
            'server_filter' => [
                'periode' => $periode->format('Y-m-d'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'branch_id' => $scope->branch_id,
            ],
        ]);
    }

    /**
     * Periode bawaan: bulan berjalan kalau sudah punya baris sirkulasi, kalau
     * belum mundur ke periode terakhir yang punya.
     *
     * Kenapa perlu: baris sirkulasi sebuah periode baru lahir saat bulan
     * SEBELUMNYA ditutup. Jadi di awal setiap bulan - sebelum satu pun kantor
     * menutup buku - bulan berjalan pasti belum punya baris, dan halaman ini
     * akan menampilkan semua kelompok sebagai "belum dinyatakan" dengan kolom
     * kuota kosong. Secara angka itu benar, tapi terbaca seperti halaman rusak.
     *
     * Mundur hanya berlaku untuk BAWAAN. Kalau user memilih periode sendiri,
     * pilihannya dihormati apa adanya - termasuk bulan kosong, karena "kosong"
     * itu sendiri jawaban yang dia cari.
     */
    private function periodeTerakhirBerdata(array $groupingIds, Carbon $diminta): Carbon
    {
        if (empty($groupingIds)) {
            return $diminta;
        }

        $adaDiBulanIni = DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->where('date', $diminta->format('Y-m-d'))
            ->exists();

        if ($adaDiBulanIni) {
            return $diminta;
        }

        $terakhir = DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->where('date', '<', $diminta->format('Y-m-d'))
            ->max('date');

        return $terakhir ? Carbon::parse($terakhir)->startOfMonth() : $diminta;
    }

    /**
     * Gabungkan sisi data (X) dan sisi kuota (Y) jadi satu baris per
     * (kelompok, hari), lalu tetapkan status pintunya.
     */
    private function susunBarisStockTake($groupings, Carbon $periode, Carbon $batasMl)
    {
        $groupingIds = $groupings->pluck('id')->all();
        $namaKelompok = $groupings->pluck('kelompok', 'id');

        $xPerBaris = $this->saldoMlDariData($groupingIds, $batasMl);
        $yPerBaris = $this->kuotaDinyatakan($groupingIds, $periode);

        // Union kunci dari kedua sisi: baris yang cuma punya salah satunya
        // justru yang paling perlu terlihat.
        return collect($xPerBaris->keys())
            ->merge($yPerBaris->keys())
            ->unique()
            ->sort()
            ->map(function ($kunci) use ($xPerBaris, $yPerBaris, $namaKelompok) {
                [$groupingId, $hari] = explode('|', $kunci);

                $x = $xPerBaris->get($kunci);
                $y = $yPerBaris->get($kunci);

                return array_merge([
                    'grouping_id' => (int) $groupingId,
                    'kelompok' => $namaKelompok->get((int) $groupingId),
                    'hari' => $hari,
                    'jumlah_pinjaman_ml' => (int) ($x['jml'] ?? 0),
                    'data_nyata' => (int) ($x['saldo'] ?? 0),
                    'kuota_dinyatakan' => $y,
                ], $this->tetapkanStatus($y, (int) ($x['saldo'] ?? 0)));
            });
    }

    /**
     * X — saldo ML dari data nyata per (kelompok, hari).
     *
     * saldo = pinjaman − angsuran − pemutihan + SUM(efek penyesuaian)
     *
     * Ekspresi efek penyesuaian dibangkitkan dari
     * TransactionSaldoAdjustment::ARAH, BUKAN ditulis ulang di SQL — supaya
     * arah tanda tetap punya satu sumber kebenaran.
     */
    private function saldoMlDariData(array $groupingIds, Carbon $batasMl)
    {
        $efek = $this->ekspresiEfekPenyesuaian();
        $saldo = "(l.pinjaman - IFNULL(l.total_angsuran,0) - IFNULL(w.wo,0) + IFNULL(a.efek,0))";

        $rows = DB::table(DB::raw('transaction_loans l'))
            ->leftJoin(DB::raw(
                '(SELECT transaction_loan_id, SUM(nominal) wo
                    FROM transaction_white_offs GROUP BY transaction_loan_id) w'
            ), 'w.transaction_loan_id', '=', 'l.id')
            ->leftJoin(DB::raw(
                "(SELECT transaction_loan_id, SUM($efek) efek
                    FROM transaction_saldo_adjustments
                   WHERE jenis NOT IN ('" . implode("','", TransactionSaldoAdjustment::WAJIB_PERSETUJUAN) . "')
                      OR approved_at IS NOT NULL
                   GROUP BY transaction_loan_id) a"
            ), 'a.transaction_loan_id', '=', 'l.id')
            ->whereIn('l.transaction_loan_officer_grouping_id', $groupingIds)
            ->where('l.status', 'success')
            ->where('l.drop_date', '<', $batasMl->format('Y-m-d'))
            ->whereNotNull('l.hari')
            ->whereRaw("$saldo > 0")
            ->groupBy('l.transaction_loan_officer_grouping_id', DB::raw('LOWER(l.hari)'))
            ->get([
                DB::raw('l.transaction_loan_officer_grouping_id AS g'),
                DB::raw('LOWER(l.hari) AS hari'),
                DB::raw("SUM($saldo) AS saldo"),
                DB::raw('COUNT(*) AS jml'),
            ]);

        return $rows->keyBy(fn($r) => $r->g . '|' . $r->hari)
            ->map(fn($r) => ['saldo' => $r->saldo, 'jml' => $r->jml]);
    }

    /**
     * Y — kuota yang dinyatakan kantor, dari transaction_sirculations.
     *
     * NULL (bukan 0) kalau kelompok+hari itu tidak punya baris sirkulasi sama
     * sekali. Bedanya penting: "dinyatakan nol" beda dari "belum pernah
     * dinyatakan", dan ±23% kelompok memang tidak punya barisnya.
     */
    private function kuotaDinyatakan(array $groupingIds, Carbon $periode)
    {
        return DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->where('date', $periode->format('Y-m-d'))
            ->groupBy('transaction_loan_officer_grouping_id', DB::raw('LOWER(day)'))
            ->get([
                DB::raw('transaction_loan_officer_grouping_id AS g'),
                DB::raw('LOWER(day) AS hari'),
                DB::raw('SUM(ml_amount) AS y'),
            ])
            ->keyBy(fn($r) => $r->g . '|' . $r->hari)
            ->map(fn($r) => (int) $r->y);
    }

    /**
     * Aturan gerbang input ML susulan (§13.3).
     *
     * Perbandingan ini HANYA sah dipakai sekali, saat serah terima. Setelah
     * kantor migrasi, yang berlaku adalah sisa kuota tersimpan yang hanya bisa
     * berkurang — kalau perbandingan ini dijalankan ulang tiap bulan, pintunya
     * akan terbuka lagi tiap kali nasabah ML membayar (karena X turun), dan
     * staf dipersilakan menambah ML fiktif senilai setoran yang baru masuk.
     */
    private function tetapkanStatus(?int $y, int $x): array
    {
        if ($y === null) {
            return [
                'status' => 'belum_dinyatakan',
                'kuota_awal' => null,
                'keterangan' => 'Belum punya baris sirkulasi — kuota belum pernah dinyatakan',
            ];
        }

        if ($y > $x) {
            return [
                'status' => 'dibuka',
                'kuota_awal' => $y - $x,
                'keterangan' => 'Masih ada ML yang orangnya belum masuk sistem',
            ];
        }

        return [
            'status' => 'ditutup',
            'kuota_awal' => 0,
            'keterangan' => $y === $x
                ? 'Kuota sudah penuh'
                : 'Data sudah melebihi kuota yang dinyatakan',
        ];
    }

    private function ringkas($baris): array
    {
        $per = fn(string $status) => $baris->where('status', $status);

        return [
            'dibuka' => [
                'baris' => $per('dibuka')->count(),
                'kuota' => (int) $per('dibuka')->sum('kuota_awal'),
            ],
            'ditutup' => ['baris' => $per('ditutup')->count()],
            'belum_dinyatakan' => [
                'baris' => $per('belum_dinyatakan')->count(),
                'data_nyata' => (int) $per('belum_dinyatakan')->sum('data_nyata'),
            ],
            'total_baris' => $baris->count(),
        ];
    }

    /**
     * Bangun ekspresi SQL untuk efek bertanda penyesuaian, dari konstanta ARAH.
     * Ditulis begini supaya arah tanda tidak pernah didefinisikan dua kali.
     */
    private function ekspresiEfekPenyesuaian(): string
    {
        $cases = '';
        foreach (TransactionSaldoAdjustment::ARAH as $jenis => $arah) {
            $tanda = $arah < 0 ? '-' : '';
            $cases .= " WHEN " . DB::getPdo()->quote($jenis) . " THEN {$tanda}nominal";
        }

        return "CASE jenis{$cases} ELSE 0 END";
    }
}
