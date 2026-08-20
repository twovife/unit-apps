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
}
