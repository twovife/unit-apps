<?php

// Cek cepat JasaModal::dari / alokasi tanpa DB: php tests/jasa_modal_check.php

require __DIR__ . '/../vendor/autoload.php';

use App\Helpers\JasaModal;

assert(JasaModal::dari(100_011_150) === 2_001_000); // 2.000.223 -> 2.001.000
assert(JasaModal::dari(100_000_000) === 2_000_000);
assert(JasaModal::dari(0) === 0);

$l = fn($id, $jenis, $source) => (object) compact('id', 'jenis', 'source');
$i = fn($sisa, $wajib, $tempo, $bila = null) => ['sisa' => $sisa, 'wajib' => $wajib, 'tempo' => $tempo, 'jasa_bila_bayar' => $bila ?? $wajib];

// Case 1: modal awal + tawan + pusat + sherly lewat tempo. Jasa dulu (pusat 0), lalu pokok Modal Awal.
$loans = collect([$l(1, 'modal_awal', 'tawan'), $l(2, 'pinjaman_modal', 'tawan'), $l(3, 'pinjaman_modal', 'pusat'), $l(4, 'pinjaman_modal', 'sherly')]);
$info = [1 => $i(100_000_000, 2_000_000, false), 2 => $i(50_000_000, 1_000_000, false), 3 => $i(50_000_000, 0, false), 4 => $i(25_000_000, 500_000, false)];
$h = JasaModal::alokasi($loans, $info, 10_000_000);
assert($h['bagian'][1] === ['pokok' => 6_500_000, 'jasa' => 2_000_000]);
assert($h['bagian'][2]['jasa'] === 1_000_000 && $h['bagian'][4]['jasa'] === 500_000 && !isset($h['bagian'][3]));

// Uang kurang: Modal Awal dulu, lalu jasa pinjaman terbaru dulu.
$h = JasaModal::alokasi($loans, $info, 2_700_000);
assert($h['bagian'][1]['jasa'] === 2_000_000 && $h['bagian'][4]['jasa'] === 500_000 && $h['bagian'][2]['jasa'] === 200_000);

// Case 2: modal awal + tawan masih tempo -> semua ke Modal Awal; lebih ke tempo (jasa dulu).
$loans = collect([$l(1, 'modal_awal', 'tawan'), $l(2, 'pinjaman_modal', 'tawan')]);
$info = [1 => $i(3_000_000, 1_000_000, false), 2 => $i(50_000_000, 0, true, 1_000_000)];
$h = JasaModal::alokasi($loans, $info, 3_000_000);
assert(array_keys($h['bagian']) === [1] && $h['bagian'][1] === ['pokok' => 2_000_000, 'jasa' => 1_000_000]);
$h = JasaModal::alokasi($loans, $info, 6_000_000);
assert($h['bagian'][2] === ['pokok' => 1_000_000, 'jasa' => 1_000_000] && $h['lebih'] === 0);

// Case 3: hanya pinjaman tempo -> kena jasa saat dibayar. Lebih dari total -> 'lebih'.
$h = JasaModal::alokasi(collect([$l(2, 'pinjaman_modal', 'tawan')]), [2 => $i(5_000_000, 0, true, 100_000)], 6_000_000);
assert($h['bagian'][2] === ['pokok' => 5_000_000, 'jasa' => 100_000] && $h['lebih'] === 900_000);

echo "ok\n";
