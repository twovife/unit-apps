<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Ringkasan pembayaran kantor di Home (mas 2026-10-15): kartu per jenis untuk
 * kantor aktif (filter cabang global) dan satu bulan. Baca-saja; input tetap
 * di menu masing-masing. Semua tabel milik app_laravel (DB bersama).
 */
class PembayaranKantorController extends Controller
{
    private const TARGET_TABUNGAN = 1000000;
    private const TARGET_BOP = 1500000;

    public function ringkasan(Request $request)
    {
        abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403);

        $branchId = (int) AuthScope::resolve()->branch_id;
        $boleh = Branch::getAllowedBranchIds(auth()->user());
        abort_unless($boleh === null || in_array($branchId, $boleh), 403, 'Cabang ini bukan cabang Anda.');

        $bulan = preg_match('/^\d{4}-\d{2}$/', (string) $request->input('bulan'))
            ? Carbon::parse($request->input('bulan') . '-01')
            : Carbon::now()->startOfMonth();
        $awal = $bulan->copy()->startOfMonth()->toDateString();
        $akhir = $bulan->copy()->endOfMonth()->toDateString();
        $branch = Branch::find($branchId);

        return response()->json([
            'unit' => $branch?->unit,
            'bulan' => $bulan->format('Y-m'),
            'kartu' => [
                'tabungan' => $this->iuran('tb_contributions', $branch, $bulan, self::TARGET_TABUNGAN),
                'bop' => $this->iuran('ops_bop_contributions', $branch, $bulan, self::TARGET_BOP),
                'bon_panjer' => $this->bonPanjer($branchId, $awal, $akhir),
                'modal' => $this->modal($branchId, $awal, $akhir),
                'sksw' => $this->sksw($branchId, $awal, $akhir),
                'umrah' => $this->umrah($branchId, $awal, $akhir),
            ],
        ]);
    }

    /** Iuran bulanan ber-target (Tabungan 1 Juta / BOP), status sama dengan menu iurannya. */
    private function iuran(string $tabel, ?Branch $branch, Carbon $bulan, int $target): array
    {
        $baris = DB::table($tabel)->where('branch_id', $branch?->id)->where('period', $bulan->format('Y-m'));
        $dibayar = (int) (clone $baris)->sum('amount');
        $terakhir = (clone $baris)->max('payment_date');

        // Masa tenggang 3 bulan sejak kantor buka (TbContributionController).
        $buka = $branch?->opening_date ? Carbon::parse($branch->opening_date) : Carbon::parse('2026-01-01');
        $tenggang = $bulan->lt($buka) || $buka->diffInMonths($bulan) < 3;

        $status = 'belum';
        if ($tenggang && $dibayar === 0) {
            $status = 'tenggang';
        } elseif ($dibayar >= $target) {
            $status = 'lunas';
        } elseif ($dibayar > 0) {
            $status = 'kurang';
        }

        return [
            'target' => $target,
            'dibayar' => $dibayar,
            'kurang' => max(0, $target - $dibayar),
            'status' => $status,
            'terakhir' => $terakhir ? Carbon::parse($terakhir)->toDateString() : null,
            'akumulasi' => (int) DB::table($tabel)->where('branch_id', $branch?->id)->where('period', '<=', $bulan->format('Y-m'))->sum('amount'),
        ];
    }

    /** BON Panjer = tb_central_loans (bon karyawan, dicicil / potong gaji). */
    private function bonPanjer(int $branchId, string $awal, string $akhir): array
    {
        $bayar = DB::table('tb_central_loan_payments')
            ->where('payment_date', '<=', $akhir)
            ->groupBy('tb_central_loan_id')
            ->selectRaw('tb_central_loan_id, SUM(amount) dibayar');

        $pinjaman = DB::table('tb_central_loans as l')
            ->leftJoinSub($bayar, 'p', 'p.tb_central_loan_id', '=', 'l.id')
            ->where('l.branch_id', $branchId)
            ->where('l.loan_date', '<=', $akhir)
            ->get(['l.id', 'l.amount', 'l.employee_id', DB::raw('COALESCE(p.dibayar, 0) as dibayar')]);
        $aktif = $pinjaman->filter(fn($l) => (int) $l->amount > (int) $l->dibayar);

        return [
            'jumlah_aktif' => $aktif->count(),
            'karyawan' => $aktif->pluck('employee_id')->unique()->count(),
            'sisa' => (int) $aktif->sum(fn($l) => (int) $l->amount - (int) $l->dibayar),
            'pinjaman_baru' => (int) DB::table('tb_central_loans')->where('branch_id', $branchId)->whereBetween('loan_date', [$awal, $akhir])->sum('amount'),
            'bayar_bulan_ini' => (int) DB::table('tb_central_loan_payments as p')
                ->join('tb_central_loans as l', 'l.id', '=', 'p.tb_central_loan_id')
                ->where('l.branch_id', $branchId)->whereBetween('p.payment_date', [$awal, $akhir])->sum('p.amount'),
        ];
    }

    /** Pinjaman modal kantor = tb_capital_loans (pokok + jasa modal). */
    private function modal(int $branchId, string $awal, string $akhir): array
    {
        $bayar = DB::table('tb_capital_loan_payments')
            ->where('payment_date', '<=', $akhir)
            ->groupBy('tb_capital_loan_id')
            ->selectRaw('tb_capital_loan_id, SUM(amount_principal) pokok');

        $pinjaman = DB::table('tb_capital_loans as l')
            ->leftJoinSub($bayar, 'p', 'p.tb_capital_loan_id', '=', 'l.id')
            ->where('l.branch_id', $branchId)
            ->where('l.loan_date', '<=', $akhir)
            ->get(['l.id', 'l.amount', DB::raw('COALESCE(p.pokok, 0) as pokok')]);
        $aktif = $pinjaman->filter(fn($l) => (int) $l->amount > (int) $l->pokok);

        $bulanIni = DB::table('tb_capital_loan_payments as p')
            ->join('tb_capital_loans as l', 'l.id', '=', 'p.tb_capital_loan_id')
            ->where('l.branch_id', $branchId)->whereBetween('p.payment_date', [$awal, $akhir])
            ->selectRaw('COALESCE(SUM(p.amount_principal),0) pokok, COALESCE(SUM(p.amount_jasa_modal),0) jasa')
            ->first();

        return [
            'jumlah_aktif' => $aktif->count(),
            'sisa' => (int) $aktif->sum(fn($l) => (int) $l->amount - (int) $l->pokok),
            'pokok_bulan_ini' => (int) $bulanIni->pokok,
            'jasa_bulan_ini' => (int) $bulanIni->jasa,
        ];
    }

    /** SKSW: saldo SW / SK kantor per akhir bulan + mutasi bulan itu (transaksi void dikecualikan). */
    private function sksw(int $branchId, string $awal, string $akhir): array
    {
        $rows = DB::table('saving_transactions')
            ->where('branch_id', $branchId)->whereNull('voided_at')->where('transaction_date', '<=', $akhir)
            ->groupBy('jenis')
            ->selectRaw('jenis,
                SUM(debit - kredit) saldo,
                SUM(CASE WHEN transaction_date >= ? THEN debit ELSE 0 END) masuk,
                SUM(CASE WHEN transaction_date >= ? THEN kredit ELSE 0 END) keluar', [$awal, $awal])
            ->get()->keyBy('jenis');

        $ambil = fn($jenis, $k) => (int) ($rows[$jenis]->$k ?? 0);

        return [
            'saldo_sw' => $ambil('SW', 'saldo'),
            'saldo_sk' => $ambil('SK', 'saldo'),
            'masuk' => $ambil('SW', 'masuk') + $ambil('SK', 'masuk'),
            'keluar' => $ambil('SW', 'keluar') + $ambil('SK', 'keluar'),
        ];
    }

    /** Tabungan Goro Umrah = goro_umroh_setoran per kantor. */
    private function umrah(int $branchId, string $awal, string $akhir): array
    {
        $bulanIni = DB::table('goro_umroh_setoran')->where('branch_id', $branchId)->whereBetween('tanggal', [$awal, $akhir]);

        return [
            'setoran_bulan_ini' => (int) (clone $bulanIni)->sum('amount'),
            'kali_bulan_ini' => (clone $bulanIni)->count(),
            'terakhir' => ($t = DB::table('goro_umroh_setoran')->where('branch_id', $branchId)->where('tanggal', '<=', $akhir)->max('tanggal'))
                ? Carbon::parse($t)->toDateString() : null,
            'total' => (int) DB::table('goro_umroh_setoran')->where('branch_id', $branchId)->where('tanggal', '<=', $akhir)->sum('amount'),
        ];
    }
}
