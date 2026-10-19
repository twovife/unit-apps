<?php

namespace App\Helpers;

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
            $berkas = self::BERKAS;

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
