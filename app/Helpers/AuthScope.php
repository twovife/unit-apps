<?php

namespace App\Helpers;

use App\Models\Branch;
use Illuminate\Support\Facades\Session;

class AuthScope
{
    /**
     * Mengambil ID Cabang yang sedang aktif.
     * 1. Cek session 'active_branch_id'.
     * 2. Jika tidak ada, ambil default branch untuk user tersebut.
     * 3. Validasi apakah user memiliki akses ke cabang tersebut.
     *
     * @return int
     */
    public static function getActiveBranchId()
    {
        $user = auth()->user();
        if (!$user) {
            return 1; // Fallback jika tidak ada user
        }

        $allowedBranches = Branch::getAllowedBranchIds($user);
        // Cek dari session yang terikat dengan user ID
        $activeBranchId = Session::get("active_branch_id_{$user->id}");

// dd(['activebranch'=>$activeBranchId],['alowedbranch'=>$allowedBranches]);

        // Jika session ada, validasi apakah diizinkan
        if ($activeBranchId) {
            // Jika allowedBranches === null, berarti user punya akses ke semua cabang
            if ($allowedBranches === null || in_array($activeBranchId, $allowedBranches)) {
                return $activeBranchId;
            }
        }

        // Jika tidak valid atau belum di-set, kembalikan ke default
        $defaultId = Branch::getDefaultBranchId($user);

        // Update session dengan default agar konsisten
        Session::put("active_branch_id_{$user->id}", $defaultId);
// dd($defaultId);
        return $defaultId;
    }

    /**
     * Resolusi data scope (branch_id, wilayah, kelompok)
     * Mengembalikan object dengan data yang siap dipakai.
     */
    public static function resolve()
    {
        $user = auth()->user();

        $branchId = self::getActiveBranchId();

        // Ambil wilayah dari branch yang aktif
        $branch = Branch::find($branchId);
        $wilayah = $branch ? $branch->wilayah : 1;

        // Kelompok (area): karena kelompok spesifik untuk user, jika dia tidak punya akses 'view-all-groups',
        // maka dipaksa hanya melihat areanya sendiri.
        $kelompok = 1;
        if ($user) {
            if (!$user->hasPermissionTo('view-all-groups')) {
                // Mantri dipaksa melihat area-nya masing-masing
                $kelompok = $user->employee->area ?? 1;
            } else {
                // KM/Pimpinan menggunakan request jika ada, jika tidak cari kelompok pertama di cabang ini
                $kelompok = request('kelompok');
                if (!$kelompok) {
                    $firstGroup = \App\Models\TransactionLoanOfficerGrouping::where('branch_id', $branchId)
                                                                            ->orderBy('kelompok')
                                                                            ->first();
                    $kelompok = $firstGroup ? $firstGroup->kelompok : 1;
                }
            }
        }

        return (object) [
            'branch_id' => $branchId,
            'wilayah' => $wilayah,
            'kelompok' => $kelompok,
            'allowed_branches' => Branch::getAllowedBranchIds($user),
            'user' => $user
        ];
    }
}
