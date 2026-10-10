<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Hari tagih GLOBAL lintas menu (keputusan mas 2026-10-10), pasangan kelompok
 * global di AuthScope: buka hari Selasa di Drop lalu pindah ke Angsuran tetap
 * Selasa.
 *
 * - Kunjungan halaman (GET, bukan JSON) yang membawa ?hari menyimpan pilihan
 *   itu di session.
 * - Permintaan tanpa ?hari diisi dari session, jadi controller cukup membaca
 *   $request->hari seperti biasa.
 * - Session baru (sesudah login ulang) belum punya pilihan -> controller jatuh
 *   ke hari ini (AppHelper::hariTagih). Logout membuang session, jadi
 *   pilihannya ikut ter-reset.
 */
class HariGlobal
{
    private const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user) {
            return $next($request);
        }

        $kunci = "active_hari_{$user->id}";
        $hari = strtolower((string) $request->query('hari', ''));

        if (in_array($hari, self::HARI, true)) {
            if ($request->isMethod('get') && !$request->wantsJson()) {
                $request->session()->put($kunci, $hari);
            }
        } elseif (!$request->has('hari') && $request->session()->has($kunci)) {
            $request->merge(['hari' => $request->session()->get($kunci)]);
        }

        return $next($request);
    }
}
