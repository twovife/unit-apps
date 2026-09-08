<?php

namespace App\Http\Controllers;

use App\Helpers\Mutasi;
use App\Models\Branch;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanMutation;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Mutasi nasabah — memindah pinjaman antar kelompok/mantri. Superuser saja.
 *
 * Yang direkam adalah ARUS: kolom kelompok di transaction_loans tak pernah
 * diubah, keanggotaan efektif dibaca `basis − keluar + masuk` (lihat
 * App\Helpers\Mutasi). Dibatasi satu kantor dan berlaku paling cepat bulan
 * depan (tanggal 1), supaya tidak mengubah agregat bulan yang sudah lewat.
 *
 * Lihat .agents/agregasi_rekap.md §7b.
 */
class MutasiNasabahController extends Controller
{
    private function pastikanSuperuser(): void
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403, 'Mutasi nasabah hanya untuk superuser.');
        }
    }

    public function index(Request $request)
    {
        $this->pastikanSuperuser();

        // Bulan berlaku bawaan = bulan depan, tanggal 1.
        $bulanDepan = Carbon::now()->addMonthNoOverflow()->startOfMonth();

        $riwayat = TransactionLoanMutation::with('dari', 'ke', 'penginput', 'loan.customer')
            ->orderByDesc('id')->limit(50)->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'loan_id' => $m->transaction_loan_id,
                'dari' => $m->dari->kelompok ?? $m->dari_grouping_id,
                'ke' => $m->ke->kelompok ?? $m->ke_grouping_id,
                'berlaku_bulan' => $m->berlaku_bulan?->format('Y-m'),
                'berlaku_sampai' => $m->berlaku_sampai?->format('Y-m'),
                'alasan' => $m->alasan,
                'penginput' => $m->penginput->nama_karyawan ?? null,
            ]);

        return Inertia::render('Admin/MutasiNasabah', [
            'riwayat' => $riwayat,
            'server_filter' => [
                'bulan_depan' => $bulanDepan->format('Y-m-d'),
            ],
        ]);
    }

    /** Cari pinjaman success milik satu NIK, dengan kelompok efektifnya. */
    public function cari(Request $request)
    {
        $this->pastikanSuperuser();

        $val = $request->validate(['nik' => ['required', 'digits:16']], [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus 16 digit.',
        ]);

        $bulanDepan = Carbon::now()->addMonthNoOverflow()->startOfMonth();

        $loans = TransactionLoan::with('loan_officer_grouping.branch')
            ->where('status', 'success')
            ->whereHas('customer', fn($q) => $q->where('nik', $val['nik']))
            ->orderByDesc('drop_date')
            ->get();

        return response()->json([
            'loans' => $loans->map(function (TransactionLoan $l) use ($bulanDepan) {
                $branchId = $l->loan_officer_grouping->branch_id ?? null;
                $efektifId = Mutasi::kelompokEfektif($l, $bulanDepan);
                $efektif = TransactionLoanOfficerGrouping::find($efektifId);

                return [
                    'loan_id' => $l->id,
                    'drop_date' => Carbon::parse($l->drop_date)->toDateString(),
                    'hari' => $l->hari,
                    'branch_id' => $branchId,
                    'unit' => $l->loan_officer_grouping->branch->unit ?? null,
                    'kelompok_efektif_id' => $efektifId,
                    'kelompok_efektif' => $efektif->kelompok ?? $efektifId,
                    // Pilihan kelompok tujuan: kelompok lain di kantor yang sama.
                    'tujuan' => TransactionLoanOfficerGrouping::where('branch_id', $branchId)
                        ->where('id', '!=', $efektifId)
                        ->orderBy('kelompok')
                        ->get(['id', 'kelompok'])
                        ->map(fn($g) => ['id' => $g->id, 'kelompok' => $g->kelompok]),
                ];
            }),
        ]);
    }

    public function simpan(Request $request)
    {
        $this->pastikanSuperuser();

        $val = $request->validate([
            'loan_id' => ['required', 'integer'],
            'ke_grouping_id' => ['required', 'integer'],
            'berlaku_bulan' => ['required', 'date'],
            'alasan' => ['nullable', 'string', 'max:255'],
        ]);

        $loan = TransactionLoan::find($val['loan_id']);
        if (!$loan) {
            return back()->withErrors('Pinjaman tidak ditemukan.');
        }

        try {
            Mutasi::catat($loan, (int) $val['ke_grouping_id'], $val['berlaku_bulan'], $val['alasan'] ?? null, auth()->user());
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Mutasi tercatat.');
    }
}
