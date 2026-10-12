<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {

    // Data karyawan (NIK, alamat) hanya untuk KM / kasir / pimpinan ke atas,
    // dan hanya cabang yang boleh diakses user - ?branch_id dari URL dulu
    // dipakai mentah, jadi siapa pun bisa membaca karyawan cabang mana pun.
    abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403, 'Data karyawan untuk kepala mantri, kasir, dan pimpinan.');
    $scope = \App\Helpers\AuthScope::resolve();
    $boleh = Branch::getAllowedBranchIds(auth()->user());
    $branch_id = $request->filled('branch_id') && ($boleh === null || in_array((int) $request->branch_id, $boleh))
      ? (int) $request->branch_id
      : $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);
    // dd($scope->branch_id);


    $employee = Employee::with('username.rolelist', 'employment')->where('branch_id', $branch_id)
      ->select('id', 'branch_id', 'nik', 'nama_karyawan', 'alamat', 'hire_date', 'area', 'janis_jaminan', 'date_resign', 'resign_status', 'resign_reson', 'employment_id')
      ->orderBy('date_resign')
      ->orderBy('employment_id')
      ->orderBy('area')
      ->get();


    $data = $employee->map(function ($item) {
      $username = $item->username->first();
      $jabatanName = $item->employment?->jabatan ?? '-';
      return [
        'id' => $item->id,
        'branch_id' => $item->branch_id,
        'identity_id' => $item->nik,
        'employee_name' => $item->nama_karyawan,
        'username' => $username?->username,
        'rolelist' => $username?->rolelist->map(function ($role) {
          return [
            'name' => $role->name
          ];
        }),
        'username_status' => $username?->isactive,
        'address' => $item->alamat,
        'employment' => strtolower($jabatanName) === "mantri" ? ($jabatanName . " " . $item->area) : $jabatanName,
        'isActive' => $item->date_resign ? false : true,
        'resign_date' => $item->date_resign,
        'hire_date' => $item->hire_date,
      ];
    });

    // dd($data);

    return Inertia::render('WebView/ManPower/Index', [
      'datas' => $data,
      'server_filter' => [
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id
      ]
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Display the specified resource.
   */
  public function show(Employee $employee)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Employee $employee)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Employee $employee)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Employee $employee)
  {
    //
  }
}
