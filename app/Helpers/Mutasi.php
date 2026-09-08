<?php

namespace App\Helpers;

use App\Models\TransactionLoan;
use App\Models\TransactionLoanMutation;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Mutasi nasabah — mencatat perpindahan + menyediakan keanggotaan EFEKTIF.
 *
 * KEANGGOTAAN EFEKTIF, DAN KENAPA NO-OP SAAT TAK ADA MUTASI
 * --------------------------------------------------------
 * Untuk bulan referensi R, kelompok efektif sebuah pinjaman adalah tujuan
 * mutasi TERAKHIR yang berlaku_bulan <= R; kalau tidak ada, kolom aslinya
 * (`transaction_loan_officer_grouping_id`). `ekspresiEfektifSql()` membangun
 * itu sebagai subkueri berkorelasi yang COALESCE ke kolom asli — jadi selama
 * belum ada satu pun baris mutasi, hasilnya PERSIS sama dengan membaca kolom
 * langsung. Angka portofolio lama tidak bergeser sedikit pun sampai ada mutasi
 * sungguhan.
 *
 * Rancangan: .agents/agregasi_rekap.md §7b.
 */
class Mutasi
{
    public const ROLE_PEMUTASI = ['superuser'];

    /**
     * Ekspresi SQL keanggotaan efektif untuk bulan referensi $ref (Y-m-d, tgl 1).
     *
     * Dipakai menggantikan `l.transaction_loan_officer_grouping_id` di kueri
     * agregat. $aliasLoan = alias tabel transaction_loans (mis. 'l').
     */
    public static function ekspresiEfektifSql(string $aliasLoan, string $ref): string
    {
        $refQ = DB::getPdo()->quote($ref);

        return "COALESCE(
            (SELECT m.ke_grouping_id
               FROM transaction_loan_mutations m
              WHERE m.transaction_loan_id = {$aliasLoan}.id
                AND m.berlaku_bulan <= {$refQ}
              ORDER BY m.berlaku_bulan DESC, m.id DESC
              LIMIT 1),
            {$aliasLoan}.transaction_loan_officer_grouping_id
        )";
    }

    /**
     * Kelompok efektif satu pinjaman pada bulan referensi (versi PHP, untuk
     * pengecekan/tampilan — bukan agregasi massal).
     */
    public static function kelompokEfektif(TransactionLoan $loan, $ref): int
    {
        $r = Carbon::parse($ref)->startOfMonth()->toDateString();

        $m = TransactionLoanMutation::where('transaction_loan_id', $loan->id)
            ->where('berlaku_bulan', '<=', $r)
            ->orderByDesc('berlaku_bulan')->orderByDesc('id')
            ->first();

        return $m ? (int) $m->ke_grouping_id : (int) $loan->transaction_loan_officer_grouping_id;
    }

    /**
     * Catat satu mutasi.
     *
     * @throws \RuntimeException
     */
    public static function catat(TransactionLoan $loan, int $keGroupingId, $berlakuBulan, ?string $alasan, $user): TransactionLoanMutation
    {
        if (!$user || !$user->hasAnyRole(self::ROLE_PEMUTASI)) {
            throw new \RuntimeException('Hanya superuser yang boleh melakukan mutasi.');
        }

        $bulan = Carbon::parse($berlakuBulan)->startOfDay();

        if ($bulan->day !== 1) {
            throw new \RuntimeException('Mutasi hanya berlaku mulai tanggal 1.');
        }

        $tujuan = TransactionLoanOfficerGrouping::find($keGroupingId);
        if (!$tujuan) {
            throw new \RuntimeException('Kelompok tujuan tidak ditemukan.');
        }

        // Dibatasi SATU KANTOR. Perpindahan lintas kantor akan membuat kelompok
        // efektif keluar dari himpunan groupingIds yang dibaca portofolio (yang
        // menyaring per kolom asli demi indeks), sehingga pinjamannya hilang
        // dari kedua kantor. Lintas kantor perlu penanganan tersendiri.
        $branchAsal = $loan->loan_officer_grouping->branch_id ?? null;
        if ($branchAsal !== null && (int) $tujuan->branch_id !== (int) $branchAsal) {
            throw new \RuntimeException('Mutasi antar kantor belum didukung — tujuan harus di kantor yang sama.');
        }

        // Kelompok asal = kelompok EFEKTIF pinjaman pada bulan itu (bukan selalu
        // kolom asli — pinjaman bisa sudah pernah pindah).
        $dari = self::kelompokEfektif($loan, $bulan);

        if ($dari === (int) $keGroupingId) {
            throw new \RuntimeException('Kelompok tujuan sama dengan kelompok sekarang.');
        }

        // Mutasi harus di masa depan yang bukunya belum tutup — minimal bulan
        // depan. Menyisipkan mutasi ke bulan yang sudah lewat akan mengubah
        // agregat yang mungkin sudah ditandatangani.
        if ($bulan->lte(Carbon::now()->startOfMonth())) {
            throw new \RuntimeException('Mutasi paling cepat berlaku bulan depan (tanggal 1).');
        }

        return DB::transaction(function () use ($loan, $keGroupingId, $dari, $bulan, $alasan, $user) {
            // Tutup rentang mutasi sebelumnya yang masih terbuka: berlaku_sampai
            // = berlaku_bulan mutasi baru. Jadi tiap saat hanya satu yang aktif.
            TransactionLoanMutation::where('transaction_loan_id', $loan->id)
                ->whereNull('berlaku_sampai')
                ->where('berlaku_bulan', '<', $bulan->toDateString())
                ->update(['berlaku_sampai' => $bulan->toDateString()]);

            return TransactionLoanMutation::create([
                'transaction_loan_id' => $loan->id,
                'dari_grouping_id' => $dari,
                'ke_grouping_id' => $keGroupingId,
                'berlaku_bulan' => $bulan->toDateString(),
                'alasan' => $alasan ?: null,
                'user_input' => $user->employee->id,
            ]);
        });
    }
}
