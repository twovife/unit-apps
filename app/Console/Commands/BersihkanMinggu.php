<?php

namespace App\Console\Commands;

use App\Models\TransactionLoan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

// Data hari Minggu yang lolos sebelum input libur diblokir (mas 2026-10-10:
// "pokok minggu hapus semua"). Sejak 1 Sep 2026 saja - sebelumnya fosil.
// Bawaan hanya menampilkan; --jalankan menghapus dalam satu transaksi.
//
// Angsuran & pinjaman SUKSES di hari Minggu sengaja TIDAK dihapus: itu uang
// sungguhan yang harus dipindah tanggalnya, bukan dibuang. Kalau ada,
// dilaporkan saja.
class BersihkanMinggu extends Command
{
    protected $signature = 'minggu:bersihkan {--jalankan : benar-benar menghapus}';

    protected $description = 'Hapus rekap harian, closing harian & pengajuan bertanggal/berhari Minggu (sejak 2026-09-01).';

    private const MULAI = '2026-09-01';

    public function handle(): int
    {
        $minggu = fn($kolom) => "DAYOFWEEK($kolom) = 1";

        $recaps = DB::table('transaction_daily_recaps')
            ->where('date', '>=', self::MULAI)->whereRaw($minggu('date'))->get(['id', 'date', 'transaction_loan_officer_grouping_id', 'kasbon', 'transport']);
        $closings = DB::table('transaction_daily_closings')
            ->where('date', '>=', self::MULAI)->whereRaw($minggu('date'))->get(['id', 'date', 'transaction_loan_officer_grouping_id', 'kasbon', 'transport']);
        // Pengajuan (belum sukses) yang tanggal drop-nya Minggu atau hari tagihnya 'minggu'.
        $loans = TransactionLoan::where('status', '!=', 'success')
            ->where(fn($q) => $q->where('drop_date', '>=', self::MULAI)->orWhere('request_date', '>=', self::MULAI))
            ->where(fn($q) => $q->whereRaw($minggu('drop_date'))->orWhere('hari', 'minggu'))
            ->get();

        $suksesMinggu = TransactionLoan::where('status', 'success')->where('drop_date', '>=', self::MULAI)
            ->where(fn($q) => $q->whereRaw($minggu('drop_date'))->orWhere('hari', 'minggu'))->count();
        $angsuranMinggu = DB::table('transaction_loan_instalments')
            ->where('transaction_date', '>=', self::MULAI)->whereRaw($minggu('transaction_date'))->count();

        $tabel = fn($rows) => $rows->map(fn($r) => [$r->id, substr($r->date, 0, 10), $r->transaction_loan_officer_grouping_id, (int) $r->kasbon, (int) $r->transport])->all();
        $this->info("Rekap harian Minggu: {$recaps->count()}");
        $recaps->isNotEmpty() && $this->table(['id', 'tanggal', 'grouping', 'kasbon', 'transport'], $tabel($recaps));
        $this->info("Closing harian Minggu: {$closings->count()}");
        $closings->isNotEmpty() && $this->table(['id', 'tanggal', 'grouping', 'kasbon', 'transport'], $tabel($closings));
        $this->info("Pengajuan Minggu: {$loans->count()}");
        $loans->isNotEmpty() && $this->table(['id', 'status', 'hari', 'request', 'drop', 'grouping'],
            $loans->map(fn($l) => [$l->id, $l->status, $l->hari, substr($l->request_date, 0, 10), substr($l->drop_date, 0, 10), $l->transaction_loan_officer_grouping_id])->all());

        if ($suksesMinggu || $angsuranMinggu) {
            $this->warn("TIDAK dihapus, perlu dipindah tanggalnya: $suksesMinggu pinjaman sukses, $angsuranMinggu angsuran di hari Minggu.");
        }

        if (!$this->option('jalankan')) {
            $this->warn('Belum ada yang dihapus. Ulangi dengan --jalankan.');
            return self::SUCCESS;
        }

        DB::transaction(function () use ($recaps, $closings, $loans) {
            DB::table('transaction_daily_recaps')->whereIn('id', $recaps->pluck('id'))->delete();
            DB::table('transaction_daily_closings')->whereIn('id', $closings->pluck('id'))->delete();
            // Lewat model: hook deleting/deleted membereskan topup & angsuran.
            $loans->each->delete();
        });

        $this->info('Selesai dihapus.');

        return self::SUCCESS;
    }
}
