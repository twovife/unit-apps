<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\TransactionLoan;
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
    $transaction_date = $request->date ?? Carbon::now();

    $loan = TransactionLoan::with(['loan_instalment', 'manage_customer' => function ($itm) {
      $itm->with('customers')
        ->withCount(['loan' => function ($subItm) {
          $subItm->where('status', 'success')->whereColumn('transaction_loans.id', '<', 'transaction_loans.id');
        }]);
    }])
      ->whereIn('request_date', [$transaction_date->format('Y-m-d'), $transaction_date->copy()->subWeeks(1)->format('Y-m-d')])
      ->where('branch_id', $branch_id)
      ->whereHas('manage_customer', function ($item) use ($kelompok) {
        $item->where('kelompok', $kelompok);
      })
      ->orderByDesc('request_date')
      ->get()
      ->groupBy(function ($item) {
        return Carbon::parse($item->request_date)->format('Y-m-d');
      })
      ->map(function ($rencana_drop, $date) use ($transaction_date) {


        return [
          'date' => $date,
          // 'data' => $rencana_drop
          'data' => $rencana_drop->map(function ($item) {
            return [
              'tanggal_pengajuan' => AppHelper::dateName($item->request_date) . " : " . Carbon::parse($item->request_date)->format('d-m-y'),
              'nama' => $item->manage_customer->customers->nama,
              'alamat' => $item->manage_customer->customers->alamat,
              'nomor_anggota' => $item->manage_customer->id,
              'pinjaman_ke' => $item->manage_customer->loan_count + 1,
              'tanggal_drop' => $item->drop_date,

              'drop' => $item->drop_before,
              'request' => $item->request_nominal,
              'acc' => $item->approved_nominal,
              'drop_jadi' => $item->drop,

              'check_date' => $item->check_date,

              'nomor_pengajuan' => $item->id,
              'nik' => $item->manage_customer->customers->nik,
              'kelompok' => $item->manage_customer->kelompok,
              'hari' => $item->hari,
              'status' => $item->status,
            ];
          })->values(),
        ];
      })->values();

    // ddd($loan);
    return Inertia::render('MobileApps/Pengajuan/Index', [
      'data' => $loan,
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
