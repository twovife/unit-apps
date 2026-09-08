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
     * Ekspresi SQL HARI TAGIH efektif untuk bulan referensi $ref.
     *
     * Sama polanya dengan kelompok efektif: hari tujuan mutasi terakhir yang
     * berlaku, atau hari asli pinjaman. COALESCE juga menampung ke_hari NULL
     * (mutasi yang tak mengganti hari) — jatuh ke hari asli.
     */
    public static function ekspresiHariEfektifSql(string $aliasLoan, string $ref): string
    {
        $refQ = DB::getPdo()->quote($ref);

        return "COALESCE(
            (SELECT m.ke_hari
               FROM transaction_loan_mutations m
              WHERE m.transaction_loan_id = {$aliasLoan}.id
                AND m.berlaku_bulan <= {$refQ}
                AND m.ke_hari IS NOT NULL
              ORDER BY m.berlaku_bulan DESC, m.id DESC
              LIMIT 1),
            {$aliasLoan}.hari
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

    /** Hari tagih efektif satu pinjaman pada bulan referensi (versi PHP). */
    public static function hariEfektif(TransactionLoan $loan, $ref): string
    {
        $r = Carbon::parse($ref)->startOfMonth()->toDateString();

        $m = TransactionLoanMutation::where('transaction_loan_id', $loan->id)
            ->where('berlaku_bulan', '<=', $r)
            ->whereNotNull('ke_hari')
            ->orderByDesc('berlaku_bulan')->orderByDesc('id')
            ->first();

        return $m ? $m->ke_hari : $loan->hari;
    }

    /**
     * Penyesuaian pembacaan koleksi harian per (grouping, hari) pada bulan $ref.
     *
     * Kolom `hari`/`grouping` ASLI sengaja tak pernah diubah mutasi (demi indeks),
     * jadi pembacaan berbasis kolom asli MELEWATKAN pinjaman yang pindah MASUK dan
     * masih ikut menghitung yang pindah KELUAR. Karena mutasi langka, cukup kembalikan
     * dua daftar ID kecil untuk menambal filter: tambahkan `masuk`, kecualikan `keluar`.
     * Tanpa mutasi, keduanya kosong dan pembacaan persis seperti semula.
     *
     * @return array{masuk: int[], keluar: int[]}
     */
    public static function penyesuaianBaca(int $groupingId, string $hari, $ref): array
    {
        $refDate = Carbon::parse($ref)->startOfMonth()->toDateString();
        $hari = strtolower($hari);

        // Mulai dari tabel mutasi (kecil), dibatasi yang MENYENTUH grouping ini
        // (pindah masuk lewat ke_grouping, atau keluar lewat dari_grouping) —
        // jadi tak menyapu seluruh mutasi kantor lain.
        $loanIds = TransactionLoanMutation::where('berlaku_bulan', '<=', $refDate)
            ->where(function ($q) use ($groupingId) {
                $q->where('ke_grouping_id', $groupingId)
                    ->orWhere('dari_grouping_id', $groupingId);
            })
            ->distinct()->pluck('transaction_loan_id');

        if ($loanIds->isEmpty()) {
            return ['masuk' => [], 'keluar' => []];
        }

        $gEff = self::ekspresiEfektifSql('l', $refDate);
        $hEff = 'LOWER(' . self::ekspresiHariEfektifSql('l', $refDate) . ')';

        $rows = DB::table(DB::raw('transaction_loans l'))
            ->whereIn('l.id', $loanIds)
            ->get([
                DB::raw('l.id AS id'),
                DB::raw('l.transaction_loan_officer_grouping_id AS og'),
                DB::raw('LOWER(l.hari) AS oh'),
                DB::raw("$gEff AS eg"),
                DB::raw("$hEff AS eh"),
            ]);

        $masuk = [];
        $keluar = [];

        foreach ($rows as $r) {
            $asli = ((int) $r->og === $groupingId) && ($r->oh === $hari);
            $efektif = ((int) $r->eg === $groupingId) && ($r->eh === $hari);

            if ($efektif && !$asli) {
                $masuk[] = (int) $r->id;
            } elseif ($asli && !$efektif) {
                $keluar[] = (int) $r->id;
            }
        }

        return ['masuk' => $masuk, 'keluar' => $keluar];
    }

    /**
     * Catat satu mutasi.
     *
     * @throws \RuntimeException
     */
    public static function catat(TransactionLoan $loan, int $keGroupingId, ?string $keHari, $berlakuBulan, ?string $alasan, $user): TransactionLoanMutation
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

        // Asal = kelompok & hari EFEKTIF pinjaman pada bulan itu (bukan selalu
        // kolom asli — pinjaman bisa sudah pernah pindah).
        $dari = self::kelompokEfektif($loan, $bulan);
        $dariHari = self::hariEfektif($loan, $bulan);
        $keHariBersih = $keHari ? strtolower($keHari) : $dariHari;

        if ($dari === (int) $keGroupingId && $keHariBersih === $dariHari) {
            throw new \RuntimeException('Tujuan sama dengan kelompok & hari sekarang.');
        }

        // Mutasi harus di masa depan yang bukunya belum tutup — minimal bulan
        // depan. Menyisipkan mutasi ke bulan yang sudah lewat akan mengubah
        // agregat yang mungkin sudah ditandatangani.
        if ($bulan->lte(Carbon::now()->startOfMonth())) {
            throw new \RuntimeException('Mutasi paling cepat berlaku bulan depan (tanggal 1).');
        }

        return DB::transaction(function () use ($loan, $keGroupingId, $dari, $dariHari, $keHariBersih, $bulan, $alasan, $user) {
            // Tutup rentang mutasi sebelumnya yang masih terbuka: berlaku_sampai
            // = berlaku_bulan mutasi baru. Jadi tiap saat hanya satu yang aktif.
            TransactionLoanMutation::where('transaction_loan_id', $loan->id)
                ->whereNull('berlaku_sampai')
                ->where('berlaku_bulan', '<', $bulan->toDateString())
                ->update(['berlaku_sampai' => $bulan->toDateString()]);

            return TransactionLoanMutation::create([
                'transaction_loan_id' => $loan->id,
                'dari_grouping_id' => $dari,
                'dari_hari' => $dariHari,
                'ke_grouping_id' => $keGroupingId,
                // ke_hari NULL kalau hari tak berubah — resolusi jatuh ke hari asli.
                'ke_hari' => $keHariBersih === $dariHari ? null : $keHariBersih,
                'berlaku_bulan' => $bulan->toDateString(),
                'alasan' => $alasan ?: null,
                'user_input' => $user->employee->id,
            ]);
        });
    }
}
