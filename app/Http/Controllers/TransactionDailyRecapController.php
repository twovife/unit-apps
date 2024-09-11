<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionSirculation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PHPUnit\TextUI\Output\SummaryPrinter;

class TransactionDailyRecapController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function rekap_index(Request $request)
  {

    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->branch->id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;
    $transaction_date = Carbon::parse($request->date ?? Carbon::now());

    $tanggal_sirkulasi = $transaction_date->copy()->subMonthNoOverflow(1)->endOfMonth()->format('Y-m-d');

    $startDateofMonth = $transaction_date->copy()->startOfMonth()->format('Y-m-d');
    $dateOfMb = $transaction_date->copy()->subMonth(4);
    $dateOfCm = $transaction_date->copy()->subMonth(3);
    $transactionOffice = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->get();

    $transactionDailyRecap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->where('date', $transaction_date->format('Y-m-d'))->get();

    $transactionSirculation = TransactionSirculation::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->where('date', $tanggal_sirkulasi)
      ->get()->groupBy('transaction_loan_officer_grouping_id');

    // $instalment = TransactionLoanInstalment::select('transaction_loan_officer_grouping_id', 'transaction_date', 'status', 'nominal')
    //   ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
    //   ->whereBetween('transaction_date', [$dateOfMb->startOfMonth()->format('Y-m-d'), $transaction_date->format('Y-m-d')])
    //   ->get()->groupBy('transaction_loan_officer_grouping_id');

    $loan = TransactionLoan::with('loan_instalment')->select('transaction_loan_officer_grouping_id', 'drop_date', 'status', 'nominal_drop', 'pinjaman', 'id')
      ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->where('status', 'success')
      ->whereBetween('drop_date', [$dateOfMb->startOfMonth()->format('Y-m-d'), $transaction_date->format('Y-m-d')])
      ->get()->groupBy('transaction_loan_officer_grouping_id');

    ddd($loan);

    $data =  $transactionOffice->map(function ($item) use ($loan, $instalment, $transactionSirculation, $transactionDailyRecap, $transaction_date, $startDateofMonth, $dateOfCm, $dateOfMb) {
      $transaction_date = $transaction_date->format('Y-m-d');
      $thisLoan = $loan->get($item->id, collect());
      $thisInstalment = $instalment->get($item->id, collect());
      $thisSirculation = $transactionSirculation->get($item->id, collect());
      $thisDailyRecap = $transactionDailyRecap->where('transaction_loan_officer_grouping_id', $item->id)->first();
      $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
      $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

      $totalDrop = $thisLoan->whereBetween('drop_date', [$startDateofMonth, $transaction_date])->sum('nominal_drop') ?? 0;
      $totalStorting = $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->sum('nominal') ?? 0;

      $totalStortingCm = $thisLoan->whereBetween('drop_date', [$dateOfCm->startOfMonth()->format('Y-m-d'), $dateOfCm->endOfMonth()->format('Y-m-d')])->sum('pinjaman') ?? 0;

      $sirkulasi = $thisSirculation->sum('amount') ?? 0;
      return [
        'kelompok' => $item->kelompok,
        'rekap_status' => $thisDailyRecap ? true : false,
        'status_approve_kepala' => $status_kepala,
        'status_approve_kasir' => $status_kasir,
        'status_dayly_approval' => $status_kepala && $status_kasir,
        'transaction_date' => $transaction_date,

        'kasbon' => $thisDailyRecap?->kasbon ?? 0,
        'drop' => $thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop') ?? 0,
        'total_drop' => $totalDrop,

        'storting' => $thisInstalment->where('transaction_date', $transaction_date)->sum('nominal') ?? 0,
        'total_storting' => $totalStorting,
        'sirkulasi' => (int) round($sirkulasi + ($totalDrop * 1.3) - ($totalStorting)),

        'angsuran_cm' => $thisInstalment->where('transaction_date', $transaction_date)->where('status', 2)->sum('nominal') ?? 0,
        'saldo_cm' => $totalStortingCm,
      ];
    })->values();

    ddd($data);
    return Inertia::render('Kasir/Rekap/Index', [
      'server_filter' => ['date' => $transaction_date, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id]
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
  public function show(TransactionDailyRecap $transactionDailyRecap)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(TransactionDailyRecap $transactionDailyRecap)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, TransactionDailyRecap $transactionDailyRecap)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(TransactionDailyRecap $transactionDailyRecap)
  {
    //
  }
}
