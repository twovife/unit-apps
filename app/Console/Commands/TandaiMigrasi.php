<?php

namespace App\Console\Commands;

use App\Helpers\AgregasiScope;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Menandai kantor pindah ke alur agregasi baru — pengganti mengedit SQL tangan.
 *
 * KENAPA PER KANTOR, BUKAN SATU TANGGAL GLOBAL
 * --------------------------------------------
 * Batas global memang lebih sederhana, tapi memindahkan 157 kantor serentak
 * membuang tiga pengaman sekaligus:
 *
 *   1. Gemboknya trigger database — kalau ada yang salah dan terlanjur
 *      terkunci, membukanya harus satu per satu dengan alasan tercatat,
 *      bukan sekadar mengembalikan kode.
 *   2. Kantor yang belum migrasi berfungsi sebagai pembanding: `saldo_masuk`
 *      nol membuat rumus baru menghasilkan angka identik dengan rumus lama.
 *      Kalau semua pindah, tidak ada lagi yang bisa dibandingkan.
 *   3. Serah terima saldo awal harus benar di semua kantor sekaligus. Empat
 *      kantor bahkan belum punya baris sirkulasi sama sekali.
 *
 * Perintah ini tetap bisa memindahkan semuanya (`--semua`) kalau memang sudah
 * waktunya — yang dihindari adalah TIDAK PUNYA PILIHAN selain serentak.
 *
 * Rancangan: .agents/agregasi_rekap.md §13.
 */
class TandaiMigrasi extends Command
{
    protected $signature = 'migrasi:tandai
                            {tanggal? : Tanggal mulai alur baru, harus tanggal 1 (YYYY-MM-DD)}
                            {--branch=* : branch_id yang ditandai, boleh diulang}
                            {--semua : Tandai SELURUH cabang}
                            {--batal : Batalkan penandaan (hanya kalau belum ada hari terkunci)}
                            {--dry-run : Tampilkan rencananya saja}';

    protected $description = 'Tandai kantor pindah ke alur agregasi baru (branches.mulai_pendataan_baru)';

    public function handle(): int
    {
        $batal = (bool) $this->option('batal');
        $kering = (bool) $this->option('dry-run');

        $tanggal = null;
        if (!$batal) {
            if (!$this->argument('tanggal')) {
                $this->error('Tanggal wajib diisi, contoh: 2026-09-01');
                return self::FAILURE;
            }

            $tanggal = Carbon::parse($this->argument('tanggal'))->startOfDay();

            // Cutover selalu di awal bulan: agregat bulanan ber-grain per
            // periode, jadi kantor yang pindah di tengah bulan akan punya
            // separuh bulan di alur lama dan separuh di alur baru - dan
            // saldo awalnya tidak punya titik pijak yang jelas.
            if ($tanggal->day !== 1) {
                $this->error('Tanggal harus tanggal 1. Cutover selalu di awal bulan.');
                return self::FAILURE;
            }
        }

        $branches = $this->sasaran();

        if ($branches->isEmpty()) {
            $this->error('Tidak ada cabang sasaran. Pakai --branch=<id> atau --semua.');
            return self::FAILURE;
        }

        $this->info(sprintf(
            '%s %d cabang%s',
            $batal ? 'Membatalkan penandaan' : 'Menandai migrasi ' . $tanggal->toDateString() . ' untuk',
            $branches->count(),
            $kering ? '  [DRY RUN]' : ''
        ));
        $this->newLine();

        $berhasil = 0;
        $dilewati = 0;

        foreach ($branches as $b) {
            $halangan = $this->halangan($b, $batal);

            if ($halangan) {
                $this->line(sprintf('  <fg=yellow>DILEWATI</> %-20s %s', $b->unit, $halangan));
                $dilewati++;
                continue;
            }

            $lama = $b->mulai_pendataan_baru?->toDateString() ?? '-';

            if (!$kering) {
                DB::table('branches')->where('id', $b->id)
                    ->update(['mulai_pendataan_baru' => $batal ? null : $tanggal->toDateString()]);
            }

            $this->line(sprintf(
                '  <fg=green>OK</>       %-20s %s -> %s',
                $b->unit,
                $lama,
                $batal ? '-' : $tanggal->toDateString()
            ));
            $berhasil++;
        }

        AgregasiScope::lupakanCache();

        $this->newLine();
        $this->info("Selesai: {$berhasil} diubah, {$dilewati} dilewati.");

        if ($berhasil > 0 && !$kering && !$batal) {
            $this->newLine();
            $this->warn('Langkah berikutnya yang BELUM otomatis:');
            $this->line('  1. Bangkitkan baris harian:  closing:generate ' . $tanggal->format('Y-m'));
            $this->line('  2. Serah terima saldo awal (awal_* per ember + sisa kuota ML) — belum ada alatnya.');
            $this->line('     Tanpa itu, saldo awal kantor ini nol dan salah sejak hari pertama.');
        }

        return self::SUCCESS;
    }

    private function sasaran()
    {
        if ($this->option('semua')) {
            return Branch::orderBy('unit')->get();
        }

        $ids = $this->option('branch');

        return $ids ? Branch::whereIn('id', $ids)->orderBy('unit')->get() : collect();
    }

    /**
     * Alasan sebuah cabang tidak boleh diubah, atau null kalau boleh.
     *
     * Aturan pentingnya: begitu ada hari yang TERKUNCI, tanggal migrasi tidak
     * boleh digeser dan penandaannya tidak boleh dibatalkan. Hari terkunci
     * berarti angkanya sudah disahkan dan sumbernya dibekukan trigger —
     * memindahkan batasnya membuat data itu menggantung tanpa induk.
     */
    private function halangan(Branch $b, bool $batal): ?string
    {
        $ids = TransactionLoanOfficerGrouping::where('branch_id', $b->id)->pluck('id');

        if ($ids->isEmpty()) {
            return 'tidak punya kelompok';
        }

        $terkunci = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereNotNull('kasir_lock_at')
            ->count();

        if ($terkunci > 0) {
            return "sudah ada {$terkunci} hari terkunci — tanggal migrasi tidak boleh digeser";
        }

        if ($batal && !$b->mulai_pendataan_baru) {
            return 'memang belum ditandai';
        }

        return null;
    }
}
