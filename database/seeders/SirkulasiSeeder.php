<?php

namespace Database\Seeders;

use App\Models\TransactionLoanOfficerGrouping;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SirkulasiSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $grouping = TransactionLoanOfficerGrouping::where('branch_id', 32)->where('kelompok', 6)->first();

    $grouping->transactionSirculation()->createMany([
      [
        'date' => '2024-08-01',
        'day' => 'senin',
        'amount' => 48322000,
        "cm_amount" => 11700000,
        "mb_amount" => 0,
        "ml_amount" => 28713000,
      ],
      [
        'date' => '2024-08-01',
        'day' => 'selasa',
        'amount' => 40974000,
        "cm_amount" => 1190000,
        "mb_amount" => 0,
        "ml_amount" => 22594000,
      ],
      [
        'date' => '2024-08-01',
        'day' => 'rabu',
        'amount' => 42148000,
        "cm_amount" => 1700000,
        "mb_amount" => 0,
        "ml_amount" => 25408000,
      ],
      [
        'date' => '2024-08-01',
        'day' => 'kamis',
        'amount' => 40913000,
        "cm_amount" => 1285000,
        "mb_amount" => 0,
        "ml_amount" => 23983000,
      ],
      [
        'date' => '2024-08-01',
        'day' => 'jumat',
        'amount' => 47061000,
        "cm_amount" => 845000,
        "mb_amount" => 0,
        "ml_amount" => 30006000,
      ],
      [
        'date' => '2024-08-01',
        'day' => 'sabtu',
        'amount' => 52191000,
        "cm_amount" => 910000,
        "mb_amount" => 0,
        "ml_amount" => 35841000,
      ],
    ]);
  }
}
