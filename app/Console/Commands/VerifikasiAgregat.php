<?php

namespace App\Console\Commands;

use App\Helpers\Ember;
use App\Helpers\HitungAgregat;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Membuktikan agregat tersimpan masih sama dengan sumbernya.
 *
 * KENAPA INI PERLU ADA
 * --------------------
 * Trigger database menjamin sumber hari TERKUNCI tidak bisa berubah, jadi
 * angkanya tidak bisa hanyut. Tapi jaminan itu punya tiga celah:
 *
 *   1. Hari yang BELUM terkunci sumbernya masih bebas berubah.
 *   2. Kalau kunci dibuka, sumber diubah, lalu dikunci lagi tanpa hitung
 *      ulang, angkanya jadi basi tanpa ada yang tahu.
 *   3. Bug di kode perhitungan menulis angka salah, dan trigger dengan setia
 *      membekukan angka salah itu.
 *
 * Perintah ini menghitung ULANG dari sumber lalu membandingkan. Itu satu-
 * satunya cara membuktikan - bukan menganggap - bahwa agregat masih cocok
 * dengan detail inputannya.
 *
 * Baca-saja. Tidak memperbaiki apa pun; memperbaiki diam-diam justru
 * menghapus buktinya.
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
            [$t, $b] = $this->periksaCabang($branch, $periode);
            $bedaTerkunci += $t;
            $bedaBulanan += $b;
        }

        $this->newLine();

        if ($bedaTerkunci === 0 && $bedaBulanan === 0) {
            $this->info('BERSIH — seluruh angka TERKUNCI cocok dengan sumbernya.');
            $this->line('Baris yang belum terkunci tidak dihitung: angkanya memang belum ditetapkan.');
            return self::SUCCESS;
        }

        if ($bedaTerkunci > 0) {
            $this->error("{$bedaTerkunci} kolom pada hari TERKUNCI meleset dari sumbernya.");
            $this->line('  Angka yang sudah ditandatangani tidak lagi cocok dengan detail inputannya.');
            $this->line('  Ini yang paling serius: hari terkunci semestinya mustahil berubah.');
        }

        if ($bedaBulanan > 0) {
            $this->warn("{$bedaBulanan} kolom BULANAN tidak sama dengan jumlah hariannya.");
            $this->line('  Ada hari yang berubah setelah bulanannya disusun.');
            $this->line('  Biasanya hilang sendiri begitu salah satu hari di bulan itu dikunci ulang.');
        }
        $this->line('Perintah ini tidak memperbaiki apa pun; memperbaiki diam-diam menghapus buktinya.');

        return self::FAILURE;
    }

    /** @return array{0:int,1:int} [beda hari terkunci, beda bulanan] */
    private function periksaCabang(Branch $branch, Carbon $periode): array
    {
        $groupings = TransactionLoanOfficerGrouping::where('branch_id', $branch->id)
            ->orderBy('kelompok')->get();

        if ($groupings->isEmpty()) {
            return [0, 0];
        }

        $ids = $groupings->pluck('id')->all();
        $nama = $groupings->pluck('kelompok', 'id');
        $akhir = $periode->copy()->endOfMonth();

        $tersimpan = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('date', [$periode->toDateString(), $akhir->toDateString()])
            ->get();

        if ($tersimpan->isEmpty()) {
            $this->line("  {$branch->unit}: belum ada baris harian.");
            return [0, 0];
        }

        $sumber = HitungAgregat::harianBanyak($ids, $periode, $akhir);

        $kolom = array_keys(HitungAgregat::kosong());
        $beda = [];
        $belumFinal = 0;

        foreach ($tersimpan as $baris) {
            $kunci = $baris->transaction_loan_officer_grouping_id . '|' . $baris->date->toDateString();
            $harusnya = $sumber[$kunci] ?? HitungAgregat::kosong();

            foreach ($kolom as $k) {
                if ((int) $baris->$k !== (int) $harusnya[$k]) {
                    // Baris BELUM TERKUNCI yang belum pernah dihitung bukan
                    // temuan - angkanya memang belum ditetapkan. Menghitungnya
                    // sebagai pelanggaran menghasilkan ratusan "meleset" palsu,
                    // dan alarm yang berbunyi terus adalah alarm yang diabaikan.
                    if (!$baris->terkunci()) {
                        $belumFinal++;
                        continue;
                    }

                    $beda[] = [
                        'kelompok' => $nama->get($baris->transaction_loan_officer_grouping_id),
                        'tanggal' => $baris->date->toDateString(),
                        'kolom' => $k,
                        'tersimpan' => (int) $baris->$k,
                        'harusnya' => (int) $harusnya[$k],
                        'terkunci' => $baris->terkunci(),
                    ];
                }
            }
        }

        $bedaBulanan = $this->periksaBulanan($ids, $periode, $tersimpan);

        $terkunci = $tersimpan->filter->terkunci()->count();

        $this->line(sprintf(
            '  %-20s %d baris (%d terkunci) — terkunci: %s, bulanan: %s%s',
            $branch->unit,
            $tersimpan->count(),
            $terkunci,
            $beda ? '<fg=red>' . count($beda) . ' MELESET</>' : '<fg=green>cocok</>',
            $bedaBulanan ? '<fg=red>' . $bedaBulanan . ' meleset</>' : '<fg=green>cocok</>',
            $belumFinal ? "  <fg=gray>({$belumFinal} kolom belum ditetapkan, wajar)</>" : ''
        ));

        if ($beda && $this->option('rinci')) {
            $this->table(
                ['Kel', 'Tanggal', 'Kolom', 'Tersimpan', 'Harusnya', 'Terkunci'],
                collect($beda)->take(20)->map(fn($b) => [
                    $b['kelompok'],
                    $b['tanggal'],
                    $b['kolom'],
                    number_format($b['tersimpan']),
                    number_format($b['harusnya']),
                    $b['terkunci'] ? 'ya' : '-',
                ])->all()
            );
        }

        return [count($beda), $bedaBulanan];
    }

    /**
     * Bulanan harus sama dengan jumlah hariannya. Beda berarti ada hari yang
     * berubah setelah bulanannya disusun.
     */
    private function periksaBulanan(array $ids, Carbon $periode, $harian): int
    {
        $bulanan = TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $periode->toDateString())
            ->get();

        if ($bulanan->isEmpty()) {
            return 0;
        }

        $kolom = array_merge(
            ['drop', 'storting', 'pemutihan'],
            array_map(fn($e) => 'storting_' . $e, Ember::SEMUA)
        );

        $jumlahHarian = $harian->groupBy(fn($b) => $b->transaction_loan_officer_grouping_id
            . '|' . strtolower($b->date->locale('id')->isoFormat('dddd')));

        $beda = 0;

        foreach ($bulanan as $m) {
            $kunci = $m->transaction_loan_officer_grouping_id . '|' . $m->hari;
            $baris = $jumlahHarian->get($kunci, collect());

            foreach ($kolom as $k) {
                if ((int) $m->$k !== (int) $baris->sum($k)) {
                    $beda++;
                }
            }
        }

        return $beda;
    }
}
