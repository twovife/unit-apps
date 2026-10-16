<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\InvAsset;
use App\Models\InvCategory;
use App\Models\InvLocation;
use App\Models\InvMaintenanceLog;
use App\Models\InvVehicle;
use App\Models\InvVehicleTax;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VehicleAssetController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:aktif,rusak,hilang,dihapus'],
        ]);
        $branchId = $this->activeBranchId();
        $branch = Branch::query()->findOrFail($branchId, ['id', 'unit', 'wilayah']);
        $officeAssets = $this->vehicleAssetsAt($branchId);

        $summary = (clone $officeAssets)
            ->selectRaw(
                "COUNT(*) as total,
                SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status IN ('rusak', 'hilang') THEN 1 ELSE 0 END) as problematic,
                COALESCE(SUM(purchase_cost), 0) as purchase_value",
            )
            ->first();

        $assets = (clone $officeAssets)
            ->with([
                'vehicle:id,asset_id,plat_nomor,tanggal_stnk,tanggal_pajak_tahunan',
                'currentLocation.branch:id,unit,wilayah',
            ])
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($validated['search'] ?? null, function ($query, $search) {
                $search = trim($search);
                $plateSearch = str_replace(' ', '', $search);

                $query->where(function ($filter) use ($search, $plateSearch) {
                    $filter->where('name', 'like', "%{$search}%")
                        ->orWhere('asset_code', 'like', "%{$search}%")
                        ->orWhereHas('vehicle', fn ($vehicle) => $vehicle->whereRaw(
                            "REPLACE(plat_nomor, ' ', '') LIKE ?",
                            ["%{$plateSearch}%"],
                        ));
                });
            })
            ->orderBy('name')
            ->paginate(25)
            ->appends(array_filter([
                'search' => $validated['search'] ?? null,
                'status' => $validated['status'] ?? null,
            ], fn ($value) => $value !== null && $value !== ''));

        return Inertia::render('Assets/Vehicles', [
            'branch' => $branch,
            'assets' => $assets,
            'branches' => $this->allowedBranches(),
            'summary' => [
                'total' => (int) ($summary->total ?? 0),
                'active' => (int) ($summary->active ?? 0),
                'problematic' => (int) ($summary->problematic ?? 0),
                'purchase_value' => (int) ($summary->purchase_value ?? 0),
            ],
            'filters' => [
                'search' => $validated['search'] ?? '',
                'status' => $validated['status'] ?? '',
            ],
            'canEditVehicleRegistration' => $this->canEditVehicleRegistration($request),
            'video' => \App\Helpers\VideoTutorial::url('cekaset')['cekaset'] ?? null,
        ]);
    }

    public function herList(Request $request)
    {
        $validated = $request->validate([
            'bulan' => ['nullable', 'date_format:Y-m'],
        ]);
        $period = $validated['bulan'] ?? now()->format('Y-m');
        $month = (int) Carbon::createFromFormat('Y-m', $period)->format('m');
        $year = (int) Carbon::createFromFormat('Y-m', $period)->format('Y');
        $branchId = $this->activeBranchId();

        $vehicles = InvVehicle::query()
            ->with([
                'asset:id,category_id,asset_code,name,status',
                'asset.currentLocation.branch:id,unit',
            ])
            ->whereHas('asset', fn ($query) => $query
                ->where('status', 'aktif')
                ->where('category_id', InvCategory::KENDARAAN)
                ->whereHas('currentLocation', fn ($location) => $location->where('branch_id', $branchId)))
            ->whereMonth('tanggal_pajak_tahunan', $month)
            ->orderBy('tanggal_pajak_tahunan')
            ->paginate(50)
            ->appends(['bulan' => $period])
            ->through(function (InvVehicle $vehicle) use ($year) {
                $due = $vehicle->tanggal_pajak_tahunan;
                $today = now()->startOfDay();
                $sampai = $due->year;
                if ($due->lt($today)) {
                    $sampai = max($due->year, $due->format('m-d') <= $today->format('m-d') ? (int) $today->year : (int) $today->year - 1);
                }

                return [
                    'id' => $vehicle->id,
                    'asset_id' => $vehicle->asset_id,
                    'asset_code' => $vehicle->asset->asset_code,
                    'name' => $vehicle->asset->name,
                    'plat_nomor' => $vehicle->plat_nomor,
                    'nama_stnk' => $vehicle->nama_stnk,
                    'tanggal_pajak_tahunan' => $due->toDateString(),
                    'tanggal_stnk' => $vehicle->tanggal_stnk->toDateString(),
                    'jenis_pajak' => $vehicle->labelJenisPajak(),
                    'tahun_ke' => $vehicle->pajakTahunKe(),
                    'periode' => $due->year,
                    'sampai_periode' => $sampai,
                    'tertunggak' => max(0, $sampai - $due->year),
                    'unit' => $vehicle->asset->currentLocation?->branch?->unit ?? '-',
                    'pengguna' => $vehicle->asset->currentLocation?->pengguna ?? '-',
                    'is_paid' => $due->year > $year,
                ];
            });

        return Inertia::render('Assets/VehicleTaxes', [
            'branch' => Branch::query()->findOrFail($branchId, ['id', 'unit']),
            'vehicles' => $vehicles,
            'period' => $period,
            'branches' => $this->allowedBranches(),
        ]);
    }

    public function detailJson(Request $request, InvAsset $asset)
    {
        $this->assertAssetInActiveBranch($request, $asset);
        $allowed = $this->allowedBranchIds();
        $asset->load([
            'category:id,name',
            'vehicle.taxes' => fn ($query) => $query->orderByDesc('periode')->orderByDesc('id'),
            'locations' => fn ($query) => $query
                ->when($allowed !== null, fn ($locations) => $locations->whereIn('branch_id', $allowed))
                ->orderByDesc('assigned_date')->orderByDesc('id'),
            'locations.branch:id,unit,wilayah',
            'locations.beforeBranch' => fn ($query) => $query
                ->when($allowed !== null, fn ($branches) => $branches->whereIn('id', $allowed))
                ->select(['id', 'unit', 'wilayah']),
            'maintenanceLogs' => fn ($query) => $query->orderByDesc('maintenance_date')->orderByDesc('id'),
            'currentLocation.branch:id,unit,wilayah',
        ]);

        $taxInfo = null;
        if ($asset->vehicle && $asset->vehicle->tanggal_pajak_tahunan) {
            $v = $asset->vehicle;
            $due = $v->tanggal_pajak_tahunan;
            $currentYear = (int) now()->year;
            $sampai = max($due->year, $currentYear);
            $taxInfo = [
                'vehicle_id' => $v->id,
                'tanggal_pajak_tahunan' => $due->toDateString(),
                'tanggal_stnk' => $v->tanggal_stnk?->toDateString(),
                'jenis_pajak' => $v->labelJenisPajak(),
                'is_5_tahunan' => $v->isPajak5Tahunan(),
                'tahun_ke' => $v->pajakTahunKe(),
                'periode' => $due->year,
                'sampai_periode' => $sampai,
                'tertunggak' => max(0, $sampai - $due->year),
                'is_paid' => $due->year > $currentYear,
            ];
        }

        return response()->json([
            'asset' => $asset,
            'branches' => $this->allowedBranches(),
            'tax_info' => $taxInfo,
        ]);
    }

    public function store(Request $request)
    {
        $branchId = $this->activeBranchId();
        $category = InvCategory::query()->where('name', 'Kendaraan')->firstOrFail();
        $validated = $this->validateAsset($request, creating: true);

        DB::transaction(function () use ($validated, $branchId, $category) {
            $this->assertUniquePlate($validated['plat_nomor']);
            $year = Carbon::parse($validated['purchase_date'])->year;
            $codeCount = InvAsset::query()->whereYear('purchase_date', $year)->lockForUpdate()->count() + 1;
            $asset = InvAsset::query()->create([
                'category_id' => $category->id,
                'asset_code' => 'AST-' . $year . '-' . str_pad((string) $codeCount, 4, '0', STR_PAD_LEFT),
                'name' => $validated['name'],
                'purchase_date' => $validated['purchase_date'],
                'purchase_cost' => $validated['purchase_cost'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
            ]);

            InvLocation::query()->create([
                'asset_id' => $asset->id,
                'branch_id' => $branchId,
                'before_branch_id' => null,
                'pengguna' => $validated['pengguna'],
                'assigned_date' => $validated['purchase_date'],
                'notes' => $validated['notes'] ?? 'Penempatan Awal',
            ]);

            $this->saveVehicleDetails($asset, $validated);
        });

        return redirect()->route('assets.index')->with('success', 'Kendaraan berhasil didaftarkan.');
    }

    public function update(Request $request, InvAsset $asset)
    {
        $this->assertAssetInActiveBranch($request, $asset);
        $validated = $this->validateAsset($request);
        $this->guardRegistrationDates($request, $asset, $validated);
        $branchId = $this->activeBranchId();
        DB::transaction(function () use ($request, $asset, $validated, $branchId) {
            $lockedAsset = InvAsset::query()->whereKey($asset->id)->lockForUpdate()->firstOrFail();
            $this->assertAssetBranch($lockedAsset, $branchId);
            $lockedAsset->vehicle()->lockForUpdate()->first();
            $this->guardRegistrationDates($request, $lockedAsset, $validated);
            $this->assertUniquePlate($validated['plat_nomor'], $lockedAsset->id);
            $lockedAsset->update([
                'name' => $validated['name'],
                'purchase_date' => $validated['purchase_date'],
                'purchase_cost' => $validated['purchase_cost'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
            ]);
            $this->saveVehicleDetails($lockedAsset, $validated);
        });

        return back()->with('success', 'Data kendaraan berhasil diperbarui.');
    }

    public function destroy(Request $request, InvAsset $asset)
    {
        abort_if($request->user()?->hasRole('kasir'), 403, 'Role kasir tidak memiliki izin untuk menghapus kendaraan.');
        $this->assertAssetInActiveBranch($request, $asset);
        $branchId = $this->activeBranchId();
        DB::transaction(function () use ($asset, $branchId) {
            $lockedAsset = InvAsset::query()->whereKey($asset->id)->lockForUpdate()->firstOrFail();
            $this->assertAssetBranch($lockedAsset, $branchId);
            $lockedAsset->delete();
        });

        return redirect()->route('assets.index')->with('success', 'Kendaraan berhasil dihapus.');
    }

    public function mutate(Request $request, InvAsset $asset)
    {
        $this->assertAssetInActiveBranch($request, $asset);
        $validated = $request->validate([
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'pengguna' => ['required', 'string', 'max:255'],
            'assigned_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);
        $this->assertAllowedBranch((int) $validated['branch_id'], 'memindahkan kendaraan');

        $activeBranchId = $this->activeBranchId();
        DB::transaction(function () use ($asset, $validated, $activeBranchId) {
            $lockedAsset = InvAsset::query()->whereKey($asset->id)->lockForUpdate()->firstOrFail();
            $currentLocation = $lockedAsset->currentLocation()->lockForUpdate()->firstOrFail();
            abort_unless((int) $currentLocation->branch_id === $activeBranchId, 404);

            if ((int) $currentLocation->branch_id === (int) $validated['branch_id']
                && $currentLocation->pengguna === $validated['pengguna']) {
                throw ValidationException::withMessages([
                    'branch_id' => 'Kantor dan pemakai kendaraan sudah sama dengan penempatan saat ini.',
                ]);
            }

            InvLocation::query()->create([
                'asset_id' => $lockedAsset->id,
                'branch_id' => $validated['branch_id'],
                'before_branch_id' => $currentLocation->branch_id,
                'pengguna' => $validated['pengguna'],
                'assigned_date' => $validated['assigned_date'],
                'notes' => $validated['notes'],
            ]);
        });

        return back()->with('success', 'Mutasi lokasi kendaraan berhasil dicatat.');
    }

    public function addMaintenance(Request $request, InvAsset $asset)
    {
        $this->assertAssetInActiveBranch($request, $asset);
        $validated = $request->validate([
            'maintenance_date' => ['required', 'date'],
            'cost' => ['required', 'integer', 'min:0'],
            'odometer' => ['nullable', 'integer', 'min:0'],
            'description' => ['required', 'string', 'max:5000'],
        ]);

        $branchId = $this->activeBranchId();
        DB::transaction(function () use ($asset, $validated, $branchId) {
            $lockedAsset = InvAsset::query()->whereKey($asset->id)->lockForUpdate()->firstOrFail();
            $this->assertAssetBranch($lockedAsset, $branchId);
            InvMaintenanceLog::query()->create([
                'asset_id' => $lockedAsset->id,
                'maintenance_date' => $validated['maintenance_date'],
                'cost' => $validated['cost'],
                'odometer' => $validated['odometer'] ?? null,
                'description' => $validated['description'],
            ]);
        });

        return back()->with('success', 'Catatan servis berhasil ditambahkan.');
    }

    public function confirmHer(Request $request, InvVehicle $vehicle)
    {
        $asset = $vehicle->asset()->firstOrFail();
        $this->assertAssetInActiveBranch($request, $asset);
        $branchId = $this->activeBranchId();
        $validated = $request->validate([
            'cost' => ['required', 'integer', 'min:0'],
            'denda' => ['nullable', 'integer', 'min:0'],
            'paid_date' => ['nullable', 'date'],
            'plat_nomor' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:255'],
            'sampai_periode' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        DB::transaction(function () use ($asset, $branchId, $vehicle, $validated) {
            $lockedAsset = InvAsset::query()->whereKey($asset->id)->lockForUpdate()->firstOrFail();
            $this->assertAssetBranch($lockedAsset, $branchId);
            $lockedVehicle = InvVehicle::query()->whereKey($vehicle->id)->lockForUpdate()->firstOrFail();
            $periodStart = $lockedVehicle->tanggal_pajak_tahunan->year;
            $periodEnd = (int) ($validated['sampai_periode'] ?? $periodStart);

            if ($periodEnd < $periodStart) {
                throw ValidationException::withMessages([
                    'sampai_periode' => "Periode tujuan tidak boleh sebelum {$periodStart}.",
                ]);
            }
            if ($periodEnd > now()->year + 1) {
                throw ValidationException::withMessages([
                    'sampai_periode' => 'Periode tujuan terlalu jauh ke depan.',
                ]);
            }
            if ($periodEnd - $periodStart + 1 > 10) {
                throw ValidationException::withMessages([
                    'sampai_periode' => 'Lebih dari 10 periode sekaligus. Periksa tanggal STNK dan jatuh tempo pajak.',
                ]);
            }

            $existingPeriods = InvVehicleTax::query()
                ->where('vehicle_id', $lockedVehicle->id)
                ->whereBetween('periode', [$periodStart, $periodEnd])
                ->pluck('periode');
            if ($existingPeriods->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'cost' => 'Pajak periode ' . $existingPeriods->implode(', ') . ' untuk kendaraan ini sudah tercatat.',
                ]);
            }

            $periodCount = $periodEnd - $periodStart + 1;
            for ($iteration = 1; $iteration <= $periodCount; $iteration++) {
                $isLast = $iteration === $periodCount;
                $due = $lockedVehicle->tanggal_pajak_tahunan->copy();
                $isFiveYearTax = $lockedVehicle->isPajak5Tahunan($due);
                $oldPlate = $lockedVehicle->plat_nomor;
                $newPlate = $isFiveYearTax && ! empty($validated['plat_nomor'])
                    ? $this->normalizePlate($validated['plat_nomor'])
                    : $oldPlate;
                $newStnk = $isFiveYearTax
                    ? $lockedVehicle->tanggal_stnk->copy()->addYears(5)
                    : $lockedVehicle->tanggal_stnk->copy();
                $newTaxDue = $due->copy()->addYear();

                if ($newPlate !== $oldPlate) {
                    $this->assertUniquePlate($newPlate, null, $lockedVehicle->id);
                }

                InvVehicleTax::query()->create([
                    'vehicle_id' => $lockedVehicle->id,
                    'periode' => $due->year,
                    'due_date' => $due->toDateString(),
                    'paid_date' => $validated['paid_date'] ?? now()->toDateString(),
                    'jenis' => $isFiveYearTax ? '5_tahunan' : 'tahunan',
                    'tahun_ke' => $lockedVehicle->pajakTahunKe($due),
                    'cost' => $isLast ? $validated['cost'] : 0,
                    'denda' => $isLast ? ($validated['denda'] ?? 0) : 0,
                    'plat_before' => $newPlate !== $oldPlate ? $oldPlate : null,
                    'plat_after' => $newPlate !== $oldPlate ? $newPlate : null,
                    'stnk_before' => $lockedVehicle->tanggal_stnk->toDateString(),
                    'stnk_after' => $newStnk->toDateString(),
                    'pajak_before' => $due->toDateString(),
                    'pajak_after' => $newTaxDue->toDateString(),
                    'notes' => $isLast
                        ? ($validated['notes'] ?? ($periodCount > 1 ? "Sekalian tunggakan {$periodStart}-" . ($periodEnd - 1) : null))
                        : "Tunggakan, dibayar bersama periode {$periodEnd}",
                    'created_by' => Auth::id(),
                ]);

                $lockedVehicle->update([
                    'tanggal_pajak_tahunan' => $newTaxDue->toDateString(),
                    'tanggal_stnk' => $newStnk->toDateString(),
                    'plat_nomor' => $newPlate,
                    'plat_prefix' => $this->platePrefix($newPlate),
                ]);
                $lockedVehicle->refresh();
            }
        });

        return back()->with('success', 'Pembayaran pajak kendaraan berhasil dikonfirmasi.');
    }

    public function cancelHer(Request $request, InvVehicleTax $tax)
    {
        $tax->loadMissing('vehicle.asset');
        $asset = $tax->vehicle?->asset;
        abort_if(! $asset, 404);
        $this->assertAssetInActiveBranch($request, $asset);
        $branchId = $this->activeBranchId();

        DB::transaction(function () use ($asset, $branchId, $tax) {
            $lockedAsset = InvAsset::query()->whereKey($asset->id)->lockForUpdate()->firstOrFail();
            $this->assertAssetBranch($lockedAsset, $branchId);
            $vehicle = InvVehicle::query()->whereKey($tax->vehicle_id)->lockForUpdate()->firstOrFail();
            $lockedTax = InvVehicleTax::query()
                ->whereKey($tax->id)
                ->where('vehicle_id', $vehicle->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (! $lockedTax->bisaDibatalkan()) {
                $lockedTax->delete();

                return;
            }

            $latestTaxId = InvVehicleTax::query()->where('vehicle_id', $vehicle->id)->max('id');
            abort_unless((int) $lockedTax->id === (int) $latestTaxId, 422, 'Hanya pembayaran pajak terakhir yang bisa dibatalkan.');
            abort_unless(
                $lockedTax->rantaiUtuh($vehicle),
                422,
                'Tanggal STNK atau jatuh tempo sudah berubah setelah pembayaran. Periksa data kendaraan sebelum membatalkan.',
            );

            $vehicle->update([
                'tanggal_pajak_tahunan' => $lockedTax->pajak_before->toDateString(),
                'tanggal_stnk' => $lockedTax->stnk_before?->toDateString() ?? $vehicle->tanggal_stnk->toDateString(),
                'plat_nomor' => $lockedTax->plat_before ?? $vehicle->plat_nomor,
                'plat_prefix' => $this->platePrefix($lockedTax->plat_before ?? $vehicle->plat_nomor),
            ]);
            $lockedTax->delete();
        });

        return back()->with('success', 'Pembayaran pajak berhasil dibatalkan.');
    }

    private function activeBranchId(): int
    {
        $scope = AuthScope::resolve();
        $branchId = (int) $scope->branch_id;
        $allowed = $scope->allowed_branches;

        abort_if(
            $allowed !== null && ! in_array($branchId, array_map('intval', $allowed), true),
            403,
            'Anda tidak memiliki akses ke kantor aktif ini.',
        );

        return $branchId;
    }

    private function vehicleAssetsAt(int $branchId)
    {
        return InvAsset::query()
            ->where('category_id', InvCategory::KENDARAAN)
            ->whereHas('currentLocation', fn ($query) => $query->where('branch_id', $branchId));
    }

    private function assertAssetInActiveBranch(Request $request, InvAsset $asset): void
    {
        $branchId = $this->activeBranchId();
        abort_unless(
            (int) $asset->currentLocation()->value('branch_id') === $branchId
                && (int) $asset->category_id === InvCategory::KENDARAAN,
            404,
        );
        $this->assertAllowedBranch($branchId, 'mengelola kendaraan');
    }

    private function assertAllowedBranch(int $branchId, string $action): void
    {
        $allowed = $this->allowedBranchIds();
        abort_if(
            $allowed !== null && ! in_array($branchId, array_map('intval', $allowed), true),
            403,
            "Anda tidak memiliki akses untuk {$action} di kantor ini.",
        );
    }

    private function assertAssetBranch(InvAsset $asset, int $branchId): void
    {
        abort_unless(
            (int) $asset->currentLocation()->lockForUpdate()->value('branch_id') === $branchId
                && (int) $asset->category_id === InvCategory::KENDARAAN,
            404,
        );
    }

    private function allowedBranchIds(): ?array
    {
        $allowed = Branch::getAllowedBranchIds(Auth::user());

        return $allowed === null ? null : array_map('intval', $allowed);
    }

    private function allowedBranches()
    {
        $allowed = Branch::getAllowedBranchIds(Auth::user());

        return Branch::query()
            ->when($allowed !== null, fn ($query) => $query->whereIn('id', $allowed))
            ->orderBy('unit')
            ->get(['id', 'unit', 'wilayah']);
    }

    private function validateAsset(Request $request, bool $creating = false): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'purchase_date' => ['required', 'date'],
            'purchase_cost' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:aktif,rusak,hilang,dihapus'],
            'description' => ['nullable', 'string', 'max:5000'],
            'plat_nomor' => ['required', 'string', 'max:50'],
            'nama_stnk' => ['required', 'string', 'max:255'],
            'tanggal_stnk' => ['required', 'date'],
            'tanggal_pajak_tahunan' => ['required', 'date'],
            'bpkb_location' => ['required', 'in:pusat,cabang,leasing,lainnya'],
        ];
        if ($creating) {
            $rules['pengguna'] = ['required', 'string', 'max:255'];
            $rules['notes'] = ['nullable', 'string', 'max:255'];
        }
        $validated = $request->validate($rules);
        $validated['plat_nomor'] = $this->normalizePlate($validated['plat_nomor']);

        return $validated;
    }

    private function saveVehicleDetails(InvAsset $asset, array $validated): void
    {
        InvVehicle::query()->updateOrCreate(
            ['asset_id' => $asset->id],
            [
                'plat_nomor' => $validated['plat_nomor'],
                'plat_prefix' => $this->platePrefix($validated['plat_nomor']),
                'nama_stnk' => $validated['nama_stnk'],
                'tanggal_stnk' => $validated['tanggal_stnk'],
                'tanggal_pajak_tahunan' => $validated['tanggal_pajak_tahunan'],
                'bpkb_location' => $validated['bpkb_location'],
            ],
        );
    }

    private function guardRegistrationDates(Request $request, InvAsset $asset, array $validated): void
    {
        $vehicle = $asset->vehicle;
        if (! $vehicle) {
            return;
        }

        $registrationChanged = $this->normalizePlate($vehicle->plat_nomor) !== $validated['plat_nomor']
            || ! $vehicle->tanggal_stnk->isSameDay(Carbon::parse($validated['tanggal_stnk']))
            || ! $vehicle->tanggal_pajak_tahunan->isSameDay(Carbon::parse($validated['tanggal_pajak_tahunan']));
        if (! $registrationChanged || $this->canEditVehicleRegistration($request)) {
            return;
        }

        abort(403, 'Plat nomor, tanggal STNK, dan jatuh tempo pajak hanya dapat berubah melalui konfirmasi pajak.');
    }

    private function canEditVehicleRegistration(Request $request): bool
    {
        return $request->user()?->getAllPermissions()->contains('name', 'edit-vehicle-stnk-data') ?? false;
    }

    private function assertUniquePlate(string $plate, ?int $assetId = null, ?int $vehicleId = null): void
    {
        $query = InvVehicle::query()->whereRaw("REPLACE(plat_nomor, ' ', '') = ?", [str_replace(' ', '', $plate)]);
        if ($assetId !== null) {
            $query->where('asset_id', '!=', $assetId);
        }
        if ($vehicleId !== null) {
            $query->where('id', '!=', $vehicleId);
        }
        if ($query->exists()) {
            throw ValidationException::withMessages([
                'plat_nomor' => 'Nomor plat kendaraan ini sudah terdaftar.',
            ]);
        }
    }

    private function normalizePlate(string $plate): string
    {
        $clean = strtoupper(str_replace(' ', '', trim($plate)));
        if (preg_match('/^([A-Z]{1,2})(\d{1,4})([A-Z]{0,3})$/', $clean, $matches)) {
            return $matches[1] . ' ' . $matches[2] . ($matches[3] ? ' ' . $matches[3] : '');
        }

        return strtoupper(preg_replace('/\s+/', ' ', trim($plate)));
    }

    private function platePrefix(string $plate): string
    {
        preg_match('/^[a-zA-Z]+/', trim($plate), $matches);

        return strtoupper($matches[0] ?? 'UNKNOWN');
    }
}
