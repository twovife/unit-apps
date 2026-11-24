<?php
// Tanggal yang belum dilaporkan tidak boleh merah sebaris penuh.
//
// Bug 2026-11-24: mengetik storting di tanggal 2 membuat tanggal 3 dan
// seterusnya merah di semua kolom Jml & Saldo. Angkanya memang berhenti di
// laporan terakhir, tapi itu bukan "kasir salah lapor" melainkan "belum ada
// laporan" — yang ditampilkan seharusnya angka sistem.
//
// Transaksi DIBATALKAN.
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_belum_dilapor_tidak_merah.php
use App\Http\Controllers\RekapWilayahController;
use App\Models\Branch;
use App\Models\RegionalCirculationRecap;
use App\Models\User;
use App\Services\AngkaRekapWilayah;
use Illuminate\Http\Request;

$periode = '2026-11-01';
$u = User::whereHas('roles', fn ($q) => $q->where('name', 'superuser'))->first();
if (! $u) { exit("LEWAT: tidak ada superuser\n"); }
auth()->login($u);

$wilayah = null;
foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->pluck('wilayah')->unique() as $w) {
    if (! RegionalCirculationRecap::where('wilayah', $w)->exists()) { $wilayah = (int) $w; break; }
}
if ($wilayah === null) { exit("LEWAT: semua wilayah sudah terisi\n"); }

$sistem = AngkaRekapWilayah::untukBulan($wilayah, $periode);
$tanggal = array_slice(array_keys($sistem), 0, 3);
$branchId = array_key_first($sistem[$tanggal[0]]);

DB::beginTransaction();

try {
    // Storting saja, di tanggal pertama saja.
    app(RekapWilayahController::class)->simpan(Request::create('/x', 'POST', ['baris' => [
        ['branch_id' => $branchId, 'tanggal' => $tanggal[0], 'nilai' => ['storting' => 1_234_000]],
    ]]));

    $disentuh = new ReflectionMethod(RekapWilayahController::class, 'disentuh');
    $disentuh->setAccessible(true);
    $c = app(RekapWilayahController::class);

    $salah = 0;
    foreach ($tanggal as $i => $t) {
        $r = RegionalCirculationRecap::where('branch_id', $branchId)->whereDate('tanggal', $t)->first();
        $kirim = $disentuh->invoke($c, $r);

        printf("%s  baris=%s  disentuh=%s  total_drop tersimpan=%s\n",
            $t, $r ? 'ada' : '-', $kirim ? 'ya' : 'tidak', $r?->total_drop ?? '-');

        // Tanggal pertama dilaporkan -> angkanya dikirim. Sisanya tidak.
        if ($kirim !== ($i === 0)) {
            $salah++;
            echo "  SALAH\n";
        }
    }

    assert($salah === 0, 'tanggal yang belum dilapor masih dikirim angkanya (akan merah di layar)');
    echo "OK semua\n";
} finally {
    DB::rollBack();
}
