<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\OpsBopContribution;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BopContributionController extends Controller
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
            $contributionsByBranch = OpsBopContribution::with(['creator.employee'])
                ->whereIn('branch_id', $branchIds)
                ->where('period', $period)
                ->orderBy('payment_date')
                ->orderBy('id')
                ->get()
                ->groupBy('branch_id');

            $totalContributions = OpsBopContribution::query()
                ->selectRaw('branch_id, SUM(amount) as total_amount')
                ->whereIn('branch_id', $branchIds)
                ->groupBy('branch_id')
                ->pluck('total_amount', 'branch_id');
        }

        $canAddAll = $this->canManageAll();
        $canAddZone = $this->canManageZone();
        $zoneBranchIds = $canAddZone && !$canAddAll
            ? (Branch::getAllowedBranchIds($this->authenticatedUser()) ?? [])
            : [];
        $isGracePeriod = $branch?->opening_date
            ? Carbon::parse($branch->opening_date)->diffInMonths(Carbon::now()) < 3
            : false;

        $data = $branches->map(function (Branch $branch) use (
            $contributionsByBranch,
            $totalContributions,
            $isGracePeriod,
            $canAddAll,
            $canAddZone,
            $zoneBranchIds,
        ) {
            $branchContributions = $contributionsByBranch->get($branch->id, collect());
            $amountPaid = (int) $branchContributions->sum('amount');
            $lastPayment = $branchContributions->last();

            $status = 'belum';
            if (!$branch->isactive) {
                $status = 'tutup';
            } elseif ($isGracePeriod) {
                $status = 'masa_tenggang';
            } elseif ($amountPaid >= 1500000) {
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
                'status' => $status,
                'is_grace_period' => $isGracePeriod,
                'amount_paid' => $amountPaid,
                'payment_date' => $lastPayment?->payment_date?->format('Y-m-d'),
                'last_payment_by' => $creator
                    ? ($creator->employee?->nama_karyawan ?? $creator->username)
                    : null,
                'total_akumulasi' => (int) $totalContributions->get($branch->id, 0),
                'can_add' => (bool) $branch->isactive
                    && !$isGracePeriod
                    && ($canAddAll || ($canAddZone && in_array((int) $branch->id, $zoneBranchIds))),
            ];
        });

        return Inertia::render('Tabungan/BopContributions', [
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
        abort_unless($branch->isactive, 422, 'Iuran BOP hanya dapat dicatat untuk kantor aktif.');

        if ($branch->opening_date && Carbon::parse($branch->opening_date)->diffInMonths(Carbon::now()) < 3) {
            return back()->withErrors([
                'amount' => 'Kantor ini masih dalam masa tenggang (umur <= 3 bulan) dan belum wajib membayar iuran BOP.',
            ]);
        }

        OpsBopContribution::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        return back()->with('message', 'Pembayaran iuran BOP berhasil dicatat.');
    }

    public function history(Branch $branch)
    {
        $this->authorizeBranchRead($branch->id);

        $contributions = OpsBopContribution::with(['creator.employee'])
            ->where('branch_id', $branch->id)
            ->orderByDesc('period')
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (OpsBopContribution $contribution) => [
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

    public function destroy(OpsBopContribution $contribution)
    {
        $this->authorizeContributionWrite((int) $contribution->branch_id);

        $latest = OpsBopContribution::query()
            ->where('branch_id', $contribution->branch_id)
            ->orderByDesc('period')
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->firstOrFail();

        abort_unless($latest->is($contribution), 422, 'Hanya transaksi BOP terakhir kantor ini yang boleh dihapus.');

        $contribution->delete();

        return back()->with('message', 'Iuran BOP berhasil dihapus.');
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
        abort_unless($this->canManageBranch($branchId), 403, 'Anda tidak memiliki hak akses untuk mengelola iuran BOP.');
    }

    private function canManageBranch(int $branchId): bool
    {
        if ($this->canManageAll()) {
            return true;
        }

        $zoneBranchIds = Branch::getAllowedBranchIds($this->authenticatedUser()) ?? [];

        return $this->canManageZone() && in_array($branchId, $zoneBranchIds);
    }

    private function canManageAll(): bool
    {
        return $this->authenticatedUser()?->hasPermissionTo('create-contributions-all') ?? false;
    }

    private function canManageZone(): bool
    {
        return $this->authenticatedUser()?->hasPermissionTo('create-contributions-zone') ?? false;
    }

    private function authenticatedUser(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }
}
