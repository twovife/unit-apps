<?php

namespace App\Helpers;

use Carbon\Carbon;

/**
 * SATU-SATUNYA acuan pembagian ember untuk alur agregasi baru.
 *
 * KENAPA BUKAN MEMAKAI YANG SUDAH ADA
 * -----------------------------------
 * `AppHelper` punya tiga fungsi serupa (`generateStatusAngsuran` :239,
 * `generateStatusAngsuranString` :261, `generateStatusAngsuranString2` :283).
 * Ketiganya SENGAJA DIBIARKAN untuk alur lama dan tidak boleh diubah — tapi
 * tidak bisa dipakai di sini, karena keluarannya cuma 4 nilai:
 *
 *     selisih < 3  -> 1     <- melahap month1, month2, DAN ccm sekaligus
 *     selisih == 3 -> 2 (cm)
 *     selisih == 4 -> 3 (mb)
 *     selisih > 4  -> 4 (ml)
 *
 * Nilai `1` menggabung tiga ember pertama, jadi `WHERE status = ...` secara
 * struktur tidak mungkin memisahkannya. Itu memadai untuk 4 KATEGORI TAMPILAN
 * (lancar/CM/MB/ML), tapi tidak untuk 6 EMBER PENYIMPANAN yang dibutuhkan buku
 * angsuran dan pergeseran ember bulanan.
 *
 * Enam ember di sini untuk menyimpan; empat kategori itu cara menampilkannya.
 * Bukan dua pilihan yang saling menggantikan — dua lapis berbeda.
 *
 * Lihat .agents/agregasi_rekap.md §6.
 */
class Ember
{
    public const MONTH1 = 'month1';
    public const MONTH2 = 'month2';
    public const CCM = 'ccm';
    public const CM = 'cm';
    public const MB = 'mb';
    public const ML = 'ml';

    /** Urut dari termuda. Urutan ini yang dipakai pergeseran ember bulanan. */
    public const SEMUA = [
        self::MONTH1,
        self::MONTH2,
        self::CCM,
        self::CM,
        self::MB,
        self::ML,
    ];

    /**
     * Empat kategori tampilan. `lancar` menggabung tiga ember pertama —
     * inilah yang membuat fungsi lama terlihat "cuma punya 4 nilai".
     */
    public const KATEGORI = [
        'lancar' => [self::MONTH1, self::MONTH2, self::CCM],
        'cm' => [self::CM],
        'mb' => [self::MB],
        'ml' => [self::ML],
    ];

    /** Selisih bulan minimal supaya masuk ML. */
    public const SELISIH_ML = 5;

    /**
     * Ember sebuah angsuran, dari jarak BULAN KALENDER antara tanggal drop
     * pinjaman dan tanggal angsurannya.
     *
     * Jarak bulan kalender, bukan umur hari: ganti bulan berarti geser ember,
     * tidak peduli tanggal berapa. Konsekuensinya pinjaman yang drop di ujung
     * bulan bergeser lebih cepat — itu diketahui dan diterima (§16 poin 5).
     *
     * @param  \DateTimeInterface|string  $dropDate
     * @param  \DateTimeInterface|string  $tanggalAngsuran
     */
    public static function dari($dropDate, $tanggalAngsuran): string
    {
        return self::dariSelisih(self::selisihBulan($dropDate, $tanggalAngsuran));
    }

    public static function dariSelisih(int $selisih): string
    {
        if ($selisih >= self::SELISIH_ML) {
            return self::ML;
        }

        // Selisih negatif (angsuran mendahului drop) tidak semestinya ada,
        // tapi kalau muncul diperlakukan sebagai bulan pertama supaya tidak
        // hilang dari penjumlahan — lebih baik terlihat salah tempat daripada
        // lenyap tanpa jejak.
        return self::SEMUA[max($selisih, 0)];
    }

    /**
     * Jarak bulan kalender: (tahun*12 + bulan) tujuan − asal.
     *
     * @param  \DateTimeInterface|string  $dari
     * @param  \DateTimeInterface|string  $ke
     */
    public static function selisihBulan($dari, $ke): int
    {
        $a = Carbon::parse($dari);
        $b = Carbon::parse($ke);

        return ($b->year * 12 + $b->month) - ($a->year * 12 + $a->month);
    }

    /**
     * Ekspresi SQL untuk ember, supaya penjumlahan besar tidak perlu menarik
     * jutaan baris ke PHP. PERIOD_DIFF menghitung jarak bulan antara dua nilai
     * YYYYMM — sama persis dengan selisihBulan() di atas.
     *
     * Dibangkitkan dari konstanta yang sama, jadi versi SQL dan versi PHP tidak
     * bisa menyimpang diam-diam.
     */
    public static function ekspresiSql(string $kolomDrop, string $kolomAngsuran): string
    {
        $selisih = "PERIOD_DIFF(DATE_FORMAT($kolomAngsuran,'%Y%m'), DATE_FORMAT($kolomDrop,'%Y%m'))";

        $cases = '';
        foreach (self::SEMUA as $i => $ember) {
            if ($ember === self::ML) {
                continue;
            }
            $cases .= " WHEN $selisih <= $i THEN '$ember'";
        }

        return "CASE{$cases} ELSE '" . self::ML . "' END";
    }

    /** Kategori tampilan sebuah ember. */
    public static function kategori(string $ember): string
    {
        foreach (self::KATEGORI as $nama => $isi) {
            if (in_array($ember, $isi, true)) {
                return $nama;
            }
        }

        return 'lancar';
    }
}
