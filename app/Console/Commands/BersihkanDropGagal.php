<?php

namespace App\Console\Commands;

use App\Models\TransactionLoan;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;

// Pinjaman 'gagal' yang masih menyimpan nominal_drop: sisa perpindahan
// success -> gagal sebelum 1c848a47 (yang sekarang mengosongkannya). Data
// sebelum 1 Sep 2026 = fosil, tidak disentuh. Bawaan hanya menampilkan;
// --jalankan untuk menulis. Tanggal yang sudah dikunci kasir ditolak trigger
// tl_kunci_before_update - dilaporkan, tidak dipaksa.
class BersihkanDropGagal extends Command
{
    protected $signature = 'drop:bersihkan-gagal {--jalankan : benar-benar mengosongkan nominal_drop}';

    protected $description = 'Kosongkan nominal_drop pinjaman berstatus gagal (drop >= 2026-09-01).';

    public function handle(): int
    {
        $loans = TransactionLoan::where('status', 'gagal')
            ->where('nominal_drop', '>', 0)
            ->where('drop_date', '>=', '2026-09-01')
            ->orderBy('drop_date')
            ->get();

        if ($loans->isEmpty()) {
            $this->info('Tidak ada pinjaman gagal yang masih membawa nominal_drop.');
            return self::SUCCESS;
        }

        $jalankan = $this->option('jalankan');
        $baris = $loans->map(function ($loan) use ($jalankan) {
            $nominal = $loan->nominal_drop;
            $hasil = 'akan dikosongkan';
            if ($jalankan) {
                try {
                    $loan->update(['nominal_drop' => null]);
                    $hasil = 'dikosongkan';
                } catch (QueryException $e) {
                    $hasil = 'DITOLAK: ' . ($e->errorInfo[2] ?? $e->getMessage());
                }
            }
            return [$loan->id, $loan->drop_date, $loan->transaction_loan_officer_grouping_id, $nominal, $hasil];
        });

        $this->table(['id', 'drop_date', 'grouping', 'nominal_drop', 'hasil'], $baris);

        if (!$jalankan) {
            $this->warn('Belum ada yang ditulis. Ulangi dengan --jalankan untuk mengosongkan.');
        }

        return self::SUCCESS;
    }
}
