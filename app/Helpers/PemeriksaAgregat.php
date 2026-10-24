<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use Carbon\Carbon;

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
     *   rincian:array<int,array<string,mixed>>
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
            'rincian' => [],
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

        return [
            'baris' => $tersimpan->count(),
            'terkunci' => $tersimpan->filter->terkunci()->count(),
            'beda_terkunci' => count($rincian),
            'beda_bulanan' => self::periksaBulanan($ids, $periode, $tersimpan),
            'belum_final' => $belumFinal,
            'rincian' => $rincian,
        ];
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
