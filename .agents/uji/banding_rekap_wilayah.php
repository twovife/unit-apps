<?php

// Bandingkan AngkaRekapWilayah dengan Rekap 2 (RekapTrait::getDataRekapDua)
// kolom per kolom, kantor per kantor. Rekap 2 yang jadi patokan.
//
// HANYA MEMBACA. Tidak ada tulisan ke basis data.
//
// Jalankan:
//   docker exec unit-app php artisan tinker \
//     --execute="include '.agents/uji/banding_rekap_wilayah.php';"
//
// Ubah $PERIKSA di bawah untuk memeriksa wilayah atau tanggal lain.

// Pakai tanggal yang BENAR-BENAR ada transaksinya, kalau tidak kolom harian
// (drop, storting, angsuran) nol di kedua sisi dan perbandingannya tidak
// membuktikan apa-apa. Salinan lokal berhenti di 2026-11-16.
$PERIKSA = [
    [1, '2026-11-16'],  // wilayah terbesar, 32 kantor, termasuk Sidoarjo 2 (alur lama)
    [8, '2026-11-13'],  // termasuk Solo 1 (alur lama)
    [10, '2026-11-11'], // 33 kantor
    [4, '2026-10-15'],  // bulan yang sudah lewat
    [1, '2026-10-01'],  // tanggal 1 yang jatuh di hari kerja (1 November 2026 = Minggu)
];

$KOLOM = [
    'drop', 'total_drop', 'storting', 'total_storting', 'sirkulasi',
    'angsuran_cm', 'total_angsuran_cm', 'saldo_cm',
    'angsuran_mb', 'total_angsuran_mb', 'saldo_mb',
    'angsuran_ml', 'total_angsuran_ml', 'saldo_ml',
];

$user = App\Models\User::whereHas('roles', fn ($q) => $q->where('name', 'superuser'))->first();
if (! $user) {
    echo "Tidak ada user superuser; Rekap 2 tidak bisa dipanggil.\n";

    return;
}
auth()->login($user);

$rekap = new class { use App\Traits\RekapTrait; };

$diperiksa = 0;
$beda = 0;

foreach ($PERIKSA as [$wilayah, $tanggal]) {
    $mulai = microtime(true);
    $punyaku = App\Services\AngkaRekapWilayah::untukWilayah($wilayah, $tanggal);
    $detik = round(microtime(true) - $mulai, 2);

    $unit = DB::table('branches')->whereIn('id', array_keys($punyaku))->pluck('unit', 'id');

    foreach (array_keys($punyaku) as $branchId) {
        App\Helpers\AuthScope::simpanFilterGlobal(['branch_id' => $branchId]);
        $req = Illuminate\Http\Request::create('/', 'GET', ['month' => substr($tanggal, 0, 7)]);
        app()->instance('request', $req);
        request()->attributes->remove('authscope'); // AuthScope::resolve() di-cache per permintaan

        $hari = collect($rekap->getDataRekapDua($req)['datas'])->firstWhere('tanggal', $tanggal);
        if (! $hari) {
            echo "wilayah $wilayah {$unit[$branchId]} $tanggal: tanggal tidak ada di Rekap 2\n";
            continue;
        }

        // Rekap 2 memberi satu baris per kelompok; rekap wilayah menjumlahnya per kantor.
        $kelompok = collect($hari['data']);
        foreach ($KOLOM as $k) {
            $diperiksa++;
            $patokan = (int) $kelompok->sum($k);
            $milikku = (int) $punyaku[$branchId][$k];
            if ($patokan !== $milikku) {
                $beda++;
                printf(
                    "BEDA wilayah %d %s %s %s: rekap2=%s saya=%s selisih=%s\n",
                    $wilayah, $tanggal, $unit[$branchId], $k,
                    number_format($patokan), number_format($milikku), number_format($milikku - $patokan)
                );
            }
        }
    }

    // Kalau kolom harian nol di semua kantor, tanggal itu tidak membuktikan
    // apa pun untuk drop/storting — ganti tanggalnya.
    $harian = collect($punyaku)->sum('drop') + collect($punyaku)->sum('storting');
    $catatan = $harian === 0 ? '  <- kolom harian nol semua, tanggal ini tidak menguji apa-apa' : '';

    echo "wilayah $wilayah $tanggal: " . count($punyaku) . " kantor, {$detik}s$catatan\n";
}

echo "\ndiperiksa=$diperiksa beda=$beda\n";
echo $beda === 0 ? "OK semua\n" : "ADA BEDA — Rekap 2 yang benar, perbaiki AngkaRekapWilayah\n";
