<?php

namespace App\Console\Commands;

use App\Helpers\AgregasiScope;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use App\Models\WorkDay;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Membuat baris agregat harian & bulanan untuk satu periode, semuanya nol.
 *
 * KENAPA BARISNYA DIBUAT DI MUKA
 * ------------------------------
 * Supaya tanggal itu PASTI ADA walau drop & storting-nya nol — kasbon dan
 * transport toh selalu keluar. Baris yang selalu ada juga membuat rantai
 * penguncian bisa mendeteksi hari yang terlewat: kalau baris cuma lahir saat
 * ada transaksi, hari sepi tidak terbedakan dari hari yang lupa dikunci.
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

    protected $description = 'Bangkitkan baris agregat harian & bulanan (nol) untuk satu periode';

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

        $totalHarian = 0;
        $totalBulanan = 0;

        foreach ($branches as $branch) {
            $groupings = TransactionLoanOfficerGrouping::where('branch_id', $branch->id)
                ->orderBy('kelompok')
                ->get();

            if ($groupings->isEmpty()) {
                $this->warn("  {$branch->unit}: tidak punya kelompok, dilewati.");
                continue;
            }

            [$harian, $bulanan] = $kering
                ? [$groupings->count() * $hariKerja->count(), $groupings->count() * 6]
                : $this->bangkitkan($groupings, $hariKerja, $periode);

            $totalHarian += $harian;
            $totalBulanan += $bulanan;

            $this->line(sprintf(
                '  %-20s %2d kelompok  →  %4d baris harian, %3d baris bulanan',
                $branch->unit,
                $groupings->count(),
                $harian,
                $bulanan
            ));
        }

        $this->newLine();
        $this->info(sprintf(
            '%s %d baris harian, %d baris bulanan.',
            $kering ? 'Akan dibuat:' : 'Dibuat/sudah ada:',
            $totalHarian,
            $totalBulanan
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

    /**
     * @return array{0:int,1:int} [jumlah baris harian, jumlah baris bulanan]
     */
    private function bangkitkan($groupings, $hariKerja, Carbon $periode): array
    {
        $harian = 0;
        $bulanan = 0;

        // Jumlah hari kerja per hari tagih, untuk kolom kelengkapan bulanan.
        $kerjaPerHari = $hariKerja->groupBy(fn(Carbon $t) => strtolower($this->namaHari($t)))
            ->map->count();

        DB::transaction(function () use ($groupings, $hariKerja, $periode, $kerjaPerHari, &$harian, &$bulanan) {
            foreach ($groupings as $g) {
                foreach ($hariKerja as $tanggal) {
                    // firstOrCreate: baris yang sudah ada TIDAK disentuh, jadi
                    // perintah ini aman diulang walau sebagian hari sudah terkunci.
                    TransactionDailyClosing::firstOrCreate([
                        'transaction_loan_officer_grouping_id' => $g->id,
                        'date' => $tanggal->toDateString(),
                    ]);
                    $harian++;
                }

                foreach (['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'] as $hari) {
                    TransactionMonthlyClosing::firstOrCreate(
                        [
                            'transaction_loan_officer_grouping_id' => $g->id,
                            'hari' => $hari,
                            'periode' => $periode->toDateString(),
                        ],
                        ['hari_kerja' => $kerjaPerHari->get($hari, 0)]
                    );
                    $bulanan++;
                }
            }
        });

        return [$harian, $bulanan];
    }

    private function namaHari(Carbon $t): string
    {
        return [
            Carbon::MONDAY => 'senin',
            Carbon::TUESDAY => 'selasa',
            Carbon::WEDNESDAY => 'rabu',
            Carbon::THURSDAY => 'kamis',
            Carbon::FRIDAY => 'jumat',
            Carbon::SATURDAY => 'sabtu',
            Carbon::SUNDAY => 'minggu',
        ][$t->dayOfWeek];
    }
}
