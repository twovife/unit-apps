<?php

namespace App\Helpers;

use App\Models\Branch;
use App\Models\TransactionCustomer;
use Carbon\Carbon;
use Faker\Core\Number;
use Illuminate\Support\Facades\Auth;

class AppHelper
{

  private static function generateUnknownNik($request)
  {
    $drop_date = Carbon::parse($request->drop_date)->format('ym');
    $branch_id = sprintf("%04d",  auth()->user()->employee->branch_id);
    $kelompok_id = sprintf("%02d",  auth()->user()->employee->area);
    $randomNumber = random_int(1, 999999);
    $formattedNumber = sprintf("%06d", $randomNumber);
    return  $branch_id . $kelompok_id . $drop_date .  $formattedNumber;
  }
  public static function dateName($date)
  {
    return strtolower(Carbon::parse($date)->locale('id')->dayName);
  }

  public static function callUnknownNik($request)
  {
    $prefix = strtoupper(substr($request->nik, 0, 2));
    // Inisialisasi variabel untuk menyimpan newNik
    $newNik = null;

    // Cek jika prefix adalah "UB" atau "ML"
    if ($prefix == "UB" || $prefix == "ML") {

      // Lakukan looping sampai menemukan newNik yang unik
      do {
        // Generate newNik
        $newNik = self::generateUnknownNik($request);
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
    return 7;
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
    $previledge = auth()->user()->hasPermissionTo('unit') ? 'unit'
      : (auth()->user()->hasPermissionTo('area') ? 'mantri'
        : (auth()->user()->hasPermissionTo('wilayah') ? 'wilayah'
          : "pusat"));
    return $previledge;
  }

  public static function branch_permission()
  {
    if (auth()->user()->hasPermissionTo('can show branch')) {
      return Branch::all();
    } else {
      return Branch::where('id', auth()->user()->employee->branch_id)->get();
    }
  }

  public static function get_closed_date($date)
  {

    if (auth()->user()->hasPermissionTo('pusat apps')) {
      return null;
    }
    if (auth()->user()->hasPermissionTo('unit apps')) {
      $closedUnitTransaction = Carbon::parse($date)->copy()->subMonth(1)->startOfMonth()->format('Y-m-d');
      return $closedUnitTransaction;
    }
    if (auth()->user()->hasPermissionTo('mantri apps')) {
      return $date;
    }
    return $date;
  }

  public static function havePermissionByDate($date)
  {
    $date = Carbon::parse($date);
    $now = Carbon::now();

    if (auth()->user()->hasPermissionTo('area')) {
      if ($date->lt($now->subDays(2))) {
        return ["status" => false, 'message' => 'Tanggal Sudah Lewat 2 Hari, Hubungi Pimpinan Untuk Merubah']; // Tanggal lebih dari 2 hari yang lalu
      }
      return ["status" => true];
    }

    if (auth()->user()->hasPermissionTo('unit')) {
      if ($date->lt($now->subMonthsNoOverflow(2))) {
        return ["status" => true]; // Tanggal lebih dari 2 hari yang lalu
      }
      return ["status" => true];
    }

    return ["status" => false, 'message' => 'User Tidak Punya Akses Merubah Data']; // Tanggal lebih dari 2 hari yang lalu
  }

  public static function havePermissionByPermission($params)
  {
    if (auth()->user()->hasPermissionTo($params)) {
      return true;
    }
    return false;
  }
}
