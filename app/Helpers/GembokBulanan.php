<?php

namespace App\Helpers;

use App\Models\TransactionLockHistory;
use App\Models\TransactionMonthlyClosing;
use Illuminate\Support\Facades\DB;

/**
 * Kunci agregat BULANAN — pasangan Gembok (harian).
 *
 * KENAPA TERPISAH DARI Gembok
 * ---------------------------
 * Yang dikunci beda tabel dan beda syarat. Kunci harian bergantung pada
 * setoran mantri dan rantai hari sebelumnya; kunci bulanan bergantung pada
 * KELENGKAPAN — semua hari kerja bulan itu sudah terkunci. Menumpuknya jadi
 * satu kelas akan mencampur dua daftar syarat yang tak berhubungan.
 *
 * SYARAT KUNCI (semua wajib)
 * --------------------------
 *   1. Kepala sudah menyetujui baris bulanan ini (kepala_approval_at).
 *   2. `lengkap()` — setiap hari kerja bulan itu sudah terkunci
 *      (hari_terkunci >= hari_kerja). INILAH yang membuat "lupa tutup buku"
 *      mustahil lolos: bukan karena ada yang mengingatkan, tapi karena
 *      tombolnya tidak bisa ditekan.
 *   3. Kalau ini BULAN PERTAMA kantor (bulan migrasi), saldo awalnya sudah
 *      diserahterimakan (serah_terima_at). Mengunci bulan pertama di atas
 *      saldo awal yang belum diterima berarti membekukan angka yang alasnya
 *      belum diperiksa.
 *
 * Kunci bulanan hanya membubuhkan tanda tangan. Ia TIDAK menghitung ulang —
 * angkanya sudah disusun TutupBulanan tiap hari dikunci, dan TutupBulanan
 * melewati baris bulanan yang sudah terkunci, jadi tanda tangan itulah yang
 * membekukannya.
 *
 * Rancangan: .agents/agregasi_rekap.md §11.
 */
class GembokBulanan
{
    /** Sama dengan Gembok harian: role saja tak cukup, `pusat` ada 30 orang. */
    public const ROLE_PEMBUKA = ['stafkontrol', 'pusat', 'superuser'];

    /**
     * @return array{boleh:bool, alasan:array<int,string>}
     */
    public static function bolehKunci(TransactionMonthlyClosing $baris): array
    {
        $alasan = [];

        if ($baris->terkunci()) {
            $alasan[] = 'Baris bulanan ini sudah terkunci.';
        }

        if ($baris->kepala_approval_at === null) {
            $alasan[] = 'Kepala belum menyetujui closing bulan ini.';
        }

        if (!$baris->lengkap()) {
            $alasan[] = sprintf(
                'Belum semua hari kerja terkunci (%d dari %d).',
                (int) $baris->hari_terkunci,
                (int) $baris->hari_kerja
            );
        }

        if (self::bulanPertamaBelumSerahTerima($baris)) {
            $alasan[] = 'Saldo awal bulan pertama belum diserahterimakan.';
        }

        return ['boleh' => empty($alasan), 'alasan' => $alasan];
    }

    /**
     * Bulan ini bulan migrasi kantor, TAPI saldo awalnya belum diterima?
     *
     * Hanya berlaku untuk bulan pertama. Bulan-bulan sesudahnya saldo awalnya
     * lahir dari bulan sebelumnya di sistem yang sama — tidak ada yang perlu
     * diserahterimakan, jadi syarat ini tidak menahannya.
     */
    private static function bulanPertamaBelumSerahTerima(TransactionMonthlyClosing $baris): bool
    {
        $branchId = DB::table('transaction_loan_officer_groupings')
            ->where('id', $baris->transaction_loan_officer_grouping_id)
            ->value('branch_id');

        $mulai = AgregasiScope::tanggalMulai($branchId);

        if (!$mulai) {
            return false;
        }

        $bulanIni = \Carbon\Carbon::parse($baris->periode)->startOfMonth();
        $bulanMigrasi = $mulai->copy()->startOfMonth();

        return $bulanIni->equalTo($bulanMigrasi) && !$baris->sudahDiserahTerimakan();
    }

    /**
     * @throws \RuntimeException
     */
    public static function kunci(TransactionMonthlyClosing $baris, int $employeeId): TransactionMonthlyClosing
    {
        $cek = self::bolehKunci($baris);

        if (!$cek['boleh']) {
            throw new \RuntimeException(implode(' ', $cek['alasan']));
        }

        return DB::transaction(function () use ($baris, $employeeId) {
            $baris->update([
                'kasir_lock_at' => now(),
                'kasir_lock_user' => $employeeId,
            ]);

            self::catat($baris, TransactionLockHistory::AKSI_KUNCI, $employeeId);

            return $baris->fresh();
        });
    }

    /**
     * Buka kunci bulanan. Butuh role berwenang DAN permission `can-edit` —
     * sama dengan buka kunci harian.
     *
     * @throws \RuntimeException
     */
    public static function buka(TransactionMonthlyClosing $baris, $user, string $alasan): TransactionMonthlyClosing
    {
        if (!$baris->terkunci()) {
            throw new \RuntimeException('Baris bulanan ini memang belum terkunci.');
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
            $baris->update(['kasir_lock_at' => null, 'kasir_lock_user' => null]);

            self::catat(
                $baris,
                TransactionLockHistory::AKSI_BUKA,
                $user->employee->id,
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

    /**
     * Jejak ke transaction_lock_histories, memakai kolom
     * transaction_monthly_closing_id. Tidak ada tunai_sebelum/sesudah — itu
     * konsep harian; kunci bulanan cuma tanda tangan.
     */
    private static function catat(
        TransactionMonthlyClosing $baris,
        string $aksi,
        int $employeeId,
        ?string $alasan = null
    ): void {
        TransactionLockHistory::create([
            'transaction_monthly_closing_id' => $baris->id,
            'transaction_loan_officer_grouping_id' => $baris->transaction_loan_officer_grouping_id,
            'tanggal' => \Carbon\Carbon::parse($baris->periode)->toDateString(),
            'aksi' => $aksi,
            'user_id' => $employeeId,
            'user_pemberi_izin' => $aksi === TransactionLockHistory::AKSI_BUKA
                ? (auth()->user()?->employee?->id)
                : null,
            'tunai_sebelum' => null,
            'tunai_sesudah' => null,
            'alasan' => $alasan,
        ]);
    }
}
