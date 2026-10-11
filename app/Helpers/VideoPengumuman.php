<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Video panduan untuk pengumuman di Home, disimpan di MinIO/S3
 * (bucket AWS_BUCKET, folder pengumuman/). Link sementara dibuat lewat disk
 * 's3_publik' (alamat yang bisa dibuka browser). MinIO belum disetel / gagal
 * -> daftar kosong, Home tetap tampil tanpa tombol video.
 */
class VideoPengumuman
{
    /** kunci pengumuman => berkas di bucket */
    public const BERKAS = [
        'tampilan_baru' => 'pengumuman/tampilan-baru.mp4',
        'pelunasan' => 'pengumuman/pelunasan.mp4',
        'input_angsuran' => 'pengumuman/input-angsuran.mp4',
        'nasabah_baru' => 'pengumuman/nasabah-baru.mp4',
    ];

    /** @return array<string,string> kunci => URL sementara (3 jam) */
    public static function url(): array
    {
        if (!config('filesystems.disks.s3_publik.bucket')) {
            return [];
        }

        try {
            $disk = Storage::disk('s3_publik');

            return collect(self::BERKAS)
                ->map(fn($berkas) => $disk->temporaryUrl($berkas, now()->addHours(3)))
                ->all();
        } catch (\Throwable $e) {
            Log::warning('Video pengumuman tidak bisa dibuat link-nya: ' . $e->getMessage());

            return [];
        }
    }
}
