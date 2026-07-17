<?php

namespace App\Http\Controllers;

use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PindahResortController extends Controller
{
  public function PindahResort(Request $request)
  {
    $request->validate([
      'branch_id' => 'required|integer',
      'kelompok_asal' => 'required|integer',
      'kelompok_tujuan' => 'required|integer',
      'hari' => 'required|string'
    ]);
    // dd($request->all());

    $kelompok_asal = TransactionLoanOfficerGrouping::where('branch_id', $request->branch_id)
      ->where('kelompok', $request->kelompok_asal)
      ->firstOrFail();
    echo 'dari kelompok' . $kelompok_asal->id . PHP_EOL;
    $kelompok_tujuan = TransactionLoanOfficerGrouping::where('branch_id', $request->branch_id)
      ->where('kelompok', $request->kelompok_tujuan)
      ->firstOrFail();

    echo 'ke kelompok' . $kelompok_tujuan->id . PHP_EOL;

    DB::transaction(function () use ($kelompok_asal, $kelompok_tujuan, $request) {

      $loanIds = TransactionLoan::where('transaction_loan_officer_grouping_id', $kelompok_asal->id)
        ->whereNull('out_status')
        ->where('hari', $request->hari)
        ->pluck('id');

      echo 'jumlah loan yang dipindah: ' . $loanIds->count() . PHP_EOL;

      if ($loanIds->isEmpty()) {
        return;
        echo "tidak ada loan yang dipindah" . PHP_EOL;
      }

      TransactionLoanInstalment::whereIn('transaction_loan_id', $loanIds)
        ->update([
          'transaction_loan_officer_grouping_id' => $kelompok_tujuan->id
        ]);

      echo "instalment berhasil diupdate" . PHP_EOL;



      TransactionLoan::whereIn('id', $loanIds)
        ->update([
          'transaction_loan_officer_grouping_id' => $kelompok_tujuan->id
        ]);
      echo "loan berhasil diupdate" . PHP_EOL;

      // export log id mana yang berhasil diupdate

      Log::channel('swaplog')->info("BEFORE", [
        'loans_moved' => $loanIds->toArray(),
      ]);
      // optional: log sukses
    });
  }
}



