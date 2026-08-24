<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionMonthlyClosing;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Menyusun baris agregat BULANAN dari agregat harian + portofolio.
 *
 * ⚠️ SELALU HITUNG ULANG PENUH, TIDAK PERNAH MENAMBAHKAN
 * ------------------------------------------------------
 * Arus bulanan = SUM(seluruh baris harian bulan itu), bukan
 * `bulanan += angka harian`. Penambahan bertahap persis mekanisme yang membuat
 * 4.141 rantai target patah: sekali terlewat atau dobel, tidak ada yang tahu
 * selamanya. Menghitung ulang satu baris = menjumlahkan ±25 baris harian —
 * praktis gratis, dan idempoten. Dijalankan sekali atau sepuluh kali hasilnya
 * sama, sehingga koreksi hari lampau otomatis membetulkan bulanannya sendiri.
 *
 * PEMETAAN GRAIN
 * --------------
 * Harian ber-grain (kelompok, TANGGAL); bulanan ber-grain (kelompok, HARI
 * TAGIH, periode). Jadi baris bulanan Senin = jumlah seluruh hari Senin di
 * bulan itu.
 *
 * Lihat .agents/agregasi_rekap.md §4.5, §10.2, §11.
 */
class TutupBulanan
{
    /**
     * Susun/perbarui baris bulanan satu periode untuk sekumpulan kelompok.
     *
     * @return array{dibuat:int,diperbarui:int,dilewati:int}
     */
    public static function susun(array $groupingIds, $periode, bool $tulis = true): array
    {
        $periode = Carbon::parse($periode)->startOfMonth();
        $akhirBulan = $periode->copy()->endOfMonth();
        $akhirBulanLalu = $periode->copy()->subDay();

        $arus = self::arusDariHarian($groupingIds, $periode);
        $kelengkapan = self::kelengkapan($groupingIds, $periode);

        // awal: saldo per AKHIR BULAN LALU, tapi ember direferensikan ke bulan
        // INI - itulah pergeseran ember. akhir: saldo per akhir bulan ini,
        // ember direferensikan ke bulan ini juga.
        $awal = HitungAgregat::portofolio($groupingIds, $akhirBulanLalu, $periode);
        $akhir = HitungAgregat::portofolio($groupingIds, $akhirBulan, $periode);
        $saldoMasuk = HitungAgregat::saldoMasuk($groupingIds, $periode);

        $kunci = array_unique(array_merge(
            array_keys($arus),
            array_keys($awal),
            array_keys($akhir),
            array_keys($kelengkapan)
        ));

        $hasil = ['dibuat' => 0, 'diperbarui' => 0, 'dilewati' => 0];

        $kerja = function () use ($kunci, $arus, $awal, $akhir, $saldoMasuk, $kelengkapan, $periode, $tulis, &$hasil) {
            foreach ($kunci as $k) {
                [$g, $hari] = explode('|', $k);

                $baris = TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $g)
                    ->where('hari', $hari)
                    ->whereDate('periode', $periode->toDateString())
                    ->first();

                // Baris bulanan yang sudah DIKUNCI tidak disentuh. Membukanya
                // urusan alur unlock, bukan hitung ulang otomatis - kalau
                // ditembus di sini, kunci kehilangan artinya.
                if ($baris && $baris->kasir_lock_at !== null) {
                    $hasil['dilewati']++;
                    continue;
                }

                $isi = self::rakit(
                    $arus[$k] ?? [],
                    $awal[$k] ?? [],
                    $akhir[$k] ?? [],
                    $saldoMasuk[$k] ?? 0,
                    $kelengkapan[$k] ?? ['hari_kerja' => 0, 'hari_terkunci' => 0]
                );

                if (!$tulis) {
                    $baris ? $hasil['diperbarui']++ : $hasil['dibuat']++;
                    continue;
                }

                if ($baris) {
                    $baris->update($isi);
                    $hasil['diperbarui']++;
                } else {
                    TransactionMonthlyClosing::create(array_merge($isi, [
                        'transaction_loan_officer_grouping_id' => $g,
                        'hari' => $hari,
                        'periode' => $periode->toDateString(),
                    ]));
                    $hasil['dibuat']++;
                }
            }
        };

        $tulis ? DB::transaction($kerja) : $kerja();

        return $hasil;
    }

    private static function rakit(array $arus, array $awal, array $akhir, int $saldoMasuk, array $kelengkapan): array
    {
        $isi = [
            'drop' => $arus['drop'] ?? 0,
            'storting' => $arus['storting'] ?? 0,
            'pemutihan' => $arus['pemutihan'] ?? 0,
            'saldo_masuk' => $saldoMasuk,
            // Mutasi belum ada tabelnya (Tahap 5). Nol berarti "tidak ada
            // mutasi", yang untuk sekarang memang benar.
            'mutasi_masuk' => 0,
            'mutasi_keluar' => 0,
            'hari_kerja' => $kelengkapan['hari_kerja'],
            'hari_terkunci' => $kelengkapan['hari_terkunci'],
        ];

        foreach (Ember::SEMUA as $e) {
            $isi['storting_' . $e] = $arus['storting_' . $e] ?? 0;
            $isi['awal_' . $e] = $awal[$e] ?? 0;
            $isi['akhir_' . $e] = $akhir[$e] ?? 0;
        }

        return $isi;
    }

    /**
     * Arus harian dijumlah per hari tagih.
     *
     * @return array<string,array<string,int>>  kunci "groupingId|hari"
     */
    private static function arusDariHarian(array $groupingIds, Carbon $periode): array
    {
        $kolom = ['drop', 'storting', 'pemutihan'];
        foreach (Ember::SEMUA as $e) {
            $kolom[] = 'storting_' . $e;
        }

        $pilih = [
            DB::raw('transaction_loan_officer_grouping_id AS g'),
            DB::raw(self::ekspresiHari('date') . ' AS hari'),
        ];
        foreach ($kolom as $c) {
            $pilih[] = DB::raw("SUM(`$c`) AS `$c`");
        }

        $rows = TransactionDailyClosing::query()
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereBetween('date', [
                $periode->toDateString(),
                $periode->copy()->endOfMonth()->toDateString(),
            ])
            ->groupBy('transaction_loan_officer_grouping_id', DB::raw(self::ekspresiHari('date')))
            ->get($pilih);

        $out = [];
        foreach ($rows as $r) {
            $isi = [];
            foreach ($kolom as $c) {
                $isi[$c] = (int) $r->$c;
            }
            $out[$r->g . '|' . $r->hari] = $isi;
        }

        return $out;
    }

    /**
     * Berapa hari kerja dan berapa yang sudah terkunci, per hari tagih.
     *
     * Dipakai syarat tanda tangan bulanan: hari_terkunci == hari_kerja. Itulah
     * yang membuat "lupa tutup buku" mustahil lolos - bukan karena ada yang
     * mengingatkan, tapi karena pengesahannya tidak bisa jalan.
     *
     * @return array<string,array<string,int>>
     */
    private static function kelengkapan(array $groupingIds, Carbon $periode): array
    {
        $rows = TransactionDailyClosing::query()
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereBetween('date', [
                $periode->toDateString(),
                $periode->copy()->endOfMonth()->toDateString(),
            ])
            ->groupBy('transaction_loan_officer_grouping_id', DB::raw(self::ekspresiHari('date')))
            ->get([
                DB::raw('transaction_loan_officer_grouping_id AS g'),
                DB::raw(self::ekspresiHari('date') . ' AS hari'),
                DB::raw('COUNT(*) AS hari_kerja'),
                DB::raw('SUM(kasir_lock_at IS NOT NULL) AS hari_terkunci'),
            ]);

        $out = [];
        foreach ($rows as $r) {
            $out[$r->g . '|' . $r->hari] = [
                'hari_kerja' => (int) $r->hari_kerja,
                'hari_terkunci' => (int) $r->hari_terkunci,
            ];
        }

        return $out;
    }

    /** Nama hari Indonesia dari kolom tanggal, di sisi SQL. */
    private static function ekspresiHari(string $kolom): string
    {
        return "ELT(WEEKDAY($kolom)+1,'senin','selasa','rabu','kamis','jumat','sabtu','minggu')";
    }
}
