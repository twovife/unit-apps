<?php

namespace App\Console\Commands;

use App\Helpers\Ember;
use App\Helpers\HitungAgregat;
use App\Helpers\TutupBulanan;
use App\Models\Branch;
use App\Models\TransactionDailyClosing;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
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
                            {--bulanan : Susun juga baris agregat bulanan dari harian}
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

        if ($this->option('bulanan')) {
            $this->susunBulanan($ids, $periode);
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
     * Susun baris bulanan dari harian, lalu periksa dua hal yang harus benar.
     */
    private function susunBulanan(array $ids, Carbon $periode): void
    {
        $this->newLine();
        $this->info('Menyusun agregat bulanan dari harian...');

        $r = TutupBulanan::susun($ids, $periode, $this->option('tulis'));

        $this->line(sprintf(
            '  dibuat %d, diperbarui %d, dilewati (terkunci) %d%s',
            $r['dibuat'],
            $r['diperbarui'],
            $r['dilewati'],
            $this->option('tulis') ? '' : '  [tidak menulis - pakai --tulis]'
        ));

        if (!$this->option('tulis')) {
            return;
        }

        $baris = TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $periode->toDateString())
            ->get();

        if ($baris->isEmpty()) {
            return;
        }

        // Periksa 1: arus bulanan harus sama dengan jumlah harian.
        $harian = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('date', [
                $periode->toDateString(),
                $periode->copy()->endOfMonth()->toDateString(),
            ])
            ->selectRaw('SUM(`drop`) d, SUM(storting) s, SUM(pemutihan) p')
            ->first();

        $this->newLine();
        $this->table(
            ['', 'Bulanan', 'Jumlah harian', 'Cocok?'],
            [
                ['drop', number_format($baris->sum('drop')), number_format((int) $harian->d), $baris->sum('drop') == (int) $harian->d ? 'ya' : 'TIDAK'],
                ['storting', number_format($baris->sum('storting')), number_format((int) $harian->s), $baris->sum('storting') == (int) $harian->s ? 'ya' : 'TIDAK'],
                ['pemutihan', number_format($baris->sum('pemutihan')), number_format((int) $harian->p), $baris->sum('pemutihan') == (int) $harian->p ? 'ya' : 'TIDAK'],
            ]
        );

        // Periksa 2: saldo akhir menurut portofolio vs menurut arus.
        // Keduanya dihitung lewat jalur yang sama sekali berbeda, jadi
        // kecocokannya bukan tautologi.
        $selisih = $baris->filter(fn($b) => $b->selisihArusVsPortofolio() !== 0);

        $this->line(sprintf(
            'Saldo akhir: portofolio %s vs arus %s  →  %d dari %d baris cocok',
            number_format($baris->sum('akhir_total')),
            number_format($baris->sum(fn($b) => $b->akhirMenurutArus())),
            $baris->count() - $selisih->count(),
            $baris->count()
        ));

        if ($selisih->isNotEmpty() && $this->option('rinci')) {
            $rinci = $selisih->take(15)->map(fn($b) => [
                $b->hari,
                number_format($b->awal_total),
                number_format($b->akhir_total),
                number_format($b->akhirMenurutArus()),
                number_format($b->selisihArusVsPortofolio()),
            ])->all();
            $this->table(['Hari', 'awal', 'akhir (portofolio)', 'akhir (arus)', 'selisih'], $rinci);
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
