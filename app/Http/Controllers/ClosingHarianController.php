<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AuthScope;
use App\Helpers\Gembok;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLockHistory;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Layar kerja harian alur agregasi baru: isi manual, approve kepala, kunci kasir.
 *
 * Urutannya disengaja dan ditegakkan lewat syarat, bukan lewat perbedaan
 * permission: kepala approve dulu, setoran mantri dicatat, baru kasir mengunci
 * — dan hari sebelumnya harus sudah terkunci lebih dulu.
 *
 * Lihat .agents/agregasi_rekap.md §4.
 */
class ClosingHarianController extends Controller
{
    public function index(Request $request)
    {
        $this->pastikanBerwenang();

        $scope = AuthScope::resolve();

        $tanggal = $request->filled('tanggal')
            ? Carbon::parse($request->tanggal)->startOfDay()
            : $this->tanggalBawaan($scope->branch_id);

        $groupings = TransactionLoanOfficerGrouping::where('branch_id', $scope->branch_id)
            ->orderBy('kelompok')->get();

        $baris = TransactionDailyClosing::with('kepala', 'kasir')
            ->whereIn('transaction_loan_officer_grouping_id', $groupings->pluck('id'))
            ->whereDate('date', $tanggal)
            ->get()
            ->keyBy('transaction_loan_officer_grouping_id');

        $user = auth()->user();

        return Inertia::render('Closing/Harian', [
            'datas' => $groupings->map(function ($g) use ($baris) {
                $b = $baris->get($g->id);

                return [
                    'grouping_id' => $g->id,
                    'kelompok' => $g->kelompok,
                    'ada_baris' => (bool) $b,
                    'id' => $b?->id,
                    // turunan - tidak bisa diubah dari layar ini
                    'drop' => (int) ($b?->drop ?? 0),
                    'storting' => (int) ($b?->storting ?? 0),
                    'pemutihan' => (int) ($b?->pemutihan ?? 0),
                    // manual
                    'kasbon' => (int) ($b?->kasbon ?? 0),
                    'transport' => (int) ($b?->transport ?? 0),
                    'keluar' => (int) ($b?->keluar ?? 0),
                    'setoran_mantri' => $b?->setoran_mantri,
                    // generated
                    'do11' => (int) ($b?->do11 ?? 0),
                    'tunai' => (int) ($b?->tunai ?? 0),
                    'selisih' => $b?->selisih,
                    // status
                    'kepala_approval_at' => $b?->kepala_approval_at?->toDateTimeString(),
                    'kepala_nama' => $b?->kepala?->nama_karyawan,
                    'kasir_lock_at' => $b?->kasir_lock_at?->toDateTimeString(),
                    'kasir_nama' => $b?->kasir?->nama_karyawan,
                    'terkunci' => (bool) $b?->kasir_lock_at,
                    'halangan' => $b ? Gembok::bolehKunci($b)['alasan'] : ['Baris hari ini belum dibangkitkan.'],
                ];
            })->values(),
            'server_filter' => [
                'tanggal' => $tanggal->toDateString(),
                'branch_id' => $scope->branch_id,
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                'boleh_buka' => Gembok::bolehBuka($user),
            ],
            'tertinggal' => $this->hariTertinggal($groupings->pluck('id')->all(), $groupings),
        ]);
    }

    /** Simpan kolom manual. Ditolak kalau barisnya sudah terkunci. */
    public function simpanManual(Request $request, TransactionDailyClosing $closing)
    {
        $this->pastikanBerwenang();

        if ($closing->terkunci()) {
            return back()->withErrors('Baris ini sudah dikunci kasir.');
        }

        $val = $request->validate([
            'kasbon' => ['required', 'integer', 'min:0'],
            'transport' => ['required', 'integer', 'min:0'],
            'keluar' => ['required', 'integer', 'min:0'],
            // nullable disengaja: NULL = kasir belum mencatat serah terima,
            // 0 = mantri memang tidak menyetor. Dua hal berbeda.
            'setoran_mantri' => ['nullable', 'integer'],
        ]);

        $closing->update($val);

        return back()->with('message', 'Tersimpan.');
    }

    public function approveKepala(TransactionDailyClosing $closing)
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

    public function kunci(TransactionDailyClosing $closing)
    {
        $this->pastikanBerwenang();

        try {
            Gembok::kunci($closing, auth()->user()->employee->id);
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Terkunci.');
    }

    public function buka(Request $request, TransactionDailyClosing $closing)
    {
        $request->validate(['alasan' => ['required', 'string', 'min:5']], [
            'alasan.required' => 'Alasan membuka kunci wajib diisi.',
            'alasan.min' => 'Alasan terlalu pendek — tulis yang bisa dipahami orang lain nanti.',
        ]);

        try {
            Gembok::buka($closing, auth()->user(), $request->alasan);
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Kunci dibuka dan tercatat.');
    }

    /**
     * Hari TERLAMA yang belum terkunci — bukan hari ini.
     *
     * Rantai penguncian menuntut hari sebelumnya terkunci lebih dulu, jadi
     * pekerjaan kasir selalu mengejar dari depan. Membuka layar di hari ini
     * berarti dia menatap hari yang belum bisa dikunci, sementara tunggakannya
     * ada di belakang dan tidak kelihatan.
     *
     * Kalau semua sudah terkunci, jatuh ke hari kerja terakhir yang ada.
     */
    private function tanggalBawaan(int $branchId): Carbon
    {
        $ids = TransactionLoanOfficerGrouping::where('branch_id', $branchId)->pluck('id');

        $terlama = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereNull('kasir_lock_at')
            ->whereDate('date', '<=', now())
            ->min('date');

        if ($terlama) {
            return Carbon::parse($terlama);
        }

        $terakhir = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('date', '<=', now())
            ->max('date');

        return $terakhir ? Carbon::parse($terakhir) : now()->startOfDay();
    }

    /**
     * Hari terlama yang belum terkunci per kelompok.
     *
     * Ini pemantau yang membuat hari tertinggal ketahuan hari itu juga, bukan
     * berbulan-bulan kemudian — dan karena rantai menuntut hari sebelumnya
     * terkunci, satu hari yang menggantung menahan seluruh sisanya.
     */
    private function hariTertinggal(array $groupingIds, $groupings): array
    {
        if (empty($groupingIds)) {
            return [];
        }

        $rows = DB::table('transaction_daily_closings')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereNull('kasir_lock_at')
            ->whereDate('date', '<=', now())
            ->groupBy('transaction_loan_officer_grouping_id')
            ->get([
                DB::raw('transaction_loan_officer_grouping_id AS g'),
                DB::raw('MIN(`date`) AS terlama'),
                DB::raw('COUNT(*) AS jml'),
            ]);

        $nama = $groupings->pluck('kelompok', 'id');

        return $rows->map(fn($r) => [
            'kelompok' => $nama->get($r->g),
            'terlama' => $r->terlama,
            'jumlah' => (int) $r->jml,
        ])->sortBy('terlama')->values()->all();
    }

    private function pastikanBerwenang(): void
    {
        if (!auth()->user()->hasPermissionTo('can-approve')) {
            abort(403, 'Layar ini untuk kepala mantri, kasir, dan pimpinan.');
        }
    }
}
