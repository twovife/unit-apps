<?php

namespace Database\Seeders;

use App\Models\OnlineBranch;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class ChangeWrongDateGlobalSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $getOnlineBranch = OnlineBranch::pluck('branch_id');
    $groupingId = TransactionLoanOfficerGrouping::whereIn('branch_id', $getOnlineBranch)->pluck('id');

    try {
      $getWrongDate = TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $groupingId)->where('drop_date', "2025-05-26")->get();
      $getWrongDate->groupBy('transaction_loan_officer_grouping_id')->map(function ($item, $man_id) {
        $item->groupBy('drop_date')->map(function ($item, $date) use ($man_id) {

          $item->map(function ($item) {
            $item->update([
              'drop_date' => Carbon::parse($item->drop_date)->addWeeks(2)->format('Y-m-d'),
            ]);
          });

          $dailyRecap = TransactionDailyRecap::updateOrCreate([
            'transaction_loan_officer_grouping_id' => $man_id,
            'date' => "2025-05-19",
          ], [
            'target_on' =>  "2025-05-05",
          ]);


          $unit = TransactionLoanOfficerGrouping::with('branch')->find($man_id);
          if ($dailyRecap->wasRecentlyCreated) {
            // Data baru berhasil dibuat
            echo "Data baru dibuat!" . PHP_EOL;
            Log::info('Daily recap updated', [
              'unit' =>  $unit->branch->unit,
              'kelompok' =>  $unit->kelompok,
              'tanggal_pengajuan_lama' => null,
              'tanggal_pengajuan_baru' => Carbon::parse($date)->addWeeks(2)->format('Y-m-d'),
              'status' => 'new',
            ]);
          } else {
            // Data lama di-update
            echo "Data berhasil di-update!" . PHP_EOL;
            Log::info('Daily recap updated', [
              'unit' =>  $unit->branch->unit,
              'kelompok' =>  $unit->kelompok,
              'tanggal_pengajuan_lama' => $date,
              'tanggal_pengajuan_baru' => Carbon::parse($date)->addWeeks(2)->format('Y-m-d'),
              'status' => 'new',
            ]);
          }
        });
      });
    } catch (Exception $e) {
      echo $e->getMessage();
    }
  }
}
