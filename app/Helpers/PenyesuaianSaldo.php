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
     * @param  int[]  $loanIds
     * @param  \DateTimeInterface|string|null  $perTanggal
     * @return array<int, array{pinjaman:int, angsuran:int, pemutihan:int, efek:int, saldo:int}>
     */
    public static function saldoBanyak(array $loanIds, $perTanggal = null): array
    {
        if (empty($loanIds)) {
            return [];
        }

        $tanggal = $perTanggal ? Carbon::parse($perTanggal)->toDateString() : null;
        $bulan = $perTanggal ? Carbon::parse($perTanggal)->startOfMonth()->toDateString() : null;

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
     * Pinjaman milik satu NIK yang MEMENUHI SYARAT disesuaikan di satu kantor.
     *
     * Syaratnya sudah ML lama: drop_date <= batas (bulan migrasi − 6 bulan).
     * Himpunan ini beku sejak migrasi dan hanya mengecil — alat migrasi
     * berbatas waktu, bukan lubang permanen (§7).
     *
     * @return array<int,array>
     */
    public static function cariEligible(int $branchId, string $nik): array
    {
        $batas = AgregasiScope::batasPenyesuaian($branchId);

        if (!$batas) {
            return [];
        }

        $ids = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $branchId)->pluck('id');

        $loans = TransactionLoan::with('loan_officer_grouping')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->where('status', 'success')
            ->where('drop_date', '<=', $batas->toDateString())
            ->whereHas('customer', fn($q) => $q->where('nik', $nik))
            ->orderByDesc('drop_date')
            ->get();

        return $loans->map(function (TransactionLoan $l) {
            $s = self::hitungSaldo($l);
            $penyesuaian = TransactionSaldoAdjustment::where('transaction_loan_id', $l->id)
                ->orderByDesc('id')->get();

            return [
                'loan_id' => $l->id,
                'grouping_id' => $l->transaction_loan_officer_grouping_id,
                'kelompok' => $l->loan_officer_grouping->kelompok ?? null,
                'hari' => $l->hari,
                'drop_date' => Carbon::parse($l->drop_date)->toDateString(),
                'nominal_drop' => (int) $l->nominal_drop,
                'pinjaman' => $s['pinjaman'],
                'angsuran' => $s['angsuran'],
                'pemutihan' => $s['pemutihan'],
                'saldo' => $s['saldo'],
                'penyesuaian' => $penyesuaian->map(fn($a) => [
                    'id' => $a->id,
                    'jenis' => $a->jenis,
                    'nominal' => (int) $a->nominal,
                    'efek' => $a->efek_saldo,
                    'disetujui' => $a->sudahDisetujui(),
                    'butuh_persetujuan' => $a->butuhPersetujuan(),
                ])->values(),
            ];
        })->all();
    }

    /**
     * Buat penyesuaian dari sisa saldo yang diketik staf.
     *
     * @throws \RuntimeException
     */
    public static function buat(TransactionLoan $loan, string $jenis, int $sisaSaldo, ?string $catatan, $user): TransactionSaldoAdjustment
    {
        if (!array_key_exists($jenis, TransactionSaldoAdjustment::ARAH)) {
            throw new \RuntimeException('Jenis penyesuaian tidak dikenal.');
        }

        if ($sisaSaldo < 0) {
            throw new \RuntimeException('Sisa saldo tidak boleh negatif.');
        }

        $branchId = DB::table('transaction_loan_officer_groupings')
            ->where('id', $loan->transaction_loan_officer_grouping_id)
            ->value('branch_id');

        if (!AgregasiScope::bolehDisesuaikan($branchId, $loan->drop_date)) {
            throw new \RuntimeException(
                'Pinjaman ini di luar jendela penyesuaian (harus ML lama, drop sebelum '
                . AgregasiScope::batasPenyesuaian($branchId)?->toDateString() . ').'
            );
        }

        $saldo = self::hitungSaldo($loan)['saldo'];
        $efekDiperlukan = $sisaSaldo - $saldo; // + menambah, − mengurangi
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
            return TransactionSaldoAdjustment::create([
                'transaction_loan_id' => $loan->id,
                'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
                'jenis' => $jenis,
                'nominal' => abs($efekDiperlukan),
                'berlaku_bulan' => $berlaku,
                'user_input' => $user->employee->id,
                'catatan' => $catatan ?: null,
            ]);
        });
    }

    /**
     * Setujui penyesuaian yang butuh persetujuan.
     *
     * Pagar terpenting: penyetuju ≠ pengaju. Satu orang tidak boleh menyetujui
     * penyesuaiannya sendiri — tanpa itu "wajib disetujui" cuma formalitas.
     *
     * @throws \RuntimeException
     */
    public static function setujui(TransactionSaldoAdjustment $adj, $user): TransactionSaldoAdjustment
    {
        if (!$adj->butuhPersetujuan()) {
            throw new \RuntimeException('Jenis ini tidak butuh persetujuan.');
        }

        if ($adj->approved_at !== null) {
            throw new \RuntimeException('Sudah disetujui.');
        }

        if ((int) $adj->user_input === (int) $user->employee->id) {
            throw new \RuntimeException('Penyetuju tidak boleh sama dengan pengaju.');
        }

        $adj->update([
            'user_approve' => $user->employee->id,
            'approved_at' => now(),
        ]);

        return $adj->fresh();
    }
}
