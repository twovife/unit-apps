<?php
// Koreksi staf kontrol harus MENJALAR ke tanggal sesudahnya, walau tanggal
// itu belum diisi. Kalau tanggal 2 salah, Jml dan Saldo tanggal 3 ke bawah
// ikut selisih — itu memang yang mau dilihat staf kontrol.
//
// Cacat yang dijaga (pernah terjadi 2026-11-24): tanggal tanpa baris jatuh ke
// kumulatif sistem apa adanya, jadi kelebihan yang dilaporkan lenyap di
// tanggal berikutnya lalu muncul lagi kalau tanggal itu diisi.
//
// Transaksi DIBATALKAN.
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
    printf("%-12s %-10s %-16s %-16s %s\n", 'tanggal', 'diisi', 'jml drop', 'sistem', 'selisih');

    foreach ($tanggal as $i => $t) {
        $r = RegionalCirculationRecap::where('branch_id', $branchId)->whereDate('tanggal', $t)->first();
        $s = (int) $sistem[$t][$branchId]['total_drop'];
        $tampil = $r?->total_drop ?? $s;

        // Kelebihan menumpuk 1 juta per tanggal yang diisi, lalu BERTAHAN di
        // tanggal sesudahnya karena tanggal itu menyumbang angka sistemnya.
        $harus = $s + $lebih * min($i + 1, 4);

        printf("%-12s %-10s %-16s %-16s %+d\n", $t, $i < 4 ? 'ya' : '-',
            number_format($tampil, 0, ',', '.'), number_format($s, 0, ',', '.'), $tampil - $s);

        if ($tampil !== $harus) {
            $beda++;
            printf("  BEDA: seharusnya %s\n", number_format($harus, 0, ',', '.'));
        }
    }

    assert($beda === 0, 'koreksi staf kontrol tidak menjalar ke tanggal berikutnya');
    echo "OK semua\n";
} finally {
    DB::rollBack();
}
