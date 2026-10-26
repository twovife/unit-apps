<?php

namespace App\Helpers;

use App\Models\TransactionCustomer;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionManageCustomer;
use App\Models\TransactionSaldoAdjustment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Input ML kantor migrasi (mas 2026-10-26): setoran nasabah macet lama dipecah dari
 * MACET LAMA menjadi pinjaman atas nama nasabah itu, lalu langsung diangsur lunas.
 *
 *   nasabah (NIK diketik / NIK UB otomatis) + rekening kelompok x hari yang sama
 *   pinjaman pecahan: drop lama (< 1 Juni, ember ML), saldo = setoran
 *   MACET LAMA: saldo dikurangi setoran                 -> total ML tidak berubah
 *   angsuran hari ini = setoran                          -> pecahan lunas
 *
 * Saldo dipindah lewat penyesuaian saldo_awal yang BERLAKU SEBULAN SEBELUM MIGRASI:
 * masuk ke saldo awal bulan migrasi dst., tapi tidak tercatat sebagai "saldo masuk" di
 * bulan tersimpan mana pun (HitungAgregat::portofolio / saldoMasuk). Pengaman: saldo
 * bulanan kelompok itu dihitung sebelum & sesudah pemecahan dan harus sama persis,
 * kalau tidak semuanya batal.
 *
 * Pinjaman pecahan ditulis lewat query builder dengan trigger beku dibuka satu aksi
 * (@koreksi_beku, seperti KoreksiBeku): event model pinjaman akan "membuka kunci"
 * tanggal drop lama. Penanda pecahan = notes; tampilan menyembunyikan lunas & pinjaman.
 */
class PecahanMacetLama
{
    public const CATATAN = 'PECAHAN MACET LAMA';
    public const BATAS_DROP = '2026-06-01';

    public static function adalah(?string $notes): bool
    {
        return $notes !== null && str_starts_with($notes, self::CATATAN);
    }

    /**
     * @param array{nama:string,nik:string,tanggal_drop:string,nominal:int} $v (nik "UB" -> dibuatkan)
     * @return array ringkasan untuk log / pesan
     */
    public static function simpan(TransactionLoan $ml, array $v, string $tanggalBayar, $user): array
    {
        $grouping = $ml->loan_officer_grouping;
        $branchId = (int) $grouping->branch_id;
        $mulai = AgregasiScope::tanggalMulai($branchId);
        $berlaku = $mulai->copy()->startOfMonth()->subMonthNoOverflow()->toDateString();
        $bulan = [];
        for ($b = $mulai->copy()->startOfMonth(); $b->lte(Carbon::now()->startOfMonth()->addMonthNoOverflow()); $b->addMonthNoOverflow()) {
            $bulan[] = $b->copy();
        }
        $hitung = fn() => array_map(fn($b) => TutupBulanan::hitung([$grouping->id], $b), $bulan);
        $nominal = (int) $v['nominal'];
        // Drop wajib di hari tagih yang sama (Senin -> Senin); ditolak, bukan digeser diam-diam.
        $drop = Carbon::parse($v['tanggal_drop']);
        if ($drop->dayOfWeek !== AppHelper::getNumbDays($ml->hari)) {
            throw new \RuntimeException("Tanggal drop harus hari {$ml->hari}, sama dengan hari tagih.");
        }

        return DB::transaction(function () use ($ml, $v, $user, $grouping, $berlaku, $hitung, $nominal, $drop, $tanggalBayar) {
            $sebelum = $hitung();

            // 1. Nasabah: NIK diketik dipakai ulang kalau sudah ada; "UB..." -> NIK UB baru.
            $nik = strtoupper(trim((string) ($v['nik'] ?? '')));
            if ($nik === '' || str_starts_with($nik, 'UB')) {
                $nik = AppHelper::callUnknownNik(new \Illuminate\Http\Request([
                    'nik' => 'UB', 'drop_date' => $drop->toDateString(),
                    'branch_id' => $grouping->branch_id, 'kelompok' => $grouping->kelompok,
                ]), true);
            }
            $customer = TransactionCustomer::firstOrCreate(['nik' => $nik], ['nama' => trim($v['nama']), 'alamat' => '-']);

            // 2. Rekening di kelompok yang sama (hari tagih dari pinjaman, seperti MACET LAMA).
            $rekening = TransactionManageCustomer::firstOrCreate([
                'transaction_customer_id' => $customer->id,
                'transaction_loan_officer_grouping_id' => $grouping->id,
                'day' => $drop->dayOfWeek,
            ]);

            // 3. Pinjaman pecahan (drop lama -> trigger beku dibuka satu aksi, tanpa event model).
            $nominalDrop = (int) ceil($nominal / 1.3);
            DB::statement('SET @koreksi_beku = 1');
            try {
                $loanId = DB::table('transaction_loans')->insertGetId([
                    'transaction_manage_customer_id' => $rekening->id,
                    'transaction_loan_officer_grouping_id' => $grouping->id,
                    'request_date' => $drop->toDateString(),
                    'drop_date' => $drop->toDateString(),
                    'check_date' => $drop->toDateString(),
                    'hari' => $ml->hari,
                    'status' => 'success',
                    'nominal_drop' => $nominalDrop,
                    'request_nominal' => $nominalDrop,
                    'approved_nominal' => $nominalDrop,
                    'notes' => self::CATATAN . ' #' . $ml->id,
                    'user_input' => $user->employee->id,
                    'user_mantri' => $user->employee->id,
                    'user_drop' => $user->employee->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } finally {
                DB::statement('SET @koreksi_beku = NULL');
            }
            $pecahan = TransactionLoan::findOrFail($loanId);

            // 4. Pindah saldo: pecahan tepat = setoran, MACET LAMA berkurang setoran.
            $adj = fn(int $loanId, int $n, string $catatan) => $n > 0 && TransactionSaldoAdjustment::create([
                'transaction_loan_id' => $loanId,
                'transaction_loan_officer_grouping_id' => $grouping->id,
                'jenis' => TransactionSaldoAdjustment::JENIS_SALDO_AWAL,
                'nominal' => $n,
                'berlaku_bulan' => $berlaku,
                'user_input' => $user->employee->id,
                'catatan' => $catatan,
            ]);
            $adj($pecahan->id, (int) $pecahan->pinjaman - $nominal, 'Pecahan MACET LAMA #' . $ml->id . ': saldo = setoran');
            $adj($ml->id, $nominal, 'Dipecah ke pinjaman #' . $pecahan->id . ' (' . trim($v['nama']) . ')');

            // 5. Pengaman: pemecahan tidak boleh menggeser saldo bulanan apa pun.
            if ($sebelum != $hitung()) {
                throw new \RuntimeException('Pemecahan MACET LAMA akan menggeser saldo bulanan — dibatalkan, hubungi IT.');
            }

            // 6. Angsuran hari ini -> pecahan lunas.
            TransactionLoanInstalment::create([
                'transaction_loan_id' => $pecahan->id,
                'transaction_loan_officer_grouping_id' => $grouping->id,
                'transaction_date' => $tanggalBayar,
                'nominal' => $nominal,
                'status' => AppHelper::generateStatusAngsuran($pecahan->drop_date, $tanggalBayar),
                'danatitipan' => 0,
                'is_transfer' => false,
                'user_input' => $user->employee->id,
                'user_mantri' => AppHelper::getMantri($grouping),
            ]);
            $pecahan->refresh()->hitungUlangPelunasan();

            $hasil = [
                'macet_lama_id' => $ml->id, 'pinjaman_id' => $pecahan->id, 'customer_id' => $customer->id,
                'nik' => $nik, 'nama' => $customer->nama, 'drop' => $drop->toDateString(),
                'nominal' => $nominal, 'tanggal_bayar' => $tanggalBayar, 'user_id' => $user->id,
            ];
            Log::info('Input ML: pecahan MACET LAMA', $hasil);

            return $hasil;
        });
    }
    /**
     * Batalkan satu Input ML (salah input): angsurannya, kedua penyesuaian pasangan, pinjaman
     * pecahan, lalu rekening / nasabah yang jadi kosong. Saldo kembali ke MACET LAMA.
     * Hanya kalau tanggal angsurannya belum dikunci kasir. Pengaman sama dengan simpan:
     * saldo bulanan (tanpa angsuran) harus sama sebelum & sesudah pembatalan.
     */
    public static function hapus(TransactionLoan $pecahan, $user): array
    {
        if (!self::adalah($pecahan->notes)) {
            throw new \RuntimeException('Bukan pinjaman Input ML.');
        }
        $mlId = (int) substr(strrchr($pecahan->notes, '#'), 1);
        $grouping = $pecahan->loan_officer_grouping;
        $mulai = AgregasiScope::tanggalMulai((int) $grouping->branch_id);
        $bulan = [];
        for ($b = $mulai->copy()->startOfMonth(); $b->lte(Carbon::now()->startOfMonth()->addMonthNoOverflow()); $b->addMonthNoOverflow()) {
            $bulan[] = $b->copy();
        }
        $hitung = fn() => array_map(fn($b) => TutupBulanan::hitung([$grouping->id], $b), $bulan);

        return DB::transaction(function () use ($pecahan, $mlId, $grouping, $hitung, $user) {
            TransactionLoan::whereKey($pecahan->id)->lockForUpdate()->first();
            foreach ($pecahan->loan_instalment()->get() as $a) {
                if (AppHelper::tanggalTerkunci($grouping->id, Carbon::parse($a->transaction_date)->toDateString())) {
                    throw new \RuntimeException('Tanggal angsurannya sudah dikunci kasir - tidak bisa dihapus.');
                }
                $a->delete();
            }

            $sebelum = $hitung();
            $nama = $pecahan->manage_customer?->customers?->nama;
            TransactionSaldoAdjustment::where('transaction_loan_id', $pecahan->id)->delete();
            TransactionSaldoAdjustment::where('transaction_loan_id', $mlId)
                ->where('catatan', 'like', 'Dipecah ke pinjaman #' . $pecahan->id . ' (%')->delete();
            $rekeningId = $pecahan->transaction_manage_customer_id;
            DB::statement('SET @koreksi_beku = 1');
            try {
                DB::table('transaction_loans')->where('id', $pecahan->id)->delete();
            } finally {
                DB::statement('SET @koreksi_beku = NULL');
            }
            if ($sebelum != $hitung()) {
                throw new \RuntimeException('Pembatalan Input ML akan menggeser saldo bulanan - dibatalkan, hubungi IT.');
            }

            $rekening = TransactionManageCustomer::find($rekeningId);
            $customerId = $rekening?->transaction_customer_id;
            if ($rekening && !TransactionLoan::where('transaction_manage_customer_id', $rekening->id)->exists()) {
                $rekening->delete();
            }
            if ($customerId && !TransactionManageCustomer::where('transaction_customer_id', $customerId)->exists()) {
                TransactionCustomer::whereKey($customerId)->delete();
            }

            $hasil = ['pinjaman_id' => $pecahan->id, 'macet_lama_id' => $mlId, 'nama' => $nama, 'user_id' => $user->id];
            Log::info('Input ML dibatalkan: saldo kembali ke MACET LAMA', $hasil);

            return $hasil;
        });
    }
}
