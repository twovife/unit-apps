<?php

namespace App\Helpers;

use App\Models\Branch;
use Carbon\Carbon;

/**
 * Gerbang tunggal yang memutuskan sebuah kantor membaca/menulis agregasi LAMA
 * (transaction_daily_recaps + transaction_sirculations) atau agregasi BARU.
 *
 * KENAPA SATU KELAS, BUKAN `if` DI TIAP TEMPAT
 * --------------------------------------------
 * Rombakan ini menyentuh belasan titik baca (RekapTrait, PinjamanTrait,
 * TransactionDailyRecapController). Kalau tiap titik mengecek sendiri
 * `$branch->mulai_pendataan_baru`, satu titik yang terlewat berarti kantor yang
 * sama dibaca dari dua tabel berbeda di dua halaman berbeda — bug yang baru
 * ketahuan berbulan-bulan kemudian. Semua keputusan itu harus lewat sini.
 *
 * Pola & gaya mengikuti App\Helpers\AuthScope (tetangganya di folder ini):
 * kelas statis, dipanggil di awal fungsi, tidak menyimpan state antar-request.
 *
 * KEADAAN SAAT INI (Tahap 0)
 * --------------------------
 * Kolom `branches.mulai_pendataan_baru` masih NULL untuk SEMUA kantor, jadi
 * `pakaiAgregatBaru()` selalu mengembalikan false dan tidak ada satu pun
 * perilaku yang berubah. Itu memang tujuan Tahap 0: memasang sakelarnya dulu
 * dan membuktikan angka di semua halaman tetap identik, sebelum ada yang
 * disambungkan ke sakelar itu.
 *
 * Rancangan lengkap: .agents/agregasi_rekap.md
 */
class AgregasiScope
{
    /**
     * Cache per-request: branch_id => Carbon|null.
     * Mencegah query berulang saat satu halaman memeriksa banyak tanggal
     * atau banyak kelompok di cabang yang sama.
     *
     * Aman karena PHP-FPM membuang state statis tiap request. Untuk test,
     * panggil lupakanCache().
     *
     * @var array<int, Carbon|null>
     */
    private static array $cacheTanggalMulai = [];

    /**
     * Berapa bulan sebelum migrasi sebuah pinjaman harus sudah ML supaya boleh
     * disesuaikan saldonya. Lihat bolehDisesuaikan().
     */
    private const BULAN_BATAS_PENYESUAIAN = 6;

    /**
     * Tanggal kantor mulai memakai alur baru. NULL = belum migrasi.
     */
    public static function tanggalMulai(?int $branchId): ?Carbon
    {
        if (!$branchId) {
            return null;
        }

        if (!array_key_exists($branchId, self::$cacheTanggalMulai)) {
            $tanggal = Branch::whereKey($branchId)->value('mulai_pendataan_baru');

            self::$cacheTanggalMulai[$branchId] = $tanggal
                ? Carbon::parse($tanggal)->startOfDay()
                : null;
        }

        return self::$cacheTanggalMulai[$branchId];
    }

    /**
     * Apakah kantor ini sudah dinyatakan pindah ke alur baru?
     *
     * Perhatikan: ini TIDAK cukup untuk memutuskan tabel mana yang dibaca —
     * kantor yang sudah migrasi tetap membaca agregasi LAMA untuk tanggal
     * sebelum migrasinya. Untuk itu pakai pakaiAgregatBaru().
     */
    public static function sudahMigrasi(?int $branchId): bool
    {
        return self::tanggalMulai($branchId) !== null;
    }

    /**
     * Keputusan utama: untuk kantor + tanggal ini, pakai agregat BARU?
     *
     * false berarti pakai transaction_daily_recaps / transaction_sirculations
     * seperti biasa. Tanggal sebelum migrasi SELAMANYA dibaca dari agregasi
     * lama sebagai arsip — agregat baru tidak pernah menghitung mundur, karena
     * hasilnya tidak akan sama dengan yang sudah ditandatangani dulu dan kita
     * berakhir punya dua versi bulan yang sama.
     *
     * @param  \DateTimeInterface|string|null  $tanggal
     */
    public static function pakaiAgregatBaru(?int $branchId, $tanggal): bool
    {
        $mulai = self::tanggalMulai($branchId);

        if ($mulai === null || $tanggal === null) {
            return false;
        }

        return Carbon::parse($tanggal)->startOfDay()->gte($mulai);
    }

    /**
     * Batas atas drop_date yang saldonya masih boleh disesuaikan staf:
     * akhir bulan ke-6 sebelum bulan migrasi.
     *
     * Contoh, migrasi 1 Oktober 2026 → batasnya 30 April 2026, artinya hanya
     * pinjaman yang sudah ML di September (bulan terakhir sistem lama) yang
     * masuk. NULL kalau kantornya belum migrasi.
     */
    public static function batasPenyesuaian(?int $branchId): ?Carbon
    {
        $mulai = self::tanggalMulai($branchId);

        return $mulai
            ? $mulai->copy()->startOfMonth()->subMonthsNoOverflow(self::BULAN_BATAS_PENYESUAIAN)->endOfMonth()
            : null;
    }

    /**
     * Bolehkah saldo pinjaman ber-drop_date ini disesuaikan?
     *
     * Himpunan yang lolos BEKU sejak migrasi dan hanya bisa mengecil:
     * `mulai_pendataan_baru` tetap dan `drop_date` tetap, jadi tidak ada satu
     * pun pinjaman baru yang bisa masuk daftar. Anggotanya lunas/diputihkan
     * seiring waktu sampai habis — fasilitas penyesuaian mati dengan
     * sendirinya. Itu yang membuatnya alat migrasi berbatas waktu, bukan
     * lubang permanen untuk menghapus selisih.
     *
     * @param  \DateTimeInterface|string|null  $dropDate
     */
    public static function bolehDisesuaikan(?int $branchId, $dropDate): bool
    {
        $batas = self::batasPenyesuaian($branchId);

        if ($batas === null || $dropDate === null) {
            return false;
        }

        return Carbon::parse($dropDate)->startOfDay()->lte($batas);
    }

    /**
     * Buang cache. Dipakai test, atau perintah yang mengubah
     * mulai_pendataan_baru lalu membaca ulang di request yang sama.
     */
    public static function lupakanCache(): void
    {
        self::$cacheTanggalMulai = [];
    }
}
