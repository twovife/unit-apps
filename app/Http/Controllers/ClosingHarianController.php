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
 * Urutannya ditegakkan lewat syarat: Ceklist Kepala dulu, setoran mantri
 * dicatat, baru kasir mengunci - dan hari sebelumnya harus sudah terkunci.
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
        $diselesaikan = ['tolak' => 0, 'gagal' => 0];

        try {
            DB::transaction(function () use ($closing, $kasir, &$diselesaikan) {
                // Yang masih menggantung di hari ini diputus sebelum dikunci
                // (keputusan mas 2026-10-09): sesudah kunci statusnya tidak
                // bisa diubah lagi, jadi jangan sampai ada yang beku di open/acc.
                $diselesaikan = self::selesaikanGantung($closing, $kasir);

                // Hitung ulang sekali lagi tepat sebelum dibekukan: transaksi
                // bisa masuk antara Ceklist Kepala dan kunci kasir, dan yang
                // dibekukan harus angka sebenarnya.
                $this->hitungUlangTurunan($closing);
                $closing->refresh();

                Gembok::kunci($closing, $kasir);
            });
        } catch (\Throwable $e) {
            return back()->withErrors(AppHelper::pesanGagal($e, $e->getMessage()));
        }

        $this->susunBulanan($closing);

        $catatan = array_filter([
            $diselesaikan['tolak'] ? $diselesaikan['tolak'] . ' pengajuan open ditolak' : null,
            $diselesaikan['gagal'] ? $diselesaikan['gagal'] . ' drop acc digagalkan' : null,
        ]);

        return back()->with('message', 'Terkunci.' . ($catatan ? ' Otomatis: ' . implode(', ', $catatan) . '.' : ''));
    }

    /**
     * Putus semua yang masih menggantung di hari kunci, untuk kelompok ini:
     *   - drop bertanggal hari itu: open -> tolak, acc -> gagal;
     *   - pengajuan yang DIAJUKAN hari itu dan masih open -> tolak.
     * Dicatat atas nama kasir yang mengunci (user_check / check_date).
     *
     * @return array{tolak:int,gagal:int}
     */
    private static function selesaikanGantung(TransactionDailyClosing $closing, int $kasir): array
    {
        $tanggal = $closing->date->toDateString();
        $hasil = ['tolak' => 0, 'gagal' => 0];

        $gantung = TransactionLoan::where('transaction_loan_officer_grouping_id', $closing->transaction_loan_officer_grouping_id)
            ->where(fn($q) => $q
                ->where(fn($q) => $q->whereDate('drop_date', $tanggal)->whereIn('status', ['open', 'acc']))
                ->orWhere(fn($q) => $q->whereDate('request_date', $tanggal)->where('status', 'open')))
            ->get();

        foreach ($gantung as $loan) {
            $baru = $loan->status === 'acc' ? 'gagal' : 'tolak';
            // Per model, bukan update massal: hook TransactionLoan ikut jalan.
            $loan->update(['status' => $baru, 'user_check' => $kasir, 'check_date' => now()->toDateString()]);
            $hasil[$baru]++;
        }

        return $hasil;
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
     * Kolom manual (kasbon, transport, keluar, setoran_mantri) tidak disentuh —
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

        for ($bulan = $periode->copy(); $bulan->lte(Carbon::now()->startOfMonth()); $bulan->addMonthNoOverflow()) {
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
