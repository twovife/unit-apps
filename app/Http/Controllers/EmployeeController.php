<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {


    $branch = auth()->user()->employee->branch_id;

    $employee = Employee::with('username', 'employment')->where('branch_id', $branch)
      ->select('id', 'nik', 'nama_karyawan', 'alamat', 'hire_date', 'area', 'janis_jaminan', 'date_resign', 'resign_status', 'resign_reson', 'employment_id')
      ->orderBy('date_resign')
      ->orderBy('employment_id')
      ->orderBy('area')
      ->get();

    // dd($employee);

    $data = $employee->map(function ($item) {
      return [
        'id' => $item->id,
        'identity_id' => $item->nik,
        'employee_name' => $item->nama_karyawan,
        'address' => $item->alamat,
        'employment' => $item->employment->jabatan == "mantri" ? $item->employment->jabatan . " " . $item->area : $item->employment->jabatan,
        'isActive' => $item->date_resign ? false : true,
        'resign_date' => $item->date_resign,
        'hire_date' => $item->hire_date,
      ];
    });

    return Inertia::render('WebView/ManPower/Index', [
      'datas' => $data
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
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
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
