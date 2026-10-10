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

        // Setoran kosong dianggap 0 (keputusan mas 2026-10-09) - bukan lagi
        // syarat kunci.

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
            // Baris di tanggal yang (belakangan) ditandai libur tidak ikut
            // rantai: di hari libur tidak boleh ada transaksi, jadi tidak ada
            // yang perlu dikunci - tanpa ini satu baris libur menyandera
            // semua hari sesudahnya.
            ->whereNotIn('date', \App\Models\WorkDay::where('is_libur', true)
                ->whereDate('date', '<', $baris->date)->select('date'))
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
     * Buka kunci. Hanya superuser, atau user yang diberi permission
     * `can-edit` oleh superuser (keputusan mas 2026-10-08: role pusat /
     * stafkontrol tidak lagi menentukan).
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
                'Buka kunci hanya untuk superuser atau user ber-izin can-edit.'
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

    /**
     * Koreksi oleh user can-edit / superuser di tanggal yang sudah dikunci:
     * kunci tanggal itu dibuka OTOMATIS sebelum perubahan ditulis (mas
     * 2026-10-10), tercatat di riwayat gembok dengan alasannya. Dikunci lagi
     * satu per satu lewat Rekap 1. User lain tidak dibukakan - trigger DB
     * tetap menolak. Tanggal sebelum migrasi tidak punya baris harian, jadi
     * tetap beku.
     *
     * Dipanggil dari event model angsuran & pinjaman, jadi semua jalur tulis
     * ikut. Berjalan di transaksi pemanggil: tulisnya gagal -> bukanya batal.
     */
    public static function bukaOtomatis($groupingId, $tanggal, string $alasan): void
    {
        $user = auth()->user();
        if (!$groupingId || !$tanggal || !self::bolehBuka($user)) {
            return;
        }

        $baris = TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $groupingId)
            ->whereDate('date', \Carbon\Carbon::parse($tanggal)->toDateString())
            ->whereNotNull('kasir_lock_at')
            ->first();

        if ($baris) {
            self::buka($baris, $user, 'Dibuka otomatis: ' . $alasan);
        }
    }

    public static function bolehBuka($user): bool
    {
        if (!$user || !$user->employee) {
            return false;
        }

        return $user->hasRole('superuser') || $user->hasPermissionTo('can-edit');
    }

    /**
     * Kunci borongan saat migrasi: semua baris harian kelompok-kelompok ini
     * s/d $sampai yang belum terkunci diberi cek kepala + kunci kasir atas nama
     * $employeeId, masing-masing dengan jejak.
     *
     * Syarat bolehKunci() SENGAJA dilewati: hari-hari ini sudah ditutup di alur
     * lama dan dicocokkan dengan buku sebelum migrasi; angkanya baru saja
     * dihitung ulang dari sumber oleh DaftarMigrasi.
     *
     * @return int jumlah baris yang dikunci
     */
    public static function kunciMigrasi(array $groupingIds, $dari, $sampai, int $employeeId): int
    {
        $baris = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereBetween('date', [
                \Carbon\Carbon::parse($dari)->toDateString(),
                \Carbon\Carbon::parse($sampai)->toDateString(),
            ])
            ->whereNull('kasir_lock_at')
            ->get();

        $alasan = 'Kunci otomatis saat migrasi s/d ' . \Carbon\Carbon::parse($sampai)->toDateString();

        foreach ($baris as $b) {
            $tunai = (int) $b->tunai;

            $b->update([
                'kepala_approval_at' => $b->kepala_approval_at ?? now(),
                'kepala_approval_user' => $b->kepala_approval_user ?? $employeeId,
                'kasir_lock_at' => now(),
                'kasir_lock_user' => $employeeId,
            ]);

            self::catat($b, TransactionLockHistory::AKSI_KUNCI, $employeeId, $tunai, $tunai, $alasan);
        }

        return $baris->count();
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
