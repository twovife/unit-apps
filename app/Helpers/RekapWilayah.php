<?php

namespace App\Helpers;

/**
 * Rumus Rekap Sirkulasi Wilayah (.agents/rekap_sirkulasi_wilayah.md).
 *
 * Sengaja tanpa Eloquent dan tanpa Carbon: supaya bisa diuji dengan
 * `php .agents/uji/uji_rekap_wilayah.php` tanpa menyentuh ubmi_db
 * (phpunit di proyek ini menghantam basis data produksi).
 */
class RekapWilayah
{
    /** Pengali sirkulasi & saldo lama; sama dengan yang dipakai RekapTrait. */
    /**
     * Kolom persen di Rekap 2 baru ditampilkan sejak bulan ini
     * (mas 2026-11-24). Bulan sebelumnya tidak menghitungnya sama sekali.
     *
     * Tidak berlaku untuk Rekap Sirkulasi Wilayah: di sana persen memang
     * bagian dari rancangannya sejak awal.
     */
    public const MULAI_PERSEN = '2026-12-01';

    public const PENGALI = 1.3;

    /** Bulan rujukan saldo lama, dihitung mundur dari bulan yang dibuka. */
    public const MUNDUR = ['cm' => 3, 'mb' => 4];

    /**
     * Pembilang/penyebut. null kalau penyebut 0, supaya layar bisa menulis '-'
     * dan tidak menampilkan 0% yang seolah-olah angka sungguhan.
     */
    public static function persen(int $pembilang, int $penyebut): ?float
    {
        if ($penyebut === 0) {
            return null;
        }

        return $pembilang / $penyebut;
    }

    /** Sirkulasi hari ini = saldo sebelumnya + drop x 1,3 - storting. */
    public static function sirkulasiBerjalan(int $saldoSebelum, int $drop, int $storting): int
    {
        return (int) round($saldoSebelum + $drop * self::PENGALI - $storting);
    }

    /**
     * Bulan rujukan saldo lama: CM = T-3, MB = T-4. Kembalian 'Y-m-01'.
     *
     * Hitung lewat jumlah bulan, bukan Carbon::subMonth(): 31 Maret dikurangi
     * 3 bulan akan meluber ke Desember karena 31 November tidak ada.
     */
    public static function bulanRujukan(string $tanggal, string $jenis): string
    {
        $mundur = self::MUNDUR[$jenis] ?? throw new \InvalidArgumentException("jenis: $jenis");

        [$tahun, $bulan] = array_map('intval', explode('-', substr($tanggal, 0, 7)));
        $total = $tahun * 12 + ($bulan - 1) - $mundur;

        return sprintf('%04d-%02d-01', intdiv($total, 12), $total % 12 + 1);
    }
}
