// Uji rumus kolom Rekap Sirkulasi Wilayah yang jalan di browser.
// Jalankan: docker exec unit-vite node .agents/uji/uji_kolom_rekap_wilayah.mjs

import assert from 'node:assert/strict';
import { BLOK, KOLOM_TURUNAN, SEMUA_KOLOM, persen, tandaSelisih, turunan } from '../../resources/js/Pages/Laporan/RekapWilayah/kolom.js';

const baris = (diketik = {}, sistem = {}) => ({ branch_id: 1, unit: 'Uji', diketik, sistem });

// --- persen
assert.equal(persen(1000, 0), null, 'penyebut 0 -> null, bukan 0');
assert.equal(persen(0, 1000), 0);
assert.equal(Number(persen(103_565_000, 614_300_000).toFixed(4)), 0.1686, 'contoh Excel mas: 16,86%');

// --- kolom persen
assert.equal(turunan(baris({ saldo_cm: 50, saldo_lama_cm: 200 }), 'persen_cm'), 0.25);
assert.equal(turunan(baris({ saldo_mb: 50, saldo_lama_mb: 200 }), 'persen_mb'), 0.25);
assert.equal(turunan(baris({ saldo_ml: 50, sirkulasi: 200 }), 'persen_ml'), 0.25, '%ML dibagi sirkulasi, bukan saldo lama');
// %ML memang TIDAK memakai saldo lama; kalau tertukar, nilainya ikut berubah.
assert.equal(turunan(baris({ saldo_ml: 50, sirkulasi: 200, saldo_lama_ml: 1000 }), 'persen_ml'), 0.25);

// --- yang diketik hanya mutasi hari itu (keputusan mas 2026-11-23)
assert.deepEqual(
  SEMUA_KOLOM.filter((k) => k.ketik).map((k) => k.k),
  ['drop', 'storting', 'angsuran_cm', 'angsuran_mb', 'angsuran_ml'],
);

// Kumulatif & saldo dihitung server, jadi tidak boleh ada yang bisa diketik.
for (const k of SEMUA_KOLOM) {
  if (KOLOM_TURUNAN.has(k.k)) assert.ok(!k.ketik, `${k.k} tidak boleh bisa diketik`);
}

// Tiap kolom harus punya judul blok, dipakai sebagai title tiap isian.
assert.equal(BLOK.flatMap((b) => b.kolom).length, SEMUA_KOLOM.length);

// --- tanda selisih: hanya beda dengan Rekap 2
assert.equal(tandaSelisih(baris({}, { drop: 100 }), 'drop'), null, 'belum tersimpan -> tanpa tanda');
assert.equal(tandaSelisih(baris({ drop: 100 }, { drop: 100 }), 'drop'), null, 'sama dengan Rekap 2');
assert.equal(tandaSelisih(baris({ drop: 100 }, {}), 'drop'), null, 'tanpa angka sistem -> tidak bisa dibandingkan');
assert.match(tandaSelisih(baris({ drop: 101 }, { drop: 100 }), 'drop'), /Rekap 2: 100/);
// Tanpa toleransi: beda Rp1 pun ditandai, dan keterangannya rupiah PENUH.
assert.match(tandaSelisih(baris({ sirkulasi: 2_480_994_001 }, { sirkulasi: 2_480_994_000 }), 'sirkulasi'), /2\.480\.994\.000/);

console.log('OK semua');
