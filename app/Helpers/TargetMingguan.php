<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use Carbon\Carbon;

// Rantai target minggu depan tetap jalan walau KM tidak cek (kantor membelot).
// Untuk tiap hari tagih D yang sudah LEWAT dan belum dicek KM
// (kepala_approval_at NULL), lahirkan target minggu depan (D+7):
//   target(D+7) = target(D) + drop(D) * 0,13         (keluar = 0, tak ada saat auto)
// ditandai target_source='auto', target_on=D. Status "belum dicek" tetap
// (approval D NULL) -> KM WAJIB cek; saat KM cek belakangan, nilai auto ditimpa
// 'manual' dengan keluar sebenarnya.
//
// Idempotent: skip kalau D+7 sudah lahir dari D (target_on=D) atau sudah 'manual'.
// drop(D) dihitung SATU SUMBER lewat HitungAgregat::harian (bukan kolom tersimpan
// yang bisa basi). $weekday (Carbon dayOfWeek 0-6) opsional: batasi ke 1 buku
// (dipakai tombol manual superuser untuk kelompok+hari+kantor tertentu).
class TargetMingguan
{
    public static function materialisasiAuto(int $groupingId, ?int $weekday = null, ?Carbon $sampai = null): int
    {
        $batas = ($sampai ?? Carbon::today())->toDateString();

        $query = TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $groupingId)
            ->whereNull('kepala_approval_at')
            ->whereDate('date', '<', $batas)
            ->orderBy('date');

        if ($weekday !== null) {
            // MySQL DAYOFWEEK: 1=Minggu..7=Sabtu; Carbon dayOfWeek: 0=Minggu..6=Sabtu.
            $query->whereRaw('DAYOFWEEK(date) = ?', [$weekday + 1]);
        }

        $jumlah = 0;

        foreach ($query->get() as $hariD) {
            $tanggalD = Carbon::parse($hariD->date)->toDateString();
            $tanggalDepan = Carbon::parse($hariD->date)->addDays(7)->toDateString();

            $barisDepan = TransactionDailyClosing::firstOrCreate([
                'transaction_loan_officer_grouping_id' => $groupingId,
                'date' => $tanggalDepan,
            ]);

            $targetOnDepan = $barisDepan->target_on
                ? Carbon::parse($barisDepan->target_on)->toDateString()
                : null;

            // Sudah lahir dari D (carried migrasi / run sebelumnya) atau sudah
            // diverifikasi manusia -> hormati, jangan sentuh.
            if ($targetOnDepan === $tanggalD || $barisDepan->target_source === 'manual') {
                continue;
            }

            $drop = (int) (HitungAgregat::harian($groupingId, $tanggalD)['drop'] ?? 0);
            $target = (int) $hariD->target + (int) round($drop * 0.13); // keluar = 0 saat auto

            $barisDepan->update([
                'target' => $target,
                'target_on' => $tanggalD,
                'target_source' => 'auto',
            ]);

            $jumlah++;
        }

        return $jumlah;
    }
}
