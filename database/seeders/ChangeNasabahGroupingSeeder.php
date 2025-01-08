<?php

namespace Database\Seeders;

use App\Helpers\AppHelper;
use App\Models\TransactionCustomer;
use App\Models\TransactionLoan;
use App\Models\TransactionManageCustomer;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChangeNasabahGroupingSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    try {
      DB::beginTransaction();
      TransactionLoan::whereIn(
        'transaction_manage_customer_id',
        function ($query) {
          $query->select('transaction_manage_customer_id')
            ->from('transaction_loans')
            ->groupBy('transaction_manage_customer_id')
            ->havingRaw('COUNT(DISTINCT hari) = 1');
        }
      )->select('transaction_manage_customer_id', 'hari', 'transaction_loan_officer_grouping_id')
        ->lazy()
        ->each(function ($transaction) {
          $customerId = $transaction->transaction_manage_customer_id;
          $day = AppHelper::getNumbDays($transaction->hari);

          $transactionManage = TransactionManageCustomer::find($customerId);
          $transactionCustomer = TransactionCustomer::find($transactionManage->transaction_customer_id);

          TransactionManageCustomer::where('id', $customerId)
            ->update(['day' => $day], ['residential_address' => $transactionCustomer->alamat]);
          echo $customerId . PHP_EOL;
        });

      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;
      echo "update hari tunggal selesai" . PHP_EOL;

      TransactionLoan::whereIn(
        'transaction_manage_customer_id',
        function ($query) {
          $query->select('transaction_manage_customer_id')
            ->from('transaction_loans')
            ->groupBy('transaction_manage_customer_id')
            ->havingRaw('COUNT(DISTINCT hari) > 1');
        }
      )->lazy()
        ->groupBy('transaction_manage_customer_id') // Kelompokkan transaksi berdasarkan `transaction_manage_customer_id`
        ->each(function ($transactions) {

          // Ambil semua hari yang terkait dengan `transaction_manage_customer_id`
          $days = $transactions->sortBy('hari');

          // Hari pertama: Update data pada `TransactionManageCustomer`
          $firstTransaction = $days->first();

          //
          $firstDay = AppHelper::getNumbDays($firstTransaction->hari); //hari

          $firstCustomerManageId = $firstTransaction->transaction_manage_customer_id; //id
          $transactionManage = TransactionManageCustomer::find($firstCustomerManageId); // cari manageCustomer
          $transactionCustomer = TransactionCustomer::find($transactionManage->transaction_customer_id); //cari nama transaction customer

          TransactionManageCustomer::where('id', $firstCustomerManageId)
            ->update(
              ['day' => $firstDay],
              ['residential_address' => $transactionCustomer->alamat]
            );

          echo   "manage asli = " . $firstCustomerManageId . PHP_EOL;
          // diatas update hari pertama yang ditemukan


          // Hari ke-2 dan seterusnya: Buat entri baru
          $remainingDays = $days->slice(1); // Ambil hari kedua dan seterusnya

          foreach ($remainingDays as $transaction) {
            echo "managa awal = " .  $transaction->transaction_manage_customer_id . PHP_EOL;
            $newTransactionManage = TransactionManageCustomer::firstOrCreate([
              'transaction_customer_id' => $transactionCustomer->id,
              'transaction_loan_officer_grouping_id' => $transaction->transaction_loan_officer_grouping_id,
              'day' => AppHelper::getNumbDays($transaction->hari),
            ], [
              'residential_address' => $transactionCustomer->alamat,
            ]);

            // Update `transaction_manage_customer_id` di transaksi
            $transaction->update([
              'transaction_manage_customer_id' => $newTransactionManage->id,
            ]);
          }
          echo "membuat manage baru = " . $newTransactionManage->id . " " . "managet terbaru = " . $transaction->transaction_manage_customer_id . " " .  PHP_EOL;
          echo "____________pindah halaman___________" . PHP_EOL;
        });
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      echo $e;
    }
  }
}
