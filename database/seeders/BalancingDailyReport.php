<?php

namespace Database\Seeders;

use App\Jobs\CountingBalance;
use App\Models\VIsBalanceDropWithDailyReport;
use App\Models\VIsBalanceLoanWithDailyReport;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class BalancingDailyReport extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $dropReports = VIsBalanceDropWithDailyReport::chunk(100, function ($reports) {
      Log::channel('scheduler_reports')->info('Job Is Active', [
        'batch_type' => 'drop',  // Misalnya Anda ingin menambahkan tipe batch
        'countJob' => $reports->count(),
        'timestamp' => now()->toDateTimeString(),
      ]);

      foreach ($reports as $report) {
        // Dispatch job untuk batch ini
        CountingBalance::dispatch($report);
      }
    });

    $loanReports = VIsBalanceLoanWithDailyReport::chunk(100, function ($reports) {
      Log::channel('scheduler_reports')->info('Job Is Active', [
        'batch_type' => 'loan',  // Misalnya Anda ingin menambahkan tipe batch
        'countJob' => $reports->count(),
        'timestamp' => now()->toDateTimeString(),
      ]);

      foreach ($reports as $report) {
        // Dispatch job untuk batch ini
        CountingBalance::dispatch($report);
      }
    });
  }
}
