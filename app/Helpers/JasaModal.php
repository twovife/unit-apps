<?php

namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Jasa & pembagian bayar pinjaman modal (tb_capital_loans), aturan mas 2026-10-21 (revisi):
 *  - Jasa 2% sisa pokok AWAL bulan bayar per pinjaman, tepat ke rupiah; TOTAL jasa wajib
 *    kantor yang dibulatkan KE ATAS per 1.000 (mas 2026-10-28, dulu per pinjaman: 430 jt
 *    dua pinjaman jadi 8.601.000). Sisa pembulatan dibebankan ke satu pinjaman (lihat
 *    perPinjaman), jadi jumlah per pinjaman = total. Sumber Pusat: tidak ada jasa.
 *  - Tempo 3 bulan: bulan ke-1..3 jasa & pokok belum wajib; wajib mulai bulan ke-4
 *    (selisih bulan kalender >= 3; pinjam Juni -> wajib September). Pinjaman tempo yang
 *    kebagian uang tetap kena jasa 2% (tidak wajib, ditarik kalau dibayar).
 *  - Jasa yang sudah dibayar di bulan itu mengurangi kewajiban (bayar 2x sebulan tidak dobel).
 *  - Satu nominal kasir (satu slip) untuk SEMUA pinjaman kantor, lihat alokasi().
 * jenis: modal_awal (modal awal kantor goro) / pinjaman_modal.
 */
class JasaModal
{
    public const MODAL_AWAL = 'modal_awal';
    public const PINJAMAN = 'pinjaman_modal';
    public const LABEL = [self::PINJAMAN => 'Pinjaman Modal', self::MODAL_AWAL => 'Modal Awal'];

    /** 2% dari sisa, dibulatkan ke rupiah terdekat (tanpa float). */
    public static function dari(int $sisa): int
    {
        return $sisa > 0 ? intdiv($sisa * 2 + 50, 100) : 0;
    }

    /** Total dibulatkan ke atas per 1.000. */
    public static function bulat(int $total): int
    {
        return intdiv($total + 999, 1_000) * 1_000;
    }

    /** Sudah lewat tempo 3 bulan (bulan ke-4 dst). */
    public static function lewatTempo($tanggalPinjam, $tanggal): bool
    {
        $a = Carbon::parse($tanggalPinjam);
        $b = Carbon::parse($tanggal);

        return ($b->year * 12 + $b->month) - ($a->year * 12 + $a->month) >= 3;
    }

    /** Bulan pertama jasa / pokok wajib (Y-m). */
    public static function wajibMulai($tanggalPinjam): string
    {
        return Carbon::parse($tanggalPinjam)->startOfMonth()->addMonths(3)->format('Y-m');
    }

    public static function berlaku(string $source, $tanggalPinjam, $tanggal): bool
    {
        return $source !== 'pusat' && self::lewatTempo($tanggalPinjam, $tanggal);
    }

    /**
     * Per pinjaman untuk bulan $tanggal: sisa awal bulan, sisa per $sampai, jasa seharusnya
     * (wajib), jasa dibayar bulan itu, jasa wajib (seharusnya - dibayar, min 0), tempo, dan
     * jasa_bila_bayar (jasa yang ditarik kalau pinjaman ini kebagian uang; = wajib bila lewat tempo).
     * $loans harus SEMUA pinjaman kantor: pembulatan total jasa wajib dihitung atas semuanya.
     *
     * @param  Collection<int,object>  $loans  baris tb_capital_loans (id, amount, loan_date, source, jenis)
     * @return array<int,array{sisa_awal:int,sisa:int,seharusnya:int,dibayar:int,wajib:int,tempo:bool,jasa_bila_bayar:int}>
     */
    public static function perPinjaman(Collection $loans, $tanggal, $sampai = null): array
    {
        if ($loans->isEmpty()) {
            return [];
        }
        $awal = Carbon::parse($tanggal)->startOfMonth()->toDateString();
        $akhir = Carbon::parse($tanggal)->endOfMonth()->toDateString();
        $sampai = Carbon::parse($sampai ?? $akhir)->toDateString();

        $bayar = DB::table('tb_capital_loan_payments')->whereIn('tb_capital_loan_id', $loans->pluck('id'))
            ->groupBy('tb_capital_loan_id')
            ->selectRaw('tb_capital_loan_id,
                SUM(CASE WHEN payment_date < ? THEN amount_principal ELSE 0 END) pokok_sebelum,
                SUM(CASE WHEN payment_date <= ? THEN amount_principal ELSE 0 END) pokok_sampai,
                SUM(CASE WHEN payment_date BETWEEN ? AND ? THEN amount_jasa_modal ELSE 0 END) jasa_bulan', [$awal, $sampai, $awal, $akhir])
            ->get()->keyBy('tb_capital_loan_id');

        $hasil = [];
        foreach ($loans as $l) {
            $b = $bayar[$l->id] ?? null;
            $sisaAwal = max(0, (int) $l->amount - (int) ($b->pokok_sebelum ?? 0));
            $penuh = $l->source === 'pusat' ? 0 : self::dari($sisaAwal);
            $tempo = !self::lewatTempo($l->loan_date, $awal);
            $seharusnya = $tempo ? 0 : $penuh;
            $dibayar = (int) ($b->jasa_bulan ?? 0);
            $hasil[$l->id] = [
                'sisa_awal' => $sisaAwal,
                'sisa' => max(0, (int) $l->amount - (int) ($b->pokok_sampai ?? 0)),
                'seharusnya' => $seharusnya,
                'dibayar' => $dibayar,
                'wajib' => max(0, $seharusnya - $dibayar),
                'tempo' => $tempo,
                'jasa_bila_bayar' => max(0, $penuh - $dibayar),
                'penuh' => $penuh,
            ];
        }

        // Pembulatan total jasa wajib kantor ke atas per 1.000: sisanya (< 1.000) ke pinjaman
        // yang jasanya ditarik paling dulu di alokasi() - Modal Awal, lalu yang terbaru.
        $total = array_sum(array_column($hasil, 'seharusnya'));
        $tambah = self::bulat($total) - $total;
        if ($tambah > 0) {
            // Utamakan yang masih bersisa: alokasi() hanya membagi ke pinjaman bersisa.
            $calon = $loans->filter(fn($l) => $hasil[$l->id]['seharusnya'] > 0)
                ->sort(fn($a, $b) => [$hasil[$b->id]['sisa'] > 0, $b->jenis === self::MODAL_AWAL, (string) $b->loan_date, $b->id]
                    <=> [$hasil[$a->id]['sisa'] > 0, $a->jenis === self::MODAL_AWAL, (string) $a->loan_date, $a->id])->first();
            $h = &$hasil[$calon->id];
            $h['seharusnya'] += $tambah;
            $h['penuh'] += $tambah;
            $h['wajib'] = max(0, $h['seharusnya'] - $h['dibayar']);
            $h['jasa_bila_bayar'] = max(0, $h['penuh'] - $h['dibayar']);
            unset($h);
        }

        return $hasil;
    }

    /**
     * Bagi satu nominal ke pinjaman aktif kantor (urutan mas 2026-10-21):
     *  1. jasa wajib Modal Awal
     *  2. jasa wajib pinjaman lain lewat tempo, terbaru dulu ("pinjaman ke-2 diutamakan")
     *  3. Modal Awal: (jasa bila masih tempo) lalu pokok
     *  4. pokok pinjaman lain lewat tempo, tertua dulu
     *  5. lebihnya ke pinjaman tempo, tertua dulu: jasa 2% lalu pokok
     * Pokok/jasa tetap bisa dipindah / lebihnya di-0-kan stafkontrol (re-split slip app_laravel).
     *
     * @param  Collection<int,object>  $loans  urut loan_date, id
     * @param  array<int,array>  $info  hasil perPinjaman()
     * @return array{bagian:array<int,array{pokok:int,jasa:int}>, lebih:int}
     */
    public static function alokasi(Collection $loans, array $info, int $nominal): array
    {
        $bagian = [];
        $ambil = function (int $id, string $kolom, int $maks) use (&$bagian, &$nominal) {
            $n = max(0, min($maks, $nominal));
            if ($n > 0) {
                $bagian[$id] ??= ['pokok' => 0, 'jasa' => 0];
                $bagian[$id][$kolom] += $n;
                $nominal -= $n;
            }
        };
        $sudahJasa = function (int $id) use (&$bagian) {
            return $bagian[$id]['jasa'] ?? 0;
        };

        $loans = $loans->filter(fn($l) => $info[$l->id]['sisa'] > 0)->values();
        $ma = $loans->where('jenis', self::MODAL_AWAL);
        $lain = $loans->where('jenis', '!=', self::MODAL_AWAL);
        $jatuh = $lain->filter(fn($l) => !$info[$l->id]['tempo']);
        $tempo = $lain->filter(fn($l) => $info[$l->id]['tempo']);

        foreach ($ma as $l) {
            $ambil($l->id, 'jasa', $info[$l->id]['wajib']);
        }
        foreach ($jatuh->reverse() as $l) {
            $ambil($l->id, 'jasa', $info[$l->id]['wajib']);
        }
        foreach ([$ma, $jatuh, $tempo] as $kelompok) {
            foreach ($kelompok as $l) {
                $ambil($l->id, 'jasa', $info[$l->id]['jasa_bila_bayar'] - $sudahJasa($l->id));
                $ambil($l->id, 'pokok', $info[$l->id]['sisa']);
            }
        }

        return ['bagian' => $bagian, 'lebih' => $nominal];
    }
}
