<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Helpers\GembokBulanan;
use App\Models\TransactionMonthlyClosing;

/**
 * Tutup Buku Storting kantor migrasi (tanda tangan bulanan). Layar Closing
 * Bulanan dicabut 2026-10-12; yang tersisa hanya aksi dari tombol Tutup Buku
 * di buku storting.
 *
 * Otorisasi dicek di controller (permission `can-approve`), BUKAN lewat
 * middleware `role:` — alias itu tidak terdaftar (05_temuan_dan_jebakan.md A1).
 */
class ClosingBulananController extends Controller
{
    private function pastikanBerwenang(): void
    {
        if (!auth()->user()->hasPermissionTo('can-approve')) {
            abort(403, 'Layar ini untuk kepala mantri, kasir, dan pimpinan.');
        }
    }

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
