// Kolom Rekap Sirkulasi Wilayah, urutan mengikuti berkas Excel staf kontrol.
//
// ketik: diisi staf kontrol dari laporan WA kasir — HANYA mutasi hari itu.
// hitung: diturunkan di layar (persen).
// Sisanya kumulatif & saldo: dihitung server dari mutasi sebulan, tidak
// diketik dan tidak dihitung ulang di sini (keputusan mas 2026-11-23).

export const BLOK = [
  {
    judul: 'Sirkulasi',
    kolom: [
      { k: 'drop', j: 'Drop', ketik: true },
      { k: 'total_drop', j: 'Jml Drop' },
      { k: 'storting', j: 'Storting', ketik: true },
      { k: 'total_storting', j: 'Jml Storting' },
      { k: 'sirkulasi', j: 'Saldo', tebal: true },
    ],
  },
  {
    judul: 'Calon Macet',
    kolom: [
      { k: 'angsuran_cm', j: 'Angs', ketik: true },
      { k: 'total_angsuran_cm', j: 'Jumlah' },
      { k: 'saldo_cm', j: 'Saldo', tebal: true },
      { k: 'persen_cm', j: '%', hitung: true },
      { k: 'saldo_lama_cm', j: 'Saldo Lama' },
    ],
  },
  {
    judul: 'Macet Baru',
    kolom: [
      { k: 'angsuran_mb', j: 'Angs', ketik: true },
      { k: 'total_angsuran_mb', j: 'Jumlah' },
      { k: 'saldo_mb', j: 'Saldo', tebal: true },
      { k: 'persen_mb', j: '%', hitung: true },
      { k: 'saldo_lama_mb', j: 'Saldo Lama' },
    ],
  },
  {
    judul: 'Macet Lama',
    kolom: [
      { k: 'angsuran_ml', j: 'Angs', ketik: true },
      { k: 'total_angsuran_ml', j: 'Jumlah' },
      { k: 'saldo_ml', j: 'Saldo', tebal: true },
      { k: 'persen_ml', j: '%', hitung: true },
    ],
  },
];

export const SEMUA_KOLOM = BLOK.flatMap((b) => b.kolom);

/** Kolom yang nilainya dihitung server dari mutasi sebulan. */
export const KOLOM_TURUNAN = new Set([
  'total_drop', 'total_storting', 'sirkulasi',
  'total_angsuran_cm', 'saldo_cm',
  'total_angsuran_mb', 'saldo_mb',
  'total_angsuran_ml', 'saldo_ml',
]);

/** Persen; null kalau penyebut 0 supaya layar menulis '-', bukan 0%. */
export const persen = (pembilang, penyebut) => (penyebut ? pembilang / penyebut : null);

/** Nilai satu sel: yang tersimpan kalau ada, kalau belum pakai angka sistem. */
export const nilai = (baris, k) => baris.diketik?.[k] ?? baris.sistem?.[k] ?? 0;

/**
 * Pembilang & penyebut tiap kolom persen, dipakai juga untuk baris total.
 * %ML dibagi SIRKULASI, bukan saldo lama (aturan mas).
 */
export const PECAHAN = {
  persen_cm: ['saldo_cm', 'saldo_lama_cm'],
  persen_mb: ['saldo_mb', 'saldo_lama_mb'],
  persen_ml: ['saldo_ml', 'sirkulasi'],
};

export const turunan = (baris, k) => {
  const p = PECAHAN[k];
  return p ? persen(nilai(baris, p[0]), nilai(baris, p[1])) : null;
};

/**
 * Tanda selisih: angka yang tersimpan berbeda dari Rekap 2. Tanpa toleransi,
 * beda Rp1 pun ditandai, dan tidak menghalangi simpan.
 *
 * Rantai kumulatif tidak diperiksa lagi: sejak kumulatif dihitung server dari
 * mutasi sebulan, angkanya tidak mungkin bertengkar dengan dirinya sendiri.
 */
export const tandaSelisih = (baris, k) => {
  const tersimpan = baris.diketik?.[k];
  if (tersimpan == null) return null;

  const sistem = baris.sistem?.[k];
  if (sistem == null || Number(tersimpan) === Number(sistem)) return null;

  return `Rekap 2: ${angka(sistem)}`;
};

/**
 * Rupiah penuh, untuk keterangan selisih. Sel tabel memakai angka() dari
 * lib/modeAngka supaya ikut saklar ribuan; keterangan sengaja penuh agar
 * angka pembandingnya tidak kehilangan tiga digit terakhir.
 *
 * kolom.js sengaja TANPA import apa pun, supaya bisa diuji langsung dengan
 * node (lihat .agents/uji/uji_kolom_rekap_wilayah.mjs).
 */
const fmt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
export const angka = (n) => (n == null ? '-' : fmt.format(Number(n) || 0));

export const persenTeks = (n) =>
  n == null ? '-' : n.toLocaleString('id-ID', { style: 'percent', minimumFractionDigits: 2 });
