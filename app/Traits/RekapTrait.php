<?php

namespace App\Traits;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionSirculation;
use Carbon\Carbon;
use Illuminate\Http\Request;

trait RekapTrait
{
  public function getRencanaDropKepalaData(Request $request)
  {
    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->branch->id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;

    $transaction_date = $request->month ?? Carbon::now()->format('Y-m');
    $startOfMonth = Carbon::parse($transaction_date)->copy()->startOfMonth();
    $endOfMonth = Carbon::parse($transaction_date)->copy()->endOfMonth();
    $groupingId = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->get();

    $loan = TransactionLoan::with('loan_officer_grouping', 'customer', 'manage_customer')
      ->where(function ($data) use ($startOfMonth, $endOfMonth) {
        $data->whereBetween('drop_date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
          ->orWhereBetween('request_date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')]);
      })
      ->whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
      ->orderBy('drop_date')
      ->get()
      ->groupBy('drop_date');

    $datesMatchDay = collect();

    for ($i = $startOfMonth; $i->lte($endOfMonth); $i->addDays()) {
      if ($i->dayOfWeek !== 0) {
        $datesMatchDay->push($i->format('Y-m-d'));
      }
    }

    $daily_recap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))->whereIn('date', $datesMatchDay)->get()->groupBy('date');

    $instalment = TransactionLoanInstalment::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))->whereIn('transaction_date', $datesMatchDay)->get()->groupBy('transaction_date');


    $buku_rencana_drop = $datesMatchDay->map(function ($tanggal) use ($loan, $daily_recap, $instalment, $groupingId) {
      $thisDailyRecap = $daily_recap->get($tanggal, collect()); //stored as database
      $thisData = $loan->get($tanggal, collect()); //summary of drop
      $thisInstalment = $instalment->get($tanggal, collect()); //summary of instalment

      return $groupingId->map(function ($groupingId) use ($tanggal, $thisDailyRecap, $thisData, $thisInstalment) {
        $thisDataPerGrup = $thisData->where('transaction_loan_officer_grouping_id', $groupingId->id);
        $thisInstalmentPerGrup = $thisInstalment->where('transaction_loan_officer_grouping_id', $groupingId->id)->sum('nominal');
        $thisDailyRecapPerGrup = $thisDailyRecap->where('transaction_loan_officer_grouping_id', $groupingId->id)->first();
        return [
          'grouping_id' => $groupingId->id,
          'kelompok' => $groupingId->kelompok,
          'tanggal' => $tanggal,
          'kasbon' => $thisDailyRecapPerGrup ? $thisDailyRecapPerGrup->kasbon : 0,
          'transport' => $thisDailyRecapPerGrup ? $thisDailyRecapPerGrup->transport : 0,
          'masuk' => $thisDailyRecapPerGrup ? $thisDailyRecapPerGrup->masuk : 0,
          'keluar' => $thisDailyRecapPerGrup ? $thisDailyRecapPerGrup->keluar : 0,
          'target' => $thisDailyRecapPerGrup ? $thisDailyRecapPerGrup->target : 0,

          'storting' => $thisInstalmentPerGrup,
          'storting_on_database' => $thisDailyRecapPerGrup ? $thisDailyRecapPerGrup->storting : 0,
          'storting_validate' => $thisInstalmentPerGrup == ($thisDailyRecapPerGrup?->storting ?? 0) ? true : false,

          'baru' => $thisDataPerGrup->where('drop_langsung', 1)->where('status', 'success')->sum('nominal_drop'),
          'lama' => $thisDataPerGrup->where('drop_langsung', 0)->where('status', 'success')->sum('nominal_drop'),

          'drop' => $thisDataPerGrup->sum('nominal_drop'),
          'drop_on_database' => $thisDailyRecapPerGrup ? $thisDailyRecapPerGrup->drop : 0,
          'drop_validate' => $thisDataPerGrup->sum('drop_jadi') == ($thisDailyRecapPerGrup?->drop ?? 0) ? true : false,

          'rencana' => $thisDataPerGrup->where('drop_langsung', 0)->sum('approved_nominal'),
        ];
      });
    })->values();

    return [
      'datas' => $buku_rencana_drop,
      'server_filter' => ['month' => $transaction_date, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id]
    ];
  }

  public function getRekapDuaData(Request $request)
  {
    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->branch->id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;
    $transaction_date = Carbon::parse($request->date ?? Carbon::now());
    $startDateofMonth = $transaction_date->copy()->startOfMonth()->format('Y-m-d');

    $dateOfMb = $transaction_date->copy()->subMonth(4);
    $dateOfCm = $transaction_date->copy()->subMonth(3);
    $transactionOffice = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->get();

    $transactionDailyRecap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->where('date', $transaction_date->format('Y-m-d'))->get();

    $transactionSirculation = TransactionSirculation::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->where('date', $startDateofMonth)
      ->get()->groupBy('transaction_loan_officer_grouping_id');

    // dd($transactionSirculation);

    $instalment = TransactionLoanInstalment::select('transaction_loan_officer_grouping_id', 'transaction_date', 'status', 'nominal')
      ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->whereBetween('transaction_date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->get()->groupBy('transaction_loan_officer_grouping_id');

    $loan = TransactionLoan::select('transaction_loan_officer_grouping_id', 'drop_date', 'nominal_drop', 'pinjaman')
      ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->whereBetween('drop_date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->get()->groupBy('transaction_loan_officer_grouping_id');


    // dd($loan);

    $data =  $transactionOffice->map(function ($item) use ($loan, $instalment, $transactionSirculation, $transactionDailyRecap, $transaction_date, $startDateofMonth, $dateOfCm, $dateOfMb) {
      $transaction_date = $transaction_date->format('Y-m-d');
      // dd($transaction_date);
      $thisLoan = $loan->get($item->id, collect());
      $thisInstalment = $instalment->get($item->id, collect());
      $thisSirculation = $transactionSirculation->get($item->id, collect());
      $thisDailyRecap = $transactionDailyRecap->where('transaction_loan_officer_grouping_id', $item->id)->first();
      $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
      $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

      $totalDrop = $thisLoan->whereBetween('drop_date', [$startDateofMonth, $transaction_date])->sum('nominal_drop') ?? 0;

      $totalStorting = $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->sum('nominal') ?? 0;

      $angusuranExistingCm = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 2)->sum('nominal') ?? 0;
      $totalStortingCm =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 2)->sum('nominal') ?? 0;

      $angusuranExistingMb = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 3)->sum('nominal') ?? 0;
      $totalStortingMb =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 3)->sum('nominal') ?? 0;

      $angusuranExistingMl = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 4)->sum('nominal') ?? 0;
      $totalStortingMl =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 4)->sum('nominal') ?? 0;

      $sirkulasi = $thisSirculation->sum('amount') ?? 0;
      $sirkulasiCm = $thisSirculation->sum('cm_amount') ?? 0;
      $sirkulasiMb = $thisSirculation->sum('mb_amount') ?? 0;
      $sirkulasiMl = $thisSirculation->sum('ml_amount') ?? 0;

      $storting = $thisInstalment->where('transaction_date', $transaction_date)->sum('nominal') ?? 0;
      $do11 = (int) round($thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop') * 0.11) ?? 0;
      $titipan9 = (int) round($thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop') * 0.9) ?? 0;
      $kasbon = $thisDailyRecap?->kasbon ?? 0;
      $debit = $do11 + $kasbon + $storting;

      $transport = $thisDailyRecap?->transport ?? 0;
      $nominaldrop =  $thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop');
      $kredit = $nominaldrop + $transport;

      return [
        'type' => 'daily',
        'kelompok' => $item->kelompok,
        'id' => $item->id,
        'tanggal' => $transaction_date,
        'rekap_status' => $thisDailyRecap ? true : false,
        'status_approve_kepala' => $status_kepala,
        'status_approve_kasir' => $status_kasir,
        'status_dayly_approval' => $status_kepala && $status_kasir,
        'transaction_date' => $transaction_date,

        'kasbon' => $kasbon, //stored db
        'drop' => $nominaldrop,
        'total_drop' => $totalDrop,
        'do11' => $do11,
        'titipan9' => $titipan9,

        'debit' => $debit,
        'transport' => $transport, //stored db
        'kredit' => $kredit,
        'tunai' => $debit - $kredit,
        'tunai_ondb' => $thisDailyRecap?->tunai ?? 0, //stored db
        'is_balance' => ($debit - $kredit) == $thisDailyRecap?->tunai,


        'storting' => $storting,
        'total_storting' => $totalStorting,
        'sirkulasi' => (int) round($sirkulasi + ($totalDrop * 1.3) - ($totalStorting)),

        'angsuran_cm' => $angusuranExistingCm,
        'total_angsuran_cm' => $totalStortingCm,
        'saldo_cm' => $sirkulasiCm - $totalStortingCm,

        'angsuran_mb' => $angusuranExistingMb,
        'total_angsuran_mb' => $totalStortingMb,
        'saldo_mb' => $sirkulasiMb - $totalStortingMb,

        'angsuran_ml' => $angusuranExistingMl,
        'total_angsuran_ml' => $totalStortingMl,
        'saldo_ml' => $sirkulasiMl - $totalStortingMl,
      ];
    })->values();


    return  [
      'datas' => $data,
      'server_filter' => ['date' => $transaction_date->format('Y-m-d'), 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id]
    ];
  }

  public function getRekapPermantriData(Request $request)
  {
    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->branch->id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;
    $kelompok = auth()->user()->can('can show kelompok') ? ($request->kelompok ?? 1) : auth()->user()->employee->area;
    // dd($kelompok);
    $transaction_date = Carbon::parse($request->month ?? Carbon::now());

    $startDateofMonth = $transaction_date->copy()->startOfMonth()->format('Y-m-d');
    $endDateofMonth = $transaction_date->copy()->endOfMonth()->format('Y-m-d');

    $dateOfMb = $transaction_date->copy()->subMonth(4);
    $dateOfCm = $transaction_date->copy()->subMonth(3);

    $transactionOffice = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->where('kelompok', $kelompok)->first();

    $transactionDailyRecap = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->whereBetween('date', [$startDateofMonth, $endDateofMonth])->get();

    $transactionSirculation = TransactionSirculation::where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->where('date', $startDateofMonth)
      ->get();

    // dd($transactionSirculation);

    $instalment = TransactionLoanInstalment::select('transaction_loan_officer_grouping_id', 'transaction_date', 'status', 'nominal')
      ->where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->whereBetween('transaction_date', [$startDateofMonth, $endDateofMonth])
      ->get();

    $loan = TransactionLoan::select('transaction_loan_officer_grouping_id', 'drop_date', 'nominal_drop', 'pinjaman')
      ->where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->whereBetween('drop_date', [$startDateofMonth, $endDateofMonth])
      ->get();

    $dates = $loan->pluck('drop_date')->merge($instalment->pluck('transaction_date'))->unique()->sort()->values();
    $data = $dates->map(function ($date) use ($loan, $instalment, $transactionSirculation, $transactionDailyRecap, $transactionOffice, $startDateofMonth, $kelompok) {
      $transaction_date = Carbon::parse($date)->format('Y-m-d');

      $thisLoan = $loan->where('drop_date', $transaction_date);
      $thisInstalment = $instalment->where('transaction_date', $transaction_date);
      $thisSirculation = $transactionSirculation;
      $thisDailyRecap = $transactionDailyRecap->where('date', $transaction_date)->first();
      $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
      $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

      $totalDrop = $loan->whereBetween('drop_date', [$startDateofMonth, $transaction_date])->sum('nominal_drop') ?? 0;
      $totalStorting = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->sum('nominal') ?? 0;

      $angusuranExistingCm = $thisInstalment->where('status', 2)->sum('nominal') ?? 0;
      $totalStortingCm = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 2)->sum('nominal') ?? 0;

      $angusuranExistingMb = $thisInstalment->where('status', 3)->sum('nominal') ?? 0;
      $totalStortingMb = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 3)->sum('nominal') ?? 0;

      $angusuranExistingMl = $thisInstalment->where('status', 4)->sum('nominal') ?? 0;
      $totalStortingMl = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 4)->sum('nominal') ?? 0;

      $sirkulasi = $thisSirculation->sum('amount') ?? 0;
      $sirkulasiCm = $thisSirculation->sum('cm_amount') ?? 0;
      $sirkulasiMb = $thisSirculation->sum('mb_amount') ?? 0;
      $sirkulasiMl = $thisSirculation->sum('ml_amount') ?? 0;

      $storting = $thisInstalment->sum('nominal') ?? 0;
      $do11 = (int) round($thisLoan->sum('nominal_drop') * 0.11) ?? 0;
      $titipan9 = (int) round($thisLoan->sum('nominal_drop') * 0.9) ?? 0;
      $kasbon = $thisDailyRecap?->kasbon ?? 0;
      $debit = $do11 + $kasbon + $storting;

      $transport = $thisDailyRecap?->transport ?? 0;
      $nominaldrop = $thisLoan->sum('nominal_drop');
      $kredit = $nominaldrop + $transport;
      return [
        'type' => 'permantri',
        'kelompok' => $kelompok,
        'id' => $transactionOffice->id,
        'tanggal' => $transaction_date,
        'rekap_status' => $thisDailyRecap ? true : false,
        'status_approve_kepala' => $status_kepala,
        'status_approve_kasir' => $status_kasir,
        'status_dayly_approval' => $status_kepala && $status_kasir,
        'transaction_date' => $transaction_date,

        'kasbon' => $kasbon,
        'drop' => $nominaldrop,
        'total_drop' => $totalDrop,
        'do11' => $do11,
        'titipan9' => $titipan9,

        'debit' => $debit,
        'transport' => $transport,
        'kredit' => $kredit,
        'tunai' => $debit - $kredit,
        'tunai_ondb' => $thisDailyRecap?->tunai ?? 0,
        'is_balance' => ($debit - $kredit) == $thisDailyRecap?->tunai,

        'storting' => $storting,
        'total_storting' => $totalStorting,
        'sirkulasi' => (int) round($sirkulasi + ($totalDrop * 1.3) - $totalStorting),

        'angsuran_cm' => $angusuranExistingCm,
        'total_angsuran_cm' => $totalStortingCm,
        'saldo_cm' => $sirkulasiCm - $totalStortingCm,

        'angsuran_mb' => $angusuranExistingMb,
        'total_angsuran_mb' => $totalStortingMb,
        'saldo_mb' => $sirkulasiMb - $totalStortingMb,

        'angsuran_ml' => $angusuranExistingMl,
        'total_angsuran_ml' => $totalStortingMl,
        'saldo_ml' => $sirkulasiMl - $totalStortingMl,
      ];
    })->values();

    return [
      'datas' => $data,
      'server_filter' => ['month' => $transaction_date->format('Y-m'), 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id]
    ];
  }
}
