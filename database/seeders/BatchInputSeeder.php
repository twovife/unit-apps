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
    $nasabah = collect(json_decode(file_get_contents(storage_path('macetselasa.json'))));

    $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', 53)->get();

    try {
      DB::beginTransaction();

      // tanpa `true`

      $nasabah->each(function ($ns) use ($officerGrouping) {
        $date = Carbon::parse($ns->tanggal);
        $firstDate = $date->copy()->firstOfMonth();
        $hari = AppHelper::getNumbDays($ns->hari);


        $dropDate = $firstDate->dayOfWeek === $hari
          ? $firstDate->toDateString()
          : $firstDate->next($hari)->toDateString();

        $ns->drop_date = $dropDate;
        $mantriCoice =  $officerGrouping->where('kelompok', $ns->kelompok)->first();
        $newNik = AppHelper::callUnknownNik($ns, true);
        // dd($newNik);
        $mantri = AppHelper::getMantriNoauth($mantriCoice);
        // dd($mantri);
        $customer = TransactionCustomer::firstorCreate(['nik' => $newNik], ['nama' => $ns->nama, 'alamat' => $ns->alamat]);

        //generate nasabah gruping

        $manage =  $customer->manage_customer()->firstOrCreate(['transaction_loan_officer_grouping_id' => $mantriCoice->id, 'day' => Carbon::parse($ns->drop_date)->dayOfWeek]);

        $loan = $manage->loan()->create([
          'transaction_loan_officer_grouping_id' => $mantriCoice->id,
          'request_date' => $ns->drop_date,
          'user_mantri' => $mantri,
          'drop_date' => $ns->drop_date,
          'hari' => AppHelper::dateName($ns->drop_date),
          'status' => "open",
          'user_input' => $mantri,

          'drop_before' => 0,
          'request_nominal' => $ns->saldo,
        ]);

        $loan->update([
          'user_drop' => $mantri,
          'status' => "success",
          'nominal_drop' => $ns->saldo,
          'request_nominal' => null,
        ]);

        $angsuran = ($ns->saldo * 1.3) - $ns->saldo;
        $tanggalAngsuran = Carbon::parse($ns->drop_date)->copy()->addWeek()->toDateString();

        $loan->loan_instalment()->create([
          'transaction_date' => $tanggalAngsuran,
          'nominal' => $angsuran,
          'danatitipan' => 0,
          'transaction_loan_officer_grouping_id' => $mantriCoice->id,
          'status' => AppHelper::generateStatusAngsuran($loan->drop_date,  $tanggalAngsuran),
          'user_input' => $mantri,
          'user_mantri' =>  $mantri,
        ]);

        // bisa pakai $ns->nik


        echo $loan->id . ' success generated' . PHP_EOL;
      });

      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      echo $e->getMessage();
    }
  }
}
