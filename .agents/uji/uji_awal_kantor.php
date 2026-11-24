<?php
// Dua jalur murah harus memberi angka yang sama dengan untukBulan() penuh,
// yang sudah terbukti sama dengan Rekap 2:
//   awalKantor()                  -> saldo awal satu kantor  (autosave)
//   untukBulan(w, t, $branchId)   -> sebulan satu kantor      (tombol Cek)
// Jalankan:
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_awal_kantor.php
use App\Models\Branch;
use App\Services\AngkaRekapWilayah;

$tanggal = '2026-11-05';
$beda = 0;
$diperiksa = 0;

foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->pluck('wilayah')->unique()->take(3) as $w) {
    // Dibandingkan pada TANGGAL yang sama. Jalur sempit bisa punya daftar
    // tanggal lebih pendek (tanggal libur yang berisi cuma di kantor lain),
    // jadi "tanggal pertama" bukan patokan yang sama.
    $perKantor = AngkaRekapWilayah::untukBulan((int) $w, $tanggal)[$tanggal] ?? [];

    foreach ($perKantor as $branchId => $acuan) {
        $uji = AngkaRekapWilayah::awalKantor((int) $branchId, $tanggal);

        foreach (['awal_sirkulasi', 'awal_cm', 'awal_mb', 'awal_ml'] as $k) {
            $diperiksa++;
            if ((int) ($uji[$k] ?? 0) !== (int) ($acuan[$k] ?? 0)) {
                $beda++;
                printf("BEDA kantor %d %s: awalKantor=%d untukBulan=%d\n", $branchId, $k, $uji[$k] ?? 0, $acuan[$k] ?? 0);
            }
        }

        // Jalur tombol Cek: sebulan tetapi disempitkan ke satu kantor.
        $sempit = AngkaRekapWilayah::untukWilayah((int) $w, $tanggal, (int) $branchId)[$branchId] ?? [];
        foreach ($acuan as $k => $v) {
            $diperiksa++;
            if ((int) ($sempit[$k] ?? 0) !== (int) $v) {
                $beda++;
                printf("BEDA kantor %d %s: sempit=%d penuh=%d\n", $branchId, $k, $sempit[$k] ?? 0, $v);
            }
        }
    }
}

printf("diperiksa=%d beda=%d\n", $diperiksa, $beda);
