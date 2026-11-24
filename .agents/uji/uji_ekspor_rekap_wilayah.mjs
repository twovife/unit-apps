// Lembar .xlsx Rekap Sirkulasi Wilayah: kepala bertingkat utuh, angka tersimpan
// sebagai angka (bukan teks), persen sebagai pecahan.
//
//   docker exec unit-vite node .agents/uji/uji_ekspor_rekap_wilayah.mjs
import assert from 'node:assert/strict';
import { susunWorkbook } from '../../resources/js/Pages/Laporan/RekapWilayah/ekspor.js';

const baris = (branch_id, unit, sistem) => ({ branch_id, unit, sistem, diketik: null });

const isi = {
  namaBulan: 'November 2026',
  kantor: [
    baris(1, 'Krian 1', {
      pemutihan: 1_000_000, drop_bulan_lalu: 50_000_000, awal_sirkulasi: 200_000_000,
      drop_cm: 10_000_000, awal_cm: 5_000_000, saldo_lama_cm: 10_000_000,
      drop_mb: 8_000_000, awal_mb: 2_000_000, saldo_lama_mb: 8_000_000,
      awal_ml: 20_000_000,
    }),
  ],
  hari: [
    {
      tanggal: '2026-11-02',
      baris: [
        baris(1, 'Krian 1', {
          drop: 3_000_000, total_drop: 3_000_000, storting: 1_000_000, total_storting: 1_000_000,
          sirkulasi: 202_900_000,
          angsuran_cm: 1_000_000, total_angsuran_cm: 1_000_000, saldo_cm: 4_000_000, saldo_lama_cm: 10_000_000,
          angsuran_mb: 0, total_angsuran_mb: 0, saldo_mb: 2_000_000, saldo_lama_mb: 8_000_000,
          angsuran_ml: 0, total_angsuran_ml: 0, saldo_ml: 20_000_000,
        }),
        baris(2, 'Krian 2', {
          drop: 1_000_000, total_drop: 1_000_000, storting: 0, total_storting: 0, sirkulasi: 1_300_000,
          angsuran_cm: 0, total_angsuran_cm: 0, saldo_cm: 1_000_000, saldo_lama_cm: 10_000_000,
          angsuran_mb: 0, total_angsuran_mb: 0, saldo_mb: 0, saldo_lama_mb: 0,
          angsuran_ml: 0, total_angsuran_ml: 0, saldo_ml: 0,
        }),
      ],
    },
  ],
};

const wb = await susunWorkbook(isi);

assert.deepEqual(wb.worksheets.map((w) => w.name), ['Harian', 'Sirkulasi Awal']);

const h = wb.getWorksheet('Harian');

// Kepala bertingkat: blok di baris 1, judul kolom di baris 2.
assert.equal(h.getCell('A1').value, 'Tanggal');
assert.equal(h.getCell('B1').value, 'Kantor');
assert.equal(h.getCell('C1').value, 'Sirkulasi');
assert.equal(h.getCell('H1').value, 'Calon Macet');
assert.equal(h.getCell('C2').value, 'Drop');
assert.equal(h.getCell('G2').value, 'Sirkulasi');

// Angka harus angka, bukan teks: kalau teks, Excel tidak bisa menjumlah.
assert.equal(typeof h.getCell('C3').value, 'number');
assert.equal(h.getCell('C3').value, 3_000_000);
assert.equal(h.getColumn(3).numFmt, '#,##0');

// Persen sebagai pecahan + numFmt persen. 4jt / 10jt = 0,4 ditampilkan 40,00%.
const kolomPersenCm = 2 + 9; // Tanggal, Kantor, lalu 5 kolom Sirkulasi + 4 Calon Macet
assert.equal(h.getCell(3, kolomPersenCm).value, 0.4);
assert.equal(h.getColumn(kolomPersenCm).numFmt, '0.00%');

// Baris total: 2 kantor + 1 total per tanggal.
assert.equal(h.getCell('B5').value, 'TOTAL WILAYAH');
assert.equal(h.getCell('C5').value, 4_000_000);
// % CM total dari jumlah pembilang / jumlah penyebut: 5jt / 20jt = 0,25,
// bukan rata-rata (40% + 10%) / 2 = 25% yang kebetulan sama — dipakai angka
// yang tidak kebetulan: saldo 4jt+1jt, penyebut 10jt+10jt.
assert.equal(h.getCell(5, kolomPersenCm).value, 0.25);

const a = wb.getWorksheet('Sirkulasi Awal');
assert.equal(a.getCell('A1').value, 'Kantor');
assert.equal(a.getCell('B1').value, 'Pemutihan');
assert.equal(a.getCell('D2').value, 200_000_000); // Sirkulasi awal
assert.equal(a.getCell('G2').value, 0.5); // % CM = 5jt / 10jt

console.log('OK semua');
