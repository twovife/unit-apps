<?php

namespace App\Helpers;

use App\Models\TransactionSaldoAdjustment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Menghitung kolom TURUNAN agregat harian langsung dari tabel sumber.
 *
 * Kolom yang dihitung di sini adalah cache: selalu bisa dihitung ulang dari
 * `transaction_loans` / `_instalments` / `_white_offs`, dan karena itu selalu
 * bisa DIVERIFIKASI ULANG terhadap sumbernya. Kolom manual (kasbon, transport,
 * keluar, setoran_mantri) tidak disentuh sama sekali oleh kelas ini.
 *
 * Tidak menulis apa pun — hanya mengembalikan angka. Yang memutuskan kapan
 * menyimpannya adalah pemanggil.
 *
 * Lihat .agents/agregasi_rekap.md §4, §10.1.
 */
class HitungAgregat
{
    /**
     * Angka turunan satu (kelompok, tanggal).
     *
     * @return array<string,int>
     */
    public static function harian(int $groupingId, $tanggal): array
    {
        return self::harianBanyak([$groupingId], $tanggal, $tanggal)[
            $groupingId . '|' . Carbon::parse($tanggal)->toDateString()
        ] ?? self::kosong();
    }

    /**
     * Versi borongan: seluruh kelompok, seluruh rentang tanggal, dalam tiga
     * query — bukan satu query per hari per kelompok.
     *
     * Kunci hasil: "groupingId|Y-m-d".
     *
     * @return array<string,array<string,int>>
     */
    public static function harianBanyak(array $groupingIds, $dari, $sampai): array
    {
        if (empty($groupingIds)) {
            return [];
        }

        $dari = Carbon::parse($dari)->toDateString();
        $sampai = Carbon::parse($sampai)->toDateString();

        $hasil = [];

        foreach (self::drop($groupingIds, $dari, $sampai) as $k => $v) {
            $hasil[$k] = array_merge(self::kosong(), ['drop' => $v]);
        }

        foreach (self::storting($groupingIds, $dari, $sampai) as $k => $v) {
            $hasil[$k] = array_merge($hasil[$k] ?? self::kosong(), $v);
        }

        foreach (self::pemutihan($groupingIds, $dari, $sampai) as $k => $v) {
            $hasil[$k] = array_merge($hasil[$k] ?? self::kosong(), ['pemutihan' => $v]);
        }

        return $hasil;
    }

    /** Semua kolom turunan bernilai nol. */
    public static function kosong(): array
    {
        $k = ['drop' => 0, 'storting' => 0, 'pemutihan' => 0];

        foreach (Ember::SEMUA as $e) {
            $k['storting_' . $e] = 0;
        }

        return $k;
    }

    /**
     * DROP — jumlah pencairan pada tanggal itu.
     *
     * ⚠️ Pinjaman yang punya baris penyesuaian `saldo_awal` DIKECUALIKAN, di
     * tanggal mana pun termasuk tanggal drop-nya sendiri. Itu nasabah lama yang
     * dibawa masuk membawa saldo: uangnya tidak pernah keluar dari laci, jadi
     * memasukkannya ke drop berarti mengarang pencairan. Inilah pengganti resmi
     * "drop palsu" yang selama ini terpaksa dipakai.
     *
     * @return array<string,int>
     */
    private static function drop(array $groupingIds, string $dari, string $sampai): array
    {
        $rows = DB::table(DB::raw('transaction_loans l'))
            ->whereIn('l.transaction_loan_officer_grouping_id', $groupingIds)
            ->where('l.status', 'success')
            ->whereBetween('l.drop_date', [$dari, $sampai])
            ->whereNotExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('transaction_saldo_adjustments as sa')
                    ->whereColumn('sa.transaction_loan_id', 'l.id')
                    ->where('sa.jenis', TransactionSaldoAdjustment::JENIS_SALDO_AWAL);
            })
            ->groupBy('l.transaction_loan_officer_grouping_id', 'l.drop_date')
            ->get([
                DB::raw('l.transaction_loan_officer_grouping_id AS g'),
                DB::raw('l.drop_date AS tgl'),
                DB::raw('SUM(l.nominal_drop) AS n'),
            ]);

        $out = [];
        foreach ($rows as $r) {
            $out[$r->g . '|' . Carbon::parse($r->tgl)->toDateString()] = (int) $r->n;
        }

        return $out;
    }

    /**
     * STORTING — total setoran, plus pecahannya per ember.
     *
     * Embernya dihitung dari `drop_date` pinjaman versus `transaction_date`
     * angsuran, lewat ekspresi SQL yang dibangkitkan Ember::ekspresiSql() —
     * bukan dari kolom `status` di angsuran. Kolom itu cuma punya 4 nilai dan
     * melahap tiga ember pertama jadi satu, jadi secara struktur tidak bisa
     * dipakai memisahkan month1/month2/ccm.
     *
     * @return array<string,array<string,int>>
     */
    private static function storting(array $groupingIds, string $dari, string $sampai): array
    {
        $ember = Ember::ekspresiSql('l.drop_date', 'i.transaction_date');

        $rows = DB::table(DB::raw('transaction_loan_instalments i'))
            ->join(DB::raw('transaction_loans l'), 'l.id', '=', 'i.transaction_loan_id')
            ->whereIn('i.transaction_loan_officer_grouping_id', $groupingIds)
            ->whereBetween('i.transaction_date', [$dari, $sampai])
            ->groupBy('i.transaction_loan_officer_grouping_id', 'i.transaction_date', DB::raw($ember))
            ->get([
                DB::raw('i.transaction_loan_officer_grouping_id AS g'),
                DB::raw('i.transaction_date AS tgl'),
                DB::raw("$ember AS ember"),
                DB::raw('SUM(i.nominal) AS n'),
            ]);

        // Hanya kunci milik storting yang dikembalikan — JANGAN memakai
        // kosong() di sini. kosong() memuat 'drop' => 0, dan hasil method ini
        // di-array_merge di atas nilai drop yang sudah dihitung, sehingga drop
        // ikut tertimpa nol. (Persis bug yang bikin drop terbaca 0 padahal
        // sumbernya Rp 641,9 juta.)
        $nol = ['storting' => 0];
        foreach (Ember::SEMUA as $e) {
            $nol['storting_' . $e] = 0;
        }

        $out = [];
        foreach ($rows as $r) {
            $kunci = $r->g . '|' . Carbon::parse($r->tgl)->toDateString();
            $out[$kunci] ??= $nol;

            $out[$kunci]['storting'] += (int) $r->n;
            $out[$kunci]['storting_' . $r->ember] += (int) $r->n;
        }

        return $out;
    }

    /**
     * PEMUTIHAN — mengurangi saldo tanpa menambah storting, jadi tidak pernah
     * ikut ke rumus tunai.
     *
     * @return array<string,int>
     */
    private static function pemutihan(array $groupingIds, string $dari, string $sampai): array
    {
        $rows = DB::table('transaction_white_offs')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereBetween('transaction_date', [$dari, $sampai])
            ->groupBy('transaction_loan_officer_grouping_id', 'transaction_date')
            ->get([
                DB::raw('transaction_loan_officer_grouping_id AS g'),
                DB::raw('transaction_date AS tgl'),
                DB::raw('SUM(nominal) AS n'),
            ]);

        $out = [];
        foreach ($rows as $r) {
            $out[$r->g . '|' . Carbon::parse($r->tgl)->toDateString()] = (int) $r->n;
        }

        return $out;
    }

    /**
     * SALDO PORTOFOLIO per (kelompok, hari), dipilah per ember.
     *
     * Dua parameter waktu yang sengaja DIPISAH:
     *
     *   $asOf            — saldo dihitung sampai tanggal ini (angsuran &
     *                      pemutihan sesudahnya tidak ikut)
     *   $bulanReferensi  — ember ditentukan relatif terhadap bulan ini
     *
     * Pemisahan itu yang membuat pergeseran ember jatuh dengan sendirinya:
     *
     *   akhir(P)   = asOf akhir P,   referensi P
     *   awal(P+1)  = asOf akhir P,   referensi P+1     <- saldo SAMA, ember naik kelas
     *
     * Karena keduanya memakai saldo yang sama persis, `akhir_total(P)` wajib
     * sama dengan `awal_total(P+1)`. Kalau meleset, ada yang salah — dan itulah
     * gunanya menghitung kedua sisi secara mandiri alih-alih menyalin satu ke
     * yang lain (§11.2).
     *
     * @return array<string,array<string,int>>  kunci "groupingId|hari"
     */
    public static function portofolio(array $groupingIds, $asOf, $bulanReferensi): array
    {
        if (empty($groupingIds)) {
            return [];
        }

        $asOf = Carbon::parse($asOf)->toDateString();
        $ref = Carbon::parse($bulanReferensi)->startOfMonth()->toDateString();

        $ember = Ember::ekspresiSql('l.drop_date', "'$ref'");
        $efek = self::ekspresiEfekPenyesuaian();

        $saldo = '(l.pinjaman - IFNULL(i.bayar,0) - IFNULL(w.wo,0) + IFNULL(a.efek,0))';

        $rows = DB::table(DB::raw('transaction_loans l'))
            ->leftJoin(DB::raw(
                "(SELECT transaction_loan_id, SUM(nominal) bayar
                    FROM transaction_loan_instalments
                   WHERE transaction_date <= '$asOf'
                   GROUP BY transaction_loan_id) i"
            ), 'i.transaction_loan_id', '=', 'l.id')
            ->leftJoin(DB::raw(
                "(SELECT transaction_loan_id, SUM(nominal) wo
                    FROM transaction_white_offs
                   WHERE transaction_date <= '$asOf'
                   GROUP BY transaction_loan_id) w"
            ), 'w.transaction_loan_id', '=', 'l.id')
            ->leftJoin(DB::raw(
                "(SELECT transaction_loan_id, SUM($efek) efek
                    FROM transaction_saldo_adjustments
                   WHERE berlaku_bulan <= '$ref'
                   GROUP BY transaction_loan_id) a"
            ), 'a.transaction_loan_id', '=', 'l.id')
            ->whereIn('l.transaction_loan_officer_grouping_id', $groupingIds)
            ->where('l.status', 'success')
            ->where('l.drop_date', '<=', $asOf)
            ->whereNotNull('l.hari')
            ->whereRaw("$saldo > 0")
            ->groupBy('l.transaction_loan_officer_grouping_id', DB::raw('LOWER(l.hari)'), DB::raw($ember))
            ->get([
                DB::raw('l.transaction_loan_officer_grouping_id AS g'),
                DB::raw('LOWER(l.hari) AS hari'),
                DB::raw("$ember AS ember"),
                DB::raw("SUM($saldo) AS saldo"),
            ]);

        $nol = [];
        foreach (Ember::SEMUA as $e) {
            $nol[$e] = 0;
        }

        $out = [];
        foreach ($rows as $r) {
            $kunci = $r->g . '|' . $r->hari;
            $out[$kunci] ??= $nol;
            $out[$kunci][$r->ember] += (int) $r->saldo;
        }

        return $out;
    }

    /**
     * SALDO MASUK — penyesuaian saldo yang berlaku di bulan ini, per
     * (kelompok, hari).
     *
     * Ini "pintu masuk kedua" sirkulasi: menaikkan saldo tanpa membuat drop.
     * Tandanya dibalik terhadap efek saldo — penyesuaian `saldo_awal` MENGURANGI
     * saldo pinjaman (nasabah sudah bayar sekian sebelum masuk sistem), tapi
     * yang MASUK ke sirkulasi kelompok adalah sisa yang dibawanya.
     *
     * @return array<string,int>  kunci "groupingId|hari"
     */
    public static function saldoMasuk(array $groupingIds, $periode): array
    {
        if (empty($groupingIds)) {
            return [];
        }

        $ref = Carbon::parse($periode)->startOfMonth()->toDateString();
        $efek = self::ekspresiEfekPenyesuaian('sa');

        $rows = DB::table(DB::raw('transaction_saldo_adjustments sa'))
            ->join(DB::raw('transaction_loans l'), 'l.id', '=', 'sa.transaction_loan_id')
            ->whereIn('sa.transaction_loan_officer_grouping_id', $groupingIds)
            ->where('sa.berlaku_bulan', $ref)
            ->whereNotNull('l.hari')
            ->groupBy('sa.transaction_loan_officer_grouping_id', DB::raw('LOWER(l.hari)'))
            ->get([
                DB::raw('sa.transaction_loan_officer_grouping_id AS g'),
                DB::raw('LOWER(l.hari) AS hari'),
                DB::raw("SUM($efek) AS efek"),
            ]);

        $out = [];
        foreach ($rows as $r) {
            $out[$r->g . '|' . $r->hari] = (int) $r->efek;
        }

        return $out;
    }

    /**
     * Ekspresi SQL efek bertanda penyesuaian, dibangkitkan dari
     * TransactionSaldoAdjustment::ARAH supaya arah tanda tidak pernah
     * didefinisikan dua kali.
     */
    private static function ekspresiEfekPenyesuaian(string $alias = ''): string
    {
        $kolomJenis = $alias ? "$alias.jenis" : 'jenis';
        $kolomNominal = $alias ? "$alias.nominal" : 'nominal';

        $cases = '';
        foreach (TransactionSaldoAdjustment::ARAH as $jenis => $arah) {
            $tanda = $arah < 0 ? '-' : '';
            $cases .= " WHEN " . DB::getPdo()->quote($jenis) . " THEN {$tanda}{$kolomNominal}";
        }

        return "CASE {$kolomJenis}{$cases} ELSE 0 END";
    }
}
