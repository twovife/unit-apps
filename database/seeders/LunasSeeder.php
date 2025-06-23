<?php

namespace Database\Seeders;

use App\Models\TransactionLoan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class LunasSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {

    try {
      DB::beginTransaction();
      $loan = TransactionLoan::where('status', 'success')->get();

      $loan->each(function ($item) {
        $angsuran = $item->loan_instalment()->sum('nominal');
        $transactionDate =  $item->loan_instalment()->max('transaction_date');

        if ($item->pinjaman == $angsuran) {
          $item->update([
            'out_date' => $transactionDate,
            'out_status' => 'LUNAS',
          ]);
        }

        if ($item->pinjaman < $angsuran) {
          $item->update([
            'out_date' => $transactionDate,
            'out_status' => 'LUNAS Xs',
          ]);
        }
        echo $item->id . " Success" . PHP_EOL;
      });

      DB::commit();
    } catch (\Throwable $th) {
      DB::rollBack();
      echo $th;
    }
  }
}
