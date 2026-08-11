<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    /**
     * Ambil branch_id default untuk suatu user.
     * Staf Kontrol → cabang pertama dari zone mereka.
     * Lainnya → cabang pusat.
     */
    public static function getDefaultBranchId(?\App\Models\User $user = null)
    {
        if ($user && $user->employee) {
            // Jika user adalah Staf Kontrol, ambil zona pertama
            if ($user->hasPermissionTo('view-zone-branches')) {
                $firstZone = $user->employee->employeeZones()->first();
                if ($firstZone) {
                    return $firstZone->branch_id;
                }
            }

            // Untuk karyawan lain (Mantri, Pimpinan, Kasir, dll), default-nya adalah cabang utamanya sendiri
            if ($user->employee->branch_id) {
                return $user->employee->branch_id;
            }
        }

        return self::where('wilayah', 0)->first()?->id ?? 1;
    }

    /**
     * Ambil daftar branch_id yang boleh diakses oleh user.
     *
     * - Superuser / Pusat  → null (artinya: semua cabang, tanpa filter)
     * - Staf Kontrol       → cabang-cabang yang terdaftar di employee_zones
     * - Pengawas/Pimpinan  → branch_id utama + cabang di employee_branches
     *
     * Mengembalikan null berarti tidak ada pembatasan (akses semua).
     * Mengembalikan array kosong berarti tidak ada cabang yang diizinkan.
     */
    public static function getAllowedBranchIds(?\App\Models\User $user = null): array|null
    {
        if (!$user) return [];

        // Akses view-all-branches tidak dibatasi
        if ($user->hasPermissionTo('view-all-branches')) {
            return null;
        }

        $branchIds = [];
        $employee = $user->employee;

        // 1. Semua karyawan minimal mendapatkan akses ke cabang utamanya
        if ($employee && $employee->branch_id) {
            $branchIds[] = $employee->branch_id;
        }

        if ($employee) {
            // 2. Staf Kontrol: ambil cabang dari employee_zones (hak pantau/audit)
            if ($user->hasPermissionTo('view-zone-branches')) {
                $zoneBranchIds = $employee->employeeZones()->pluck('branch_id')->toArray();
                $branchIds = array_merge($branchIds, $zoneBranchIds);
            }

            // 3. Pengawas/Pimpinan: cabang struktural tambahan (employee_branches)
            if ($user->hasPermissionTo('view-delegated-branches')) {
                $additionalIds = $employee->employeeBranches()->pluck('branch_id')->toArray();
                $branchIds = array_merge($branchIds, $additionalIds);
            }
        }

        return array_values(array_unique($branchIds));
    }
}
