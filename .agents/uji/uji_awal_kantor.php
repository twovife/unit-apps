<?php
// awalKantor() harus memberi saldo awal yang sama dengan untukBulan(), yang
// sudah terbukti sama dengan Rekap 2. Jalankan:
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_awal_kantor.php
use App\Models\Branch;
use App\Services\AngkaRekapWilayah;

$tanggal = '2026-11-05';
$beda = 0;
$diperiksa = 0;

foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->pluck('wilayah')->unique()->take(3) as $w) {
    $sebulan = AngkaRekapWilayah::untukBulan((int) $w, $tanggal);
    $perKantor = $sebulan[array_key_first($sebulan)] ?? [];

    foreach ($perKantor as $branchId => $acuan) {
        $uji = AngkaRekapWilayah::awalKantor((int) $branchId, $tanggal);

        foreach (['awal_sirkulasi', 'awal_cm', 'awal_mb', 'awal_ml'] as $k) {
            $diperiksa++;
            if ((int) ($uji[$k] ?? 0) !== (int) ($acuan[$k] ?? 0)) {
                $beda++;
                printf("BEDA kantor %d %s: awalKantor=%d untukBulan=%d\n", $branchId, $k, $uji[$k] ?? 0, $acuan[$k] ?? 0);
            }
        }
    }
}

printf("diperiksa=%d beda=%d\n", $diperiksa, $beda);
