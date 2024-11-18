<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\TransactionSirculation;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{

  public function index()
  {
    $role = Role::with('permissions', 'users')->get();
    $user = User::with('rolelist')->get();


    $permission = Permission::all();
    return Inertia::render('AdminPanel/Index', [
      'role' => $role,
      'permission' => $permission,
      'user' => $user,
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
    } catch (Exception $e) {
      DB::rollBack();
      ddd($e);
      return redirect()->back()->withErrors('Sirkulasi Awal Error');
    }
    return redirect()->back()->with('message', 'Sirkulasi Awal Successfully');
  }
}
