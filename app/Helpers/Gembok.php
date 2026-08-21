<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionLockHistory;
use Illuminate\Support\Facades\DB;

/**
 * Mengunci dan membuka agregat harian, beserta jejaknya.
 *
 * Penegakan sesungguhnya ada di TRIGGER database — kelas ini yang menentukan
 * SYARAT dan mencatat JEJAK. Trigger menolak penulisan ke tanggal terkunci
 * lewat jalur apa pun (Eloquent, mass update, raw SQL, tinker); kelas ini
 * memastikan penguncian hanya terjadi kalau syaratnya terpenuhi, dan setiap
 * buka-tutup meninggalkan catatan.
 *
 * Lihat .agents/agregasi_rekap.md §4.
 */
class Gembok
{
    /** Role yang boleh membuka kunci — masih harus ditambah permission can-edit. */
    public const ROLE_PEMBUKA = ['stafkontrol', 'pusat', 'superuser'];

    /**
     * Syarat mengunci satu baris harian.
     *
     * Yang SENGAJA BUKAN syarat: kas seimbang. Selisih fisik dibebankan ke
     * penagih lewat pembukuan terpisah; kalau kas seimbang jadi syarat, rantai
     * penguncian jadi sandera masalah yang penyelesaiannya ada di buku lain.
     *
     * @return array{boleh:bool,alasan:string[]}
     */
    public static function bolehKunci(TransactionDailyClosing $baris): array
    {
        $alasan = [];

        if ($baris->terkunci()) {
            $alasan[] = 'Baris ini sudah terkunci.';
        }

        if (!$baris->sudahDisetujuiKepala()) {
            $alasan[] = 'Kepala belum menyetujui rekap hari ini.';
        }

        // NULL = kasir belum mencatat serah terima uang. 0 sah — artinya mantri
        // memang tidak menyetor. Tanpa membedakan keduanya, hari yang terlewat
        // tidak bisa dibedakan dari hari yang sepi.
        if (!$baris->setoranSudahDicatat()) {
            $alasan[] = 'Setoran mantri belum dicatat kasir.';
        }

        if ($sebelumnya = self::barisSebelumnyaBelumTerkunci($baris)) {
            $alasan[] = sprintf(
                'Hari sebelumnya (%s) belum dikunci.',
                $sebelumnya->date->format('d M Y')
            );
        }

        return ['boleh' => empty($alasan), 'alasan' => $alasan];
    }

    /**
     * Baris ADA sebelumnya yang belum terkunci — bukan "tanggal kemarin persis".
     *
     * Dibaca begitu karena tidak setiap tanggal kalender punya baris: hari
     * libur memang tidak dibuatkan. Rantainya menyusuri baris yang ada.
     *
     * Efeknya disengaja: hari yang setoran atau pendataannya bolong otomatis
     * menahan rantai, jadi ketahuan besoknya — bukan berbulan-bulan kemudian.
     */
    public static function barisSebelumnyaBelumTerkunci(TransactionDailyClosing $baris): ?TransactionDailyClosing
    {
        $mulai = AgregasiScope::tanggalMulai($baris->loan_officer_grouping?->branch_id);

        return TransactionDailyClosing::where(
                'transaction_loan_officer_grouping_id',
                $baris->transaction_loan_officer_grouping_id
            )
            ->whereDate('date', '<', $baris->date)
            // Jangan menuntut hari-hari SEBELUM kantor migrasi ikut dikunci —
            // di zona itu alur lama yang berlaku.
            ->when($mulai, fn($q) => $q->whereDate('date', '>=', $mulai))
            ->whereNull('kasir_lock_at')
            ->orderByDesc('date')
            ->first();
    }

    /**
     * Kunci satu baris. Melempar kalau syaratnya belum terpenuhi.
     *
     * @throws \RuntimeException
     */
    public static function kunci(TransactionDailyClosing $baris, int $employeeId): TransactionDailyClosing
    {
        $cek = self::bolehKunci($baris);

        if (!$cek['boleh']) {
            throw new \RuntimeException(implode(' ', $cek['alasan']));
        }

        return DB::transaction(function () use ($baris, $employeeId) {
            // Dibaca SEBELUM dikunci: `tunai` generated, jadi kalau nanti kunci
            // dibuka dan inputnya berubah, angka ini tidak bisa direkonstruksi
            // dari mana pun.
            $tunai = (int) $baris->tunai;

            $baris->update([
                'kasir_lock_at' => now(),
                'kasir_lock_user' => $employeeId,
            ]);

            self::catat($baris, TransactionLockHistory::AKSI_KUNCI, $employeeId, $tunai, $tunai);

            return $baris->fresh();
        });
    }

    /**
     * Buka kunci. Butuh role berwenang DAN permission `can-edit` yang
     * dipasang-cabut superuser — role saja tidak cukup, karena `pusat` sendiri
     * ada 30 orang.
     *
     * @throws \RuntimeException
     */
    public static function buka(TransactionDailyClosing $baris, $user, string $alasan): TransactionDailyClosing
    {
        if (!$baris->terkunci()) {
            throw new \RuntimeException('Baris ini memang belum terkunci.');
        }

        if (trim($alasan) === '') {
            throw new \RuntimeException('Alasan membuka kunci wajib diisi.');
        }

        if (!self::bolehBuka($user)) {
            throw new \RuntimeException(
                'Butuh role stafkontrol/pusat/superuser DAN permission can-edit.'
            );
        }

        return DB::transaction(function () use ($baris, $user, $alasan) {
            $tunai = (int) $baris->tunai;

            $baris->update(['kasir_lock_at' => null, 'kasir_lock_user' => null]);

            self::catat(
                $baris,
                TransactionLockHistory::AKSI_BUKA,
                $user->employee->id,
                $tunai,
                null,
                $alasan
            );

            return $baris->fresh();
        });
    }

    public static function bolehBuka($user): bool
    {
        if (!$user || !$user->employee) {
            return false;
        }

        return $user->hasAnyRole(self::ROLE_PEMBUKA)
            && $user->hasPermissionTo('can-edit');
    }

    private static function catat(
        TransactionDailyClosing $baris,
        string $aksi,
        int $employeeId,
        ?int $tunaiSebelum,
        ?int $tunaiSesudah,
        ?string $alasan = null
    ): void {
        TransactionLockHistory::create([
            'transaction_daily_closing_id' => $baris->id,
            'transaction_loan_officer_grouping_id' => $baris->transaction_loan_officer_grouping_id,
            'tanggal' => $baris->date->toDateString(),
            'aksi' => $aksi,
            'user_id' => $employeeId,
            'tunai_sebelum' => $tunaiSebelum,
            'tunai_sesudah' => $tunaiSesudah,
            'alasan' => $alasan,
        ]);
    }
}
