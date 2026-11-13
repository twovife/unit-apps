<?php

namespace App\Console\Commands;

use App\Helpers\TargetMingguan;
use App\Models\Branch;
use App\Models\TransactionLoanOfficerGrouping;
use Illuminate\Console\Command;

// Cron H+1 dini hari: lahirkan target minggu depan (auto) untuk hari tagih lewat
// yang belum dicek KM, di semua kantor migrasi. Placeholder supaya rantai target
// tak putus saat kantor membelot; KM tetap wajib cek (nilai auto ditimpa manual
// saat dicek). --branch membatasi ke satu kantor (dipakai debugging / manual).
class MaterialisasiTargetOtomatis extends Command
{
    protected $signature = 'target:auto {--branch= : batasi ke satu branch_id}';

    protected $description = 'Materialisasi target minggu depan (auto) untuk hari tagih lewat yang belum dicek KM (kantor migrasi saja).';

    public function handle(): int
    {
        // mulai_pendataan_baru NULL = belum migrasi -> tidak disentuh.
        $branchIds = Branch::whereNotNull('mulai_pendataan_baru')
            ->when($this->option('branch'), fn ($q, $b) => $q->whereKey($b))
            ->pluck('id');

        $total = 0;
        foreach ($branchIds as $branchId) {
            foreach (TransactionLoanOfficerGrouping::where('branch_id', $branchId)->pluck('id') as $groupingId) {
                $total += TargetMingguan::materialisasiAuto($groupingId);
            }
        }

        $this->info("Target auto dimaterialisasi: {$total} baris.");

        return self::SUCCESS;
    }
}
