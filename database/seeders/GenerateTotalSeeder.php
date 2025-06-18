<?php

namespace Database\Seeders;

use App\Models\TransactionLoan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateTotalSeeder extends Seeder
{
  /**
   * Hitung kolom total_angsuran untuk semua loan
   * yang sudah success tetapi belum terisi (total_angsuran = 0).
   */
  public function run(): void
  {
    // Proses 1 000 baris per iterasi; ubah angka sesuai kapasitas server
    // 1 000 loan per iterasi — ubah sesuai kapasitas server
    TransactionLoan::where('status', 'success')
      ->where('total_angsuran', 0) // Pastikan ID lebih besar dari 0
      ->chunkById(5000, function ($loans) {

        // Ambil daftar ID loan dlm chunk ini
        $loanIds = $loans->pluck('id');

        // ----- 1 query GROUP BY utk subset ini -----
        $totals = DB::table('transaction_loan_instalments')
          ->select('transaction_loan_id', DB::raw('SUM(nominal) AS total'))
          ->whereIn('transaction_loan_id', $loanIds)
          ->groupBy('transaction_loan_id')
          ->pluck('total', 'transaction_loan_id');   // [id => total]

        foreach ($loans as $loan) {
          $total = $totals[$loan->id] ?? 0;

          if ($total !== $loan->total_angsuran) {
            $loan->update(['total_angsuran' => $total]);
          }
          echo "Updated loan ID {$loan->id} with total_angsuran: {$total}" . PHP_EOL;
        }
      });

    $this->command->info('Done recalculating total_angsuran.');
  }
}
