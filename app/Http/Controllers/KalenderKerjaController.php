<?php

namespace App\Http\Controllers;

use App\Helpers\KalenderKerja;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Layar penetapan kalender kerja nasional.
 *
 * HANYA SUPERUSER. Kalendernya berlaku untuk 157 kantor sekaligus — satu
 * tanggal yang salah ditandai libur akan menghapus satu hari kerja dari
 * seluruh kantor pada bulan itu. Bukan wewenang yang layak dititipkan per
 * cabang.
 *
 * Lihat .agents/agregasi_rekap.md §9.
 */
class KalenderKerjaController extends Controller
{
    private function pastikanSuperuser(): void
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403, 'Kalender kerja berlaku nasional — hanya superuser yang boleh menetapkannya.');
        }
    }

    public function index(Request $request)
    {
        $this->pastikanSuperuser();

        $batas = KalenderKerja::bulanPalingAwal();

        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : Carbon::now()->startOfMonth();

        // Dijepit, bukan ditolak. Bulan sebelum migrasi tidak punya apa-apa
        // untuk ditampilkan, dan halaman error untuk sekadar menekan panah
        // mundur adalah hukuman yang tidak sepadan.
        if ($periode->lt($batas)) {
            $periode = $batas->copy();
        }

        return Inertia::render('Admin/KalenderKerja', [
            'kalender' => KalenderKerja::bulan($periode),
            'server_filter' => [
                'periode' => $periode->format('Y-m'),
                'sebelumnya' => $periode->copy()->subMonthNoOverflow()->max($batas)->format('Y-m'),
                'berikutnya' => $periode->copy()->addMonthNoOverflow()->format('Y-m'),
            ],
        ]);
    }

    public function simpan(Request $request)
    {
        $this->pastikanSuperuser();

        $val = $request->validate([
            'tanggal' => ['required', 'date'],
            'is_libur' => ['required', 'boolean'],
            'keterangan' => ['nullable', 'string', 'max:190'],
        ]);

        try {
            KalenderKerja::tetapkan(
                $val['tanggal'],
                $val['is_libur'],
                $val['keterangan'] ?? null,
                auth()->user()
            );
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', sprintf(
            '%s ditetapkan sebagai hari %s.',
            Carbon::parse($val['tanggal'])->locale('id')->isoFormat('D MMMM Y'),
            $val['is_libur'] ? 'libur' : 'kerja'
        ));
    }

    public function terapkanSaran(Request $request)
    {
        $this->pastikanSuperuser();

        $val = $request->validate(['periode' => ['required', 'date']]);

        $hasil = KalenderKerja::terapkanSaran($val['periode'], auth()->user());

        return back()->with('message', sprintf(
            '%d tanggal ditetapkan, %d dilewati (sudah ditetapkan sebelumnya atau tidak boleh dijadikan libur).',
            $hasil['ditetapkan'],
            $hasil['dilewati']
        ));
    }
}
