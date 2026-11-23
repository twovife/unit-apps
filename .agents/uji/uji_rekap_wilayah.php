<?php

// Uji rumus Rekap Sirkulasi Wilayah. Tanpa Laravel, tanpa basis data.
// Jalankan: docker exec unit-app php -d zend.assertions=1 .agents/uji/uji_rekap_wilayah.php
//
// phpunit di proyek ini menghantam ubmi_db produksi, jadi rumusnya diuji
// lewat skrip lepas seperti ini.

require __DIR__ . '/../../app/Helpers/RekapWilayah.php';

use App\Helpers\RekapWilayah;

// --- persen
assert(RekapWilayah::persen(103_565_000, 614_300_000) !== null);
assert(round(RekapWilayah::persen(103_565_000, 614_300_000), 4) === 0.1686, 'contoh Excel mas: 16,86%');
assert(RekapWilayah::persen(1000, 0) === null, 'penyebut 0 -> null, bukan 0');
assert(RekapWilayah::persen(0, 1000) === 0.0);

// --- saldo lama = drop bulan rujukan x 1,3
assert(RekapWilayah::saldoLama(100_000_000) === 130_000_000);
assert(RekapWilayah::saldoLama(0) === 0);
assert(RekapWilayah::saldoLama(3) === 4, 'pembulatan: 3 x 1,3 = 3,9 -> 4');

// --- sirkulasi berjalan
assert(RekapWilayah::sirkulasiBerjalan(1_000_000, 100_000, 50_000) === 1_080_000);
assert(RekapWilayah::sirkulasiBerjalan(0, 0, 0) === 0);

// --- bulan rujukan: CM = T-3, MB = T-4
assert(RekapWilayah::bulanRujukan('2026-11-23', 'cm') === '2026-08-01');
assert(RekapWilayah::bulanRujukan('2026-11-23', 'mb') === '2026-07-01');
assert(RekapWilayah::bulanRujukan('2026-01-15', 'cm') === '2025-10-01', 'lintas tahun');
assert(RekapWilayah::bulanRujukan('2026-03-31', 'cm') === '2025-12-01', 'akhir bulan tidak meluber');
assert(RekapWilayah::bulanRujukan('2026-04-30', 'mb') === '2025-12-01');

// --- selisih rantai kumulatif
assert(RekapWilayah::selisihRantai(1000, 200, 1200) === 0, 'cocok');
assert(RekapWilayah::selisihRantai(1000, 200, 1250) === 50, 'kelebihan 50');
assert(RekapWilayah::selisihRantai(1000, 200, 1100) === -100, 'kurang 100');
assert(RekapWilayah::selisihRantai(null, 200, 1200) === null, 'tanpa angka hari sebelumnya');

echo "OK semua\n";
