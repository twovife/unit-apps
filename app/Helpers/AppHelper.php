<?php

namespace App\Helpers;

use Carbon\Carbon;
use Faker\Core\Number;
use Illuminate\Support\Facades\Auth;

class AppHelper
{
    public static function dateName($date)
    {
        return strtolower(Carbon::parse($date)->locale('id')->dayName);
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
        if ($parameter == 1) {
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
}
