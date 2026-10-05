<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AuthScope;
use App\Helpers\GembokBulanan;
use App\Helpers\TutupBulanan;
use App\Models\Branch;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Layar tutup buku BULANAN alur baru.
 *
 * Alurnya cermin dari Closing Harian, satu tingkat di atasnya:
 *   kepala menyetujui  →  kasir mengunci (hanya kalau semua hari kerja terkunci)
 *
 * Bedanya dengan harian: layar ini TIDAK menghitung apa pun dan tidak punya
 * kolom manual. Angka bulanan sudah disusun TutupBulanan tiap hari dikunci;
 * layar ini cuma tempat menandatanganinya. Syarat lengkap() — semua hari kerja
 * terkunci — yang membuat "lupa tutup buku" mustahil lolos.
 *
 * Otorisasi dicek di controller (permission `can-approve`), BUKAN lewat
 * middleware `role:` — alias itu tidak terdaftar (05_temuan_dan_jebakan.md A1).
 *
 * Rancangan: .agents/agregasi_rekap.md §11.
 */
class ClosingBulananController extends Controller
{
    private function pastikanBerwenang(): void
    {
        if (!auth()->user()->hasPermissionTo('can-approve')) {
            abort(403, 'Layar ini untuk kepala mantri, kasir, dan pimpinan.');
        }
    }

    public function index(Request $request)
    {
        $this->pastikanBerwenang();

        $scope = AuthScope::resolve();

        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : (AgregasiScope::tanggalMulai($scope->branch_id)?->startOfMonth()
                ?? Carbon::now()->startOfMonth());

        $ids = TransactionLoanOfficerGrouping::where('branch_id', $scope->branch_id)
            ->pluck('id')->all();

        // Susun ulang sebelum ditampilkan supaya hari_terkunci/hari_kerja
        // mutakhir. TutupBulanan melewati baris yang sudah terkunci, jadi ini
        // tidak menyentuh yang sudah ditandatangani.
        if (!empty($ids) && AgregasiScope::sudahMigrasi($scope->branch_id)) {
            TutupBulanan::susun($ids, $periode);
        }

        $baris = TransactionMonthlyClosing::with('kepala', 'kasir', 'loan_officer_grouping')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $periode->toDateString())
            ->get()
            ->sortBy(fn($b) => [$b->loan_officer_grouping->kelompok ?? 0, $b->hari])
            ->values();

        $user = auth()->user();

        // Tanda "diperbarui sesudah diteken": jejak 'perbarui' terakhir per baris.
        $perbarui = \App\Models\TransactionLockHistory::whereIn('transaction_monthly_closing_id', $baris->pluck('id'))
            ->where('aksi', \App\Models\TransactionLockHistory::AKSI_PERBARUI)
            ->orderBy('id')->get(['transaction_monthly_closing_id', 'alasan', 'created_at'])
            ->keyBy('transaction_monthly_closing_id');

        return Inertia::render('Closing/Bulanan', [
            'datas' => $baris->map(function (TransactionMonthlyClosing $b) use ($perbarui) {
                return [
                    'id' => $b->id,
                    'kelompok' => $b->loan_officer_grouping->kelompok ?? null,
                    'hari' => $b->hari,
                    'hari_kerja' => (int) $b->hari_kerja,
                    'hari_terkunci' => (int) $b->hari_terkunci,
                    'lengkap' => $b->lengkap(),
                    'awal_total' => (int) $b->awal_total,
                    'akhir_total' => (int) $b->akhir_total,
                    'drop' => (int) $b->drop,
                    'storting' => (int) $b->storting,
                    'pemutihan' => (int) $b->pemutihan,
                    'saldo_masuk' => (int) $b->saldo_masuk,
                    // status pengesahan
                    'kepala_approval_at' => $b->kepala_approval_at?->toDateTimeString(),
                    'kepala_nama' => $b->kepala?->nama_karyawan,
                    'kasir_lock_at' => $b->kasir_lock_at?->toDateTimeString(),
                    'kasir_nama' => $b->kasir?->nama_karyawan,
                    'terkunci' => $b->terkunci(),
                    'sudah_serah_terima' => $b->sudahDiserahTerimakan(),
                    'halangan' => GembokBulanan::bolehKunci($b)['alasan'],
                    'diperbarui_at' => $perbarui->get($b->id)?->created_at?->toDateTimeString(),
                    'diperbarui_alasan' => $perbarui->get($b->id)?->alasan,
                ];
            }),
            'server_filter' => [
                'periode' => $periode->format('Y-m'),
                'nama_periode' => $periode->locale('id')->isoFormat('MMMM Y'),
                'sebelumnya' => $periode->copy()->subMonthNoOverflow()->format('Y-m'),
                'berikutnya' => $periode->copy()->addMonthNoOverflow()->format('Y-m'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                'boleh_buka' => GembokBulanan::bolehBuka($user),
            ],
        ]);
    }

    /** Persetujuan kepala — sekadar tanda "sudah saya lihat". */
    public function approveKepala(TransactionMonthlyClosing $closing)
    {
        $this->pastikanBerwenang();

        if ($closing->terkunci()) {
            return back()->withErrors('Baris ini sudah dikunci kasir.');
        }

        $closing->update([
            'kepala_approval_at' => now(),
            'kepala_approval_user' => auth()->user()->employee->id,
        ]);

        return back()->with('message', 'Disetujui kepala.');
    }

    /** Kunci kasir — hanya lolos kalau semua hari kerja bulan itu terkunci. */
    public function kunci(TransactionMonthlyClosing $closing)
    {
        $this->pastikanBerwenang();

        try {
            GembokBulanan::kunci($closing, auth()->user()->employee->id);
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Bulan terkunci.');
    }

    public function buka(Request $request, TransactionMonthlyClosing $closing)
    {
        $request->validate(['alasan' => ['required', 'string', 'min:5']], [
            'alasan.required' => 'Alasan membuka kunci wajib diisi.',
            'alasan.min' => 'Alasan terlalu pendek — tulis yang bisa dipahami orang lain nanti.',
        ]);

        try {
            GembokBulanan::buka($closing, auth()->user(), $request->alasan);
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Kunci bulanan dibuka dan tercatat.');
    }
}
