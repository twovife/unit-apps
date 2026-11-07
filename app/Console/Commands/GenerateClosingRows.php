<?php

namespace App\Console\Commands;

use App\Helpers\AgregasiScope;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\WorkDay;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Membuat baris agregat HARIAN untuk satu periode, semuanya nol.
 *
 * KENAPA BARIS HARIAN DIBUAT DI MUKA
 * ----------------------------------
 * Supaya tanggal itu PASTI ADA walau drop & storting-nya nol — kasbon dan
 * transport toh selalu keluar. Baris yang selalu ada juga membuat rantai
 * penguncian bisa mendeteksi hari yang terlewat: kalau baris cuma lahir saat
 * ada transaksi, hari sepi tidak terbedakan dari hari yang lupa dikunci.
 *
 * Itu obat langsung untuk penyakit yang ditemukan di tabel lama:
 * `transaction_sirculations` hanya lahir kalau ada yang menekan tombol, dan
 * hasilnya 4 kantor tidak punya baris sama sekali (Sawojajar 2, Salatiga 1,
 * Singosari 3 bolong 60 dari 60).
 *
 * KENAPA BARIS BULANAN TIDAK IKUT
 * -------------------------------
 * Kolom `awal_*` di baris bulanan berisi saldo awal. Baris kosong berarti
 * mengklaim "saldo awal kelompok ini nol", padahal yang benar "saldo awalnya
 * belum ditetapkan" — pembedaan yang sama yang kita jaga di laporan stock-take
 * antara Y=null dan Y=0. Barisnya lahir saat serah terima (yang mengisi
 * `awal_*` dengan angka sungguhan) atau saat hari pertama dikunci.
 *
 * Perintah ini AMAN dijalankan berkali-kali — memakai firstOrCreate, jadi baris
 * yang sudah ada tidak disentuh sama sekali (termasuk yang sudah terkunci).
 *
 * Rancangan: .agents/agregasi_rekap.md §10, §12.2
 */
class GenerateClosingRows extends Command
{
    protected $signature = 'closing:generate
                            {periode : Bulan yang dibangkitkan, format YYYY-MM}
                            {--branch= : Batasi ke satu branch_id (untuk uji coba)}
                            {--dry-run : Tampilkan rencananya saja, tidak menulis}';

    protected $description = 'Bangkitkan baris agregat harian (nol) untuk satu periode';

    public function handle(): int
    {
        try {
            $periode = Carbon::createFromFormat('Y-m', $this->argument('periode'))->startOfMonth();
        } catch (\Throwable $e) {
            $this->error('Format periode harus YYYY-MM, contoh: 2026-10');
            return self::FAILURE;
        }

        $kering = (bool) $this->option('dry-run');
        $branches = $this->cabangSasaran();

        if ($branches->isEmpty()) {
            $this->warn('Tidak ada cabang yang memenuhi syarat.');
            $this->line('Bawaannya hanya cabang yang sudah punya branches.mulai_pendataan_baru.');
            $this->line('Untuk uji coba sebelum ada yang migrasi, pakai --branch=<id>.');
            return self::SUCCESS;
        }

        $hariKerja = WorkDay::hariKerjaBulan($periode);

        if (!WorkDay::sudahDikonfirmasi($periode)) {
            $this->warn(sprintf(
                'Kalender %s BELUM dikonfirmasi — memakai bawaan Senin-Sabtu (%d hari kerja).',
                $periode->format('F Y'),
                $hariKerja->count()
            ));
        }

        $this->info(sprintf(
            '%s: %d cabang, %d hari kerja%s',
            $periode->format('F Y'),
            $branches->count(),
            $hariKerja->count(),
            $kering ? '  [DRY RUN - tidak menulis]' : ''
        ));

        $total = 0;

        foreach ($branches as $branch) {
            $groupings = TransactionLoanOfficerGrouping::where('branch_id', $branch->id)
                ->orderBy('kelompok')
                ->get();

            if ($groupings->isEmpty()) {
                $this->warn("  {$branch->unit}: tidak punya kelompok, dilewati.");
                continue;
            }

            $jumlah = $kering
                ? $groupings->count() * $hariKerja->count()
                : $this->bangkitkan($groupings, $hariKerja);

            $total += $jumlah;

            $this->line(sprintf(
                '  %-20s %2d kelompok  →  %4d baris harian',
                $branch->unit,
                $groupings->count(),
                $jumlah
            ));
        }

        $this->newLine();
        $this->info(sprintf(
            '%s %d baris harian. Baris bulanan tidak dibuat di sini (lihat docblock).',
            $kering ? 'Akan dibuat:' : 'Dibuat/sudah ada:',
            $total
        ));

        return self::SUCCESS;
    }

    /**
     * Bawaannya hanya cabang yang sudah ditandai migrasi — jadi selama semua
     * `mulai_pendataan_baru` masih NULL, perintah ini tidak menghasilkan apa pun.
     * Itu disengaja: baris agregat baru tidak boleh muncul untuk kantor yang
     * masih memakai alur lama.
     */
    private function cabangSasaran()
    {
        $paksa = $this->option('branch');

        if ($paksa) {
            $branch = Branch::find($paksa);

            if (!$branch) {
                $this->error("Branch {$paksa} tidak ditemukan.");
                return collect();
            }

            if (!AgregasiScope::sudahMigrasi($branch->id)) {
                $this->warn("  {$branch->unit} BELUM ditandai migrasi — dipaksa lewat --branch.");
            }

            return collect([$branch]);
        }

        return Branch::whereNotNull('mulai_pendataan_baru')->orderBy('unit')->get();
    }

    private function bangkitkan($groupings, $hariKerja): int
    {
        $jumlah = 0;

        DB::transaction(function () use ($groupings, $hariKerja, &$jumlah) {
            foreach ($groupings as $g) {
                foreach ($hariKerja as $tanggal) {
                    // firstOrCreate: baris yang sudah ada TIDAK disentuh, jadi
                    // perintah ini aman diulang walau sebagian hari sudah terkunci.
                    TransactionDailyClosing::firstOrCreate([
                        'transaction_loan_officer_grouping_id' => $g->id,
                        'date' => $tanggal->toDateString(),
                    ]);
                    $jumlah++;
                }
            }
        });

        return $jumlah;
    }
}
