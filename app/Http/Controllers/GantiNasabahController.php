<?php

namespace App\Http\Controllers;

use App\Helpers\GantiNasabah;
use App\Models\TransactionLoan;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Ganti Nasabah (superuser): Daftar Nasabah yang sama, tapi NIK tiap pinjaman bisa diklik
 * untuk memindah pinjaman itu ke nasabah lain lewat NIK. Aturan di App\Helpers\GantiNasabah.
 */
class GantiNasabahController extends Controller
{
    private function pastikanSuperuser(): void
    {
        abort_unless(auth()->user()->hasRole('superuser'), 403, 'Ganti nasabah hanya untuk superuser.');
    }

    public function index(Request $request)
    {
        $this->pastikanSuperuser();
        $data = app(TransactionLoanController::class)->dataDaftarNasabah($request);
        $data['server_filter']['mode'] = 'ganti';

        return Inertia::render('Pinjaman/DaftarNasabah', $data);
    }

    private function isian(Request $request): array
    {
        return $request->validate([
            'nik' => ['required', 'digits:16'],
            'nama' => ['nullable', 'string', 'max:255'],
        ], ['nik.digits' => 'NIK harus 16 digit angka.']);
    }

    /** Pratinjau (JSON): apa yang akan terjadi, tanpa menulis apa pun. */
    public function pratinjau(Request $request, TransactionLoan $loan)
    {
        $this->pastikanSuperuser();
        $v = $this->isian($request);
        try {
            return response()->json(GantiNasabah::rencana($loan, $v['nik'], $v['nama'] ?? null));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function simpan(Request $request, TransactionLoan $loan)
    {
        $this->pastikanSuperuser();
        $v = $this->isian($request);
        try {
            GantiNasabah::jalankan($loan, $v['nik'], $v['nama'] ?? null, auth()->id());
        } catch (\RuntimeException $e) {
            return back()->withErrors(['nik' => $e->getMessage()]);
        }

        return back()->with('message', 'Nasabah pinjaman diganti.');
    }
}
