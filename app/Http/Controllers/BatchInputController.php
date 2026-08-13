<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Employee;
use App\Models\TransactionCustomer;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BatchInputController extends Controller
{
  /**
   * Batch upload global DIBATASI SUPERUSER (2026-08-12).
   *
   * Menu ini sudah tidak dipakai operasional. Jalur ini membuat pinjaman
   * status 'success' lengkap dengan nominal_drop (menggelembungkan DROP) plus
   * baris angsuran sebesar selisih saldo (menggelembungkan STORTING) — dua-duanya
   * uang yang tidak pernah bergerak di kas. Penggantinya adalah penyesuaian saldo
   * (.agents/agregasi_rekap.md §7) yang menggeser saldo tanpa menyentuh kas.
   *
   * Dicek eksplisit di sini, BUKAN lewat middleware 'role:' — alias itu tidak
   * terdaftar di app/Http/Kernel.php, jadi pemakaiannya akan melempar
   * exception, bukan menolak dengan rapi. Lihat 05_temuan_dan_jebakan.md A1.
   */
  private function pastikanSuperuser()
  {
    if (!auth()->user()?->hasRole('superuser')) {
      abort(403, 'Batch upload global hanya untuk superuser. Pakai menu penyesuaian saldo.');
    }
  }

  public function index()
  {
    $this->pastikanSuperuser();

    return Inertia::render('Administrasi/BatchInput/Index', [
      'resorts' => 'halo',
    ]);
  }

  private function createAngsuran($loan, $tanggal, $nominal, $mantriChoice, $mantri)
  {
    if ($nominal === null || $nominal === '' || $nominal <= 0) {
      return;
    }

    $loan->loan_instalment()->create([
      'transaction_date' => $tanggal,
      'nominal' => $nominal,
      'danatitipan' => 0,
      'transaction_loan_officer_grouping_id' => $mantriChoice->id,
      'status' => AppHelper::generateStatusAngsuran($loan->drop_date, $tanggal),
      'user_input' => 4955,
      'user_mantri' => $mantri,
    ]);
  }
  // $this->createAngsuran($loan, $tglAngs1, $targetPinjaman - $ns['saldo'], $mantriChoice, $mantri);

  /**
   * Logic Utama Store Data
   */
  public function store(Request $request)
  {
    $this->pastikanSuperuser();

    $payload = $request->input('data');
    $id_branch = $request->input('branch_id');
    $monthInput = $request->input('input_month'); // Format: "2026-03"
    $selectedHari = strtolower($request->input('input_hari'));
    $todayStr = date('Y-m-d');
    $pimpinan = Employee::where('branch_id', $id_branch)->where('jabatan', 'pimpinan')->first()->id ?? 4955;
    $kasir = Employee::where('branch_id', $id_branch)->where('jabatan', 'kasir')->first()->id ?? 4955;

    // Gunakan ID pimpinan, jika null gunakan ID kasir, jika keduanya null gunakan default seeder
    $id_mantri_default = $pimpinan ?? ($kasir ?? 4955);

    // 1. Preload grouping agar tidak query berulang dalam looping
    $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', $id_branch)
      ->get()
      ->keyBy('kelompok');

    // 2. Generate mapping tanggal angsuran statis berdasarkan bulan input
    // Ini menggantikan switch-case manual di Seeder agar lebih dinamis tiap bulan
    $staticDates = $this->generateStaticDatesByDay($monthInput, $selectedHari);

    DB::beginTransaction();
    try {
      foreach ($payload as $ns) {

        // Ambil Officer Grouping
        $isPast = $ns['drop_date'] < $todayStr;

        $mantriChoice = $officerGrouping[$ns['kelompok']] ?? null;
        if (!$mantriChoice) continue;

        // Ambil ID Mantri sesuai logic AppHelper
        $mantri = AppHelper::getMantriNoauth($mantriChoice, $id_mantri_default);

        // A. Kelola Data Nasabah
        $customer = TransactionCustomer::firstOrCreate(['nik' => $ns['nik']], [
          'nama' => $ns['nama'],
          'alamat' => $ns['alamat'],
        ]);

        // B. Manage Customer (Relasi Day)
        $dayOfWeek = Carbon::parse($ns['drop_date'])->dayOfWeekIso; // 1 (Senin) - 7 (Minggu)
        $manage = $customer->manage_customer()->firstOrCreate([
          'transaction_loan_officer_grouping_id' => $mantriChoice->id,
          'day' => $dayOfWeek,
        ]);

        if ($isPast) {
          /** * TYPE "S" (LAMPAU)
           * Logic: Success, Nominal Drop, Generate Angsuran
           */
          $loan = $manage->loan()->create([
            'transaction_loan_officer_grouping_id' => $mantriChoice->id,
            'request_date' => $ns['drop_date'],
            'user_mantri'  => $mantri,
            'drop_date'    => $ns['drop_date'],
            'hari'         => AppHelper::dateName($ns['drop_date']),
            'status'       => "success",
            'user_input'   => $id_mantri_default,
            'nominal_drop' => $ns['nominal'],
            'user_drop'    => $mantri,
            'drop_before'  => 0,
          ]);

          // Logic Angsuran Pertama
          // 1. Hitung Target Pinjaman & Tanggal H+1 Minggu (Batas Skip)
          // 1. Hitung Target & Batas Aman (H+1 Minggu dari Drop)
          $targetPinjaman = $ns['nominal'] * 1.3;
          $selisihSaldo = $targetPinjaman - ($ns['saldo'] ?? 0);
          $firstAngsDate = date('Y-m-d', strtotime($ns['drop_date'] . ' +1 week'));

          // Ambil tanggal pertama di kalender bulan ini untuk pembanding
          $firstDateInMonth = $staticDates[0];

          // KONDISI A: Jika angsuran pertama jatuh SEBELUM kalender bulan ini dimulai
          if ($firstAngsDate < $firstDateInMonth) {
            if ($selisihSaldo > 0) {
              $this->createAngsuran($loan, $firstAngsDate, $selisihSaldo, $mantriChoice, $mantri);
            }
          }

          $angsuranKeys = array_filter(array_keys($ns), function ($key) {
            return strpos($key, 'angs_') === 0;
          });

          foreach ($angsuranKeys as $key) {
            $nominalMingguan = $ns[$key];

            if ($nominalMingguan > 0) {
              // Ambil angka dibelakang 'angs_' (misal: 'angs_5' jadi 5)
              $weekIndex = (int) str_replace('angs_', '', $key) - 1;

              if (isset($staticDates[$weekIndex])) {
                // JIKA MINGGU TERSEDIA DI BULAN INI (Minggu 1-4 atau 1-5)
                $tanggalEksekusi = $staticDates[$weekIndex];
              } else {
                // JIKA MELEBIHI (Misal: angs_5 tapi bulan cuma ada 4 minggu, atau angs_6)
                // Ambil tanggal terakhir yang ada di staticDates, lalu tambah minggu kekurangannya
                $lastAvailableDate = Carbon::parse(end($staticDates));
                $diffWeeks = $weekIndex - (count($staticDates) - 1);
                $tanggalEksekusi = $lastAvailableDate->addWeeks($diffWeeks)->toDateString();
              }

              // Validasi: Jangan input angsuran yang tanggalnya sebelum atau sama dengan tanggal cair (drop)
              if ($tanggalEksekusi > $ns['drop_date']) {
                $this->createAngsuran($loan, $tanggalEksekusi, $nominalMingguan, $mantriChoice, $mantri);
              }
            }
          }

          // 2. Looping Angsuran Statis Bulan Ini
          // foreach ($staticDates as $index => $tanggalAngsuran) {
          //   $key = "angs_" . ($index + 1);
          //   $nominalMingguan = !empty($ns[$key]) ? $ns[$key] : 0;

          //   // // KONDISI C: Skip semua tanggal kalender yang jatuh sebelum nasabah itu berhak angsuran
          //   // if ($tanggalAngsuran < $firstAngsDate) {
          //   //   continue;
          //   // }

          //   // KONDISI D: Angsuran rutin bulanan
          //   if ($nominalMingguan > 0) {
          //     $this->createAngsuran($loan, $tanggalAngsuran, $nominalMingguan, $mantriChoice, $mantri);
          //   }
          // }
        } else {
          /** * TYPE "P" (HARI INI / DEPAN)
           * Logic: Open, Request Nominal, No Angsuran
           */
          $loan = $manage->loan()->create([
            'transaction_loan_officer_grouping_id' => $mantriChoice->id,
            'request_date'    => date('Y-m-d', strtotime($ns['drop_date'] . ' -1 week')),
            'user_mantri'     => $mantri,
            'drop_date'       => $ns['drop_date'],
            'hari'            => AppHelper::dateName($ns['drop_date']),
            'status'          => "acc",
            'user_input'      => $id_mantri_default,
            'request_nominal' => $ns['nominal'],
            'nominal_drop'    => null,
            'drop_before'     => $ns['nominal'],
            'user_check'      => $id_mantri_default,
            'check_date'      => Carbon::now()->format('Y-m-d'),
            'approved_nominal' => $ns['nominal'],
          ]);

          // $loan->update([
          //   'status' =>  $request->status,
          //   'user_check' => auth()->user()->employee->id,
          //   'check_date' => Carbon::now()->format('Y-m-d'),
          //   'approved_nominal' => $request->approved_nominal ?? $transactionLoan->approved_nominal,
          // ]);
        }
      }

      DB::commit();
      return response()->json(['message' => 'Batch Upload Sukses!'], 200);
    } catch (\Exception $e) {
      DB::rollBack();

      // \Illuminate\Support\Facades\Log::error("Store Error: " . $e->getMessage() . " at line " . $e->getLine());
      return response()->json([
        'eror_aslinya' => $e->getMessage(),
        'di_baris' => $e->getLine(),
        'di_file' => $e->getFile(),
        'eror_aseli' => $e
      ], 500);
    }
  }

  /**
   * Helper untuk menentukan tanggal angsuran statis di bulan terpilih
   */
  private function generateStaticDatesByDay($monthInput, $hariIndo)
  {
    $map = [
      'senin'  => 'monday',
      'selasa' => 'tuesday',
      'rabu'   => 'wednesday',
      'kamis'  => 'thursday',
      'jumat'  => 'friday',
      'sabtu'  => 'saturday'
    ];

    $hariEng = $map[strtolower($hariIndo)] ?? 'monday';
    $dates = [];

    // Ambil tanggal pertama di bulan tersebut (misal: 2026-04-01)
    $startDate = \Carbon\Carbon::parse($monthInput)->startOfMonth();
    $monthNum = $startDate->month;

    // Cari hari pertama yang cocok di bulan itu
    // Misal: Cari "Thursday" pertama di bulan April
    // Cari hari pertama yang sesuai di bulan tersebut
    $current = \Carbon\Carbon::parse("first $hariEng of " . $startDate->format('Y-m'));

    // Looping selama masih di bulan yang sama
    while ($current->month === $monthNum) {
      $dates[] = $current->toDateString();
      $current->addWeek(); // Lompat ke minggu depan
    }

    return $dates;
  }

  public function validateData(Request $request)
  {
    $this->pastikanSuperuser();

    $items = $request->input('data');
    $id_branch = $request->input('branch_id');
    $results = [];
    $allOk = true;

    // Cache grouping untuk validasi cepat
    $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', $id_branch)
      ->pluck('id', 'kelompok');

    foreach ($items as $ns) {
      $errors = [];

      // 1. Cek Kelompok (Wajib ada di branch tersebut)
      if (!isset($officerGrouping[$ns['kelompok']])) {
        $errors[] = "KLP " . $ns['kelompok'] . " TIDAK ADA DI BRANCH $id_branch";
      }

      // 2. Cek Duplikasi Loan di tanggal yang sama (Opsional tapi penting)


      // 3. Cek Format Data Kritikal
      if (empty($ns['nama'])) $errors[] = "NAMA KOSONG";
      if (empty($ns['drop_date'])) $errors[] = "TANGGAL KOSONG";

      $status = empty($errors) ? 'ok' : 'error';
      if ($status === 'error') $allOk = false;

      $results[] = [
        '_uida' => $ns['_uida'],
        'status' => $status,
        'errors' => $errors
      ];
    }

    return response()->json([
      'all_ok' => $allOk,
      'results' => $results
    ]);
  }
}
