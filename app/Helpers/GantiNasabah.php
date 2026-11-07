<?php

namespace App\Helpers;

use App\Models\TransactionCustomer;
use App\Models\TransactionLoan;
use App\Models\TransactionManageCustomer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Ganti nasabah SATU pinjaman lewat NIK (superuser, mas 2026-10-26). Yang berpindah hanya
 * pinjaman ini; data lama dibersihkan kalau jadi kosong.
 *
 *  - NIK tujuan sudah terdaftar (nasabah B): pinjaman pindah ke rekening B di kelompok +
 *    hari tagih yang sama; belum ada -> rekening baru untuk B (salinan rekening lama:
 *    no anggota, domisili, dst.).
 *  - NIK tujuan belum terdaftar, nasabah asal HANYA punya pinjaman ini: NIK-nya diganti.
 *  - NIK tujuan belum terdaftar, nasabah asal punya pinjaman lain: nasabah baru (nama bisa
 *    diubah) + rekening salinan, hanya pinjaman ini yang pindah.
 * Sesudahnya: rekening asal kosong -> dihapus; nasabah asal tanpa rekening -> dihapus.
 *
 * Rantai data: transaction_customers <- transaction_manage_customers <- transaction_loans
 * (tidak ada tabel lain yang menunjuk keduanya). Pinjaman dipindah lewat query builder:
 * hanya kolom rekening yang berubah, jadi event model (buka gembok, segarkan rekap) tidak
 * relevan, dan trigger kunci/beku hanya menjaga status/nominal/tanggal/kelompok.
 */
class GantiNasabah
{
    /** @return array rencana untuk pratinjau; melempar RuntimeException kalau tidak bisa. */
    public static function rencana(TransactionLoan $loan, string $nik, ?string $namaBaru = null): array
    {
        if (!preg_match('/^\d{16}$/', $nik)) {
            throw new \RuntimeException('NIK harus 16 digit angka.');
        }
        $asal = TransactionManageCustomer::with('customers')->findOrFail($loan->transaction_manage_customer_id);
        $a = $asal->customers;
        if ($a && (string) $a->nik === $nik) {
            throw new \RuntimeException('NIK sama dengan NIK nasabah pinjaman ini.');
        }

        $pinjamanA = TransactionLoan::whereIn('transaction_manage_customer_id', TransactionManageCustomer::where('transaction_customer_id', $a?->id)->select('id'))->count();
        $sisaDiRekeningAsal = TransactionLoan::where('transaction_manage_customer_id', $asal->id)->whereKeyNot($loan->id)->count();
        // NIK dobel lama: ambil nasabah tertua sebagai tujuan.
        $b = TransactionCustomer::where('nik', $nik)->orderBy('id')->first();

        if ($b) {
            $tujuan = self::rekeningTujuan($b->id, $asal->transaction_loan_officer_grouping_id, $loan->hari);
            $aksi = 'pindah';
        } elseif ($pinjamanA <= 1) {
            $tujuan = null;
            $aksi = 'ganti_nik';
        } else {
            $tujuan = null;
            $aksi = 'baru';
        }

        $hapusRekening = $aksi !== 'ganti_nik' && $sisaDiRekeningAsal === 0;
        $hapusNasabah = $hapusRekening
            && TransactionManageCustomer::where('transaction_customer_id', $a?->id)->whereKeyNot($asal->id)->doesntExist();

        return [
            'aksi' => $aksi,
            'loan_id' => $loan->id,
            'nik' => $nik,
            'asal' => ['id' => $a?->id, 'nama' => $a?->nama, 'nik' => $a?->nik, 'rekening_id' => $asal->id, 'jumlah_pinjaman' => $pinjamanA],
            'tujuan' => $b
                ? ['id' => $b->id, 'nama' => $b->nama, 'nik' => $b->nik, 'rekening_id' => $tujuan?->id, 'nomor_anggota' => $tujuan?->nomor_anggota]
                : ($aksi === 'baru' ? ['id' => null, 'nama' => trim((string) ($namaBaru ?: $a?->nama)), 'nik' => $nik, 'rekening_id' => null] : null),
            'buat_rekening' => $aksi === 'baru' || ($aksi === 'pindah' && !$tujuan),
            'hapus_rekening_asal' => $hapusRekening,
            'hapus_nasabah_asal' => $hapusNasabah,
        ];
    }

    /** Rekening nasabah di kelompok yang sama dengan hari tagih yang sama (dari pinjamannya, atau kolom day). */
    private static function rekeningTujuan(int $customerId, int $groupingId, ?string $hari): ?TransactionManageCustomer
    {
        $kandidat = TransactionManageCustomer::where('transaction_customer_id', $customerId)
            ->where('transaction_loan_officer_grouping_id', $groupingId)->orderBy('id')->get();

        return $kandidat->first(fn($m) => TransactionLoan::where('transaction_manage_customer_id', $m->id)->where('hari', $hari)->exists())
            ?? $kandidat->first(fn($m) => strtolower((string) $m->day) === strtolower((string) $hari));
    }

    /** Jalankan rencana yang sama dengan pratinjau, satu transaksi. */
    public static function jalankan(TransactionLoan $loan, string $nik, ?string $namaBaru, int $userId): array
    {
        return DB::transaction(function () use ($loan, $nik, $namaBaru, $userId) {
            $loan = TransactionLoan::lockForUpdate()->findOrFail($loan->id);
            $r = self::rencana($loan, $nik, $namaBaru);
            $asal = TransactionManageCustomer::findOrFail($r['asal']['rekening_id']);

            if ($r['aksi'] === 'ganti_nik') {
                TransactionCustomer::whereKey($r['asal']['id'])->update(['nik' => $nik, 'updated_at' => now()]);
            } else {
                $customerId = $r['tujuan']['id'] ?? TransactionCustomer::create([
                    'nama' => $r['tujuan']['nama'],
                    'nik' => $nik,
                    'alamat' => TransactionCustomer::whereKey($r['asal']['id'])->value('alamat'),
                ])->id;
                $rekeningId = $r['tujuan']['rekening_id'] ?? null;
                if (!$rekeningId) {
                    $baru = $asal->replicate();
                    $baru->transaction_customer_id = $customerId;
                    $baru->save();
                    $rekeningId = $baru->id;
                }
                DB::table('transaction_loans')->where('id', $loan->id)
                    ->update(['transaction_manage_customer_id' => $rekeningId, 'updated_at' => now()]);
                if ($r['hapus_rekening_asal']) {
                    $asal->delete();
                }
                if ($r['hapus_nasabah_asal']) {
                    TransactionCustomer::whereKey($r['asal']['id'])->delete();
                }
                $r['hasil'] = ['customer_id' => $customerId, 'rekening_id' => $rekeningId];
            }

            Log::info('Ganti nasabah pinjaman', ['user_id' => $userId] + $r);

            return $r;
        });
    }
}
