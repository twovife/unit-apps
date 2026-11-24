<?php
// Kumulatif meneruskan angka STAF KONTROL, bukan Rekap 2.
//
// Dua cacat yang dijaga uji ini, keduanya pernah terjadi:
//  1. tanggal tanpa baris jatuh ke kumulatif sistem apa adanya, koreksi staf
//     kontrol hilang begitu saja di tanggal berikutnya;
//  2. tanggal yang belum dilaporkan ikut menambah angka sistem, jadi
//     kumulatifnya campuran laporan dan sistem - tidak berarti apa-apa.
//
// Berjalan di dalam transaksi yang DIBATALKAN.
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_kumulatif_bersambung.php
use App\Http\Controllers\RekapWilayahController;
use App\Models\RegionalCirculationRecap;
use App\Models\User;
use App\Services\AngkaRekapWilayah;
use Illuminate\Http\Request;

$periode = '2026-11-01';
$lebih = 1_000_000;

$u = User::whereHas('roles', fn ($q) => $q->where('name', 'superuser'))->first();
if (! $u) { exit("LEWAT: tidak ada superuser\n"); }
auth()->login($u);

// Wilayah yang belum punya baris sama sekali, supaya ujinya bersih.
$wilayah = null;
foreach (\App\Models\Branch::where('isactive', true)->whereNotNull('wilayah')->pluck('wilayah')->unique() as $w) {
    $ada = RegionalCirculationRecap::where('wilayah', $w)->whereDate('tanggal', '>=', $periode)->exists();
    if (! $ada) { $wilayah = (int) $w; break; }
}
if ($wilayah === null) { exit("LEWAT: semua wilayah sudah terisi\n"); }

$sistem = AngkaRekapWilayah::untukBulan($wilayah, $periode);
$tanggal = array_slice(array_keys($sistem), 0, 6);
$branchId = array_key_first($sistem[$tanggal[0]]);

DB::beginTransaction();

try {
    // Isi 4 tanggal pertama saja, drop dilebihkan dari sistem tiap hari.
    $kirim = [];
    foreach (array_slice($tanggal, 0, 4) as $t) {
        $kirim[] = ['branch_id' => $branchId, 'tanggal' => $t,
            'nilai' => ['drop' => (int) $sistem[$t][$branchId]['drop'] + $lebih]];
    }
    app(RekapWilayahController::class)->simpan(Request::create('/x', 'POST', ['baris' => $kirim]));

    $beda = 0;
    $dilapor = 0;
    printf("%-12s %-10s %-16s %-16s %s\n", 'tanggal', 'dilapor', 'jml drop', 'sistem', 'seharusnya');

    foreach ($tanggal as $i => $t) {
        $r = RegionalCirculationRecap::where('branch_id', $branchId)->whereDate('tanggal', $t)->first();
        $s = (int) $sistem[$t][$branchId]['total_drop'];
        $tampil = $r?->total_drop ?? $s;

        // Hanya tanggal yang diisi yang menambah. Tanggal 5 dan seterusnya
        // belum dilaporkan, jadi kumulatifnya berhenti di angka tanggal 4.
        if ($i < 4) {
            $dilapor += (int) $sistem[$t][$branchId]['drop'] + $lebih;
        }

        printf("%-12s %-10s %-16s %-16s %s\n", $t, $i < 4 ? 'ya' : '-',
            number_format($tampil, 0, ',', '.'), number_format($s, 0, ',', '.'),
            number_format($dilapor, 0, ',', '.'));

        if ($tampil !== $dilapor) {
            $beda++;
            echo "  BEDA\n";
        }
    }

    assert($beda === 0, 'kumulatif tidak meneruskan angka staf kontrol');
    echo "OK semua\n";
} finally {
    DB::rollBack();
}
