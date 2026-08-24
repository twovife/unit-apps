<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class SetBranchController extends Controller
{
    /**
     * Update the active branch in session.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|integer|exists:branches,id'
        ]);

        // Validate if user is allowed to set this branch
        $user = auth()->user();
        if ($user) {
            $allowedBranches = \App\Models\Branch::getAllowedBranchIds($user);
            if ($allowedBranches === null || in_array($request->branch_id, $allowedBranches)) {
                Session::put("active_branch_id_{$user->id}", $request->branch_id);
                return back()->with('message', 'Cabang aktif berhasil diubah.');
            }
        }

        return back()->withErrors('Anda tidak memiliki akses ke cabang tersebut.');
    }
}
