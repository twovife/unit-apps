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


  /** True jika kantor pemilik grouping ini sudah pakai agregat baru pada tanggal itu. */
  private function sudahMigrasi($groupingId, $date): bool
  {
    if (!$groupingId || !$date) {
      return false;
    }
    $branchId = TransactionLoanOfficerGrouping::where('id', $groupingId)->value('branch_id');

    return $branchId ? \App\Helpers\AgregasiScope::pakaiAgregatBaru($branchId, $date) : false;
  }

  public function rekap_post(Request $request)
  {
    // GERBANG alur baru: kantor migrasi TIDAK menulis daily_recaps lagi (juga
    // menghindari hook target rekursif TransactionDailyRecap::updating). Dialog
    // kasir yang sama (Kasir -> Rekap) menulis ke daily_closings.
    if ($this->sudahMigrasi($request->id, $request->date)) {
      return $this->rekapPostAlurBaru($request);
    }

    try {
      DB::beginTransaction();
      $dailyTransaction = TransactionDailyRecap::firstOrNew(
        ['transaction_loan_officer_grouping_id' => $request->id, 'date' => $request->date]
      );

      if ($request->type == 2 && !$dailyTransaction->daily_kepala_approval) {
        return redirect()->back()->withError('Data belum di approve kepala');
      }

      $dailyTransaction->update([
        "kasbon" => $request->kasbon,
        "transport" => $request->transport,
        "daily_kasir_approval" => $request->type == 1 ? $dailyTransaction->daily_kasir_approval : Carbon::now(),
        "daily_kasir_approval_user" => $request->type == 1 ? $dailyTransaction->daily_kasir_approval_user : auth()->user()->employee->id
      ]);



      $dailyTransaction->save();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withError('Data Gagal Diperbarui, Refresh / Hub IT');
    }

    return redirect()->back()->with('message', 'Data berhasil disimpan.');
  }

  /**
   * Kasir alur baru, dari dialog yang sama dengan alur lama (Kasir -> Rekap):
   *   type 1 = Input Kasbon & Transport -> simpan ke daily_closings;
   *   type 2 = Cek Tunai Mantri -> setoran mantri = tunai yang dikonfirmasi
   *            kasir, lalu KUNCI (ClosingHarianController@kunci: hitung ulang,
   *            syarat Gembok, susun bulanan).
   * Kunci kasir hanya dari sini; menu ACC KM khusus Ceklist Kepala.
   */
  private function rekapPostAlurBaru(Request $request)
  {
    $val = $request->validate([
      'id' => ['required', 'integer'],
      'date' => ['required', 'date'],
      'type' => ['required', 'in:1,2'],
      'kasbon' => ['nullable', 'integer', 'min:0'],
      'transport' => ['nullable', 'integer', 'min:0'],
      'tunai' => ['nullable', 'integer'],
    ]);

    $grouping = TransactionLoanOfficerGrouping::find($val['id']);
    if (!AppHelper::bolehAksesKelompok($grouping)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    $closing = \App\Models\TransactionDailyClosing::firstOrCreate([
      'transaction_loan_officer_grouping_id' => $grouping->id,
      'date' => Carbon::parse($val['date'])->toDateString(),
    ]);

    if ($closing->kasir_lock_at) {
      return redirect()->back()->withErrors('Hari ini sudah dikunci kasir.');
    }

    $closing->update([
      'kasbon' => (int) ($val['kasbon'] ?? 0),
      'transport' => (int) ($val['transport'] ?? 0),
    ]);

    if ((int) $val['type'] === 1) {
      return redirect()->back()->with('message', 'Kasbon & transport tersimpan.');
    }

    if (!$closing->kepala_approval_at) {
      return redirect()->back()->withErrors('Belum di-Ceklist Kepala (ACC KM).');
    }

    $closing->update(['setoran_mantri' => (int) ($val['tunai'] ?? 0)]);

    return app(ClosingHarianController::class)->kunci($closing->fresh());
  }

  /**
   * SU Lapangan (uang yang dibawa pulang mantri) -> daily_closings.setoran_mantri.
   * Diisi kasir langsung di sel Rekap 1, kantor alur baru, hari yang belum
   * dikunci. Kosong = belum dicatat (null), beda dengan 0.
   */
  public function simpan_su_lapangan(Request $request)
  {
    if (!auth()->user()->hasPermissionTo('can-approve')) {
      return redirect()->back()->withErrors('SU Lapangan diisi kasir / KM / pimpinan.');
    }

    $val = $request->validate([
      'id' => ['required', 'integer'],
      'date' => ['required', 'date', 'before_or_equal:today'],
      'su_lapangan' => ['nullable', 'integer', 'min:0'],
    ]);

    $grouping = TransactionLoanOfficerGrouping::find($val['id']);
    if (!AppHelper::bolehAksesKelompok($grouping)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }
    if (!$this->sudahMigrasi($grouping->id, $val['date'])) {
      return redirect()->back()->withErrors('SU Lapangan hanya untuk kantor yang sudah migrasi.');
    }

    $closing = \App\Models\TransactionDailyClosing::firstOrCreate([
      'transaction_loan_officer_grouping_id' => $grouping->id,
      'date' => Carbon::parse($val['date'])->toDateString(),
    ]);
    if ($closing->kasir_lock_at) {
      return redirect()->back()->withErrors('Hari ini sudah dikunci kasir.');
    }

    $closing->update(['setoran_mantri' => $val['su_lapangan'] ?? null]);

    return redirect()->back()->with('message', 'SU Lapangan tersimpan.');
  }

  public function ceklist_kepala(Request $request)
  {
    // GERBANG alur baru: kantor migrasi Ceklist Kepala lewat ACC KM (ceklist_kepala_baru)
    // (TransactionLoanController@ceklist_kepala_baru), bukan menulis daily_recaps di sini.
    if ($this->sudahMigrasi($request->id, $request->date)) {
      return redirect()->back()->withError('Kantor ini sudah migrasi — Ceklist Kepala lewat Buku Transaksi → ACC KM, bukan rekap lama.');
    }

    $validate = $request->validate([
      'id' => ['required'],
      'date' => ['required'],
      'keluar' => ['required'],
      'baru' => ['required'],
      'lama' => ['required'],
      'rencana' => ['required'],
      'tanggal_rencana_minggu_depan' => ['required'],
      'rencana_minggu_depan' => ['required'],
      'target_minggu_depan' => ['required'],
    ]);


    try {
      DB::beginTransaction();
      $sumAllDrop = TransactionLoan::where('transaction_loan_officer_grouping_id', $request->id)->where('drop_date', $request->date)->where('status', 'success')->sum('nominal_drop');
      $sumAllInstalment = TransactionLoanInstalment::where('transaction_loan_officer_grouping_id', $request->id)->where('transaction_date', $request->date)->sum('nominal');

      $check_thisDay = TransactionDailyRecap::firstOrCreate(['transaction_loan_officer_grouping_id' => $request->id, 'date' => $request->date]);
      $check_thisDay->update([
        'drop' => $sumAllDrop,
        'storting' => $sumAllInstalment,
        'keluar' => $request->keluar,
        'daily_kepala_approval' => Carbon::now(),
        'daily_kepala_approval_user' =>  auth()->user()->employee->id,
      ]);


      $fillTragetMingguDepan = TransactionDailyRecap::firstOrCreate(['transaction_loan_officer_grouping_id' => $request->id, 'date' => $request->tanggal_rencana_minggu_depan]);
      $fillTragetMingguDepan->update([
        'target' => $request->target_minggu_depan,
        'target_on' =>  $request->date,
      ]);





      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withError('Data Gagal Diperbarui, Refresh / Hub IT');
    }
    return redirect()->back()->with('message', $message ?? 'Data berhasil disimpan.');
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
    $data = $this->getDataRekapDua($request);
    // ddd($data);
    return Inertia::render('WebView/Rekap/RekapDua', $data);
  }
  public function rekap_satu(Request $request)
  {
    $data = $this->getRekapDuaData($request);
    return Inertia::render('WebView/Rekap/RekapSatu', $data);
  }

  public function deleteRekap(TransactionDailyRecap $transactionDailyRecap, Request $request)
  {
    try {
      DB::beginTransaction();
      $transactionDailyRecap->delete();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withError('Data Gagal Diperbarui, Refresh / Hub IT');
    }
    return redirect()->back()->with('message', 'Data berhasil dihapus.');
  }
}
