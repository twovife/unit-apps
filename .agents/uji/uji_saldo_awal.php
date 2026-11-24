<?php
// Saldo awal yang dilaporkan kantor harus menggeser seluruh kumulatif bulan
// itu, bukan cuma tersimpan diam di tabelnya sendiri.
//
// Berjalan di dalam transaksi yang DIBATALKAN, jadi tidak meninggalkan data.
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_saldo_awal.php
use App\Http\Controllers\RekapWilayahController;
use App\Models\Branch;
use App\Models\RegionalCirculationOpening;
use App\Models\RegionalCirculationRecap;
use App\Models\User;
use App\Services\AngkaRekapWilayah;
use Illuminate\Http\Request;

$periode = '2026-11-01';
$selisih = 1_000_000;

$u = User::whereHas('roles', fn ($q) => $q->where('name', 'superuser'))->first();
if (! $u) { exit("LEWAT: tidak ada superuser\n"); }
auth()->login($u);

// Kantor mana pun yang sudah punya baris harian bulan itu.
$branchId = RegionalCirculationRecap::whereDate('tanggal', '>=', $periode)->value('branch_id');
if (! $branchId) { exit("LEWAT: belum ada baris harian di $periode\n"); }

$branch = Branch::find($branchId);
$sistem = AngkaRekapWilayah::untukBulan((int) $branch->wilayah, $periode, $branchId);
$awalSistem = (int) (reset($sistem)[$branchId]['awal_sirkulasi'] ?? 0);

DB::beginTransaction();

try {
    $akhir = fn () => (int) RegionalCirculationRecap::where('branch_id', $branchId)
        ->whereNull('checked_at')->orderByDesc('tanggal')->value('sirkulasi');

    $sebelum = $akhir();

    app(RekapWilayahController::class)->simpanAwal(
        Request::create('/x', 'POST', ['periode' => $periode, 'nilai' => ['awal_sirkulasi' => $awalSistem + $selisih]]),
        $branch
    );

    $baris = RegionalCirculationOpening::where('branch_id', $branchId)->whereDate('periode', $periode)->first();
    $sesudah = $akhir();

    printf("kantor %d: awal sistem %d, dilaporkan %d\n", $branchId, $awalSistem, $baris?->awal_sirkulasi);
    printf("sirkulasi akhir %d -> %d (%+d)\n", $sebelum, $sesudah, $sesudah - $sebelum);

    assert($baris !== null, 'baris saldo awal tidak tersimpan');
    assert((int) $baris->awal_sirkulasi === $awalSistem + $selisih, 'angka yang tersimpan bukan yang dikirim');
    assert($baris->periode->toDateString() === $periode, 'periode tidak dipatok ke tanggal 1');
    assert($sesudah - $sebelum === $selisih, 'kumulatif tidak ikut bergeser');

    echo "OK semua\n";
} finally {
    DB::rollBack();
}
