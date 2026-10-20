<?php

namespace App\Http\Controllers;

use App\Helpers\VideoPengumuman;
use App\Helpers\VideoTutorial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Superuser menambah / mengganti / menghapus video panduan (MinIO).
 * Dua jenis: slot bawaan kode (kunci tetap; ganti = berkas baru, hapus =
 * sembunyikan) dan video tambahan per menu (baris ber-menu; hapus = baris hilang).
 * Batas 50 MB (nginx 64M, php.ini 256M).
 */
class VideoTutorialController extends Controller
{
    private function slot(): array
    {
        return VideoPengumuman::BERKAS + VideoTutorial::BERKAS;
    }

    private function pastikanSuperuser(): void
    {
        abort_unless(auth()->user()->hasRole('superuser'), 403, 'Video panduan hanya untuk superuser.');
    }

    private function selesai(Request $request, string $pesan)
    {
        return $request->expectsJson() ? response()->json(['pesan' => $pesan]) : back()->with('message', $pesan);
    }

    public function index()
    {
        $this->pastikanSuperuser();

        $berkas = VideoTutorial::berkas($this->slot());
        $disk = Storage::disk('s3_publik');

        $bawaan = collect($this->slot())->map(fn($_, $kunci) => [
            'kunci' => $kunci,
            'judul' => VideoTutorial::JUDUL[$kunci] ?? ucfirst(str_replace('_', ' ', $kunci)),
            'menu' => null,
            'ada' => isset($berkas[$kunci]),
            'url' => isset($berkas[$kunci]) ? $disk->temporaryUrl($berkas[$kunci], now()->addHours(1)) : null,
        ])->values();

        $tambahan = DB::table('tutorial_videos')->whereNotNull('menu')->whereNotNull('path')->orderBy('id')->get()
            ->map(fn($r) => [
                'kunci' => $r->kunci,
                'judul' => $r->judul ?: 'Video Panduan',
                'menu' => VideoTutorial::MENU[$r->menu] ?? $r->menu,
                'ada' => true,
                'url' => $disk->temporaryUrl($r->path, now()->addHours(1)),
            ]);

        return Inertia::render('Admin/VideoTutorial', [
            'videos' => $bawaan->concat($tambahan)->values(),
            'menuOpsi' => VideoTutorial::MENU,
        ]);
    }

    // JSON video tambahan satu menu untuk tombol di halaman menu (semua user login).
    public function menu(string $menu)
    {
        abort_unless(isset(VideoTutorial::MENU[$menu]), 404);

        return response()->json([
            'videos' => VideoTutorial::menu($menu),
            'boleh_kelola' => auth()->user()->hasRole('superuser'),
        ]);
    }

    public function tambah(Request $request)
    {
        $this->pastikanSuperuser();
        $data = $request->validate([
            'menu' => 'required|in:' . implode(',', array_keys(VideoTutorial::MENU)),
            'judul' => 'required|string|max:120',
            'deskripsi' => 'nullable|string|max:500',
            'file' => 'required|file|mimetypes:video/mp4|max:51200',
        ]);

        $kunci = 'x' . Str::lower(Str::random(10));
        $path = 'tutorial/' . $kunci . '.mp4';
        Storage::disk('s3')->putFileAs('tutorial', $request->file('file'), basename($path));
        DB::table('tutorial_videos')->insert([
            'kunci' => $kunci, 'menu' => $data['menu'], 'judul' => $data['judul'],
            'deskripsi' => $data['deskripsi'] ?? null, 'path' => $path,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return $this->selesai($request, 'Video ditambahkan.');
    }

    public function store(Request $request, string $kunci)
    {
        $this->pastikanSuperuser();
        $baris = DB::table('tutorial_videos')->where('kunci', $kunci)->first();
        abort_unless(isset($this->slot()[$kunci]) || $baris?->menu, 404);

        $request->validate(['file' => 'required|file|mimetypes:video/mp4|max:51200']);

        $lama = $baris?->menu ? $baris->path : (VideoTutorial::berkas($this->slot())[$kunci] ?? null);
        $baru = 'tutorial/' . $kunci . '-' . time() . '.mp4';

        Storage::disk('s3')->putFileAs('tutorial', $request->file('file'), basename($baru));
        DB::table('tutorial_videos')->updateOrInsert(
            ['kunci' => $kunci],
            ['path' => $baru, 'updated_at' => now(), 'created_at' => now()]
        );
        $this->hapusBerkas($lama, $baru);

        return $this->selesai($request, 'Video diganti.');
    }

    public function destroy(Request $request, string $kunci)
    {
        $this->pastikanSuperuser();
        $baris = DB::table('tutorial_videos')->where('kunci', $kunci)->first();
        abort_unless(isset($this->slot()[$kunci]) || $baris?->menu, 404);

        if ($baris?->menu) {
            $lama = $baris->path;
            DB::table('tutorial_videos')->where('kunci', $kunci)->delete();
        } else {
            $lama = VideoTutorial::berkas($this->slot())[$kunci] ?? null;
            DB::table('tutorial_videos')->updateOrInsert(
                ['kunci' => $kunci],
                ['path' => null, 'updated_at' => now(), 'created_at' => now()]
            );
        }
        $this->hapusBerkas($lama);

        return $this->selesai($request, 'Video dihapus.');
    }

    private function hapusBerkas(?string $path, ?string $kecuali = null): void
    {
        if ($path && $path !== $kecuali) {
            Storage::disk('s3')->delete($path);
        }
    }
}
