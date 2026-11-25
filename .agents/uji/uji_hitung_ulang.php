<?php
// Mengetik SATU kolom tidak boleh menolkan kolom lain.
//
// Bug 2026-11-24: staf kontrol mengetik storting, lalu "Jml Drop" jadi 0.
// Sebabnya kumulatif dijumlah dari kolom yang pernah diketik saja, padahal
// yang tidak diketik harus memakai angka sistem (Rekap 2).
//
// Berjalan di dalam transaksi yang DIBATALKAN, jadi tidak meninggalkan data.
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_hitung_ulang.php
use App\Http\Controllers\RekapWilayahController;
use App\Models\Branch;
use App\Models\RegionalCirculationRecap;
use App\Services\AngkaRekapWilayah;

$periode = '2026-11-01';

// Cari kantor + tanggal yang angka sistemnya tidak nol, supaya ujinya berarti.
$pilih = null;
foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->pluck('wilayah')->unique()->take(3) as $w) {
    foreach (AngkaRekapWilayah::untukBulan((int) $w, $periode) as $t => $perKantor) {
        foreach ($perKantor as $branchId => $s) {
            if (($s['drop'] ?? 0) > 0 && ($s['storting'] ?? 0) > 0) {
                $pilih = [(int) $w, (int) $branchId, $t, $s];
                break 3;
            }
        }
    }
}

if ($pilih === null) {
    exit("LEWAT: tidak ada kantor dengan drop & storting bukan nol di $periode\n");
}

[$wilayah, $branchId, $tanggal, $sistem] = $pilih;

$hitung = new ReflectionMethod(RekapWilayahController::class, 'hitungUlangBulan');
$hitung->setAccessible(true);
$controller = app(RekapWilayahController::class);

DB::beginTransaction();

try {
    // Staf kontrol mengetik STORTING saja. Kolom lain tetap null.
    $baris = RegionalCirculationRecap::updateOrCreate(
        ['branch_id' => $branchId, 'tanggal' => $tanggal],
        ['wilayah' => $wilayah, 'storting' => 7_777_000]
    );

    $hitung->invoke($controller, $branchId, $wilayah, $tanggal);
    $baris->refresh();

    // Jml Drop hari itu = jumlah drop sistem dari tanggal 1 s/d tanggal ini,
    // karena tidak satu pun drop diketik.
    $dropSampai = 0;
    foreach (AngkaRekapWilayah::untukBulan($wilayah, $periode, $branchId) as $t => $perKantor) {
        if ($t > $tanggal) {
            break;
        }
        $dropSampai += (int) ($perKantor[$branchId]['drop'] ?? 0);
    }

    printf("kantor %d tanggal %s\n", $branchId, $tanggal);
    printf("  drop sistem hari ini   : %d\n", $sistem['drop']);
    printf("  total_drop tersimpan   : %d\n", (int) $baris->total_drop);
    printf("  total_drop seharusnya  : %d\n", $dropSampai);

    assert((int) $baris->total_drop === $dropSampai, 'total_drop tidak memakai angka sistem');
    assert((int) $baris->total_drop > 0, 'total_drop nol padahal drop sistem tidak nol');
    assert((int) $baris->storting === 7_777_000, 'storting yang diketik ikut tertimpa');

    echo "OK semua\n";
} finally {
    DB::rollBack();
}
