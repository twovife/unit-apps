<?php

namespace App\Helpers;

use App\Models\TransactionLoan;
use App\Models\TransactionSaldoAdjustment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Logika penyesuaian saldo nasabah lama — dipakai layar & pengujian.
 *
 * MASUKANNYA "SISA SALDO", BUKAN "SUDAH BAYAR BERAPA"
 * --------------------------------------------------
 * Buku kertas menampilkan SISA saldo — itu fakta yang bisa diketik apa adanya.
 * "Total dibayar sejak 2024" adalah PR yang harus dihitung sendiri, dan tiap
 * hitungan manual adalah kesempatan salah. Jadi staf mengetik sisa saldo, dan
 * sistem yang menurunkan berapa penyesuaian yang diperlukan:
 *
 *     saldo_sistem = pinjaman − angsuran − pemutihan + Σ efek penyesuaian
 *     efek_diperlukan = sisa_saldo − saldo_sistem
 *
 * Tanda `efek_diperlukan` HARUS cocok dengan arah jenis yang dipilih
 * (TransactionSaldoAdjustment::ARAH). Kalau tidak cocok — mis. staf memilih
 * "kurang_input" (menambah) padahal sisa saldo lebih kecil dari sistem —
 * ditolak, bukan dipaksa. Nominal yang disimpan selalu positif; arahnya sudah
 * ada di jenis.
 *
 * Rancangan: .agents/agregasi_rekap.md §7.
 */
class PenyesuaianSaldo
{
    /**
     * Saldo satu pinjaman. Sengaja cuma membungkus saldoBanyak(): satu kode,
     * jadi saldo per pinjaman dan saldo massal tidak mungkin berbeda.
     *
     * @param  \DateTimeInterface|string|null  $perTanggal  null = semua yang tercatat
     * @return array{pinjaman:int, angsuran:int, pemutihan:int, efek:int, saldo:int}
     */
    public static function hitungSaldo(TransactionLoan $loan, $perTanggal = null): array
    {
        return self::saldoBanyak([$loan->id], $perTanggal)[$loan->id]
            ?? ['pinjaman' => 0, 'angsuran' => 0, 'pemutihan' => 0, 'efek' => 0, 'saldo' => 0];
    }

    /**
     * SATU-SATUNYA rumus saldo pinjaman (F8):
     *
     *     saldo = pinjaman − Σ angsuran − Σ pemutihan + Σ efek penyesuaian yang berlaku
     *
     * Batas waktunya sama persis dengan HitungAgregat::portofolio(): angsuran &
     * pemutihan bertanggal ≤ $perTanggal, penyesuaian ber-`berlaku_bulan` ≤ bulan
     * $perTanggal. null = tanpa batas. Penyesuaian yang butuh persetujuan tapi
     * belum disetujui tidak dihitung. Kesamaan dengan portofolio dibuktikan
     * `php artisan saldo:cek {branch}`.
     *
     * $bulanPenyesuaian: bulan batas penyesuaian kalau beda dari bulan
     * $perTanggal. Saldo AWAL bulan B = transaksi s/d hari terakhir bulan
     * sebelumnya + penyesuaian ber-berlaku_bulan <= B (penyesuaian membetulkan
     * saldo pembuka bulan berlakunya) - sama dengan portofolio($asOf, $ref).
     *
     * @param  int[]  $loanIds
     * @param  \DateTimeInterface|string|null  $perTanggal
     * @param  \DateTimeInterface|string|null  $bulanPenyesuaian
     * @return array<int, array{pinjaman:int, angsuran:int, pemutihan:int, efek:int, saldo:int}>
     */
    public static function saldoBanyak(array $loanIds, $perTanggal = null, $bulanPenyesuaian = null): array
    {
        if (empty($loanIds)) {
            return [];
        }

        $tanggal = $perTanggal ? Carbon::parse($perTanggal)->toDateString() : null;
        $bulan = ($bulanPenyesuaian ?? $perTanggal) ? Carbon::parse($bulanPenyesuaian ?? $perTanggal)->startOfMonth()->toDateString() : null;

        $jumlah = fn(string $tabel) => DB::table($tabel)
            ->select('transaction_loan_id', DB::raw('SUM(nominal) AS n'))
            ->whereIn('transaction_loan_id', $loanIds)
            ->when($tanggal, fn($q) => $q->where('transaction_date', '<=', $tanggal))
            ->groupBy('transaction_loan_id');

        $efek = DB::table('transaction_saldo_adjustments')
            ->select('transaction_loan_id', DB::raw('SUM(' . HitungAgregat::ekspresiEfekPenyesuaian() . ') AS n'))
            ->whereIn('transaction_loan_id', $loanIds)
            ->whereRaw(TransactionSaldoAdjustment::ekspresiBerlakuSql())
            ->when($bulan, fn($q) => $q->where('berlaku_bulan', '<=', $bulan))
            ->groupBy('transaction_loan_id');

        $rows = DB::table('transaction_loans as l')
            ->leftJoinSub($jumlah('transaction_loan_instalments'), 'i', 'i.transaction_loan_id', '=', 'l.id')
            ->leftJoinSub($jumlah('transaction_white_offs'), 'w', 'w.transaction_loan_id', '=', 'l.id')
            ->leftJoinSub($efek, 'a', 'a.transaction_loan_id', '=', 'l.id')
            ->whereIn('l.id', $loanIds)
            ->get(['l.id', 'l.pinjaman', 'i.n AS angsuran', 'w.n AS pemutihan', 'a.n AS efek']);

        $out = [];
        foreach ($rows as $r) {
            $s = [
                'pinjaman' => (int) $r->pinjaman,
                'angsuran' => (int) $r->angsuran,
                'pemutihan' => (int) $r->pemutihan,
                'efek' => (int) $r->efek,
            ];
            $s['saldo'] = $s['pinjaman'] - $s['angsuran'] - $s['pemutihan'] + $s['efek'];
            $out[(int) $r->id] = $s;
        }

        return $out;
    }

    /**
     * Buat penyesuaian dari sisa saldo yang diketik staf.
     *
     * $jenis null = ikut arah angkanya: sisa lebih besar dari saldo sistem
     * -> kurang_input (menambah), lebih kecil -> saldo_awal (mengurangi).
     *
     * @throws \RuntimeException
     */
    public static function buat(TransactionLoan $loan, ?string $jenis, int $sisaSaldo, ?string $catatan, $user): TransactionSaldoAdjustment
    {
        if ($jenis !== null && !array_key_exists($jenis, TransactionSaldoAdjustment::ARAH)) {
            throw new \RuntimeException('Jenis penyesuaian tidak dikenal.');
        }

        if ($sisaSaldo < 0) {
            throw new \RuntimeException('Sisa saldo tidak boleh negatif.');
        }

        $branchId = DB::table('transaction_loan_officer_groupings')
            ->where('id', $loan->transaction_loan_officer_grouping_id)
            ->value('branch_id');

        // Sesudah migrasi saldo awal sudah dicocokkan dengan buku dan dikunci;
        // penyesuaian baru akan menggeser bulan yang sudah ditutup.
        if (AgregasiScope::sudahMigrasi($branchId)) {
            throw new \RuntimeException('Kantor ini sudah migrasi — penyesuaian saldo tidak lagi diterima.');
        }

        if (!AgregasiScope::bolehDisesuaikan($branchId, $loan->drop_date)) {
            throw new \RuntimeException(
                'Pinjaman ini di luar jendela penyesuaian (harus ML lama, drop sebelum '
                . AgregasiScope::batasPenyesuaian($branchId)?->toDateString() . ').'
            );
        }

        $saldo = self::hitungSaldo($loan)['saldo'];
        $efekDiperlukan = $sisaSaldo - $saldo; // + menambah, − mengurangi
        $jenis ??= $efekDiperlukan > 0
            ? TransactionSaldoAdjustment::JENIS_KURANG_INPUT
            : TransactionSaldoAdjustment::JENIS_SALDO_AWAL;
        $arah = TransactionSaldoAdjustment::ARAH[$jenis];

        if ($efekDiperlukan === 0) {
            throw new \RuntimeException('Sisa saldo sama dengan saldo sistem — tidak ada yang perlu disesuaikan.');
        }

        // Arah jenis harus cocok dengan arah yang diperlukan.
        if (($efekDiperlukan > 0 && $arah < 0) || ($efekDiperlukan < 0 && $arah > 0)) {
            $perlu = $efekDiperlukan > 0 ? 'MENAMBAH' : 'MENGURANGI';
            throw new \RuntimeException(sprintf(
                'Sisa saldo yang diketik menuntut penyesuaian %s saldo, tapi jenis "%s" arahnya berlawanan. Pilih jenis yang sesuai.',
                $perlu,
                $jenis
            ));
        }

        $berlaku = AgregasiScope::acuanPenyesuaian($branchId)->toDateString();

        return DB::transaction(function () use ($loan, $jenis, $efekDiperlukan, $catatan, $user, $berlaku) {
            $adj = TransactionSaldoAdjustment::create([
                'transaction_loan_id' => $loan->id,
                'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
                'jenis' => $jenis,
                'nominal' => abs($efekDiperlukan),
                'berlaku_bulan' => $berlaku,
                'user_input' => $user->employee->id,
                'catatan' => $catatan ?: null,
            ]);

            // Saldo berubah -> status lunas ikut: saldo jadi 0 = lunas,
            // pinjaman lunas yang ditambah saldonya = aktif lagi.
            $loan->refresh()->hitungUlangPelunasan();

            return $adj;
        });
    }

}
