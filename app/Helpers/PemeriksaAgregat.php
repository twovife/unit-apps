<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use App\Models\TransactionResortRombak;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Membuktikan agregat tersimpan masih sama dengan sumbernya.
 *
 * KENAPA PERLU ADA
 * ----------------
 * Trigger database menjamin sumber hari TERKUNCI tidak bisa berubah, jadi
 * angkanya tidak bisa hanyut. Tapi jaminan itu punya tiga celah:
 *
 *   1. Hari yang BELUM terkunci sumbernya masih bebas berubah.
 *   2. Kunci dibuka, sumber diubah, lalu dikunci lagi tanpa hitung ulang.
 *   3. Bug di kode perhitungan menulis angka salah, dan trigger membekukan
 *      angka salah itu dengan setia.
 *
 * Menghitung ULANG dari sumber lalu membandingkan adalah satu-satunya cara
 * MEMBUKTIKAN - bukan menganggap - bahwa agregat cocok dengan detail inputannya.
 *
 * BACA-SAJA. Tidak memperbaiki apa pun: memperbaiki diam-diam menghapus
 * buktinya, dan pemeriksaan yang menyembuhkan dirinya sendiri tidak pernah
 * melaporkan bahwa ada yang salah.
 *
 * Dipakai bersama oleh layar dan perintah CLI supaya keduanya tidak bisa
 * menyimpang - kalau logikanya ditulis dua kali, suatu hari salah satunya
 * akan bilang bersih sementara yang lain bilang meleset.
 */
class PemeriksaAgregat
{
    /**
     * @return array{
     *   baris:int, terkunci:int,
     *   beda_terkunci:int, beda_bulanan:int, belum_final:int,
     *   beda_sinambung:int, beda_kelompok:int,
     *   rincian:array<int,array<string,mixed>>, sinambung:array, kelompok:array
     * }
     */
    public static function periksa(int $branchId, $periode): array
    {
        $periode = Carbon::parse($periode)->startOfMonth();
        $akhir = $periode->copy()->endOfMonth();

        $groupings = TransactionLoanOfficerGrouping::where('branch_id', $branchId)
            ->orderBy('kelompok')->get();

        $kosong = [
            'baris' => 0, 'terkunci' => 0,
            'beda_terkunci' => 0, 'beda_bulanan' => 0, 'belum_final' => 0,
            'beda_sinambung' => 0, 'beda_kelompok' => 0,
            'rincian' => [], 'sinambung' => [], 'kelompok' => [],
        ];

        if ($groupings->isEmpty()) {
            return $kosong;
        }

        $ids = $groupings->pluck('id')->all();
        $nama = $groupings->pluck('kelompok', 'id');

        $tersimpan = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('date', [$periode->toDateString(), $akhir->toDateString()])
            ->orderBy('date')
            ->get();

        $sinambung = self::periksaSinambung($ids, $periode, $nama);
        $kelompok = self::periksaKelompokRombak($branchId, $periode);
        $kosong = array_merge($kosong, [
            'beda_sinambung' => count($sinambung), 'sinambung' => $sinambung,
            'beda_kelompok' => array_sum($kelompok), 'kelompok' => $kelompok,
        ]);

        if ($tersimpan->isEmpty()) {
            return $kosong;
        }

        $sumber = HitungAgregat::harianBanyak($ids, $periode, $akhir);
        $kolom = array_keys(HitungAgregat::kosong());

        $rincian = [];
        $belumFinal = 0;

        foreach ($tersimpan as $baris) {
            $kunci = $baris->transaction_loan_officer_grouping_id . '|' . $baris->date->toDateString();
            $harusnya = $sumber[$kunci] ?? HitungAgregat::kosong();

            foreach ($kolom as $k) {
                if ((int) $baris->$k === (int) $harusnya[$k]) {
                    continue;
                }

                // Baris belum terkunci yang belum pernah dihitung BUKAN temuan -
                // angkanya memang belum ditetapkan. Menghitungnya sebagai
                // pelanggaran menghasilkan ratusan "meleset" palsu, dan alarm
                // yang berbunyi terus adalah alarm yang diabaikan.
                if (!$baris->terkunci()) {
                    $belumFinal++;
                    continue;
                }

                $rincian[] = [
                    'kelompok' => $nama->get($baris->transaction_loan_officer_grouping_id),
                    'tanggal' => $baris->date->toDateString(),
                    'kolom' => $k,
                    'tersimpan' => (int) $baris->$k,
                    'harusnya' => (int) $harusnya[$k],
                ];
            }
        }

        return array_merge($kosong, [
            'baris' => $tersimpan->count(),
            'terkunci' => $tersimpan->filter->terkunci()->count(),
            'beda_terkunci' => count($rincian),
            'beda_bulanan' => self::periksaBulanan($ids, $periode, $tersimpan),
            'belum_final' => $belumFinal,
            'rincian' => $rincian,
        ]);
    }

    /**
     * Saldo awal bulan ini = saldo akhir bulan lalu, per (kelompok, hari).
     * Bulan yang punya mutasi berlaku (rombak resort / mutasi nasabah) memindah
     * saldo antar resort tepat di batas bulan, jadi kesinambungannya diperiksa
     * di total kantor saja (rombak_resort §10).
     *
     * @return array<int,array{resort:string,awal:int,akhir_lalu:int}>
     */
    private static function periksaSinambung(array $ids, Carbon $periode, $nama): array
    {
        $baca = fn(Carbon $p, string $kolom) => TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $p->toDateString())->get()
            ->mapWithKeys(fn($m) => ['K' . $nama->get($m->transaction_loan_officer_grouping_id) . ' ' . $m->hari => (int) $m->$kolom]);
        $awal = $baca($periode, 'awal_total');
        $akhir = $baca($periode->copy()->subMonthNoOverflow(), 'akhir_total');
        if ($awal->isEmpty() || $akhir->isEmpty()) {
            return [];
        }

        $mutasi = DB::table('transaction_loan_mutations')->whereDate('berlaku_bulan', $periode->toDateString())
            ->where(fn($q) => $q->whereIn('dari_grouping_id', $ids)->orWhereIn('ke_grouping_id', $ids))->exists();
        if ($mutasi) {
            $awal = collect(['kantor' => $awal->sum()]);
            $akhir = collect(['kantor' => $akhir->sum()]);
        }

        return $awal->keys()->merge($akhir->keys())->unique()->sort()
            ->filter(fn($k) => ($awal[$k] ?? 0) !== ($akhir[$k] ?? 0))
            ->map(fn($k) => ['resort' => $k, 'awal' => $awal[$k] ?? 0, 'akhir_lalu' => $akhir[$k] ?? 0])
            ->values()->all();
    }

    /**
     * Baris bulan ini (angsuran, pemutihan, penyesuaian) milik pinjaman rombak
     * yang diterapkan, yang kelompoknya bukan kelompok pinjaman PADA tanggal
     * baris itu (Mutasi::kelompokPada). Rombak memindah baris bulan M ke
     * kelompok baru; sisa di kelompok lama = baris yang tertinggal.
     *
     * @return array{angsuran:int,pemutihan:int,penyesuaian:int}
     */
    private static function periksaKelompokRombak(int $branchId, Carbon $periode): array
    {
        $rombak = TransactionResortRombak::where('branch_id', $branchId)->whereDate('berlaku_bulan', $periode->toDateString())
            ->where('status', 'diterapkan')->pluck('id');
        $hasil = [];
        foreach (['angsuran' => ['transaction_loan_instalments', 'transaction_date'], 'pemutihan' => ['transaction_white_offs', 'transaction_date'],
                  'penyesuaian' => ['transaction_saldo_adjustments', 'berlaku_bulan']] as $k => [$tabel, $kolom]) {
            $hasil[$k] = $rombak->isEmpty() ? 0 : DB::table("$tabel as x")->join('transaction_loans as l', 'l.id', '=', 'x.transaction_loan_id')
                ->whereIn('x.transaction_loan_id', DB::table('transaction_loan_mutations')->whereIn('rombak_id', $rombak)->select('transaction_loan_id'))
                ->whereBetween("x.$kolom", [$periode->toDateString(), $periode->copy()->endOfMonth()->toDateString()])
                ->whereRaw('x.transaction_loan_officer_grouping_id <> ' . Mutasi::kelompokSql('l', "x.$kolom"))
                ->count();
        }

        return $hasil;
    }

    /**
     * Bulanan harus sama dengan jumlah hariannya. Beda berarti ada hari yang
     * berubah setelah bulanannya disusun.
     */
    private static function periksaBulanan(array $ids, Carbon $periode, $harian): int
    {
        $bulanan = TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $periode->toDateString())
            ->get();

        if ($bulanan->isEmpty()) {
            return 0;
        }

        $kolom = array_merge(
            ['drop', 'storting', 'pemutihan'],
            array_map(fn($e) => 'storting_' . $e, Ember::SEMUA)
        );

        $perHari = $harian->groupBy(fn($b) => $b->transaction_loan_officer_grouping_id
            . '|' . strtolower($b->date->locale('id')->isoFormat('dddd')));

        $beda = 0;

        foreach ($bulanan as $m) {
            $baris = $perHari->get($m->transaction_loan_officer_grouping_id . '|' . $m->hari, collect());

            foreach ($kolom as $k) {
                if ((int) $m->$k !== (int) $baris->sum($k)) {
                    $beda++;
                }
            }
        }

        return $beda;
    }
}
