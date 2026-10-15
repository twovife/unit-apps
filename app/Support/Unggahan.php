<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Pintu unggahan bukti transfer di unit-apps, padanan app_laravel
 * App\Support\Unggahan (folder & bentuk path sama, jadi app_laravel bisa
 * menampilkan bukti yang diunggah dari sini).
 *
 * Bedanya: image unit-apps belum punya ekstensi GD, jadi gambar TIDAK
 * dikompres ulang di server - browser sudah mengecilkannya (canvas -> JPEG,
 * yang sekaligus membuang EXIF). Server tetap memeriksa jenis dari ISI file
 * (finfo, bukan nama/ekstensi), membatasi ukuran, menolak PDF bersekrip, dan
 * memberi nama acak.
 *
 * ponytail: tanpa GD gambar disimpan apa adanya; pasang gd di Dockerfile lalu
 * re-encode seperti app_laravel kalau unggahan dari luar browser jadi soal.
 */
class Unggahan
{
    public const DISK = 's3';
    public const MAKS_KB = 5120;
    public const ATURAN = ['file', 'mimetypes:image/jpeg,image/png,image/webp,application/pdf', 'max:' . self::MAKS_KB];

    private const EKSTENSI = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'application/pdf' => 'pdf'];

    /** @return array<string,string> */
    public static function pesan(string $field): array
    {
        return [
            "{$field}.required" => 'Foto bukti transfer wajib diunggah.',
            "{$field}.mimetypes" => 'File harus berupa foto (JPG/PNG) atau PDF.',
            "{$field}.max" => 'Ukuran file maksimal 5MB.',
            "{$field}.uploaded" => 'File gagal terunggah, coba lagi.',
        ];
    }

    /** Periksa lalu simpan ke MinIO; mengembalikan path file. */
    public static function simpan(UploadedFile $file, string $folder, string $field = 'file'): string
    {
        $mime = (string) $file->getMimeType(); // dari isi file (finfo)
        $ext = self::EKSTENSI[$mime] ?? null;
        if (!$ext) {
            throw ValidationException::withMessages([$field => 'File harus berupa foto (JPG/PNG) atau PDF.']);
        }

        $isi = (string) file_get_contents($file->getRealPath());
        if ($ext === 'pdf') {
            self::periksaPdf($isi, $field);
        }

        $path = trim($folder, '/') . '/' . Str::random(40) . '.' . $ext;
        try {
            $ok = Storage::disk(self::DISK)->put($path, $isi);
        } catch (\Throwable $e) {
            $ok = false;
        }
        if (!$ok) {
            throw ValidationException::withMessages([$field => 'Gagal menyimpan file ke server penyimpanan.']);
        }

        return $path;
    }

    private static function periksaPdf(string $isi, string $field): void
    {
        if (!str_starts_with($isi, '%PDF-')) {
            throw ValidationException::withMessages([$field => 'File PDF tidak valid.']);
        }
        // Sama dengan app_laravel: JavaScript / Launch / file sisipan = tanda PDF berbahaya.
        if (preg_match('#/(JavaScript|JS|Launch|EmbeddedFile|OpenAction|AA|RichMedia|XFA)\b#', $isi)) {
            throw ValidationException::withMessages([$field => 'PDF berisi skrip atau lampiran tersembunyi, tidak diizinkan. Kirim sebagai foto.']);
        }
    }
}
