<?php

namespace App\Helpers;

use App\Models\TransactionLoan;

/**
 * Keluar target karena TOPUP — aturan lapangan, disepakati 2026-10-02.
 *
 * Pinjaman lama keluar target begitu pengajuan penggantinya (previous_loan_id)
 * di-ACC. Tanggal keluarnya = tanggal PENGAJUAN pengganti (bukan tanggal ACC),
 * sebab PELUNASAN. Status pengganti menentukan:
 *
 *   acc / success                  -> keluar
 *   gagal tanpa anak tundaan        -> tetap keluar (gagal sesudah ACC)
 *   open hasil tundaan (postponed)  -> tetap keluar (menunggu ACC ulang)
 *   tolak / dihapus / reset ke open -> batal keluar, kembali ke target
 *
 * Satu fungsi untuk semua kejadian (dipanggil hook TransactionLoan saat status
 * pengganti berubah atau pengganti dihapus), dihitung ulang penuh dari data,
 * jadi aman dipanggil berkali-kali. Keluar target karena sebab lain (lunas,
 * pemutihan, BHT, lunas lama) tidak disentuh.
 */
class KeluarTarget
{
    public static function sinkronTopup(?int $loanLamaId): void
    {
        $lama = $loanLamaId ? TransactionLoan::find($loanLamaId) : null;
        if (!$lama) {
            return;
        }

        $tanggalPengajuan = TransactionLoan::where('previous_loan_id', $loanLamaId)
            ->where(function ($q) {
                $q->whereIn('status', ['acc', 'success'])
                    ->orWhere(fn($q) => $q->where('status', 'open')->whereNotNull('postponed_loan_id'))
                    ->orWhere(fn($q) => $q->where('status', 'gagal')->whereNotExists(
                        fn($anak) => $anak->from('transaction_loans as t')->whereColumn('t.postponed_loan_id', 'transaction_loans.id')
                    ));
            })
            ->min('request_date');

        if ($tanggalPengajuan && !$lama->out_date) {
            $lama->forceFill([
                'out_date' => $tanggalPengajuan,
                'transaction_out_reasons_id' => TransactionLoan::SEBAB_PELUNASAN,
            ])->saveQuietly();
        } elseif (!$tanggalPengajuan && (int) $lama->transaction_out_reasons_id === TransactionLoan::SEBAB_PELUNASAN) {
            $lama->forceFill(['out_date' => null, 'transaction_out_reasons_id' => null])->saveQuietly();
        }
    }
}
