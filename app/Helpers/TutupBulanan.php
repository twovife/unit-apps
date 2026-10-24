<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionLockHistory;
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
     * $perbarui (['employee_id' => int, 'sumber' => string]) dipakai saat hari
     * lampau dikoreksi lewat buka-kunci: baris bulanan yang SUDAH diteken ikut
     * ditulis ulang kalau angkanya berubah (keputusan mas 2026-10-06, sama
     * dengan proses kantor), tanda tangannya tetap, dan jejak 'perbarui'
     * dicatat sebagai tandanya. Tanpa $perbarui, baris terkunci dilewati.
     * `paksa_awal` => true (Koreksi Data Beku): saldo awal ikut dihitung ulang
     * walau serah terima sudah diteken.
     *
     * @return array{dibuat:int,diperbarui:int,dilewati:int}
     */
    public static function susun(array $groupingIds, $periode, bool $tulis = true, ?array $perbarui = null): array
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

        $kerja = function () use ($kunci, $arus, $awal, $akhir, $saldoMasuk, $kelengkapan, $periode, $tulis, $perbarui, &$hasil) {
            foreach ($kunci as $k) {
                [$g, $hari] = explode('|', $k);

                $baris = TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $g)
                    ->where('hari', $hari)
                    ->whereDate('periode', $periode->toDateString())
                    ->first();

                $isi = self::rakit(
                    $arus[$k] ?? [],
                    $awal[$k] ?? [],
                    $akhir[$k] ?? [],
                    $saldoMasuk[$k] ?? 0,
                    $kelengkapan[$k] ?? ['hari_kerja' => 0, 'hari_terkunci' => 0],
                    $baris,
                    (bool) ($perbarui['paksa_awal'] ?? false)
                );

                // Baris bulanan yang sudah DIKUNCI tidak disentuh hitung ulang
                // biasa. Hanya koreksi lewat buka-kunci hari ($perbarui) yang
                // boleh menulis ulang, dan selalu meninggalkan jejak.
                if ($baris && $baris->kasir_lock_at !== null) {
                    if ($perbarui && $tulis && self::berubah($baris, $isi)) {
                        self::tulisUlangTerkunci($baris, $isi, $perbarui);
                        $hasil['diperbarui']++;
                    } else {
                        $hasil['dilewati']++;
                    }
                    continue;
                }

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

    /**
     * Isi baris bulanan hasil hitung SEKARANG, tanpa menulis apa pun (saldo awal
     * selalu ikut dihitung). Dipakai Koreksi Data Beku untuk mengukur dampak
     * koreksi saja: hitung sebelum & sesudah, selisihnya yang ditulis.
     *
     * @return array<string,array<string,int>>  kunci "groupingId|hari"
     */
    public static function hitung(array $groupingIds, $periode): array
    {
        $periode = Carbon::parse($periode)->startOfMonth();
        $arus = self::arusDariHarian($groupingIds, $periode);
        $kelengkapan = self::kelengkapan($groupingIds, $periode);
        $awal = HitungAgregat::portofolio($groupingIds, $periode->copy()->subDay(), $periode);
        $akhir = HitungAgregat::portofolio($groupingIds, $periode->copy()->endOfMonth(), $periode);
        $saldoMasuk = HitungAgregat::saldoMasuk($groupingIds, $periode);

        $out = [];
        foreach (array_unique(array_merge(array_keys($arus), array_keys($awal), array_keys($akhir), array_keys($kelengkapan))) as $k) {
            $out[$k] = self::rakit($arus[$k] ?? [], $awal[$k] ?? [], $akhir[$k] ?? [], $saldoMasuk[$k] ?? 0,
                $kelengkapan[$k] ?? ['hari_kerja' => 0, 'hari_terkunci' => 0], null, true);
        }

        return $out;
    }

    /**
     * Tambahkan selisih ke baris bulanan TERSIMPAN (bukan hitung ulang penuh):
     * angka lain di baris itu - termasuk hari yang belum dikunci - dibiarkan.
     * Baris yang sudah diteken ditulis ulang dengan jejak 'perbarui'.
     *
     * ponytail: penjumlahan bertahap, satu-satunya pengecualian aturan "selalu hitung
     * ulang penuh" di atas - hanya untuk Koreksi Data Beku (mas 2026-10-24: tampilkan
     * & tulis dampak koreksinya saja). Hitung ulang penuh berikutnya tetap membetulkan.
     */
    public static function tambahkan(TransactionMonthlyClosing $baris, array $selisih, array $perbarui): void
    {
        $isi = [];
        foreach ($selisih as $kolom => $d) {
            $isi[$kolom] = (int) $baris->$kolom + $d;
        }
        if ($baris->kasir_lock_at !== null) {
            self::tulisUlangTerkunci($baris, $isi, $perbarui);
        } else {
            $baris->update($isi);
        }
    }

    private static function berubah(TransactionMonthlyClosing $baris, array $isi): bool
    {
        // Hitungan hari (kelengkapan) tidak dihitung sebagai perubahan: buka
        // lalu kunci ulang satu hari akan kembali ke angka yang sama, dan itu
        // bukan alasan menulis ulang baris yang sudah diteken.
        foreach (array_diff_key($isi, ['hari_kerja' => 0, 'hari_terkunci' => 0]) as $kolom => $nilai) {
            if ((int) $baris->$kolom !== (int) $nilai) {
                return true;
            }
        }

        return false;
    }

    /**
     * Tulis ulang baris bulanan yang sudah diteken. Trigger tmc_kunci menolak
     * perubahan selama kunci terpasang, jadi kunci dilepas, angka ditulis,
     * lalu kunci ASLI (waktu & penandatangan) dipasang lagi - semuanya di
     * dalam transaksi pemanggil. Jejak 'perbarui' menyimpan sebelum/sesudah.
     */
    private static function tulisUlangTerkunci(TransactionMonthlyClosing $baris, array $isi, array $perbarui): void
    {
        $akhirLama = (int) $baris->akhir_total;
        $kunci = ['kasir_lock_at' => $baris->kasir_lock_at, 'kasir_lock_user' => $baris->kasir_lock_user];

        DB::table('transaction_monthly_closings')->where('id', $baris->id)->update(['kasir_lock_at' => null]);
        $baris->forceFill(['kasir_lock_at' => null])->syncOriginal();
        $baris->update($isi);
        DB::table('transaction_monthly_closings')->where('id', $baris->id)->update($kunci);
        $baris->refresh();

        TransactionLockHistory::create([
            'transaction_monthly_closing_id' => $baris->id,
            'transaction_loan_officer_grouping_id' => $baris->transaction_loan_officer_grouping_id,
            'tanggal' => Carbon::parse($baris->periode)->toDateString(),
            'aksi' => TransactionLockHistory::AKSI_PERBARUI,
            'user_id' => $perbarui['employee_id'],
            'alasan' => sprintf(
                'Diperbarui sesudah diteken karena %s. Saldo akhir %s -> %s.',
                $perbarui['sumber'],
                number_format($akhirLama, 0, ',', '.'),
                number_format((int) $baris->akhir_total, 0, ',', '.')
            ),
        ]);
    }

    private static function rakit(
        array $arus,
        array $awal,
        array $akhir,
        int $saldoMasuk,
        array $kelengkapan,
        ?TransactionMonthlyClosing $baris = null,
        bool $paksaAwal = false
    ): array {
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

        // Saldo awal yang SUDAH diserahterimakan tidak pernah dihitung ulang.
        //
        // Tanpa pagar ini, satu pinjaman bertanggal mundur yang disisipkan ke
        // bulan sebelumnya akan diam-diam menggeser saldo awal yang sudah
        // diperiksa dan diteken kantor — dan tidak ada yang tahu, karena yang
        // berubah justru angka pembandingnya sendiri. Serah terima yang bisa
        // berubah sendiri bukan serah terima.
        //
        // `akhir_*` TETAP dihitung ulang: itu memang cerminan keadaan sekarang,
        // dan justru selisih `akhir` terhadap `awal` yang membuat sisipan
        // semacam itu terlihat, bukan tersembunyi. Lihat §13.2.
        //
        // Satu pengecualian ($paksaAwal): Koreksi Data Beku oleh superuser
        // (KoreksiBeku) - tujuannya justru membetulkan patokan itu, dengan
        // alasan tertulis dan jejak di log koreksi & riwayat kunci.
        $sudahSerahTerima = !$paksaAwal && $baris && $baris->serah_terima_at !== null;

        foreach (Ember::SEMUA as $e) {
            $isi['storting_' . $e] = $arus['storting_' . $e] ?? 0;
            $isi['akhir_' . $e] = $akhir[$e] ?? 0;

            if (!$sudahSerahTerima) {
                $isi['awal_' . $e] = $awal[$e] ?? 0;
            }
        }

        // `awal_total` & `akhir_total` TIDAK diisi di sini: keduanya STORED
        // GENERATED (jumlah keenam embernya). Menulisinya melempar error 1906.

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
