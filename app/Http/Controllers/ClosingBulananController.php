<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
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

        // Sambungan antar bulan: awal bulan depan buku yang sama harus = akhir
        // bulan ini. Belum ada barisnya (bulan depan belum disusun) -> null.
        $depan = TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $periode->copy()->addMonthNoOverflow()->toDateString())
            ->get()->keyBy(fn($b) => $b->transaction_loan_officer_grouping_id . '|' . $b->hari);

        // Tanda "diperbarui sesudah diteken": jejak 'perbarui' terakhir per baris.
        $perbarui = \App\Models\TransactionLockHistory::whereIn('transaction_monthly_closing_id', $baris->pluck('id'))
            ->where('aksi', \App\Models\TransactionLockHistory::AKSI_PERBARUI)
            ->orderBy('id')->get(['transaction_monthly_closing_id', 'alasan', 'created_at'])
            ->keyBy('transaction_monthly_closing_id');

        return Inertia::render('Closing/Bulanan', [
            'datas' => $baris->map(function (TransactionMonthlyClosing $b) use ($perbarui, $depan) {
                $ember = fn($awalan) => collect(\App\Helpers\Ember::SEMUA)->mapWithKeys(fn($e) => [$e => (int) $b->{$awalan . $e}])->all();
                $bd = $depan->get($b->transaction_loan_officer_grouping_id . '|' . $b->hari);

                return [
                    'awal' => $ember('awal_'),
                    'akhir' => $ember('akhir_'),
                    'awal_depan' => $bd ? (int) $bd->awal_total : null,
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
                    'mutasi_masuk' => (int) $b->mutasi_masuk,
                    'mutasi_keluar' => (int) $b->mutasi_keluar,
                    // status pengesahan
                    'kepala_approval_at' => $b->kepala_approval_at?->toDateTimeString(),
                    'kepala_nama' => $b->kepala?->nama_karyawan,
                    'kasir_lock_at' => $b->kasir_lock_at?->toDateTimeString(),
                    'kasir_nama' => $b->kasir?->nama_karyawan,
                    'terkunci' => $b->terkunci(),
                    'halangan' => GembokBulanan::halanganTutupBuku($b),
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
                'koreksi_beku' => \App\Models\TransactionKoreksiBeku::where('branch_id', $scope->branch_id)->count(),
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                // Hari dibuka ulang yang belum dikunci lagi (menahan kelengkapan).
                'hari_terbuka' => AgregasiScope::sudahMigrasi($scope->branch_id) ? \App\Helpers\Gembok::hariTerbuka($scope->branch_id) : [],
            ],
        ]);
    }

    /** Persetujuan kepala — sekadar tanda "sudah saya lihat". */
    /**
     * Tutup Buku Storting (kantor migrasi): tanda tangan bulanan satu langkah
     * untuk satu buku (kelompok x hari x bulan). Dipanggil dari tombol Tutup
     * Buku di buku storting; sesudahnya tombol hilang. Tombol ACC / Kunci /
     * Buka di layar ini dicabut (2026-10-10) - layar ini laporan saja.
     */
    public function tutupBuku(TransactionMonthlyClosing $closing)
    {
        if (!AppHelper::bolehAksesKelompok($closing->loan_officer_grouping)) {
            abort(403, AppHelper::PESAN_BUKAN_WILAYAH);
        }
        $this->pastikanBerwenang();

        try {
            GembokBulanan::tutupBuku($closing, auth()->user()->employee->id);
        } catch (\Throwable $e) {
            return back()->withErrors(AppHelper::pesanGagal($e, $e->getMessage()));
        }

        return back()->with('message', 'Buku storting ditutup.');
    }
}
