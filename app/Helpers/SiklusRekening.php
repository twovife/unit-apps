<?php

namespace App\Helpers;

use App\Models\TransactionManageCustomer;
use App\Models\TransactionSiklus;

/**
 * Menandai siklus sebuah rekening (transaction_manage_customers.siklus_id).
 *
 * Dipicu OLEH KEJADIAN, bukan tutup buku:
 *   - nasabah_baru : rekening baru didrop langsung (tgl pengajuan == tgl drop)
 *   - pelunasan    : topup berhasil (pinjaman pengganti jadi success)
 *   - ist          : pelunasan manual (bayar_pinjaman melunasi, tanpa topup)
 *
 * Nilai siklus DATA (tabel transaction_siklus), jadi resolusi lewat `kode`.
 * Kode tak ditemukan -> diam (tidak melempar): siklus cuma penanda lunak,
 * tak boleh menggagalkan transaksi induknya.
 */
class SiklusRekening
{
    public const NASABAH_BARU = 'nasabah_baru';
    public const PELUNASAN = 'pelunasan';
    public const IST = 'ist';

    /** id siklus per-kode, di-cache selama request supaya tak query berulang. */
    private static array $cacheId = [];

    public static function idDari(string $kode): ?int
    {
        if (!array_key_exists($kode, self::$cacheId)) {
            self::$cacheId[$kode] = TransactionSiklus::where('kode', $kode)->value('id');
        }

        return self::$cacheId[$kode];
    }

    /**
     * Set siklus rekening. Pakai update() langsung (bukan save model) supaya
     * ringan dan tidak memicu event model lain.
     */
    public static function tandai(?int $manageCustomerId, string $kode): void
    {
        if (!$manageCustomerId) {
            return;
        }

        $siklusId = self::idDari($kode);

        if (!$siklusId) {
            return;
        }

        TransactionManageCustomer::where('id', $manageCustomerId)
            ->update(['siklus_id' => $siklusId]);
    }
}
