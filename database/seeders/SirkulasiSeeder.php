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
        'date' => '2024-07-31',
        'day' => 'senin',
        'amount' => 48322000 - 10000000,
        'mb_amount' => 28713000 - 10000000,
      ],
      [
        'date' => '2024-07-31',
        'day' => 'selasa',
        'amount' => 40974000 - 10000000,
        'mb_amount' => 22594000 - 10000000
      ],
      [
        'date' => '2024-07-31',
        'day' => 'rabu',
        'amount' => 42148000 - 10000000,
        'mb_amount' => 25408000 - 10000000,
      ],
      [
        'date' => '2024-07-31',
        'day' => 'kamis',
        'amount' => 40913000 - 10000000,
        'mb_amount' => 23983000 - 10000000,
      ],
      [
        'date' => '2024-07-31',
        'day' => 'jumat',
        'amount' => 47061000 - 10000000,
        'mb_amount' => 30006000 - 10000000,
      ],
      [
        'date' => '2024-07-31',
        'day' => 'sabtu',
        'amount' => 52191000 - 10000000,
        'mb_amount' => 35841000 - 10000000,
      ],
    ]);
  }
}
