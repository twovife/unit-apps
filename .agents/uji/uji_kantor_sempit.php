<?php
// untukBulan(w, t, $branchId) — sebulan tetapi disempitkan ke satu kantor —
// harus memberi angka yang sama dengan untukBulan() penuh, yang sudah terbukti
// sama dengan Rekap 2. Dipakai tombol Cek dan hitung ulang kumulatif.
// Jalankan:
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_kantor_sempit.php
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
