<?php

namespace App\Helpers;

use App\Helpers\Ember;
use App\Models\TransactionSaldoAdjustment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Laporan bayangan target: `target_rantai` (tersimpan) vs `target_hitung`
 * (dihitung ulang dari sumber). READ-ONLY — tidak menulis apa pun.
 *
 * Gunanya memberi UKURAN kapan tombol recount layak dinyalakan, bukan menebak.
 * Rantai target selalu hanyut sedikit demi sedikit (warisan minggu lalu +
 * drop*0.13 − keluar); laporan ini menunjukkan seberapa jauh hanyutnya
 * terhadap target yang dihitung langsung dari portofolio.
 *
 *   target_hitung(kelompok, hari) =
 *     Σ (nominal_drop × 0,13) atas pinjaman success, saldo > 0,
 *       ember ∈ {month1, month2, ccm, cm}   ← MB & ML bukan target
 *
 * Rancangan: .agents/agregasi_rekap.md §5.
 */
class TargetBayangan
{
    /** Ember yang dihitung sebagai target (indeks 0..3). MB(4)/ML(>=5) bukan. */
    private const EMBER_TARGET = ['month1', 'month2', 'ccm', 'cm'];

    /**
     * @return array<int,array{kelompok:?int,hari:string,rantai:int,hitung:int,selisih:int}>
     */
    public static function laporan(array $groupingIds, $periode, bool $migrasi = false): array
    {
        if (empty($groupingIds)) {
            return [];
        }

        // target_rantai dibaca dari tabel yang benar: kantor migrasi menyimpan
        // target di transaction_daily_closings (alur baru); selain itu di
        // transaction_daily_recaps (lama). Salah tabel -> rantai basi/0.
        $tabelRantai = $migrasi ? 'transaction_daily_closings' : 'transaction_daily_recaps';

        $periode = Carbon::parse($periode)->startOfMonth();
        $ref = $periode->toDateString();
        $asOf = $periode->copy()->endOfMonth()->toDateString();
        $awal = $periode->toDateString();

        // --- target_hitung: Σ nominal_drop*0.13 atas pinjaman target-bucket, saldo>0
        $ember = Ember::ekspresiSql('l.drop_date', "'$ref'");
        $efek = self::efekSql();
        $saldo = '(l.pinjaman - IFNULL(i.bayar,0) - IFNULL(w.wo,0) + IFNULL(a.efek,0))';
        $emberList = "'" . implode("','", self::EMBER_TARGET) . "'";

        $hitungRows = DB::table(DB::raw('transaction_loans l'))
            ->leftJoin(DB::raw("(SELECT transaction_loan_id, SUM(nominal) bayar FROM transaction_loan_instalments WHERE transaction_date <= '$asOf' GROUP BY transaction_loan_id) i"), 'i.transaction_loan_id', '=', 'l.id')
            ->leftJoin(DB::raw("(SELECT transaction_loan_id, SUM(nominal) wo FROM transaction_white_offs WHERE transaction_date <= '$asOf' GROUP BY transaction_loan_id) w"), 'w.transaction_loan_id', '=', 'l.id')
            ->leftJoin(DB::raw("(SELECT transaction_loan_id, SUM($efek) efek FROM transaction_saldo_adjustments WHERE berlaku_bulan <= '$ref' AND " . TransactionSaldoAdjustment::ekspresiBerlakuSql() . " GROUP BY transaction_loan_id) a"), 'a.transaction_loan_id', '=', 'l.id')
            ->whereIn('l.transaction_loan_officer_grouping_id', $groupingIds)
            ->where('l.status', 'success')
            ->where('l.drop_date', '<=', $asOf)
            ->whereNotNull('l.hari')
            ->whereRaw("$saldo > 0")
            ->whereRaw("$ember IN ($emberList)")
            ->groupBy('l.transaction_loan_officer_grouping_id', DB::raw('LOWER(l.hari)'))
            ->get([
                DB::raw('l.transaction_loan_officer_grouping_id AS g'),
                DB::raw('LOWER(l.hari) AS hari'),
                DB::raw('FLOOR(SUM(l.nominal_drop) * 0.13) AS hitung'),
            ]);

        // --- target_rantai: target tersimpan pada baris TERBARU per (grouping,hari)
        $rantaiRows = DB::table("$tabelRantai as r")
            ->whereIn('r.transaction_loan_officer_grouping_id', $groupingIds)
            ->whereBetween('r.date', [$awal, $asOf])
            ->whereRaw("r.id = (SELECT r2.id FROM $tabelRantai r2
                                 WHERE r2.transaction_loan_officer_grouping_id = r.transaction_loan_officer_grouping_id
                                   AND LOWER(DAYNAME(r2.date)) = LOWER(DAYNAME(r.date))
                                   AND r2.date BETWEEN ? AND ?
                                 ORDER BY r2.date DESC, r2.id DESC LIMIT 1)", [$awal, $asOf])
            ->get([
                DB::raw('r.transaction_loan_officer_grouping_id AS g'),
                DB::raw("LOWER(ELT(WEEKDAY(r.date)+1,'senin','selasa','rabu','kamis','jumat','sabtu','minggu')) AS hari"),
                DB::raw('r.target AS rantai'),
            ]);

        $nama = DB::table('transaction_loan_officer_groupings')
            ->whereIn('id', $groupingIds)->pluck('kelompok', 'id');

        $peta = [];
        foreach ($hitungRows as $r) {
            $peta[$r->g . '|' . $r->hari] = ['hitung' => (int) $r->hitung, 'rantai' => 0];
        }
        foreach ($rantaiRows as $r) {
            $k = $r->g . '|' . $r->hari;
            $peta[$k] ??= ['hitung' => 0, 'rantai' => 0];
            $peta[$k]['rantai'] = (int) $r->rantai;
        }

        $out = [];
        foreach ($peta as $k => $v) {
            [$g, $hari] = explode('|', $k);
            $out[] = [
                'kelompok' => $nama[$g] ?? null,
                'hari' => $hari,
                'rantai' => $v['rantai'],
                'hitung' => $v['hitung'],
                'selisih' => $v['rantai'] - $v['hitung'],
            ];
        }

        usort($out, fn($a, $b) => [$a['kelompok'], $a['hari']] <=> [$b['kelompok'], $b['hari']]);

        return $out;
    }

    private static function efekSql(): string
    {
        $cases = '';
        foreach (TransactionSaldoAdjustment::ARAH as $jenis => $arah) {
            $tanda = $arah < 0 ? '-' : '';
            $cases .= " WHEN '" . $jenis . "' THEN {$tanda}nominal";
        }

        return "CASE jenis{$cases} ELSE 0 END";
    }
}
