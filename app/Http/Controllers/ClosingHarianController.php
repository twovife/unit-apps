<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Helpers\Gembok;
use App\Helpers\HitungAgregat;
use App\Helpers\TutupBulanan;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Kunci & buka kunci harian alur agregasi baru. Layarnya sudah tidak ada
 * (dicabut 2026-10-09): Ceklist Kepala dari Buku Transaksi -> ACC KM, kunci
 * kasir dari Kasir -> Rekap (Cek Tunai Mantri, lewat
 * TransactionDailyRecapController::rekap_post). Controller ini tinggal
 * menyimpan logika kunci/buka (route closing.buka).
 *
 * Urutannya: hari sebelumnya harus sudah terkunci. Ceklist Kepala yang belum
 * ada dijalankan otomatis saat kunci (ditandai acc_auto).
 *
 * Lihat .agents/agregasi_rekap.md §4.
 */
class ClosingHarianController extends Controller
{
    public function kunci(TransactionDailyClosing $closing)
    {
        if (!AppHelper::bolehAksesKelompok($closing->loan_officer_grouping)) {
            abort(403, AppHelper::PESAN_BUKAN_WILAYAH);
        }
        $this->pastikanBerwenang();

        $kasir = auth()->user()->employee->id;
        $gagal = 0;
        $accOtomatis = false;
        $disambung = false;

        try {
            DB::transaction(function () use ($closing, $kasir, &$gagal, &$accOtomatis, &$disambung) {
                // Drop hari ini yang masih menggantung digagalkan sebelum
                // dikunci: sesudah kunci statusnya tidak bisa diubah lagi.
                // Pengajuan (drop minggu depan) TIDAK disentuh - masih bisa
                // di-ACC / tolak sesudah kunci (keputusan mas 2026-10-10).
                $gagal = self::gagalkanDropGantung($closing, $kasir);

                // Belum dicek KM -> ACC KM otomatis (target minggu depan ikut
                // terbentuk), ditandai kuning di layar (CeklistKepala::otomatis).
                $closing->refresh();
                if (!$closing->kepala_approval_at) {
                    \App\Helpers\CeklistKepala::otomatis($closing, $kasir);
                    $accOtomatis = true;
                }

                // Hitung ulang sekali lagi tepat sebelum dibekukan: transaksi
                // bisa masuk antara Ceklist Kepala dan kunci kasir, dan yang
                // dibekukan harus angka sebenarnya.
                $this->hitungUlangTurunan($closing);

                // Target minggu depan ditulis saat ACC KM; drop / keluar bisa berubah
                // sesudahnya (Malang 4, 2 Nov: drop sukses sesudah ACC -> masuk tidak
                // ikut). Saat dibekukan, sambung ulang rantainya kalau sudah tidak cocok.
                $disambung = self::sambungTargetDepan($closing, $kasir);

                // Setoran yang belum diisi kasir dibekukan dengan angka bawaan
                // dari angsuran hari itu (cash / transfer / katrol) - angka yang
                // sama dengan yang tampil di Rekap 1.
                $bawaan = HitungAgregat::stortingCaraBayar($closing->transaction_loan_officer_grouping_id, $closing->date);
                $closing->refresh();
                $closing->update(array_filter([
                    'setoran_tunai' => $closing->setoran_tunai === null ? $bawaan['tunai'] : null,
                    'setoran_transfer' => $closing->setoran_transfer === null ? $bawaan['transfer'] : null,
                    'setoran_katrol' => $closing->setoran_katrol === null ? $bawaan['katrol'] : null,
                ], fn($v) => $v !== null));
                $closing->refresh();

                Gembok::kunci($closing, $kasir);
            });
        } catch (\Throwable $e) {
            return back()->withErrors(AppHelper::pesanGagal($e, $e->getMessage()));
        }

        $this->susunBulanan($closing);

        $catatan = array_filter([
            $gagal ? $gagal . ' drop hari ini digagalkan' : null,
            $accOtomatis ? 'ACC KM otomatis (belum dicek KM)' : null,
            $disambung ? 'target minggu depan dihitung ulang dari drop & keluar terbaru' : null,
        ]);

        return back()->with('message', 'Terkunci.' . ($catatan ? ' Otomatis: ' . implode(', ', $catatan) . '.' : ''));
    }

    /**
     * Target D+7 != target D + masuk(drop D) - keluar D -> sambung ulang rantai dari D
     * (KoreksiTarget, menjalar ke depan, tercatat di riwayat). Diam kalau D+7 dikoreksi
     * tangan / recount, sudah dikunci, belum ada, atau sudah cocok.
     */
    public static function sambungTargetDepan(TransactionDailyClosing $closing, int $employeeId): bool
    {
        $g = $closing->transaction_loan_officer_grouping_id;
        $tgl = Carbon::parse($closing->date)->toDateString();
        $tglDepan = \App\Helpers\TargetMingguan::tanggalDepan($tgl);
        $depan = $tglDepan ? TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $g)->whereDate('date', $tglDepan)->first() : null;
        if (!$depan || $depan->kasir_lock_at || in_array($depan->target_source, \App\Helpers\TargetMingguan::SUMBER_PUTUS, true)) {
            return false;
        }
        $harus = \App\Helpers\TargetMingguan::hitung((int) $closing->target, (int) (HitungAgregat::harian($g, $tgl)['drop'] ?? 0), (int) $closing->keluar);
        if ((int) $depan->target === $harus) {
            return false;
        }
        try {
            \App\Helpers\KoreksiTarget::simpan($g, $tgl, null, null, 'Disambung ulang saat kunci kasir (drop / keluar berubah sesudah ACC KM).', $employeeId);
        } catch (\RuntimeException $e) {
            return false; // beku / belum ada baris: kunci tetap jalan
        }

        return true;
    }

    /**
     * Drop bertanggal hari kunci yang belum sukses (open / acc) -> gagal, untuk
     * kelompok ini. Dicatat atas nama kasir yang mengunci (user_check /
     * check_date). Pengajuan yang diajukan hari itu tidak disentuh.
     */
    public static function dropGantung(TransactionDailyClosing $closing)
    {
        return TransactionLoan::where('transaction_loan_officer_grouping_id', $closing->transaction_loan_officer_grouping_id)
            ->whereDate('drop_date', Carbon::parse($closing->date)->toDateString())
            ->whereIn('status', ['open', 'acc'])
            ->get();
    }

    public static function gagalkanDropGantung(TransactionDailyClosing $closing, int $kasir): int
    {
        $gantung = self::dropGantung($closing);
        // Per model, bukan update massal: hook TransactionLoan ikut jalan.
        $gantung->each->update(['status' => 'gagal', 'user_check' => $kasir, 'check_date' => now()->toDateString()]);

        return $gantung->count();
    }

    public function buka(Request $request, TransactionDailyClosing $closing)
    {
        if (!AppHelper::bolehAksesKelompok($closing->loan_officer_grouping)) {
            abort(403, AppHelper::PESAN_BUKAN_WILAYAH);
        }
        $request->validate(['alasan' => ['required', 'string', 'min:5']], [
            'alasan.required' => 'Alasan membuka kunci wajib diisi.',
            'alasan.min' => 'Alasan terlalu pendek — tulis yang bisa dipahami orang lain nanti.',
        ]);

        try {
            Gembok::buka($closing, auth()->user(), $request->alasan);
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        // Bulanannya ikut disusun ulang: jumlah hari terkunci berubah, dan
        // syarat tanda tangan bulanan bergantung pada angka itu.
        $this->susunBulanan($closing);

        return back()->with('message', 'Kunci dibuka dan tercatat.');
    }

    /**
     * Hitung ulang kolom turunan satu baris dari tabel SUMBER.
     *
     * Kolom manual (kasbon, transport, keluar, setoran_tunai/transfer) tidak disentuh —
     * itu isian manusia, bukan turunan.
     */
    private function hitungUlangTurunan(TransactionDailyClosing $closing): void
    {
        $angka = HitungAgregat::harian(
            $closing->transaction_loan_officer_grouping_id,
            $closing->date
        );

        $closing->update($angka);
    }

    /**
     * Susun ulang baris bulanan yang memuat tanggal ini.
     *
     * Dipanggil saat kunci dan saat buka kunci — bukan lewat penjadwal.
     * Menggantungkannya ke penjadwal berarti mengulang penyakit yang sedang
     * diobati: sesuatu yang harus dijalankan seseorang, dan kalau terlewat
     * tidak ada yang tahu. Disambungkan ke aksi, dia tidak bisa terlewat.
     *
     * Aksinya HITUNG ULANG TOTAL, bukan penambahan — lihat TutupBulanan.
     */
    private function susunBulanan(TransactionDailyClosing $closing): void
    {
        $groupingId = $closing->transaction_loan_officer_grouping_id;
        $periode = $closing->date->copy()->startOfMonth();

        // Segarkan dulu hari-hari yang BELUM terkunci di bulan ini.
        //
        // Baris bulanan menjumlahkan SEMUA hari, bukan hanya yang terkunci -
        // kalau disaring, hari yang terlewat hilang diam-diam (§4.5). Tapi hari
        // yang belum terkunci angkanya bisa sudah basi, karena yang menyimpan
        // hanya aksi kunci. Menyegarkannya lebih dulu membuat jumlah bulanan
        // mencerminkan keadaan sebenarnya, bukan campuran angka final dan
        // angka sisa.
        //
        // Hari yang SUDAH terkunci tidak disentuh: itu angka yang sudah
        // ditandatangani, dan sumbernya pun dibekukan trigger.
        //
        // Menjalar ke depan sampai bulan berjalan: koreksi hari lampau (buka →
        // betulkan → kunci) menggeser saldo akhir bulan itu, jadi saldo awal
        // setiap bulan sesudahnya ikut berubah - termasuk yang sudah diteken,
        // yang ditulis ulang dengan jejak 'perbarui' (keputusan mas 2026-10-06).
        $perbarui = [
            'employee_id' => auth()->user()->employee->id,
            'sumber' => sprintf('koreksi %s kelompok %s',
                $closing->date->locale('id')->isoFormat('D MMM Y'),
                $closing->loan_officer_grouping?->kelompok),
        ];

        // Sampai BULAN DEPAN: tiap tutup harian menghitung ulang bulan ini dan
        // saldo awal bulan depan (= akhir bulan ini), jadi saldo awal bulan
        // depan sudah ada sejak sekarang dan ikut bergerak tiap kunci
        // (mas 2026-10-10). Tidak dihitung saat layar dibuka.
        $sampai = Carbon::now()->startOfMonth()->addMonthNoOverflow();
        for ($bulan = $periode->copy(); $bulan->lte($sampai); $bulan->addMonthNoOverflow()) {
            $this->segarkanHariBelumTerkunci($groupingId, $bulan);
            TutupBulanan::susun([$groupingId], $bulan, true, $perbarui);
        }
    }

    /**
     * Hitung ulang kolom turunan seluruh hari BELUM TERKUNCI dalam satu bulan.
     */
    private function segarkanHariBelumTerkunci(int $groupingId, Carbon $periode): void
    {
        $angka = HitungAgregat::harianBanyak(
            [$groupingId],
            $periode,
            $periode->copy()->endOfMonth()
        );

        foreach ($angka as $kunci => $nilai) {
            [$g, $tgl] = explode('|', $kunci);

            TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $g)
                ->whereDate('date', $tgl)
                ->whereNull('kasir_lock_at')
                ->update($nilai);
        }
    }

    private function pastikanBerwenang(): void
    {
        if (!auth()->user()->hasPermissionTo('can-approve')) {
            abort(403, 'Layar ini untuk kepala mantri, kasir, dan pimpinan.');
        }
    }
}
