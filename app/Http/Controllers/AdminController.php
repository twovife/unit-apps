<?php

namespace App\Http\Controllers;

use App\Models\TransactionSirculation;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{

  public function index()
  {
    $role = Role::with('permissions', 'users')->get();
    $user = User::with('rolelist')->get();
    $maintenen_workers = User::permission('can-edit')->with('branch', 'employee')->get();
    // dd($maintenen_workers);

    $permission = Permission::all();
    return Inertia::render('AdminPanel/Index', [
      'role' => $role,
      'permission' => $permission,
      'user' => $user,
      'maintenen_workers' => $maintenen_workers
    ]);
  }
  public function post_permission(Request $request)
  {
    $request->validate([
      'name' => 'required',
      'type' => 'required',
    ]);

    if ($request->type == "permission") {
      $permission = Permission::create(['name' => $request->name]);
      return redirect()->back()->with('message', 'Permission Created Successfully');
    }

    if ($request->type == "role") {
      $role = Role::create(['name' => $request->name]);
      return redirect()->back()->with('message', 'Role Created Successfully');
    }

    return redirect()->back()->with('message', 'Role Created Successfully');
  }

  public function role_assign(Request $request)
  {

    try {
      $roleid = (int) $request->role;
      $perms = $request->permission;
      $role = Role::findById($roleid);
      $role->syncPermissions($perms);
    } catch (Exception $e) {
      return redirect()->back()->withErrors('User Assigned Error');
    }

    return redirect()->back()->with('message', 'Role Assigned Successfully');
  }
  public function user_assign(Request $request)
  {

    try {
      $userid = (int) $request->username;
      $roleid = (int) $request->role;

      $user = User::find($userid);
      $role = Role::findById($roleid);
      $user->syncRoles($role);
    } catch (Exception $e) {
      return redirect()->back()->withErrors('User Assigned Error');
    }

    return redirect()->back()->with('message', 'User Assigned Successfully');
  }

  public function sirkulasiAwal(Request $request)
  {
    // dd($request->all());
    $tanggal = Carbon::parse($request->month)->startOfMonth()->addMonthNoOverflow(1)->format('Y-m-d');

    try {
      DB::beginTransaction();
      // ddd($request->all());
      $sirkulasi = TransactionSirculation::firstOrCreate([
        "transaction_loan_officer_grouping_id" => $request->transaction_loan_officer_grouping_id,
        "date" => $tanggal,
        "day" => $request->hari
      ]);

      $sirkulasi->update([
        "amount" => $request->amount_next,
        "cm_amount" => $request->cm_next,
        "mb_amount" => $request->mb_next,
        "ml_amount" => $request->ml_next,
      ]);

      DB::commit();

      // Pendaftaran OTOMATIS ke alur agregasi baru sesudah tutup buku dicabut
      // 2026-10-04: migrasi dilakukan manual per kantor dari layar Kesiapan
      // Migrasi sesudah bucket dicek.
    } catch (Exception $e) {
      DB::rollBack();

      // `ddd($e)` dihapus 2026-08-12. Dump-and-die membuat baris `withErrors`
      // di bawah ini TIDAK PERNAH tercapai: user yang gagal menutup buku cuma
      // melihat layar dump (atau respons rusak kalau APP_DEBUG=false) dan tidak
      // pernah tahu sebabnya. Alur ini jadi gerbang migrasi ke agregasi baru —
      // kegagalan diam-diam di sini berarti kantornya tidak punya baris
      // sirkulasi, dan tidak ada yang tahu kenapa.
      Log::error('sirkulasiAwal gagal: ' . $e->getMessage(), [
        'grouping_id' => $request->transaction_loan_officer_grouping_id,
        'hari' => $request->hari,
        'month' => $request->month,
        'user_id' => auth()->id(),
        'line' => $e->getLine(),
      ]);

      return redirect()->back()->withErrors('Sirkulasi Awal gagal: ' . $e->getMessage());
    }
    return redirect()->back()->with('message', 'Sirkulasi Awal Successfully');
  }

  public function giveMaintenerWorker(Request $request)
  {
    $userid = (int) $request->username;
    if ($request->type == 1) {
      try {
        $user = User::find($userid);
        $user->givePermissionTo('can-edit');
      } catch (Exception $e) {
        return redirect()->back()->withErrors('User Assigned Error');
      }
    } else {
      try {
        $user = User::find($userid);
        $user->revokePermissionTo('can-edit');
      } catch (Exception $e) {
        return redirect()->back()->withErrors('User Assigned Error');
      }
    }
    return redirect()->back()->with('message', 'User Assigned Successfully');
  }

}
