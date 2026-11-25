<?php
// Cek harus urut dari awal bulan. Melompati satu hari kerja ditolak 422,
// dan pesannya menyebut tanggal yang tertinggal.
//
// Transaksi DIBATALKAN.
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_rantai_cek.php
use App\Http\Controllers\RekapWilayahController;
use App\Models\Branch;
use App\Models\RegionalCirculationRecap;
use App\Models\User;
use App\Services\AngkaRekapWilayah;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

$periode = '2026-11-01';
$u = User::whereHas('roles', fn ($q) => $q->where('name', 'superuser'))->first();
if (! $u) { exit("LEWAT: tidak ada superuser\n"); }
auth()->login($u);

$branch = Branch::where('isactive', true)->whereNotNull('wilayah')->orderBy('id')->first();
$tanggal = array_keys(AngkaRekapWilayah::untukBulan((int) $branch->wilayah, $periode, $branch->id));
$c = app(RekapWilayahController::class);
$cek = fn ($t) => $c->cek(Request::create('/x', 'POST', ['tanggal' => $t]), $branch);

DB::beginTransaction();

try {
    RegionalCirculationRecap::where('branch_id', $branch->id)->delete();

    // Melompat ke tanggal ketiga tanpa mengecek dua yang pertama.
    $pesan = null;
    try {
        $cek($tanggal[2]);
    } catch (HttpException $e) {
        $pesan = $e->getStatusCode() . ' ' . $e->getMessage();
    }
    printf("lompat ke %s  -> %s\n", $tanggal[2], $pesan ?? 'DITERIMA (salah)');
    assert($pesan !== null && str_starts_with($pesan, '422'), 'lompat tanggal diterima');
    assert(str_contains($pesan, substr($tanggal[0], 8)), 'pesan tidak menyebut tanggal yang tertinggal');

    // Urut: tanggal 1, lalu 2, lalu 3 — semuanya diterima.
    foreach (array_slice($tanggal, 0, 3) as $t) {
        $cek($t);
        $r = RegionalCirculationRecap::where('branch_id', $branch->id)->whereDate('tanggal', $t)->first();
        printf("cek %s        -> %s\n", $t, $r?->terkunci() ? 'terkunci' : 'GAGAL');
        assert($r?->terkunci(), "cek $t gagal");
    }

    // Kantor lain tidak terseret: rantainya per kantor.
    $lain = Branch::where('isactive', true)->whereNotNull('wilayah')->where('id', '!=', $branch->id)->first();
    $pesanLain = null;
    try {
        $c->cek(Request::create('/x', 'POST', ['tanggal' => $tanggal[1]]), $lain);
    } catch (HttpException $e) {
        $pesanLain = $e->getStatusCode();
    }
    printf("kantor lain lompat -> %s\n", $pesanLain === 422 ? '422 (benar, rantainya per kantor)' : 'DITERIMA (salah)');
    assert($pesanLain === 422, 'rantai tidak berlaku di kantor lain');

    echo "OK semua\n";
} finally {
    DB::rollBack();
}
