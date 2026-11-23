// Uji rumus kolom Rekap Sirkulasi Wilayah yang jalan di browser.
// Jalankan: docker exec unit-vite node .agents/uji/uji_kolom_rekap_wilayah.mjs

import assert from 'node:assert/strict';
import { harusnya, persen, tandaSelisih, turunan } from '../../resources/js/Pages/Laporan/RekapWilayah/kolom.js';

const baris = (diketik = {}, sistem = {}) => ({ branch_id: 1, unit: 'Uji', diketik, sistem });

// --- persen
assert.equal(persen(1000, 0), null, 'penyebut 0 -> null, bukan 0');
assert.equal(persen(0, 1000), 0);
assert.equal(Number(persen(103_565_000, 614_300_000).toFixed(4)), 0.1686, 'contoh Excel mas: 16,86%');

// --- kolom persen
assert.equal(turunan(baris({ saldo_cm: 50, saldo_lama_cm: 200 }), 'persen_cm'), 0.25);
assert.equal(turunan(baris({ saldo_mb: 50, saldo_lama_mb: 200 }), 'persen_mb'), 0.25);
assert.equal(turunan(baris({ saldo_ml: 50, sirkulasi: 200 }), 'persen_ml'), 0.25, '%ML dibagi sirkulasi, bukan saldo lama');

// --- rantai kumulatif: kemarin + mutasi hari ini
const kemarin = {
  total_drop: 1000, total_storting: 2000, sirkulasi: 5000,
  total_angsuran_cm: 100, saldo_cm: 900,
  total_angsuran_mb: 50, saldo_mb: 400,
  total_angsuran_ml: 10, saldo_ml: 300,
};

assert.equal(harusnya(baris({ drop: 200 }), kemarin, 'total_drop'), 1200);
assert.equal(harusnya(baris({ storting: 300 }), kemarin, 'total_storting'), 2300);
assert.equal(harusnya(baris({ angsuran_cm: 25 }), kemarin, 'total_angsuran_cm'), 125);

// Sirkulasi memakai pengali 1,3 dan storting mengurangi.
assert.equal(harusnya(baris({ drop: 1000, storting: 300 }), kemarin, 'sirkulasi'), 5000 + 1300 - 300);

// Saldo macet BERKURANG oleh angsuran, tidak bertambah.
assert.equal(harusnya(baris({ angsuran_cm: 25 }), kemarin, 'saldo_cm'), 875);
assert.equal(harusnya(baris({ angsuran_mb: 50 }), kemarin, 'saldo_mb'), 350);
assert.equal(harusnya(baris({ angsuran_ml: 10 }), kemarin, 'saldo_ml'), 290);

// Hari kerja PERTAMA bulan: total_* mulai dari 0, saldo dari saldo awal bulan.
assert.equal(harusnya(baris({ drop: 200 }), null, 'total_drop', true), 200);
assert.equal(harusnya(baris({ awal_sirkulasi: 700, drop: 100, storting: 30 }), null, 'sirkulasi', true), 700 + 130 - 30);
assert.equal(harusnya(baris({ awal_cm: 500, angsuran_cm: 20 }), null, 'saldo_cm', true), 480);
assert.equal(harusnya(baris({ angsuran_cm: 20 }), null, 'saldo_cm', true), null, 'tanpa saldo awal -> tidak bisa dinilai');

// TENGAH bulan dan hari kerja sebelumnya belum diketik -> tidak bisa dinilai.
// Tanpa pembeda ini, sel ditandai kuning hanya karena kemarin belum diisi.
assert.equal(harusnya(baris({ drop: 200 }), null, 'total_drop', false), null);
assert.equal(harusnya(baris({ awal_cm: 500, angsuran_cm: 20 }), null, 'saldo_cm', false), null);
assert.equal(tandaSelisih(baris({ total_drop: 9 }, { total_drop: 9 }), null, 'total_drop', false), null);

assert.equal(harusnya(baris({ drop: 1 }), kemarin, 'drop'), null, 'kolom mutasi tidak punya rantai');

// --- tanda selisih
assert.equal(tandaSelisih(baris({}, { drop: 100 }), null, 'drop'), null, 'belum diketik -> tanpa tanda');
assert.equal(tandaSelisih(baris({ drop: 100 }, { drop: 100 }), null, 'drop'), null, 'sama dengan Rekap 2');
assert.match(tandaSelisih(baris({ drop: 101 }, { drop: 100 }), null, 'drop'), /Rekap 2: 100/);

// Beda Rp1 pun ditandai; tanpa toleransi.
assert.match(
  tandaSelisih(baris({ total_drop: 1201, drop: 200 }, { total_drop: 1201 }), kemarin, 'total_drop'),
  /hari sebelumnya: 1\.200/,
);

// Dua jenis selisih sekaligus -> dua pesan.
const dua = tandaSelisih(baris({ total_drop: 1500, drop: 200 }, { total_drop: 1201 }), kemarin, 'total_drop');
assert.match(dua, /Rekap 2/);
assert.match(dua, /hari sebelumnya/);

console.log('OK semua');
