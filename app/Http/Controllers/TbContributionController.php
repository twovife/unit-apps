<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\TbContribution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TbContributionController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'period' => ['nullable', 'date_format:Y-m'],
        ]);

        $period = $request->input('period') ?: Carbon::now()->format('Y-m');
        $scope = AuthScope::resolve();
        $branch = Branch::query()
            ->whereKey($scope->branch_id)
            ->when(
                $scope->allowed_branches !== null,
                fn ($query) => $query->whereIn('id', $scope->allowed_branches),
            )
            ->first();
        $branches = $branch ? collect([$branch]) : collect();
        $branchIds = $branch ? [$branch->id] : [];
        $contributionsByBranch = collect();
        $totalContributions = collect();

        if ($branchIds !== []) {
            $contributionsByBranch = TbContribution::with(['creator.employee'])
                ->whereIn('branch_id', $branchIds)
                ->where('period', $period)
                ->orderBy('payment_date')
                ->orderBy('id')
                ->get()
                ->groupBy('branch_id');

            $totalContributions = TbContribution::query()
                ->selectRaw('branch_id, SUM(amount) as total_amount')
                ->whereIn('branch_id', $branchIds)
                ->groupBy('branch_id')
                ->pluck('total_amount', 'branch_id');
        }

        $canAddAll = $this->canManageAll();
        $canAddZone = $this->canManageZone();
        $zoneBranchIds = $canAddZone && !$canAddAll ? $this->zoneBranchIds() : [];
        $periodDate = Carbon::parse($period . '-01');

        $data = $branches->map(function (Branch $branch) use (
            $contributionsByBranch,
            $totalContributions,
            $periodDate,
            $canAddAll,
            $canAddZone,
            $zoneBranchIds,
        ) {
            $branchContributions = $contributionsByBranch->get($branch->id, collect());
            $amountPaid = (int) $branchContributions->sum('amount');
            $lastPayment = $branchContributions->last();
            $openingDate = $branch->opening_date
                ? Carbon::parse($branch->opening_date)
                : Carbon::parse('2026-01-01');
            $isGracePeriod = $periodDate->lt($openingDate) || $openingDate->diffInMonths($periodDate) < 3;

            $status = 'belum';
            if ($isGracePeriod && $amountPaid === 0) {
                $status = 'grace_period';
            } elseif ($amountPaid >= 1000000) {
                $status = 'lunas';
            } elseif ($amountPaid > 0) {
                $status = 'kurang';
            }

            $creator = $lastPayment?->creator;

            return [
                'branch_id' => $branch->id,
                'wilayah' => $branch->wilayah,
                'unit' => $branch->unit,
                'isactive' => (int) $branch->isactive,
                'opening_date' => $branch->opening_date,
                'is_grace_period' => $isGracePeriod,
                'can_add' => $canAddAll || ($canAddZone && in_array((int) $branch->id, $zoneBranchIds)),
                'status' => $status,
                'amount_paid' => $amountPaid,
                'payment_date' => $lastPayment?->payment_date?->format('Y-m-d'),
                'last_payment_by' => $creator
                    ? ($creator->employee?->nama_karyawan ?? $creator->username)
                    : null,
                'total_akumulasi' => (int) $totalContributions->get($branch->id, 0),
            ];
        });

        return Inertia::render('Tabungan/Contributions', [
            'period' => $period,
            'datas' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'period' => ['required', 'date_format:Y-m'],
            'amount' => ['required', 'integer', 'min:1'],
            'payment_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $this->authorizeContributionWrite((int) $validated['branch_id']);

        $branch = Branch::findOrFail($validated['branch_id']);
        $openingDate = $branch->opening_date
            ? Carbon::parse($branch->opening_date)
            : Carbon::parse('2026-01-01');
        $periodDate = Carbon::parse($validated['period'] . '-01');

        if ($periodDate->lt($openingDate) || $openingDate->diffInMonths($periodDate) < 3) {
            return back()->withErrors([
                'amount' => 'Kantor ini masih dalam masa tenggang (umur <= 3 bulan) dan belum wajib membayar iuran.',
            ]);
        }

        TbContribution::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        return back()->with('message', 'Pembayaran iuran berhasil dicatat.');
    }

    public function history(Branch $branch)
    {
        $this->authorizeBranchRead($branch->id);

        $contributions = TbContribution::with(['creator.employee'])
            ->where('branch_id', $branch->id)
            ->orderByDesc('period')
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (TbContribution $contribution) => [
                'id' => $contribution->id,
                'period' => $contribution->period,
                'amount' => (int) $contribution->amount,
                'payment_date' => $contribution->payment_date?->format('Y-m-d'),
                'notes' => $contribution->notes,
                'kasir' => $contribution->creator
                    ? ($contribution->creator->employee?->nama_karyawan ?? $contribution->creator->username)
                    : null,
            ]);

        return response()->json([
            'contributions' => $contributions,
            'can_delete' => $this->canManageBranch($branch->id),
        ]);
    }

    public function destroy(TbContribution $contribution)
    {
        $this->authorizeContributionWrite((int) $contribution->branch_id);

        $latest = TbContribution::query()
            ->where('branch_id', $contribution->branch_id)
            ->orderByDesc('period')
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->firstOrFail();

        abort_unless($latest->is($contribution), 422, 'Hanya transaksi iuran terakhir kantor ini yang boleh dihapus.');

        $contribution->delete();

        return back()->with('message', 'Transaksi iuran berhasil dihapus.');
    }

    private function authorizeBranchRead(int $branchId): void
    {
        $allowedBranchIds = Branch::getAllowedBranchIds($this->authenticatedUser());

        abort_if(
            $allowedBranchIds !== null && !in_array($branchId, $allowedBranchIds),
            403,
            'Anda tidak memiliki akses ke kantor ini.',
        );
    }

    private function authorizeContributionWrite(int $branchId): void
    {
        abort_unless($this->canManageBranch($branchId), 403, 'Anda tidak memiliki hak akses untuk mengelola iuran.');
    }

    private function canManageBranch(int $branchId): bool
    {
        if ($this->canManageAll()) {
            return true;
        }

        return $this->canManageZone() && in_array($branchId, $this->zoneBranchIds());
    }

    private function canManageAll(): bool
    {
        $user = $this->authenticatedUser();

        return $user !== null && (
            $user->hasPermissionTo('create-contributions-all') ||
            $user->hasRole('superuser') ||
            $user->hasRole('pusat')
        );
    }

    private function canManageZone(): bool
    {
        $user = $this->authenticatedUser();

        return $user !== null && (
            $user->hasPermissionTo('create-contributions-zone') ||
            $user->hasRole('stafkontrol')
        );
    }

    private function zoneBranchIds(): array
    {
        $employee = $this->authenticatedUser()?->employee;

        return $employee
            ? $employee->employeeZones()->pluck('branch_id')->map(fn ($id) => (int) $id)->all()
            : [];
    }

    private function authenticatedUser(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }
}
