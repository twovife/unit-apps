<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Video panduan tutorial di MinIO/S3 (disk s3_publik).
 * Menyediakan presigned temporaryUrl untuk modul:
 * - Dashboard Kasir: iuran, pinjamanmodal, sksw, tabungangoro
 * - Aset Kendaraan: cekaset
 * - Lamaran Kerja: lamaran
 */
class VideoTutorial
{
    /** Kunci video => path berkas di bucket MinIO */
    public const BERKAS = [
        'cekaset' => 'tutorial/cekaset.mp4',
        'cek_pajak' => 'tutorial/cek_pajak.mp4',
        'iuran' => 'tutorial/iuran.mp4',
        'lamaran' => 'tutorial/lamaran.mp4',
        'pinjamanmodal' => 'tutorial/pinjamanmodal.mp4',
        'sksw' => 'tutorial/sksw.mp4',
        'sksw_karyawan_baru' => 'tutorial/sksw_karyawan_baru.mp4',
        'tabungangoro' => 'tutorial/tabungangoro.mp4',
        'pelunasan' => 'pengumuman/pelunasan.mp4',
        'input_angsuran' => 'pengumuman/input-angsuran.mp4',
    ];

    /** Kunci video => judul tampilan */
    public const JUDUL = [
        'cekaset' => 'Panduan Aset Kendaraan',
        'cek_pajak' => 'Cara Cek Pajak Kendaraan',
        'iuran' => 'Panduan Iuran Bulanan (Tabungan & BOP)',
        'lamaran' => 'Panduan Lamaran Kerja',
        'pinjamanmodal' => 'Panduan Pembayaran Pinjaman Modal',
        'sksw' => 'Panduan SKSW — Laporan & Setoran Unit',
        'sksw_karyawan_baru' => 'Panduan Buka Tabungan SKSW Pegawai Baru',
        'tabungangoro' => 'Panduan Setoran Tabungan Goro Umrah',
        'pelunasan' => 'Pengajuan Nasabah Lama Lewat Menu Angsuran',
        'input_angsuran' => 'Perubahan Tampilan Menu Angsuran',
    ];

    /** Menu yang punya tombol video => nama di pilihan Tambah Video */
    public const MENU = [
        'aset' => 'Aset Kendaraan',
        'lamaran' => 'Lamaran Kerja',
        'sksw' => 'SKSW Unit',
        'angsuran' => 'Angsuran',
        'kasir' => 'Dashboard Kasir',
        'home' => 'Home',
        'pengajuan' => 'Input Pengajuan',
        'buku_transaksi' => 'Buku Transaksi',
        'fastcreate' => 'Fastcreate',
        'input_macet' => 'Input Macet',
        'macet' => 'Pinjaman Macet',
        'cari_angsuran' => 'Cari Angsuran',
        'rekap_satu' => 'Rekap 1',
        'rekap_dua' => 'Rekap 2',
        'rencana_drop' => 'Rencana Drop',
        'rekap_permantri' => 'Rekap Per Mantri',
        'manpower' => 'Manpower',
        'tabungan' => 'Iuran 1 Juta',
        'bop' => 'Iuran BOP',
        'goro_umrah' => 'Tabungan Goro Umrah',
        'pinjaman_modal' => 'Pinjaman Modal',
    ];

    /**
     * Video tambahan superuser untuk satu menu (baris tutorial_videos ber-menu).
     *
     * @return array<int,array{key:string,judul:string,deskripsi:?string,url:string}>
     */
    public static function menu(string $menu): array
    {
        try {
            $disk = Storage::disk('s3_publik');

            return DB::table('tutorial_videos')->where('menu', $menu)->whereNotNull('path')
                ->orderBy('id')->get()
                ->map(fn($r) => [
                    'key' => $r->kunci,
                    'judul' => $r->judul ?: 'Video Panduan',
                    'deskripsi' => $r->deskripsi,
                    'url' => $disk->temporaryUrl($r->path, now()->addHours(3)),
                ])->all();
        } catch (\Throwable $e) {
            Log::warning('Video panduan menu tidak bisa dimuat: ' . $e->getMessage());

            return [];
        }
    }

    /**
     * Berkas per kunci: bawaan kode ditimpa tabel tutorial_videos (superuser).
     * path NULL di tabel = video disembunyikan. Tabel belum ada = bawaan saja.
     *
     * @param array<string,string> $dasar
     * @return array<string,string>
     */
    public static function berkas(array $dasar = self::BERKAS): array
    {
        try {
            foreach (DB::table('tutorial_videos')->get() as $r) {
                if (!array_key_exists($r->kunci, $dasar)) {
                    continue;
                }
                if ($r->path) {
                    $dasar[$r->kunci] = $r->path;
                } else {
                    unset($dasar[$r->kunci]);
                }
            }
        } catch (\Throwable $e) {
            // ponytail: tabel belum dimigrasi -> pakai bawaan kode.
        }

        return $dasar;
    }

    /**
     * Mengambil daftar link sementara (presigned URL) untuk video yang diminta.
     *
     * @param array<string>|string|null $kunci Kunci spesifik atau null untuk semua
     * @return array<string,string> kunci => presigned URL
     */
    public static function url(array|string|null $kunci = null): array
    {
        if (!config('filesystems.disks.s3_publik.bucket')) {
            return [];
        }

        try {
            $disk = Storage::disk('s3_publik');
            $berkas = self::berkas();

            if ($kunci !== null) {
                $daftarKunci = (array) $kunci;
                $berkas = array_intersect_key($berkas, array_flip($daftarKunci));
            }

            return collect($berkas)
                ->map(fn($b) => $disk->temporaryUrl($b, now()->addHours(3)))
                ->all();
        } catch (\Throwable $e) {
            Log::warning('Video tutorial tidak bisa dibuat link-nya: ' . $e->getMessage());

            return [];
        }
    }
}
