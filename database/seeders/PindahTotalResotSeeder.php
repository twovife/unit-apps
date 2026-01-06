<?php

namespace Database\Seeders;

use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PindahTotalResotSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $kelompok_asal = TransactionLoanOfficerGrouping::where('branch_id', 34)
      ->where('kelompok', 9)
      ->firstOrFail();

    $kelompok_tujuan = TransactionLoanOfficerGrouping::where('branch_id', 34)
      ->where('kelompok', 6)
      ->firstOrFail();

    DB::transaction(function () use ($kelompok_asal, $kelompok_tujuan) {

      $loanIds = TransactionLoan::where('transaction_loan_officer_grouping_id', $kelompok_asal->id)
        ->where('out_status', '!=', 'LUNAS')
        ->where('hari', 'SELASA')
        ->pluck('id');

      if ($loanIds->isEmpty()) {
        return;
      }

      TransactionLoanInstalment::whereIn('transaction_loan_id', $loanIds)
        ->update([
          'transaction_loan_officer_grouping_id' => $kelompok_tujuan->id
        ]);

      TransactionLoan::whereIn('id', $loanIds)
        ->update([
          'transaction_loan_officer_grouping_id' => $kelompok_tujuan->id
        ]);

      // optional: log sukses
    });
  }
}
