<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MobileAppsMantriController extends Controller
{
  public function index()
  {
    return Inertia::render('MobileApps/Index');
  }

  public function index_pengajuan(Request $request)
  {
    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->employee->branch_id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;
    $kelompok = auth()->user()->can('can show kelompok') ? ($request->kelompok ?? 1) : auth()->user()->employee->area;
    $transaction_date = $request->date ?? Carbon::now()->format('Y-m-d');


    return Inertia::render('MobileApps/Pengajuan/Index', [
      'server_filter' => ['date' => $transaction_date, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $request->branch_id, 'kelompok' => $kelompok],
      'select_branch' => auth()->user()->can('can show branch'),
      'select_kelompok' => auth()->user()->can('can show kelompok'),
    ]);
  }

  public function create_pengajuan()
  {
    //
  }

  public function drop_pengajuan()
  {
    //
  }

  public function transaksi_pengajuan()
  {
    //
  }
}
