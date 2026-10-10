<?php

namespace App\Http\Middleware;

use App\Models\WorkDay;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;

/**
 * Filter GLOBAL lintas menu: tanggal, hari tagih & bulan (keputusan mas
 * 2026-10-10), pasangan kelompok global di AuthScope. Ketiganya selalu
 * selaras:
 *
 * - pilih TANGGAL  -> hari & bulan ikut tanggal itu (Kamis 17 Sep -> kamis,
 *   2026-09);
 * - pilih HARI / BULAN -> tanggal = hari tagih itu yang terakhir di bulan itu,
 *   paling lambat hari ini, melompati libur (kamis + Oktober -> Kamis terakhir
 *   s/d hari ini; kamis + September -> Kamis terakhir September).
 *
 * Hanya kunjungan halaman (GET, bukan JSON) yang membaca/menyimpan pilihan.
 * Drawer (JSON) membawa parameternya sendiri dan tidak disentuh - kalau diisi
 * dari session, tanggal global bisa menimpa hari/bulan yang diminta drawer.
 *
 * Session baru (login ulang) belum punya pilihan -> controller jatuh ke hari
 * ini / bulan ini. Logout membuang session, jadi ikut ter-reset.
 */
class FilterGlobal
{
    private const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    private const NOMOR_HARI = ['senin' => 1, 'selasa' => 2, 'rabu' => 3, 'kamis' => 4, 'jumat' => 5, 'sabtu' => 6];

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user || !$request->isMethod('get') || $request->wantsJson()) {
            return $next($request);
        }

        $kunci = "filter_global_{$user->id}";
        $simpan = $request->session()->get($kunci, []);

        $tanggal = $this->tanggalSah($request->query('date'));
        $hari = in_array(strtolower((string) $request->query('hari')), self::HARI, true) ? strtolower($request->query('hari')) : null;
        $bulan = preg_match('/^\d{4}-\d{2}$/', (string) $request->query('month')) ? $request->query('month') : null;

        if ($tanggal) {
            // Tanggal menentukan hari & bulan.
            $simpan = [
                'date' => $tanggal->toDateString(),
                'hari' => strtolower($tanggal->locale('id')->dayName),
                'month' => $tanggal->format('Y-m'),
            ];
        } elseif ($hari || $bulan) {
            // Hari / bulan baru -> tanggal = hari tagih terakhir di bulan itu.
            $hari ??= $simpan['hari'] ?? null;
            $bulan ??= $simpan['month'] ?? Carbon::today()->format('Y-m');
            $simpan = array_filter([
                'hari' => $hari,
                'month' => $bulan,
                'date' => $hari ? $this->tagihTerakhir($hari, $bulan) : null,
            ]);
        }

        if ($simpan) {
            $request->session()->put($kunci, $simpan);
        }

        // Isi parameter yang tidak dibawa permintaan dari pilihan global.
        foreach (['date', 'hari', 'month'] as $param) {
            if (!$request->has($param) && isset($simpan[$param])) {
                $request->merge([$param => $simpan[$param]]);
            }
        }

        return $next($request);
    }

    private function tanggalSah($nilai): ?Carbon
    {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $nilai)) {
            return null;
        }
        try {
            return Carbon::parse($nilai)->startOfDay();
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Hari tagih $hari terakhir di bulan $bulan, paling lambat hari ini,
     * melompati libur (mundur per minggu). Kalau di bulan berjalan hari itu
     * belum tiba, pakai yang pertama di bulan itu.
     */
    private function tagihTerakhir(string $hari, string $bulan): string
    {
        $awal = Carbon::parse("$bulan-01")->startOfDay();
        $batas = min($awal->copy()->endOfMonth(), Carbon::today());

        $t = $batas->copy();
        while ($t->dayOfWeek !== self::NOMOR_HARI[$hari]) {
            $t->subDay();
        }
        for ($i = 0; $i < 6 && $t->gte($awal) && !WorkDay::hariKerja($t); $i++) {
            $t->subWeek();
        }

        if ($t->lt($awal)) {
            $t = $awal->copy();
            while ($t->dayOfWeek !== self::NOMOR_HARI[$hari]) {
                $t->addDay();
            }
        }

        return $t->toDateString();
    }
}
