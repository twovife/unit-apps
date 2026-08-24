<?php

namespace App\Console\Commands;

use App\Helpers\PemeriksaAgregat;
use App\Models\Branch;
use Carbon\Carbon;
use Illuminate\Console\Command;

/**
 * Pembungkus CLI atas App\Helpers\PemeriksaAgregat.
 *
 * Layar Pemeriksaan Agregat (menu Persiapan Migrasi) memakai helper yang SAMA,
 * jadi keduanya mustahil menyimpang. Perintah ini dipertahankan untuk
 * pemeriksaan borongan seluruh kantor sekaligus - sesuatu yang tidak masuk akal
 * dilakukan lewat layar per-cabang.
 */
class VerifikasiAgregat extends Command
{
    protected $signature = 'closing:verifikasi
                            {periode : Bulan yang diperiksa, format YYYY-MM}
                            {--branch= : Batasi ke satu branch_id}
                            {--rinci : Tampilkan tiap baris yang meleset}';

    protected $description = 'Bandingkan agregat tersimpan dengan hitung ulang dari sumber';

    public function handle(): int
    {
        try {
            $periode = Carbon::createFromFormat('Y-m', $this->argument('periode'))->startOfMonth();
        } catch (\Throwable $e) {
            $this->error('Format periode harus YYYY-MM, contoh: 2026-08');
            return self::FAILURE;
        }

        $branches = $this->option('branch')
            ? Branch::whereKey($this->option('branch'))->get()
            : Branch::whereNotNull('mulai_pendataan_baru')->orderBy('unit')->get();

        if ($branches->isEmpty()) {
            $this->warn('Tidak ada cabang yang diperiksa (bawaannya: yang sudah migrasi).');
            return self::SUCCESS;
        }

        $this->info($periode->format('F Y') . ' — memeriksa ' . $branches->count() . ' cabang');

        $bedaTerkunci = 0;
        $bedaBulanan = 0;

        foreach ($branches as $branch) {
            $h = PemeriksaAgregat::periksa($branch->id, $periode);

            $bedaTerkunci += $h['beda_terkunci'];
            $bedaBulanan += $h['beda_bulanan'];

            if ($h['baris'] === 0) {
                $this->line("  {$branch->unit}: belum ada baris harian.");
                continue;
            }

            $this->line(sprintf(
                '  %-20s %d baris (%d terkunci) — terkunci: %s, bulanan: %s%s',
                $branch->unit,
                $h['baris'],
                $h['terkunci'],
                $h['beda_terkunci'] ? '<fg=red>' . $h['beda_terkunci'] . ' MELESET</>' : '<fg=green>cocok</>',
                $h['beda_bulanan'] ? '<fg=red>' . $h['beda_bulanan'] . ' meleset</>' : '<fg=green>cocok</>',
                $h['belum_final'] ? "  <fg=gray>({$h['belum_final']} kolom belum ditetapkan, wajar)</>" : ''
            ));

            if ($h['rincian'] && $this->option('rinci')) {
                $this->table(
                    ['Kel', 'Tanggal', 'Kolom', 'Tersimpan', 'Harusnya'],
                    collect($h['rincian'])->take(20)->map(fn($b) => [
                        $b['kelompok'], $b['tanggal'], $b['kolom'],
                        number_format($b['tersimpan']), number_format($b['harusnya']),
                    ])->all()
                );
            }
        }

        $this->newLine();

        if ($bedaTerkunci === 0 && $bedaBulanan === 0) {
            $this->info('BERSIH — seluruh angka TERKUNCI cocok dengan sumbernya.');
            $this->line('Baris yang belum terkunci tidak dihitung: angkanya memang belum ditetapkan.');
            return self::SUCCESS;
        }

        if ($bedaTerkunci > 0) {
            $this->error("{$bedaTerkunci} kolom pada hari TERKUNCI meleset dari sumbernya.");
        }

        if ($bedaBulanan > 0) {
            $this->warn("{$bedaBulanan} kolom BULANAN tidak sama dengan jumlah hariannya.");
        }

        $this->line('Perintah ini tidak memperbaiki apa pun; memperbaiki diam-diam menghapus buktinya.');

        return self::FAILURE;
    }
}
