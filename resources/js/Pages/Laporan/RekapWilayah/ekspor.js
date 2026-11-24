import { BLOK, KOLOM_AWAL, PECAHAN, SEMUA_KOLOM, nilai, persen, turunan } from './kolom.js';

// exceljs diimpor dinamis supaya 900 KB-nya tidak masuk bundel awal: yang
// mengekspor cuma staf kontrol, sekali sebulan.
//
// `default ?? m` karena exceljs CJS: di node yang terpakai excel.js dan
// interop menaruhnya di .default, di browser vite memakai medan "browser"
// (dist/exceljs.min.js) yang bisa jadi namespace langsung.
const muatExcelJS = async () => {
  const m = await import('exceljs');

  return m.default ?? m;
};

const RUPIAH = '#,##0';
const PERSEN = '0.00%';

const tgl = (t) => new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

/** Angka untuk Excel: null jadi sel kosong, bukan 0 — nol dan "belum diisi" beda. */
const sel = (v) => (v === null || v === undefined ? null : Number(v));

/**
 * Lebar kolom dari judul terpanjangnya. Lebih sempit dari autoFit tapi cukup,
 * dan tidak perlu mengukur tiap angka.
 */
const lebar = (judul, min = 11) => Math.max(min, String(judul).length + 2);

/** Kepala dua tingkat: baris blok dengan sel gabung, lalu baris judul kolom. */
function kepalaBertingkat(ws, kolomDepan, blok) {
  const atas = [...kolomDepan.map(() => ''), ...blok.flatMap((b) => b.kolom.map(() => ''))];
  const bawah = [...kolomDepan, ...blok.flatMap((b) => b.kolom.map((k) => k.j))];

  ws.addRow(atas);
  ws.addRow(bawah);

  // Kolom depan (Tanggal, Kantor) digabung ke bawah; blok digabung ke samping.
  kolomDepan.forEach((j, i) => {
    ws.mergeCells(1, i + 1, 2, i + 1);
    ws.getCell(1, i + 1).value = j;
  });

  let c = kolomDepan.length + 1;
  for (const b of blok) {
    if (b.kolom.length > 1) ws.mergeCells(1, c, 1, c + b.kolom.length - 1);
    ws.getCell(1, c).value = b.judul;
    c += b.kolom.length;
  }

  for (const baris of [1, 2]) {
    ws.getRow(baris).font = { bold: true };
    ws.getRow(baris).alignment = { horizontal: 'center', vertical: 'middle' };
  }

  ws.views = [{ state: 'frozen', xSplit: kolomDepan.length, ySplit: 2 }];
}

/** Format angka & persen per kolom, dipasang sekali per lembar. */
function formatKolom(ws, mulai, kolom) {
  kolom.forEach((k, i) => {
    const c = ws.getColumn(mulai + i);
    c.numFmt = k.bagi || k.hitung ? PERSEN : RUPIAH;
    c.width = lebar(k.j);
  });
}

/**
 * Lembar "Harian": satu baris per kantor per tanggal, plus baris total tiap
 * tanggal.
 *
 * Kepalanya ditulis SEKALI di atas, bukan diulang tiap tanggal, dan tanggalnya
 * jadi kolom pertama. Jadi isinya masih bisa disaring & dipivot di Excel,
 * sementara blok kolomnya tetap sama dengan layar.
 */
function lembarHarian(wb, { hari, namaBulan }) {
  const ws = wb.addWorksheet('Harian', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  kepalaBertingkat(ws, ['Tanggal', 'Kantor'], BLOK);
  formatKolom(ws, 3, SEMUA_KOLOM);
  ws.getColumn(1).width = 12;
  ws.getColumn(2).width = 18;

  const angkaBaris = (b) => SEMUA_KOLOM.map((k) => (k.hitung ? turunan(b, k.k) : sel(nilai(b, k.k))));

  for (const h of hari) {
    for (const b of h.baris) {
      ws.addRow([tgl(h.tanggal), b.unit, ...angkaBaris(b)]);
    }

    // Persen baris total dari jumlah pembilang / jumlah penyebut, BUKAN
    // rata-rata persen kantor — sama dengan layar.
    const jumlah = (k) => h.baris.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);
    const total = SEMUA_KOLOM.map((k) => {
      const p = PECAHAN[k.k];

      return p ? persen(jumlah(p[0]), jumlah(p[1])) : jumlah(k.k);
    });

    const r = ws.addRow([tgl(h.tanggal), 'TOTAL WILAYAH', ...total]);
    r.font = { bold: true };
    r.border = { top: { style: 'thin' }, bottom: { style: 'double' } };
  }

  ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: 2 + SEMUA_KOLOM.length } };
  ws.getCell('A1').note = `Rekap Sirkulasi Wilayah ${namaBulan}`;

  return ws;
}

/** Lembar "Sirkulasi Awal": kolom panel accordion, satu baris per kantor. */
function lembarAwal(wb, { kantor, namaBulan }) {
  const ws = wb.addWorksheet('Sirkulasi Awal');

  ws.addRow(['Kantor', ...KOLOM_AWAL.map((c) => c.j)]).font = { bold: true };
  ws.getColumn(1).width = 18;
  formatKolom(ws, 2, KOLOM_AWAL);

  const isi = (b, c) => (c.bagi ? persen(Number(nilai(b, c.atas)), Number(nilai(b, c.bagi))) : sel(nilai(b, c.k)));

  for (const b of kantor) {
    ws.addRow([b.unit, ...KOLOM_AWAL.map((c) => isi(b, c))]);
  }

  const jumlah = (k) => kantor.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);
  const total = ws.addRow([
    'TOTAL WILAYAH',
    ...KOLOM_AWAL.map((c) => (c.bagi ? persen(jumlah(c.atas), jumlah(c.bagi)) : jumlah(c.k))),
  ]);
  total.font = { bold: true };
  total.border = { top: { style: 'thin' }, bottom: { style: 'double' } };

  ws.getCell('A1').note = `Saldo awal ${namaBulan}; tetap sepanjang bulan`;
  ws.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];
}

const KOLOM_MINGGU = [
  ['drop', 'Drop'],
  ['storting', 'Storting'],
  ['angsuran_cm', 'Angs CM'],
  ['angsuran_mb', 'Angs MB'],
  ['angsuran_ml', 'Angs ML'],
  ['sirkulasi', 'Sirkulasi Akhir'],
];

/** Lembar "Mingguan": satu baris per minggu, lalu sebulan. */
function lembarMingguan(wb, { mingguan }) {
  if (!mingguan.length) return;

  const ws = wb.addWorksheet('Mingguan');
  ws.addRow(['Minggu', 'Mulai', 'Sampai', ...KOLOM_MINGGU.map(([, j]) => j)]).font = { bold: true };
  [14, 12, 12].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  KOLOM_MINGGU.forEach(([, j], i) => {
    const c = ws.getColumn(4 + i);
    c.numFmt = RUPIAH;
    c.width = lebar(j);
  });

  for (const m of mingguan) {
    ws.addRow([`Minggu ${m.ke}`, tgl(m.mulai), tgl(m.sampai), ...KOLOM_MINGGU.map(([k]) => m.total[k])]);
  }

  // Sirkulasi bukan jumlah mingguan: yang berlaku angka minggu terakhir.
  const akhir = mingguan[mingguan.length - 1].total;
  const total = ws.addRow([
    'Sebulan',
    '',
    '',
    ...KOLOM_MINGGU.map(([k]) => (k === 'sirkulasi' ? akhir[k] : mingguan.reduce((t, m) => t + m.total[k], 0))),
  ]);
  total.font = { bold: true };
  total.border = { top: { style: 'thin' }, bottom: { style: 'double' } };
}

/**
 * Susun tiga lembar: Harian, Sirkulasi Awal, Mingguan.
 *
 * Angkanya ditulis sebagai ANGKA dengan numFmt, bukan teks, jadi masih bisa
 * dijumlah di Excel. Persen ditulis sebagai pecahan (0,4) dengan format
 * `0.00%`, bukan 40 — kalau ditulis 40 Excel menampilkannya 4000%.
 *
 * Dipisah dari unduhExcel supaya bisa diuji di node tanpa document & URL:
 * .agents/uji/uji_ekspor_rekap_wilayah.mjs
 */
export async function susunWorkbook({ namaBulan, kantor = [], hari = [], mingguan = [] }) {
  const ExcelJS = await muatExcelJS();
  const wb = new ExcelJS.Workbook();
  wb.created = new Date();

  lembarHarian(wb, { hari, namaBulan });
  lembarAwal(wb, { kantor, namaBulan });
  lembarMingguan(wb, { mingguan });

  return wb;
}

export async function unduhExcel({ wilayah, bulan, ...isi }) {
  const wb = await susunWorkbook(isi);
  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

  const a = document.createElement('a');
  a.href = url;
  a.download = `rekap-wilayah-${wilayah}-${bulan}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
