<?php

namespace App\Helpers;

use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\WorkDay;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Mendaftarkan kantor ke alur agregasi baru — dipicu oleh TUTUP BUKU.
 *
 * KENAPA TUTUP BUKU YANG JADI PEMICU
 * ----------------------------------
 * Menutup buku bulan sebelumnya adalah bukti paling jujur bahwa kantor itu
 * siap: dia sudah menyelesaikan pembukuan lamanya sampai tuntas. Kantor yang
 * belum menutup buku tidak akan punya saldo awal yang bisa dipakai, jadi
 * memindahkannya cuma memindahkan kekosongan.
 *
 * Itu juga sebabnya `transaction_sirculations` bisa dipakai sebagai penanda:
 * barisnya HANYA lahir kalau ada yang benar-benar menutup buku.
 *
 * KENAPA MASIH BUTUH SETELAN BULAN MIGRASI
 * ----------------------------------------
 * Tutup buku itu kegiatan bulanan biasa. Tanpa penentu, kantor yang menutup
 * buku bulan depan pun ikut terdaftar — padahal belum ada yang memutuskan
 * bahwa migrasinya dimulai. `config('agregasi.bulan_migrasi')` yang menentukan
 * sejak kapan tutup buku berlaku sebagai pendaftaran.
 *
 * Lihat .agents/agregasi_rekap.md §13.
 */
class DaftarMigrasi
{
    /** Bulan migrasi global, atau null kalau belum ditetapkan. */
    public static function bulanMigrasi(): ?Carbon
    {
        $nilai = config('agregasi.bulan_migrasi');

        if (!$nilai) {
            return null;
        }

        try {
            return Carbon::createFromFormat('Y-m', $nilai)->startOfMonth();
        } catch (\Throwable $e) {
            Log::warning('agregasi.bulan_migrasi tidak bisa dibaca: ' . $nilai);
            return null;
        }
    }

    /**
     * Dipanggil setelah sebuah kantor menutup buku dan melahirkan baris
     * sirkulasi untuk `$periodeBaru`.
     *
     * Aman dipanggil berkali-kali: tutup buku satu kantor memanggilnya sampai
     * 60 kali (10 kelompok x 6 hari), tapi pekerjaan beratnya hanya jalan
     * sekali — sesudah itu `mulai_pendataan_baru` sudah terisi dan langsung
     * keluar.
     *
     * @return bool true kalau kantor ini BARU SAJA didaftarkan
     */
    public static function cobaDaftarkan(int $branchId, $periodeBaru): bool
    {
        $bulanMigrasi = self::bulanMigrasi();

        if (!$bulanMigrasi) {
            return false;
        }

        $periode = Carbon::parse($periodeBaru)->startOfMonth();

        // Tutup buku untuk bulan SEBELUM bulan migrasi berjalan seperti biasa.
        if ($periode->lt($bulanMigrasi)) {
            return false;
        }

        $branch = Branch::find($branchId);

        if (!$branch || $branch->mulai_pendataan_baru) {
            return false;
        }

        DB::transaction(function () use ($branch, $periode) {
            DB::table('branches')->where('id', $branch->id)
                ->update(['mulai_pendataan_baru' => $periode->toDateString()]);

            self::siapkanBaris($branch->id, $periode);
        });

        AgregasiScope::lupakanCache();

        Log::info('Kantor terdaftar ke alur agregasi baru', [
            'branch_id' => $branch->id,
            'unit' => $branch->unit,
            'mulai' => $periode->toDateString(),
        ]);

        return true;
    }

    /**
     * Bangkitkan baris harian sebulan penuh, lalu hitung angka turunan untuk
     * hari-hari yang SUDAH LEWAT.
     *
     * Kenapa hari yang sudah lewat ikut dihitung: kantor bisa saja baru menutup
     * buku tanggal 21, padahal transaksinya sudah berjalan sejak tanggal 1.
     * Tanpa ini, dua puluh hari pertama akan nol padahal sumbernya ada.
     *
     * Hari yang belum lewat tetap dibuat tapi dibiarkan nol — barisnya ada
     * supaya rantai penguncian bisa mendeteksi hari yang terlewat nanti.
     */
    private static function siapkanBaris(int $branchId, Carbon $periode): void
    {
        $groupings = TransactionLoanOfficerGrouping::where('branch_id', $branchId)->get();

        if ($groupings->isEmpty()) {
            return;
        }

        foreach (WorkDay::hariKerjaBulan($periode) as $tanggal) {
            foreach ($groupings as $g) {
                TransactionDailyClosing::firstOrCreate([
                    'transaction_loan_officer_grouping_id' => $g->id,
                    'date' => $tanggal->toDateString(),
                ]);
            }
        }

        $ids = $groupings->pluck('id')->all();
        $sampai = Carbon::now()->startOfDay();
        $akhirBulan = $periode->copy()->endOfMonth();

        if ($sampai->gt($akhirBulan)) {
            $sampai = $akhirBulan;
        }

        if ($sampai->lt($periode)) {
            return; // bulan migrasinya masih di depan, belum ada yang lewat
        }

        foreach (HitungAgregat::harianBanyak($ids, $periode, $sampai) as $kunci => $angka) {
            [$g, $tgl] = explode('|', $kunci);

            TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $g)
                ->whereDate('date', $tgl)
                ->whereNull('kasir_lock_at')
                ->update($angka);
        }
    }

    /**
     * Ringkasan kemajuan migrasi seluruh kantor — bahan menu pemantau.
     *
     * @return array<string,mixed>
     */
    public static function kemajuan(): array
    {
        $bulan = self::bulanMigrasi();

        $branches = Branch::orderBy('unit')->get(['id', 'unit', 'wilayah', 'mulai_pendataan_baru']);

        $sudah = $branches->whereNotNull('mulai_pendataan_baru');

        return [
            'bulan_migrasi' => $bulan?->format('Y-m'),
            'total' => $branches->count(),
            'sudah' => $sudah->count(),
            'belum' => $branches->count() - $sudah->count(),
            'branches' => $branches,
        ];
    }
}
