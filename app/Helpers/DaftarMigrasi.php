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
     * Daftarkan satu kantor ke alur agregasi baru mulai $periode (tanggal 1).
     *
     * Dipicu MANUAL dari layar Kesiapan Migrasi (superuser) sesudah bucket
     * dicek - pendaftaran otomatis saat tutup buku dicabut 2026-10-04.
     *
     * Satu transaksi:
     * 1. isi mulai_pendataan_baru;
     * 2. bangkitkan & hitung baris harian SETIAP bulan dari $periode s/d bulan
     *    berjalan (migrasi bisa dilakukan sebulan sesudahnya);
     * 3. kunci otomatis s/d $kunciSampai (opsional) - hari sesudahnya dikunci
     *    manual per tanggal lewat Closing Harian;
     * 4. susun baris bulanan tiap bulan itu (saldo awal rekap).
     *
     * @return bool false kalau kantor tidak ada atau sudah terdaftar
     */
    public static function daftarkan(int $branchId, $periodeMulai, $kunciSampai = null, ?int $employeeId = null): bool
    {
        $periode = Carbon::parse($periodeMulai)->startOfMonth();
        $branch = Branch::find($branchId);

        if (!$branch || $branch->mulai_pendataan_baru) {
            return false;
        }

        if ($kunciSampai && !$employeeId) {
            throw new \RuntimeException('Kunci otomatis butuh akun yang terhubung ke data karyawan.');
        }

        $bulan = [];
        for ($b = $periode->copy(); $b->lte(Carbon::now()->startOfMonth()) || empty($bulan); $b->addMonthNoOverflow()) {
            $bulan[] = $b->copy();
        }

        $kunci = 0;

        DB::transaction(function () use ($branch, $periode, $bulan, $kunciSampai, $employeeId, &$kunci) {
            DB::table('branches')->where('id', $branch->id)
                ->update(['mulai_pendataan_baru' => $periode->toDateString()]);
            AgregasiScope::lupakanCache();

            foreach ($bulan as $b) {
                self::siapkanBaris($branch->id, $b);
            }

            $ids = TransactionLoanOfficerGrouping::where('branch_id', $branch->id)->pluck('id')->all();

            if ($kunciSampai) {
                $kunci = Gembok::kunciMigrasi($ids, $periode, $kunciSampai, $employeeId);
            }

            foreach ($bulan as $b) {
                TutupBulanan::susun($ids, $b);
            }
        });

        AgregasiScope::lupakanCache();

        Log::info('Kantor didaftarkan ke alur agregasi baru (manual)', [
            'branch_id' => $branch->id,
            'unit' => $branch->unit,
            'mulai' => $periode->toDateString(),
            'kunci_sampai' => $kunciSampai ? Carbon::parse($kunciSampai)->toDateString() : null,
            'baris_dikunci' => $kunci,
            'oleh' => auth()->id(),
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

        self::bawaKolomManual($branchId, $periode);
    }

    /**
     * Bawa kolom MANUAL dari daily_recaps lama ke daily_closings bulan migrasi.
     *
     * kasbon/transport/keluar/target itu DIKETIK manusia — tak bisa dihitung
     * ulang dari sumber seperti drop/storting/ember. Kalau tidak ikut dibawa saat
     * kantor pindah tabel, data yang sudah diinput kasir/kepala di bulan migrasi
     * HILANG (dan `tunai` yang generated dari kasbon/transport jadi salah). Hanya
     * menyentuh baris yang BELUM terkunci; baris terkunci dilewati (trigger DB
     * juga menolaknya). Idempoten — menyalin ulang nilai yang sama.
     *
     * @return int jumlah baris daily_closings yang terisi
     */
    public static function bawaKolomManual(int $branchId, $periode): int
    {
        $periode = Carbon::parse($periode)->startOfMonth();
        $ids = TransactionLoanOfficerGrouping::where('branch_id', $branchId)->pluck('id')->all();

        if (empty($ids)) {
            return 0;
        }

        $recaps = DB::table('transaction_daily_recaps')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('date', [$periode->toDateString(), $periode->copy()->endOfMonth()->toDateString()])
            ->get(['transaction_loan_officer_grouping_id', 'date', 'kasbon', 'transport', 'keluar', 'target', 'target_on']);

        $terbawa = 0;

        foreach ($recaps as $r) {
            $terbawa += TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $r->transaction_loan_officer_grouping_id)
                ->whereDate('date', Carbon::parse($r->date)->toDateString())
                ->whereNull('kasir_lock_at')
                ->update([
                    'kasbon' => (int) ($r->kasbon ?? 0),
                    'transport' => (int) ($r->transport ?? 0),
                    'keluar' => (int) ($r->keluar ?? 0),
                    'target' => (int) ($r->target ?? 0),
                    'target_on' => $r->target_on,
                ]);
        }

        return $terbawa;
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
