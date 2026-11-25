<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionLockHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Ceklist Kepala (ACC KM) alur baru - satu sumber untuk ACC KM manual
 * (TransactionLoanController::ceklist_kepala_baru) dan ACC otomatis saat
 * kasir mengunci hari yang belum dicek KM (ClosingHarianController::kunci).
 *
 * Tidak membuka transaksi sendiri: pemanggil yang membungkusnya, supaya
 * kegagalan di sini ikut membatalkan langkah lain di transaksi yang sama.
 */
class CeklistKepala
{
    /**
     * Tandai hari D sudah dicek KM, simpan keluar, dan tulis target minggu
     * depan (target D + 13% drop D - keluar) - kecuali target minggu depan
     * sudah dikoreksi / di-recount (awal rantai baru, tidak ditimpa).
     *
     * @return bool  true = target minggu depan sudah dikoreksi, tidak diubah
     *
     * @throws \RuntimeException  baris minggu depan sudah dikunci
     */
    public static function simpan(TransactionDailyClosing $closing, int $keluar, int $employeeId, $waktu = null): bool
    {
        $groupingId = $closing->transaction_loan_officer_grouping_id;
        $date = Carbon::parse($closing->date)->toDateString();

        // Drop hari D satu sumber (bukan kolom tersimpan yang bisa basi).
        $drop = (int) (HitungAgregat::harian($groupingId, $date)['drop'] ?? 0);

        $closing->update([
            'keluar' => $keluar,
            'kepala_approval_at' => $waktu ?? now(),
            'kepala_approval_user' => $employeeId,
        ]);

        // D+7 libur -> hari tagih kerja berikutnya.
        $tanggalDepan = TargetMingguan::tanggalDepan($date);
        if (!$tanggalDepan) {
            return false;
        }

        $depan = TransactionDailyClosing::firstOrCreate([
            'transaction_loan_officer_grouping_id' => $groupingId,
            'date' => $tanggalDepan,
        ]);
        if ($depan->kasir_lock_at) {
            throw new \RuntimeException('Target minggu depan (' . Carbon::parse($tanggalDepan)->locale('id')->isoFormat('D MMMM Y')
                . ') sudah dikunci; Ceklist Kepala tidak disimpan.');
        }

        if (in_array($depan->target_source, TargetMingguan::SUMBER_PUTUS, true)) {
            return true;
        }

        $depan->update([
            'target' => TargetMingguan::hitung((int) $closing->target, $drop, $keluar),
            'target_on' => $date,
            'target_source' => 'manual',
        ]);

        return false;
    }

    /**
     * ACC KM otomatis saat kunci kasir (hari belum dicek KM). Dicatat di
     * riwayat gembok (aksi acc_auto); kepala_approval_at disamakan PERSIS
     * dengan waktu catatan itu - begitu KM mengecek ulang (sesudah kunci
     * dibuka), waktunya berubah dan tanda otomatisnya hilang sendiri.
     */
    public static function otomatis(TransactionDailyClosing $closing, int $employeeId): bool
    {
        $catatan = TransactionLockHistory::create([
            'transaction_daily_closing_id' => $closing->id,
            'transaction_loan_officer_grouping_id' => $closing->transaction_loan_officer_grouping_id,
            'tanggal' => Carbon::parse($closing->date)->toDateString(),
            'aksi' => TransactionLockHistory::AKSI_ACC_OTOMATIS,
            'user_id' => $employeeId,
            'alasan' => 'ACC KM otomatis saat kunci kasir (belum dicek KM).',
        ]);

        return self::simpan($closing, (int) $closing->keluar, $employeeId, $catatan->created_at);
    }

    /**
     * Kunci "kelompok|Y-m-d" yang ACC KM-nya otomatis (belum dicek KM tapi
     * sudah dikunci) - dipakai tampilan untuk mewarnai kuning.
     *
     * @return array<string,true>
     */
    public static function daftarOtomatis(iterable $groupingIds, $dari, $sampai): array
    {
        return DB::table('transaction_daily_closings as c')
            ->join('transaction_lock_histories as h', function ($j) {
                $j->on('h.transaction_daily_closing_id', '=', 'c.id')
                    ->where('h.aksi', TransactionLockHistory::AKSI_ACC_OTOMATIS)
                    ->whereColumn('h.created_at', 'c.kepala_approval_at');
            })
            ->whereIn('c.transaction_loan_officer_grouping_id', collect($groupingIds)->all())
            ->whereBetween('c.date', [Carbon::parse($dari)->toDateString(), Carbon::parse($sampai)->toDateString()])
            ->get(['c.transaction_loan_officer_grouping_id as g', 'c.date as d'])
            ->mapWithKeys(fn($r) => [$r->g . '|' . Carbon::parse($r->d)->toDateString() => true])
            ->all();
    }
}
