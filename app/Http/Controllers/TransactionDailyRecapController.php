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
   *   type 2 = kunci kasir -> ClosingHarianController@kunci (hitung ulang,
   *            setoran kosong diisi angka bawaan, syarat Gembok, susun bulanan).
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

    // Setoran tidak diambil dari dialog: yang belum diisi di Rekap 1 dibekukan
    // dengan angka bawaan dari angsuran saat kunci.
    return app(ClosingHarianController::class)->kunci($closing->fresh());
  }

  /**
   * Isi dialog Kunci di Rekap 1 (alur baru): rekap hari itu lengkap -
   * storting per ember, status cek KM + target minggu depan yang akan
   * terbentuk kalau KM belum mengecek, drop menggantung yang akan digagalkan,
   * pengajuan open (tidak disentuh), dan penghalang kunci (hari sebelumnya).
   */
  public function pratinjau_kunci(Request $request)
  {
    $val = $request->validate(['id' => ['required', 'integer'], 'date' => ['required', 'date']]);
    $grouping = TransactionLoanOfficerGrouping::findOrFail($val['id']);
    if (!AppHelper::bolehAksesKelompok($grouping)) {
      abort(403, AppHelper::PESAN_BUKAN_WILAYAH);
    }
    $date = Carbon::parse($val['date'])->toDateString();

    // Tidak membuat baris: pratinjau hanya membaca.
    $closing = \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $grouping->id)
      ->whereDate('date', $date)->first()
      ?? new \App\Models\TransactionDailyClosing(['transaction_loan_officer_grouping_id' => $grouping->id, 'date' => $date]);

    $harian = \App\Helpers\HitungAgregat::harian($grouping->id, $date);
    $tanggalDepan = \App\Helpers\TargetMingguan::tanggalDepan($date);
    $sebelumnya = $closing->exists ? \App\Helpers\Gembok::barisSebelumnyaBelumTerkunci($closing) : null;
    $nama = fn($l) => $l->customer?->nama;

    $dropGantung = ClosingHarianController::dropGantung($closing)->load('customer');
    $pengajuanOpen = TransactionLoan::with('customer')
      ->where('transaction_loan_officer_grouping_id', $grouping->id)
      ->whereDate('request_date', $date)->whereColumn('request_date', '!=', 'drop_date')
      ->where('status', 'open')->get();

    return response()->json([
      'kelompok' => $grouping->kelompok,
      'tanggal' => $date,
      'terkunci' => (bool) $closing->kasir_lock_at,
      'storting' => collect(\App\Helpers\Ember::SEMUA)->mapWithKeys(fn($e) => [$e => (int) ($harian['storting_' . $e] ?? 0)])->all()
        + ['total' => (int) $harian['storting']],
      'drop' => (int) $harian['drop'],
      'cek_km' => (bool) $closing->kepala_approval_at,
      'target' => (int) $closing->target,
      'keluar' => (int) $closing->keluar,
      'masuk' => \App\Helpers\TargetMingguan::masuk((int) $harian['drop']),
      'tanggal_depan' => $tanggalDepan,
      // Target minggu depan kalau ACC KM otomatis jalan sekarang.
      'target_depan' => \App\Helpers\TargetMingguan::hitung((int) $closing->target, (int) $harian['drop'], (int) $closing->keluar),
      'drop_gantung' => $dropGantung->map(fn($l) => [
        'id' => $l->id, 'nama' => $nama($l), 'status' => $l->status,
        'nominal' => (int) ($l->approved_nominal ?: $l->request_nominal),
      ])->values(),
      'pengajuan_open' => $pengajuanOpen->map(fn($l) => [
        'id' => $l->id, 'nama' => $nama($l), 'nominal' => (int) $l->request_nominal,
      ])->values(),
      'penghalang' => $sebelumnya ? 'Hari sebelumnya (' . $sebelumnya->date->format('d-m-Y') . ') belum dikunci.' : null,
    ]);
  }

  /**
   * Kunci hari itu dari dialog Rekap 1 (alur baru). Tidak menyentuh kasbon /
   * transport / setoran - itu diisi inline di tabel.
   */
  public function kunci_hari(Request $request)
  {
    $val = $request->validate(['id' => ['required', 'integer'], 'date' => ['required', 'date', 'before_or_equal:today']]);
    $grouping = TransactionLoanOfficerGrouping::findOrFail($val['id']);
    if (!AppHelper::bolehAksesKelompok($grouping)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }
    if (!\App\Helpers\AgregasiScope::sudahMigrasi($grouping->branch_id)) {
      return redirect()->back()->withErrors('Kantor ini belum migrasi ke alur baru.');
    }

    $closing = \App\Models\TransactionDailyClosing::firstOrCreate([
      'transaction_loan_officer_grouping_id' => $grouping->id,
      'date' => Carbon::parse($val['date'])->toDateString(),
    ]);
    if ($closing->kasir_lock_at) {
      return redirect()->back()->withErrors('Hari ini sudah dikunci kasir.');
    }

    return app(ClosingHarianController::class)->kunci($closing->fresh());
  }

  /**
   * Setoran mantri dari sel Rekap 1 -> daily_closings: SU Lapangan
   * (setoran_tunai, uang yang dibawa pulang mantri) atau setoran_transfer.
   * Kantor alur baru, hari yang belum dikunci. Kosong = belum dicatat (null),
   * beda dengan 0.
   */
  public function simpan_su_lapangan(Request $request)
  {
    if (!auth()->user()->hasPermissionTo('can-approve')) {
      return redirect()->back()->withErrors('Setoran diisi kasir / KM / pimpinan.');
    }

    $val = $request->validate([
      'id' => ['required', 'integer'],
      'date' => ['required', 'date', 'before_or_equal:today'],
      'kolom' => ['required', 'in:kasbon,transport,setoran_tunai,setoran_transfer,setoran_katrol'],
      'nilai' => ['nullable', 'integer', 'min:0'],
    ]);

    $grouping = TransactionLoanOfficerGrouping::find($val['id']);
    if (!AppHelper::bolehAksesKelompok($grouping)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }
    $nama = ['kasbon' => 'Kasbon', 'transport' => 'Transport', 'setoran_tunai' => 'SU Lapangan', 'setoran_transfer' => 'Setor transfer', 'setoran_katrol' => 'Katrolan'];

    // Kantor belum migrasi (mas 2026-10-12): Rekap 1 hanya kasbon & transport,
    // ditulis ke tabel lama (daily_recaps) seperti dialog lama rekap_post type 1.
    if (!$this->sudahMigrasi($grouping->id, $val['date'])) {
      if (!in_array($val['kolom'], ['kasbon', 'transport'], true)) {
        return redirect()->back()->withErrors('Setoran hanya untuk kantor yang sudah migrasi.');
      }
      $recap = TransactionDailyRecap::firstOrNew([
        'transaction_loan_officer_grouping_id' => $grouping->id,
        'date' => Carbon::parse($val['date'])->toDateString(),
      ]);
      if ($recap->daily_kasir_approval) {
        return redirect()->back()->withErrors('Hari ini sudah di-ACC kasir.');
      }
      $recap->fill([$val['kolom'] => (int) ($val['nilai'] ?? 0)])->save();

      return redirect()->back()->with('message', $nama[$val['kolom']] . ' tersimpan.');
    }

    $closing = \App\Models\TransactionDailyClosing::firstOrCreate([
      'transaction_loan_officer_grouping_id' => $grouping->id,
      'date' => Carbon::parse($val['date'])->toDateString(),
    ]);
    if ($closing->kasir_lock_at) {
      return redirect()->back()->withErrors('Hari ini sudah dikunci kasir.');
    }

    // Bawaan 0 untuk semua isian (keputusan mas 2026-10-09): kosong = 0.
    $closing->update([$val['kolom'] => (int) ($val['nilai'] ?? 0)]);

    return redirect()->back()->with('message', $nama[$val['kolom']] . ' tersimpan.');
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

  // JSON detail tunai per hari satu kelompok - drawer dari tabel Global Rekap 1.
  public function rekap_permantri_json(Request $request)
  {
    return response()->json($this->getRekapPermantriData($request));
  }

  public function rekap_permantri(Request $request)
  {
    $data = $this->getRekapPermantriData($request);
    // Tab "Rencana Drop": satu kelompok saja, ikut satu request (5 kueri kecil).
    $data['rencana'] = collect($this->getRencanaDropKepalaData($request, $data['server_filter']['kelompok'])['datas'])->flatten(1)->values();
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
