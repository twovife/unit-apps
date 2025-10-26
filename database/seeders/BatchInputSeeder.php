<?php

namespace Database\Seeders;

use App\Helpers\AppHelper;
use App\Models\TransactionCustomer;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchInputSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $nasabahRaw = collect(json_decode(file_get_contents(storage_path('datababat1.json'))));

    // Pre-process JSON dulu (biar gak hitung carbon/helper berulang kali)
    $nasabah = $nasabahRaw->map(function ($ns) {
      $ns->drop_date = $ns->drop_date;
      $ns->new_nik = AppHelper::callUnknownNik($ns, true);
      $ns->day = Carbon::parse($ns->drop_date)->dayOfWeek;
      $ns->saldo = $ns->saldo;
      $ns->tanggal_angsuran = Carbon::parse($ns->drop_date)->addWeek()->toDateString();
      return $ns;
    });

    // Preload grouping biar gak query berulang
    $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', 21)
      ->get()
      ->keyBy('kelompok');

    // Proses per 100 data
    $nasabah->chunk(100)->each(function ($batch) use ($officerGrouping) {

      DB::beginTransaction();

      try {

        // preload customer yang udah ada biar gak query berulang


        foreach ($batch as $ns) {
          $mantriChoice = $officerGrouping[$ns->kelompok] ?? null;
          if (!$mantriChoice) {
            echo "⚠️ Kelompok {$ns->kelompok} tidak ditemukan\n";
            continue;
          }

          $mantri = AppHelper::getMantriNoauth($mantriChoice);

          // ambil customer dari cache atau buat baru
          $customer =  TransactionCustomer::firstOrCreate(['nik' => $ns->new_nik], [
            'nama' => $ns->nama,
            'alamat' => $ns->alamat,
          ]);

          // relasi manage_customer
          $manage = $customer->manage_customer()->firstOrCreate([
            'transaction_loan_officer_grouping_id' => $mantriChoice->id,
            'day' => $ns->day,
          ]);

          // buat loan
          $loan = $manage->loan()->create([
            'transaction_loan_officer_grouping_id' => $mantriChoice->id,
            'request_date' => $ns->drop_date,
            'user_mantri' => $mantri,
            'drop_date' => $ns->drop_date,
            'hari' => AppHelper::dateName($ns->drop_date),
            'status' => "open",
            'user_input' => $mantri,
            'drop_before' => 0,
            'request_nominal' => $ns->pinjaman,
          ]);

          $loan->update([
            'user_drop' => $mantri,
            'status' => "success",
            'nominal_drop' => $ns->pinjaman,
            'request_nominal' => null,
          ]);

          if ($ns->saldo == 0) {
            $loan->loan_instalment()->create([
              'transaction_date' => $ns->tanggal_angsuran,
              'nominal' => $ns->pinjaman * 1.3,
              'danatitipan' => 0,
              'transaction_loan_officer_grouping_id' => $mantriChoice->id,
              'status' => AppHelper::generateStatusAngsuran($loan->drop_date, $ns->tanggal_angsuran),
              'user_input' => $mantri,
              'user_mantri' => $mantri,
            ]);
          }
          // buat cicilan pertama


          echo "✅ Loan {$loan->id} sukses di-generate\n";
        }

        DB::commit();
      } catch (\Throwable $e) {
        DB::rollBack();
        echo "❌ Error batch: " . $e->getMessage() . "\n";
      }
    });

    echo "🎉 Import selesai!\n";
  }
}
