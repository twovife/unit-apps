<?php

namespace App\Console\Commands;

use App\Helpers\Ember;
use App\Helpers\HitungAgregat;
use App\Helpers\PenyesuaianSaldo;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

// Bukti F8: saldo per pinjaman (PenyesuaianSaldo::saldoBanyak) dijumlah per ember
// harus sama persis dengan HitungAgregat::portofolio. Read-only. Dibandingkan per
// kantor, bukan per kelompok: portofolio mengelompokkan menurut kelompok EFEKTIF
// (mutasi), tapi mutasi tak pernah keluar kantor, jadi total kantor tetap sama.
class CekSaldo extends Command
{
    protected $signature = 'saldo:cek {branch : branch_id} {--tanggal= : saldo per tanggal (bawaan hari ini)}';

    protected $description = 'Bukti rumus saldo F8: saldoBanyak per ember = HitungAgregat::portofolio (read-only).';

    public function handle(): int
    {
        $tanggal = Carbon::parse($this->option('tanggal') ?: now())->toDateString();
        $ref = Carbon::parse($tanggal)->startOfMonth()->toDateString();
        $groupingIds = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $this->argument('branch'))->pluck('id')->all();

        $porto = array_fill_keys(Ember::SEMUA, 0);
        foreach (HitungAgregat::portofolio($groupingIds, $tanggal, $ref) as $perEmber) {
            foreach ($perEmber as $ember => $saldo) {
                $porto[$ember] += $saldo;
            }
        }

        // Saringan keanggotaan sama dengan portofolio: success, sudah drop, punya hari, saldo > 0.
        $f8 = array_fill_keys(Ember::SEMUA, 0);
        DB::table('transaction_loans')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->where('status', 'success')
            ->where('drop_date', '<=', $tanggal)
            ->whereNotNull('hari')
            ->select('id', 'drop_date')
            ->orderBy('id')
            ->chunk(1000, function ($loans) use (&$f8, $tanggal, $ref) {
                $saldo = PenyesuaianSaldo::saldoBanyak($loans->pluck('id')->all(), $tanggal);
                foreach ($loans as $l) {
                    $s = $saldo[$l->id]['saldo'] ?? 0;
                    if ($s > 0) {
                        $f8[Ember::dari($l->drop_date, $ref)] += $s;
                    }
                }
            });

        $baris = [];
        $beda = 0;
        foreach (Ember::SEMUA as $ember) {
            $selisih = $f8[$ember] - $porto[$ember];
            $beda += abs($selisih);
            $baris[] = [$ember, number_format($porto[$ember]), number_format($f8[$ember]), number_format($selisih)];
        }
        $this->table(['ember', 'portofolio', 'f8', 'selisih'], $baris);

        if ($beda !== 0) {
            $this->error("BEDA per $tanggal");
            return self::FAILURE;
        }

        $this->info("SAMA per $tanggal");
        return self::SUCCESS;
    }
}
