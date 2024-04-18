<?php

namespace App\Helpers;

use Carbon\Carbon;
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
}
