<?php

namespace App\Console\Commands;

use App\Helpers\PenyesuaianSaldo;
use App\Models\TransactionLoan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

// Bukti F1: status lunas (pay_off_date) & keluar target (out_date + sebab) lewat
// skenario nyata — angsuran, hapus angsuran, edit nominal, reset, pemutihan,
// topup. Semua di dalam satu transaksi yang SELALU di-rollback.
class CekPelunasan extends Command
{
    protected $signature = 'pelunasan:cek {--loan= : id pinjaman aktif yang diuji (bawaan dipilih otomatis)}';

    protected $description = 'Uji F1 hitungUlangPelunasan lewat skenario dalam transaksi yang selalu di-rollback.';

    private array $baris = [];

    public function handle(): int
    {
        DB::beginTransaction();
        try {
            $loan = $this->option('loan') ? TransactionLoan::findOrFail($this->option('loan')) : $this->pilihPinjaman();
            $this->info("Pinjaman uji #{$loan->id} (drop {$loan->drop_date})");
            $this->skenario($loan);
        } finally {
            DB::rollBack();
        }

        $this->table(['skenario', 'kolom', 'harap', 'dapat', ''], $this->baris);
        $gagal = count(array_filter($this->baris, fn($b) => $b[4] !== 'OK'));
        $gagal ? $this->error("$gagal GAGAL (data sudah di-rollback)") : $this->info('SEMUA OK (data sudah di-rollback)');

        return $gagal ? self::FAILURE : self::SUCCESS;
    }

    private function skenario(TransactionLoan $loan): void
    {
        $tgl = now()->toDateString();
        $awal = PenyesuaianSaldo::hitungSaldo($loan);
        $angsuran = fn(int $nominal) => $loan->loan_instalment()->create([
            'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
            'transaction_date' => $tgl,
            'nominal' => $nominal,
            'status' => 1,
            'danatitipan' => 0,
            'user_input' => $loan->user_input,
            'user_mantri' => $loan->user_mantri,
        ]);
        $kosong = ['pay_off_date' => null, 'out_date' => null, 'transaction_out_reasons_id' => null];

        $a = $angsuran($awal['saldo']);
        $this->cek('1 angsuran melunasi', $loan, ['pay_off_date' => $tgl, 'out_date' => $tgl,
            'transaction_out_reasons_id' => TransactionLoan::SEBAB_LUNAS, 'total_angsuran' => $awal['angsuran'] + $awal['saldo']]);

        $a->delete();
        $this->cek('2 hapus angsuran itu', $loan, $kosong + ['total_angsuran' => $awal['angsuran']]);

        $a = $angsuran($awal['saldo']);
        $loan->refresh()->update(['nominal_drop' => $loan->nominal_drop + 100000]);
        $this->cek('3 nominal drop dinaikkan', $loan, $kosong);
        $loan->refresh()->update(['nominal_drop' => $loan->nominal_drop - 100000]);
        $this->cek('4 nominal dikembalikan', $loan, ['pay_off_date' => $tgl, 'transaction_out_reasons_id' => TransactionLoan::SEBAB_LUNAS]);

        $loan->refresh()->update(['status' => 'open']);
        $this->cek('5 reset ke open', $loan, $kosong);
        $loan->refresh()->update(['status' => 'success']);
        $a->delete();

        $loan->white_off()->create([
            'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
            'transaction_date' => $tgl,
            'nominal' => $awal['saldo'],
        ]);
        $loan->refresh()->hitungUlangPelunasan();
        $this->cek('6 pemutihan sisa saldo', $loan, ['pay_off_date' => $tgl, 'out_date' => $tgl,
            'transaction_out_reasons_id' => TransactionLoan::SEBAB_PEMUTIHAN, 'total_angsuran' => $awal['angsuran']]);
        DB::table('transaction_white_offs')->where('transaction_loan_id', $loan->id)->delete();
        $loan->refresh()->hitungUlangPelunasan();

        $tglPengajuan = now()->subWeek()->toDateString();
        $pengganti = TransactionLoan::create([
            'transaction_manage_customer_id' => $loan->transaction_manage_customer_id,
            'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
            'previous_loan_id' => $loan->id,
            'request_date' => $tglPengajuan,
            'drop_date' => $tgl,
            'hari' => $loan->hari,
            'status' => 'open',
            'user_input' => $loan->user_input,
            'request_nominal' => 500000,
        ]);
        $pengganti->update(['status' => 'success', 'nominal_drop' => 500000]);
        $this->cek('7 topup jadi success', $loan, ['pay_off_date' => $tgl, 'out_date' => $tglPengajuan,
            'transaction_out_reasons_id' => TransactionLoan::SEBAB_PELUNASAN]);

        $pengganti->refresh()->update(['status' => 'open']);
        $this->cek('8 topup di-reset', $loan, $kosong + ['total_angsuran' => $awal['angsuran']]);

        // Step 3: keluar target ikut status pengajuan pengganti.
        $keluar = ['out_date' => $tglPengajuan, 'transaction_out_reasons_id' => TransactionLoan::SEBAB_PELUNASAN];
        $pengganti->refresh()->update(['status' => 'acc']);
        $this->cek('9 pengganti di-ACC', $loan, $keluar + ['pay_off_date' => null]);

        $pengganti->refresh()->update(['status' => 'tolak']);
        $this->cek('10 pengganti ditolak', $loan, $kosong);

        $pengganti->refresh()->update(['status' => 'acc']);
        $tundaan = TransactionLoan::create([
            'transaction_manage_customer_id' => $loan->transaction_manage_customer_id,
            'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
            'previous_loan_id' => $loan->id,
            'postponed_loan_id' => $pengganti->id,
            'request_date' => $tglPengajuan,
            'drop_date' => now()->addWeek()->toDateString(),
            'hari' => $loan->hari,
            'status' => 'open',
            'user_input' => $loan->user_input,
            'request_nominal' => 500000,
        ]);
        $pengganti->refresh()->update(['status' => 'gagal']);
        $this->cek('11 ditunda (TD)', $loan, $keluar);

        $tundaan->refresh()->update(['status' => 'tolak']);
        $this->cek('12 tundaan ditolak', $loan, $kosong);

        $tundaan->refresh()->update(['status' => 'acc']);
        $this->cek('13 tundaan di-ACC', $loan, $keluar);

        $tundaan->delete();
        $pengganti->delete();
        $this->cek('14 pengganti dihapus', $loan, $kosong);
    }

    private function cek(string $skenario, TransactionLoan $loan, array $harap): void
    {
        $loan->refresh();
        foreach ($harap as $kolom => $nilai) {
            $dapat = $loan->getRawOriginal($kolom);
            $sama = $nilai === null ? $dapat === null : (string) $dapat === (string) $nilai;
            $this->baris[] = [$skenario, $kolom, var_export($nilai, true), var_export($dapat, true), $sama ? 'OK' : 'GAGAL'];
        }
    }

    /** Pinjaman aktif biasa: success, belum tutup, tanpa pemutihan/pengganti, saldo > 0. */
    private function pilihPinjaman(): TransactionLoan
    {
        return TransactionLoan::where('status', 'success')
            ->whereNull('pay_off_date')->whereNull('out_date')->whereNotNull('nominal_drop')->whereNotNull('user_input')
            ->where('drop_date', '<', now()->subWeeks(2)->toDateString())
            ->whereDoesntHave('white_off')
            ->whereNotExists(fn($q) => $q->from('transaction_loans as p')->whereColumn('p.previous_loan_id', 'transaction_loans.id'))
            ->latest('id')->limit(200)->get()
            ->first(fn($l) => PenyesuaianSaldo::hitungSaldo($l)['saldo'] > 0)
            ?? throw new \RuntimeException('Tidak ada pinjaman aktif yang cocok untuk diuji.');
    }
}
