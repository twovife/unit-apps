<?php
// Cek saldo awal: membuat barisnya dari angka sistem kalau belum pernah
// diketik, mengunci, dan menolak diubah sesudahnya. Buka mengembalikannya.
//
// Transaksi DIBATALKAN.
//   docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_cek_saldo_awal.php
use App\Http\Controllers\RekapWilayahController;
use App\Models\Branch;
use App\Models\RegionalCirculationOpening;
use App\Models\User;
use App\Services\AngkaRekapWilayah;
use Illuminate\Http\Request;

$periode = '2026-11-01';
$u = User::whereHas('roles', fn ($q) => $q->where('name', 'superuser'))->first();
if (! $u) { exit("LEWAT: tidak ada superuser\n"); }
auth()->login($u);

// Kantor yang saldo awalnya BUKAN nol, supaya ujinya berarti.
$branch = null;
$sistem = [];
foreach (Branch::where('isactive', true)->whereNotNull('wilayah')->orderBy('id')->take(20)->get() as $b) {
    $sebulan = AngkaRekapWilayah::untukBulan((int) $b->wilayah, $periode, $b->id);
    $s = $sebulan ? (reset($sebulan)[$b->id] ?? []) : [];
    if ((int) ($s['awal_sirkulasi'] ?? 0) > 0) {
        $branch = $b;
        $sistem = $s;
        break;
    }
}
if ($branch === null) { exit("LEWAT: tidak ada kantor dengan saldo awal bukan nol\n"); }
$c = app(RekapWilayahController::class);

DB::beginTransaction();

try {
    RegionalCirculationOpening::where('branch_id', $branch->id)->whereDate('periode', $periode)->delete();

    $c->cekAwal(Request::create('/x', 'POST', ['periode' => $periode]), $branch);
    $o = RegionalCirculationOpening::where('branch_id', $branch->id)->whereDate('periode', $periode)->first();

    printf("sesudah cek: awal_sirkulasi=%s (sistem %s) terkunci=%s oleh=%s\n",
        number_format((int) $o->awal_sirkulasi, 0, ',', '.'),
        number_format((int) ($sistem['awal_sirkulasi'] ?? 0), 0, ',', '.'),
        $o->terkunci() ? 'ya' : 'tidak', $o->checked_by);

    assert($o !== null, 'baris saldo awal tidak dibuat');
    assert($o->terkunci(), 'tidak terkunci sesudah dicek');
    assert((int) $o->awal_sirkulasi === (int) ($sistem['awal_sirkulasi'] ?? 0), 'tidak diisi angka sistem');

    // Terkunci: simpan harus ditolak.
    $ditolak = false;
    try {
        $c->simpanAwal(Request::create('/x', 'POST', ['periode' => $periode, 'nilai' => ['awal_cm' => 1]]), $branch);
    } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
        $ditolak = $e->getStatusCode() === 422;
    }
    printf("simpan saat terkunci ditolak: %s\n", $ditolak ? 'ya' : 'TIDAK');
    assert($ditolak, 'saldo awal terkunci masih bisa diubah');

    // Buka tanpa alasan ditolak, dengan alasan diterima.
    $wajib = false;
    try {
        $c->bukaAwal(Request::create('/x', 'POST', ['periode' => $periode]), $branch);
    } catch (\Illuminate\Validation\ValidationException $e) {
        $wajib = true;
    }
    printf("buka tanpa alasan ditolak: %s\n", $wajib ? 'ya' : 'TIDAK');
    assert($wajib, 'buka tanpa alasan diterima');

    $c->bukaAwal(Request::create('/x', 'POST', ['periode' => $periode, 'alasan' => 'salah ketik dari WA']), $branch);
    printf("sesudah buka: terkunci=%s\n", $o->fresh()->terkunci() ? 'ya' : 'tidak');
    assert(! $o->fresh()->terkunci(), 'masih terkunci sesudah dibuka');

    echo "OK semua\n";
} finally {
    DB::rollBack();
}
