<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionSirculation;
use App\Traits\RekapTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PHPUnit\TextUI\Output\SummaryPrinter;

class TransactionDailyRecapController extends Controller
{

  use RekapTrait;


  public function rekap_post(Request $request)
  {
    try {
      DB::beginTransaction();
      $dailyTransaction = TransactionDailyRecap::firstOrNew(
        ['transaction_loan_officer_grouping_id' => $request->id, 'date' => $request->date]
      );

      if ($request->type == 1) {
        $optionalFields = ['tunai', 'transport', 'kasbon'];

        foreach ($optionalFields as $field) {
          if ($request->has($field)) {
            $dailyTransaction->$field = $request->$field;
          }
        }
      }

      if ($request->type == 2) {

        if (!$dailyTransaction->daily_kepala_approval) {
          return redirect()->back()->withError('Data belum di approve kepala');
        }

        $dailyTransaction->daily_kasir_approval = Carbon::now();
        $dailyTransaction->daily_kasir_approval_user = auth()->user()->employee->id;
        $dailyTransaction->tunai = $request->tunai;
      }

      $dailyTransaction->save();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      dd($e);
      return redirect()->back()->withError('Data Gagal Diperbarui, Refresh / Hub IT');
    }

    return redirect()->back()->with('message', 'Data berhasil disimpan.');
  }

  public function ceklist_kepala(Request $request)
  {

    // "id" => 311
    // "date" => "2024-09-03"
    // "target" => "0"
    // "masuk" => 806000
    // "keluar" => 221000
    // "baru" => 4500000
    // "lama" => 1700000
    // "rencana" => 1700000
    // "storting" => 1820000
    // "drop" => 6200000
    // "tanggal_rencana_minggu_depan" => "2024-09-10"
    // "rencana_minggu_depan" => 0
    // "target_minggu_depan" => 585000
    // "daily_kepala_approval" => true

    // dd($request->all());
    $validate = $request->validate([
      'id' => ['required'],
      'date' => ['required'],
      'masuk' => ['required'],
      'keluar' => ['required'],
      'baru' => ['required'],
      'lama' => ['required'],
      'rencana' => ['required'],
      'storting' => ['required'],
      'drop' => ['required'],
      'tanggal_rencana_minggu_depan' => ['required'],
      'rencana_minggu_depan' => ['required'],
      'target_minggu_depan' => ['required'],
    ]);


    try {
      DB::beginTransaction();
      $check_thisDay = TransactionDailyRecap::firstOrNew(['transaction_loan_officer_grouping_id' => $request->id, 'date' => $request->date]);
      $check_thisDay->kasbon = $request->kasbon;
      $check_thisDay->transport = $request->transport;
      $check_thisDay->masuk = $request->masuk;
      $check_thisDay->keluar = $request->keluar;
      $check_thisDay->storting = $request->storting;
      $check_thisDay->drop = $request->drop;
      $check_thisDay->daily_kepala_approval = Carbon::now();
      $check_thisDay->daily_kepala_approval_user = auth()->user()->employee->id;
      $check_thisDay->save();

      $fillTragetMingguDepan = TransactionDailyRecap::firstOrNew(['transaction_loan_officer_grouping_id' => $request->id, 'date' => $request->tanggal_rencana_minggu_depan]);
      $fillTragetMingguDepan->target = $request->target_minggu_depan;
      $fillTragetMingguDepan->save();

      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      ddd($e);
      return redirect()->back()->withError('Data Gagal Diperbarui, Refresh / Hub IT');
    }
    return redirect()->back()->with('message', 'Data berhasil disimpan.');
  }

  public function rekap_permantri(Request $request)
  {
    $data = $this->getRekapPermantriData($request);
    return Inertia::render('WebView/Rekap/RekapPerMantri', $data);
  }

  public function rencana_drop(Request $request)
  {
    $data = $this->getRencanaDropKepalaData($request);
    return Inertia::render('WebView/RencanaDropKepala/Index', $data);
  }

  public function rekap_dua(Request $request)
  {
    $data = $this->getRekapDuaData($request);
    return Inertia::render('WebView/Rekap/RekapDua', $data);
  }
  public function rekap_satu(Request $request)
  {
    $data = $this->getRekapDuaData($request);
    return Inertia::render('WebView/Rekap/RekapSatu', $data);
  }
}
