<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Filter GLOBAL lintas menu: hari tagih & bulan (keputusan mas 2026-10-10),
 * pasangan kelompok global di AuthScope. Buka Selasa Oktober di Drop lalu
 * pindah ke Angsuran tetap Selasa Oktober.
 *
 * - Kunjungan halaman (GET, bukan JSON) yang membawa ?hari / ?month yang sah
 *   menyimpan pilihan itu di session.
 * - Permintaan tanpa parameter itu diisi dari session, jadi controller cukup
 *   membaca $request->hari / ->month seperti biasa.
 * - Session baru (sesudah login ulang) belum punya pilihan -> controller jatuh
 *   ke hari ini / bulan ini. Logout membuang session, jadi ikut ter-reset.
 */
class FilterGlobal
{
    private const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user) {
            return $next($request);
        }

        $halaman = $request->isMethod('get') && !$request->wantsJson();

        $this->global($request, "active_hari_{$user->id}", 'hari', $halaman,
            fn($v) => in_array(strtolower($v), self::HARI, true) ? strtolower($v) : null);
        $this->global($request, "active_month_{$user->id}", 'month', $halaman,
            fn($v) => preg_match('/^\d{4}-\d{2}$/', $v) ? $v : null);

        return $next($request);
    }

    private function global(Request $request, string $kunci, string $param, bool $halaman, callable $sah): void
    {
        $nilai = $sah((string) $request->query($param, ''));

        if ($nilai !== null) {
            if ($halaman) {
                $request->session()->put($kunci, $nilai);
            }
        } elseif (!$request->has($param) && $request->session()->has($kunci)) {
            $request->merge([$param => $request->session()->get($kunci)]);
        }
    }
}
