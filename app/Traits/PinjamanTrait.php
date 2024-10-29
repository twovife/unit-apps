<?php

namespace App\Traits;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Http\Request;

trait PinjamanTrait
{
  public function getTransactionLoan(Request $request, bool $withPlan = false, bool $sortDesc = false)
  {
    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->branch->id;

    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;

    $kelompok = auth()->user()->can('can show kelompok') ? ($request->kelompok ?? 1) : auth()->user()->employee->area;

    $transaction_date = $request->month ?? Carbon::now()->format('Y-m');
    $startOfMonth = Carbon::parse($transaction_date)->copy()->startOfMonth();
    $endOfMonth = Carbon::parse($transaction_date)->copy()->endOfMonth();

    $hari = $request->hari ?? AppHelper::dateName(Carbon::now()->format('Y-m-d'));

    $groupingId = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->where('kelompok', $kelompok)->first();

    $loan = TransactionLoan::with('loan_officer_grouping', 'customer', 'manage_customer')
      ->where(function ($data) use ($startOfMonth, $endOfMonth) {
        $data->whereBetween('drop_date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
          ->orWhereBetween('request_date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')]);
      })
      ->where('transaction_loan_officer_grouping_id', $groupingId->id)
      ->where('hari', $hari)
      ->orderBy('drop_date')
      ->get();

    $loanCustId = collect($loan->pluck('transaction_manage_customer_id'))->unique();
    $transactionManageCustomer = TransactionLoan::whereIn('transaction_manage_customer_id', $loanCustId)
      ->where('status', 'success')
      ->orderBy('id', 'desc')
      ->get()
      ->groupBy('transaction_manage_customer_id');

    $pengajuan = collect($loan->map(function ($drop, $key) use ($transactionManageCustomer) {
      $countPinjaman = $transactionManageCustomer->get($drop->transaction_manage_customer_id, collect())->count('id') + 1;
      return [
        'nama' => $drop->customer->nama,
        'alamat' => $drop->customer->alamat,
        'nomor_anggota' => $drop->manage_customer->id,
        'pinjaman_ke' => $countPinjaman,
        'tanggal_drop' => $drop->drop_date,
        'request_date' => $drop->request_date,

        'drop' => $drop->drop_langsung ? null : $drop->drop_before,
        'request' => $drop->drop_langsung ? null : $drop->request_nominal,
        'acc' => $drop->drop_langsung ? null : $drop->approved_nominal,
        'drop_jadi' => $drop->nominal_drop,

        'check_date' => $drop->check_date,

        'nomor_pengajuan' => $drop->id,
        'nik' => $drop->customer->nik,
        'kelompok' => $drop->loan_officer_grouping->kelompok,
        'unit' => $drop->branch->unit,
        'hari' => $drop->hari,
        'status' => $drop->status,
        'drop_langsung' => $drop->drop_langsung ? 'baru' : "lama",
        'drop_langsung_status' => $drop->drop_langsung ? 2 : 1
      ];
    })->sortBy('nama')->sortBy('drop_langsung_status')->sortBy('tanggal_drop')->groupBy('tanggal_drop'));


    $numberDays = AppHelper::getNumbDays($hari);
    $datesMatchDay = collect();

    for ($i = $startOfMonth; $i->lte($endOfMonth); $i->addDays()) {
      if ($i->dayOfWeek == $numberDays) {
        $datesMatchDay->push($i->format('Y-m-d'));
      }
    }

    $ClosedTransaction = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereNotNull('daily_kepala_approval')->whereNotNull('daily_kasir_approval')->max('date');

    // jika beserta plan maka ini yang akan dikembalikan

    if ($withPlan) {
      $daily_recap = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereIn('date', $datesMatchDay)->get()->groupBy('date');

      $instalment = TransactionLoanInstalment::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereIn('transaction_date', $datesMatchDay)->get()->groupBy('transaction_date');

      $buku_rencana_drop = $datesMatchDay->map(function ($tanggal) use ($pengajuan, $daily_recap, $instalment, $groupingId) {
        $thisDailyRecap = $daily_recap->get($tanggal, collect())->first(); //stored as database
        $thisData = $pengajuan->get($tanggal, collect()); //summary of drop
        $thisInstalment = $instalment->get($tanggal, collect())->sum('nominal'); //summary of instalment

        // dd($thisData);
        return [
          'is_generated' => $thisDailyRecap ? true : false,
          'grouping_id' => $groupingId->id,
          'kelompok' => $groupingId->kelompok,
          'tanggal' => $tanggal,
          'kasbon' =>  $thisDailyRecap?->kasbon,
          'transport' => $thisDailyRecap?->transport,
          'masuk' => $thisDailyRecap?->masuk,
          'keluar' => $thisDailyRecap?->keluar,
          'target' => $thisDailyRecap?->target,
          'storting_on_database' => $thisDailyRecap?->storting,
          'storting' => $thisInstalment,
          'storting_validate' => $thisInstalment == ($thisDailyRecap?->storting) ? true : false,
          'baru' => $thisData->where('drop_langsung', 'baru')->sum('drop_jadi'),
          'lama' => $thisData->where('drop_langsung', 'lama')->sum('drop_jadi'),

          'drop' => $thisData->sum('drop_jadi'),
          'drop_on_database' => $thisDailyRecap?->drop,
          'drop_validate' => $thisData->sum('drop_jadi') == ($thisDailyRecap?->drop) ? true : false,

          'rencana' => $thisData->where('drop_langsung', 'lama')->sum('acc'),

          'is_approved' => $thisDailyRecap?->daily_kepala_approval ? true : false,
          'is_kasir' => $thisDailyRecap?->daily_kasir_approval ? true : false,
          'at_approved' => $thisDailyRecap?->daily_kepala_approval,
          'at_kasir' => $thisDailyRecap?->daily_kasir_approval,
          'is_closed' => $thisDailyRecap?->daily_kepala_approval && $thisDailyRecap?->daily_kasir_approval ? true : false,
          'button_color' => $thisDailyRecap?->daily_kepala_approval ? ($thisDailyRecap?->daily_kasir_approval ? 'success' : 'baru') : 'open',
        ];
      })->sortBy('tanggal')->values();
    }


    return [
      'datas' => $sortDesc ? $pengajuan->sortKeysDesc()->values() : $pengajuan->values(),
      'buku_rencana' => $buku_rencana_drop,
      'server_filter' => ['month' => $transaction_date, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id, 'kelompok' => $kelompok, 'hari' => $hari, 'closed_transaction' => $ClosedTransaction,]
    ];
  }
}
