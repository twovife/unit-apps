<?php

namespace Database\Seeders;

use App\Models\TransactionLoanInstalment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateManageSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $instalmentRaw = collect(json_decode(file_get_contents(storage_path('kamis.json'))));
    $instalmentRaw->chunk(100)->each(function ($batch) {
      DB::beginTransaction();
      try {
        foreach ($batch as $key) {
          $instalment = TransactionLoanInstalment::find($key->id);
          if ($instalment) {
            $instalment->transaction_manage_customer_id = $key->transaction_manage_customer_id;
            $instalment->save();
          }
        }
      } catch (\Throwable $th) {
        //throw $th;
      }
    });
  }
}
