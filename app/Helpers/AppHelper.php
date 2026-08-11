<?php

namespace App\Helpers;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\EmploymentPermission;
use App\Models\TransactionCustomer;
use Carbon\Carbon;
use Faker\Core\Number;
use Illuminate\Bus\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppHelper
{



  // 2
  private static function generateUnknownNik($request)
  {
    $drop_date = Carbon::parse($request->drop_date)->format('ym');
    $branch_id = sprintf("%04d",  auth()->user()->employee->branch_id);
    $kelompok_id = sprintf("%02d",  auth()->user()->employee->area);
    $randomNumber = random_int(1, 999999);
    $formattedNumber = sprintf("%06d", $randomNumber);
    return  $branch_id . $kelompok_id . $drop_date .  $formattedNumber;
  }

  // 3
  private static function generateUnknownNik2($request)
  {
    $drop_date = Carbon::parse($request->drop_date)->format('dym');
    $branch_id = sprintf("%04d",  $request->branch_id);
    $kelompok_id = sprintf("%02d",  $request->kelompok);
    $randomNumber = random_int(1, 999999);
    $formattedNumber = sprintf("%04d", $randomNumber);
    // dd([$branch_id, $kelompok_id, $drop_date, $formattedNumber]);
    return  $branch_id . $kelompok_id . $drop_date .  $formattedNumber;
  }

  public static function getMantri($officerGrouping)
  {

    // CATATAN: dulu di sini ada cabang
    //   if (hasAnyPermission(['unit pimpinan','unit mantri','unit km']))
    //       return employee id user yang login;
    // Ketiga nama itu tidak pernah ada di tabel `permissions`, sehingga
    // hasAnyPermission() selalu mengembalikan false (diam, tidak melempar) dan
    // cabang tersebut TIDAK PERNAH jalan. Seluruh data historis terbentuk lewat
    // jalur pencarian di bawah. Cabang itu sengaja dihapus, bukan diperbaiki
    // jadi cek role, agar atribusi `user_mantri` tetap konsisten dengan data
    // lama. Kalau suatu saat pimpinan/KM ingin tercatat atas nama dirinya
    // sendiri, itu perubahan aturan bisnis yang harus diputuskan terpisah.
    $get_mantri = Employee::where('branch_id', $officerGrouping->branch_id)
      ->where('area', $officerGrouping->kelompok)
      ->orderBy('id', 'desc')
      ->get();

    // Coba temukan mantri yang aktif (tidak resign)
    $mantri = $get_mantri->whereNull('date_resign')->first()?->id;

    // Jika tidak ada mantri aktif yang ditemukan, ambil mantri pertama dari daftar
    if (!$mantri) {
      $mantri = $get_mantri->first()?->id;
    }

    // Jika daftar mantri kosong, gunakan ID employee dari user yang sedang login
    if (!$mantri) {
      $mantri = auth()->user()->employee->id;
    }

    return $mantri;
  }

  public static function getMantriNoauth($officerGrouping, $idpimpinan)
  {
    $mantri = Employee::where('branch_id', $officerGrouping->branch_id)
      ->where('area', $officerGrouping->kelompok)
      ->whereNull('date_resign')
      ->orderBy('id', 'desc')
      ->value('id');

    return $mantri ?? $idpimpinan;
  }




  public static function dateName($date)
  {
    return strtolower(Carbon::parse($date)->locale('id')->dayName);
  }


  // 1
  public static function callUnknownNik($request, $batch = false)
  {

    $prefix = strtoupper(substr($request->nik, 0, 2));
    // Inisialisasi variabel untuk menyimpan newNik
    $newNik = null;

    // Cek jika prefix adalah "UB" atau "ML"
    if ($prefix == "UB" || $prefix == "ML") {

      // Lakukan looping sampai menemukan newNik yang unik
      do {
        // Generate newNik
        $newNik = $batch ? self::generateUnknownNik2($request) : self::generateUnknownNik($request);
        // Cari nasabah dengan newNik di database
        $nasabah = TransactionCustomer::where('nik', $newNik)->first();
      } while ($nasabah); // Ulangi jika nasabah ditemukan

      return $newNik;
    }

    return $request->nik;
  }


  public static function monthNumber($date)
  {
    return strtolower(Carbon::parse($date)->format('Y-m'));
  }
  public static function monthName($date)
  {
    return strtolower(Carbon::parse($date)->locale('id')->monthName);
  }

  public static function status_pinjaman($parameter)
  {
    if ($parameter == 1 || $parameter == null) {
      return "normal";
    }
    if ($parameter == 2) {
      return "cm";
    }
    if ($parameter == 3) {
      return "mb";
    }
    if ($parameter == 4) {
      return "ml";
    }
    return "normal";
  }

  public static function format()
  {
    return new AppHelper();
  }

  public static function getCheckAuth($request)
  {
    if (Auth::check() && Auth::user()->hasPermissionTo($request)) {
      return true;
    } else {
      return false;
    }
  }
  public static function getNumbDays($request)
  {
    $req = strtolower($request);

    if ($req == "senin") {
      return 1;
    }
    if ($req == "selasa") {
      return 2;
    }
    if ($req == "rabu") {
      return 3;
    }
    if ($req == "kamis") {
      return 4;
    }
    if ($req == "jumat") {
      return 5;
    }
    if ($req == "sabtu") {
      return 6;
    }
    return 0;
  }

  public static function getNumberToNameDays($request)
  {
    $req = strtolower($request);

    if ($req == 1) {
      return "senin";
    }
    if ($req == 2) {
      return "selasa";
    }
    if ($req == 3) {
      return "rabu";
    }
    if ($req == 4) {
      return "kamis";
    }
    if ($req == 5) {
      return "jumat";
    }
    if ($req == 6) {
      return "sabtu";
    }
    return "minggu";
  }

  public static function getIsPaid($max_date, $req_day)
  {
    // dd([$max_date, Carbon::parse(Carbon::now())->format('Y-m-d')]);
    $today = Carbon::today()->dayOfWeek;
    $reqday = self::getNumbDays($req_day);
    $prevDay = Carbon::parse(Carbon::today())->previous($reqday)->format('Y-m-d');

    if ($today == $reqday) {
      return Carbon::parse(Carbon::now())->format('Y-m-d') == $max_date ? 1 : 0;
    }
    return $prevDay == $max_date ? 1 : 0;
  }


  public static function getStortingShowDate($req_day)
  {
    $today = Carbon::today()->dayOfWeek;
    $reqday = self::getNumbDays($req_day);
    // dd($reqday);
    $prevDay = Carbon::parse(Carbon::today())->previous($reqday)->format('Y-m-d');
    if ($today == $reqday) {
      return Carbon::today()->format('Y-m-d');
    }

    return $prevDay;
  }

  public static function generateStatusAngsuran($tanggal_drop, $request_date): Int
  {
    $drop = Carbon::createFromFormat('Y-m-d', $tanggal_drop)->startOfMonth();
    $request = Carbon::createFromFormat('Y-m-d', $request_date)->startOfMonth();

    $monthDifference = $drop->diffInMonths($request, false);
    // dd($monthDifference);

    if ($monthDifference < 3) {
      return 1;
    }
    if ($monthDifference == 3) {
      return 2;
    }
    if ($monthDifference == 4) {
      return 3;
    }
    if ($monthDifference > 4) {
      return 4;
    }
    return $monthDifference;
  }
  public static function generateStatusAngsuranString($tanggal_drop, $request_date): string
  {
    $drop = Carbon::createFromFormat('Y-m-d', $tanggal_drop)->startOfMonth();
    $request = Carbon::createFromFormat('Y-m-d', $request_date)->startOfMonth();

    $monthDifference = $drop->diffInMonths($request, false);
    // dd($monthDifference);

    if ($monthDifference < 3) {
      return "normal";
    }
    if ($monthDifference == 3) {
      return "cm";
    }
    if ($monthDifference == 4) {
      return "mb";
    }
    if ($monthDifference > 4) {
      return "ml";
    }
    return "normal";
  }
  public static function generateStatusAngsuranString2($tanggal_drop, $request_date): string
  {
    $drop = Carbon::createFromFormat('Y-m-d', $tanggal_drop)->startOfMonth();
    $request = Carbon::createFromFormat('Y-m-d', $request_date)->startOfMonth();

    $monthDifference = $drop->diffInMonths($request, false);
    // dd($monthDifference);

    if ($monthDifference == 1) {
      return "n1";
    }
    if ($monthDifference == 2) {
      return "ccm";
    }
    if ($monthDifference == 3) {
      return "cm";
    }
    if ($monthDifference == 4) {
      return "mb";
    }
    if ($monthDifference > 4) {
      return "ml";
    }
    return "normal";
  }

  public static function user_permission(): string
  {
    // Cukup gunakan Role pertama yang dimiliki user
    $roles = auth()->user()->getRoleNames();
    return $roles->first() ?? 'mantri';
  }

  public static function branch_permission($authorized, $branch_id)
  {
    // Backward compatibility shim untuk UI lama
    return collect([
      'canShowGroupingBranch' => false,
      'canShowBranch' => false, // Global filter digunakan, matikan lokal
      'canShowKelompok' => $authorized->hasPermissionTo('view-all-groups'),
      'canCreate' => $authorized->hasPermissionTo('can-create'),
      'branches' => collect() // Dikosongkan karena menggunakan Global Selector
    ]);
  }

  public static function user_authorized($authorized)
  {
    // Global filter digunakan, data branches dihandle oleh Middleware
    return collect();
  }
  public static function get_closed_date($date)
  {

    if (auth()->user()->hasRole('superuser') || auth()->user()->hasRole('stafkontrol')) {
      return null;
    }

    if (auth()->user()->hasPermissionTo('can-edit')) {
      return null;
    }

    if (auth()->user()->hasAnyRole(['kasir', 'pimpinan', 'kepala-mantri', 'pengawas'])) {
      $closedUnitTransaction = Carbon::parse($date)->copy()->subMonth(1)->startOfMonth()->format('Y-m-d');
      return $closedUnitTransaction;
    }
    if (auth()->user()->hasRole('mantri')) {
      return $date;
    }
    return $date;
  }

  public static function havePermissionByDate($date)
  {
    $date = Carbon::parse($date);
    $now = Carbon::now();

    if (auth()->user()->hasRole('mantri')) {
      if ($date->lt($now->subDays(2))) {
        return ["status" => false, 'message' => 'Tanggal Sudah Lewat 2 Hari, Hubungi Pimpinan Untuk Merubah'];
      }
      return ["status" => true];
    }

    if (auth()->user()->hasAnyRole(['kasir', 'pimpinan', 'kepala-mantri', 'pengawas'])) {
      if ($date->lt($now->subMonthsNoOverflow(2))) {
        return ["status" => true];
      }
      return ["status" => true];
    }

    return ["status" => false, 'message' => 'User Tidak Punya Akses Merubah Data'];
  }

  /**
   * Gerbang khusus HAPUS PINJAMAN (destroy_loan). Sengaja dipisah dari
   * havePermissionByDate() - aturan tanggal 2 hari & bug "selalu true" di
   * sana tidak relevan untuk hapus, dan havePermissionByDate masih dipakai
   * destroy_angsuran/updateEverything jadi tidak boleh diubah di sini.
   *
   *  - mantri     : boleh hanya jika drop_date ATAU request_date pinjaman itu
   *                 adalah HARI INI. Selain itu ditolak, tanpa pengecualian.
   *  - can-approve (kasir, pimpinan, kepala-mantri, pengawas, stafkontrol,
   *                 superuser): boleh selama rekap harian tanggal drop BELUM
   *                 di-ACC kepala (transaction_daily_recaps.daily_kepala_approval
   *                 masih null). Begitu terkunci, TIDAK ADA pengecualian
   *                 (termasuk superuser - beda dengan Reset Pinjaman).
   *  - lainnya    : ditolak.
   */
  /**
   * true = pinjaman ini sudah dijadikan dasar pengajuan lain yang masih
   * aktif (top-up lewat previous_loan_id ATAU Tundaan lewat
   * postponed_loan_id, status open/acc/success). Dipakai `canDeleteLoan()`
   * dan gerbang Reset Pinjaman di `updateEverything()` - keduanya harus
   * memblokir tanpa pengecualian role apa pun, sama seperti gerbang
   * tampilan di RemoveLoan.jsx/ChangeDetail.jsx.
   */
  public static function sudahDiajukanPengganti(\App\Models\TransactionLoan $transactionLoan): bool
  {
    return \App\Models\TransactionLoan::where(function ($q) use ($transactionLoan) {
      $q->where('previous_loan_id', $transactionLoan->id)
        ->orWhere('postponed_loan_id', $transactionLoan->id);
    })
      ->whereIn('status', ['open', 'acc', 'success'])
      ->exists();
  }

  public static function canDeleteLoan(\App\Models\TransactionLoan $transactionLoan): array
  {
    $user = auth()->user();

    if (self::sudahDiajukanPengganti($transactionLoan)) {
      return ["status" => false, 'message' => 'Transaksi ini sudah diajukan (jadi dasar pengajuan/Tundaan lain yang masih berjalan), tidak bisa dihapus.'];
    }

    if ($user->hasRole('mantri')) {
      $today = Carbon::now()->format('Y-m-d');
      $dropDate = $transactionLoan->drop_date ? Carbon::parse($transactionLoan->drop_date)->format('Y-m-d') : null;
      $requestDate = $transactionLoan->request_date ? Carbon::parse($transactionLoan->request_date)->format('Y-m-d') : null;

      if ($dropDate === $today || $requestDate === $today) {
        return ["status" => true];
      }

      return ["status" => false, 'message' => 'Mantri hanya bisa menghapus pinjaman dengan tanggal pengajuan atau tanggal drop hari ini. Hubungi KM / Pimpinan untuk tanggal lain.'];
    }

    if ($user->hasPermissionTo('can-approve')) {
      $recapTerkunci = \App\Models\TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $transactionLoan->transaction_loan_officer_grouping_id)
        ->where('date', $transactionLoan->drop_date)
        ->whereNotNull('daily_kepala_approval')
        ->exists();

      if ($recapTerkunci) {
        return ["status" => false, 'message' => 'Rekap harian tanggal drop ini sudah di-ACC pimpinan, pinjaman tidak bisa dihapus.'];
      }

      return ["status" => true];
    }

    return ["status" => false, 'message' => 'Anda tidak mempunyai akses menghapus pinjaman.'];
  }

  public static function havePermissionByPermission($params)
  {
    if (auth()->user()->hasPermissionTo($params)) {
      return true;
    }
    return false;
  }

  public static function getFirstDayOfMonthID($dayNameID, $month)
  {
    $dayMap = [
      'minggu' => 'Sunday',
      'senin' => 'Monday',
      'selasa' => 'Tuesday',
      'rabu' => 'Wednesday',
      'kamis' => 'Thursday',
      'jumat' => 'Friday',
      'sabtu' => 'Saturday'
    ];

    $dayName = $dayMap[strtolower($dayNameID)] ?? null;

    if (!$dayName) {
      return 'Nama hari tidak valid!';
    }

    $date = Carbon::parse($month)->startOfMonth();
    return $date->copy()->isSameDay($date->copy()->next($dayName)->subWeek()) ? $date : $date->next($dayName);
  }
}
