<?php

namespace App\Console\Commands;

use App\Helpers\Ember;
use App\Helpers\HitungAgregat;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Hitung kolom turunan agregat harian, lalu BANDINGKAN dengan angka lama.
 *
 * Bawaannya hanya membandingkan dan melaporkan — tidak menulis apa pun. Ini
 * "jalan berdampingan" dari rencana (§12.4): jalankan mesin baru atas bulan
 * yang angka lamanya sudah ada, lalu periksa selisihnya. Kalau cocok, mesinnya
 * benar. Kalau tidak, ketahuan sebelum menyentuh data sungguhan.
 *
 * Selisih TIDAK otomatis berarti mesin baru salah. Sudah diketahui bahwa 8.703
 * rekap harian 2026 angka `storting`-nya tidak cocok dengan sumbernya — jadi
 * sebagian selisih justru kesalahan lama yang baru sekarang terlihat.
 */
class HitungClosing extends Command
{
    protected $signature = 'closing:hitung
                            {periode : Bulan yang dihitung, format YYYY-MM}
                            {--branch= : Batasi ke satu branch_id}
                            {--tulis : Simpan hasilnya ke transaction_daily_closings}
                            {--rinci : Tampilkan baris yang selisih}';

    protected $description = 'Hitung agregat harian dari sumber dan bandingkan dengan rekap lama';

    public function handle(): int
    {
        try {
            $periode = Carbon::createFromFormat('Y-m', $this->argument('periode'))->startOfMonth();
        } catch (\Throwable $e) {
            $this->error('Format periode harus YYYY-MM, contoh: 2026-07');
            return self::FAILURE;
        }

        $branchId = $this->option('branch');
        if (!$branchId) {
            $this->error('Wajib pakai --branch=<id>. Menghitung semua cabang sekaligus belum didukung.');
            return self::FAILURE;
        }

        $branch = Branch::find($branchId);
        if (!$branch) {
            $this->error("Branch {$branchId} tidak ditemukan.");
            return self::FAILURE;
        }

        $groupings = TransactionLoanOfficerGrouping::where('branch_id', $branch->id)
            ->orderBy('kelompok')->get();

        if ($groupings->isEmpty()) {
            $this->error("{$branch->unit} tidak punya kelompok.");
            return self::FAILURE;
        }

        $awal = $periode->copy()->startOfMonth();
        $akhir = $periode->copy()->endOfMonth();
        $ids = $groupings->pluck('id')->all();
        $namaKelompok = $groupings->pluck('kelompok', 'id');

        $this->info(sprintf(
            '%s — %s (%d kelompok)%s',
            $branch->unit,
            $periode->format('F Y'),
            $groupings->count(),
            $this->option('tulis') ? '  [MENULIS]' : '  [banding saja, tidak menulis]'
        ));

        $baru = HitungAgregat::harianBanyak($ids, $awal, $akhir);
        $lama = $this->rekapLama($ids, $awal, $akhir);

        $this->laporkan($baru, $lama, $namaKelompok);

        if ($this->option('tulis')) {
            $ditulis = $this->tulis($baru);
            $this->newLine();
            $this->info("Disimpan ke transaction_daily_closings: {$ditulis} baris.");
        }

        return self::SUCCESS;
    }

    /** Angka pembanding dari transaction_daily_recaps. */
    private function rekapLama(array $ids, Carbon $awal, Carbon $akhir): array
    {
        $rows = DB::table('transaction_daily_recaps')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('date', [$awal->toDateString(), $akhir->toDateString()])
            ->get(['transaction_loan_officer_grouping_id AS g', 'date AS tgl', 'drop', 'storting']);

        $out = [];
        foreach ($rows as $r) {
            $out[$r->g . '|' . Carbon::parse($r->tgl)->toDateString()] = [
                'drop' => (int) $r->drop,
                'storting' => (int) $r->storting,
            ];
        }

        return $out;
    }

    private function laporkan(array $baru, array $lama, $namaKelompok): void
    {
        $kunci = array_unique(array_merge(array_keys($baru), array_keys($lama)));
        sort($kunci);

        $cocok = 0;
        $beda = [];
        $totalBaruDrop = $totalLamaDrop = $totalBaruStor = $totalLamaStor = 0;

        foreach ($kunci as $k) {
            $b = $baru[$k] ?? HitungAgregat::kosong();
            $l = $lama[$k] ?? ['drop' => 0, 'storting' => 0];

            $totalBaruDrop += $b['drop'];
            $totalLamaDrop += $l['drop'];
            $totalBaruStor += $b['storting'];
            $totalLamaStor += $l['storting'];

            if ($b['drop'] === $l['drop'] && $b['storting'] === $l['storting']) {
                $cocok++;
                continue;
            }

            $beda[] = [$k, $b, $l];
        }

        $this->newLine();
        $this->table(
            ['', 'Mesin baru', 'Rekap lama', 'Selisih'],
            [
                ['drop', number_format($totalBaruDrop), number_format($totalLamaDrop), number_format($totalBaruDrop - $totalLamaDrop)],
                ['storting', number_format($totalBaruStor), number_format($totalLamaStor), number_format($totalBaruStor - $totalLamaStor)],
            ]
        );

        $this->line(sprintf(
            'Baris diperiksa: %d  →  cocok %d, beda %d',
            count($kunci),
            $cocok,
            count($beda)
        ));

        if ($beda && $this->option('rinci')) {
            $this->newLine();
            $baris = [];
            foreach (array_slice($beda, 0, 30) as [$k, $b, $l]) {
                [$g, $tgl] = explode('|', $k);
                $baris[] = [
                    'kel ' . $namaKelompok->get((int) $g),
                    $tgl,
                    number_format($b['drop']),
                    number_format($l['drop']),
                    number_format($b['storting']),
                    number_format($l['storting']),
                ];
            }
            $this->table(['Kelompok', 'Tanggal', 'drop baru', 'drop lama', 'stor baru', 'stor lama'], $baris);

            if (count($beda) > 30) {
                $this->line('... dan ' . (count($beda) - 30) . ' baris lain.');
            }
        } elseif ($beda) {
            $this->line('Pakai --rinci untuk melihat baris yang selisih.');
        }
    }

    /**
     * Simpan hanya ke baris yang SUDAH ADA dan BELUM terkunci.
     *
     * Tidak membuat baris baru: pembuatan baris urusan closing:generate, yang
     * mengikuti kalender kerja. Kalau baris hari itu tidak ada, artinya hari itu
     * bukan hari kerja — dan angka yang jatuh di sana justru perlu terlihat
     * sebagai kejanggalan, bukan diam-diam dibuatkan tempat.
     */
    private function tulis(array $baru): int
    {
        $n = 0;

        DB::transaction(function () use ($baru, &$n) {
            foreach ($baru as $kunci => $angka) {
                [$g, $tgl] = explode('|', $kunci);

                $terpengaruh = TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $g)
                    ->whereDate('date', $tgl)
                    ->whereNull('kasir_lock_at')
                    ->update($angka);

                $n += $terpengaruh;
            }
        });

        return $n;
    }
}
