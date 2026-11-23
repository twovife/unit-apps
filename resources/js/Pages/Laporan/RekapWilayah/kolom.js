// Kolom Rekap Sirkulasi Wilayah, urutan mengikuti berkas Excel staf kontrol.
// ketik: sel yang diisi staf kontrol. hitung: nilainya diturunkan di layar.

export const BLOK = [
  {
    judul: 'Sirkulasi',
    kolom: [
      { k: 'drop', j: 'Drop', ketik: true },
      { k: 'total_drop', j: 'Jumlah Drop', ketik: true },
      { k: 'storting', j: 'Storting', ketik: true },
      { k: 'total_storting', j: 'Jumlah Storting', ketik: true },
      { k: 'sirkulasi', j: 'Saldo', ketik: true, tebal: true },
    ],
  },
  {
    judul: 'Calon Macet',
    kolom: [
      { k: 'angsuran_cm', j: 'Angs', ketik: true },
      { k: 'total_angsuran_cm', j: 'Jumlah', ketik: true },
      { k: 'saldo_cm', j: 'Saldo', ketik: true, tebal: true },
      { k: 'persen_cm', j: '%', hitung: true },
      { k: 'saldo_lama_cm', j: 'Saldo Lama' },
    ],
  },
  {
    judul: 'Macet Baru',
    kolom: [
      { k: 'angsuran_mb', j: 'Angs', ketik: true },
      { k: 'total_angsuran_mb', j: 'Jumlah', ketik: true },
      { k: 'saldo_mb', j: 'Saldo', ketik: true, tebal: true },
      { k: 'persen_mb', j: '%', hitung: true },
      { k: 'saldo_lama_mb', j: 'Saldo Lama' },
    ],
  },
  {
    judul: 'Macet Lama',
    kolom: [
      { k: 'angsuran_ml', j: 'Angs', ketik: true },
      { k: 'total_angsuran_ml', j: 'Jumlah', ketik: true },
      { k: 'saldo_ml', j: 'Saldo', ketik: true, tebal: true },
      { k: 'persen_ml', j: '%', hitung: true },
    ],
  },
];

export const SEMUA_KOLOM = BLOK.flatMap((b) => b.kolom);

/** Persen; null kalau penyebut 0 supaya layar menulis '-', bukan 0%. */
export const persen = (pembilang, penyebut) => (penyebut ? pembilang / penyebut : null);

/** Nilai satu sel: yang diketik kalau ada, kalau belum pakai angka sistem. */
export const nilai = (baris, k) => baris.diketik?.[k] ?? baris.sistem?.[k] ?? 0;

/** Pembilang & penyebut tiap kolom persen, dipakai juga untuk baris total. */
export const PECAHAN = {
  persen_cm: ['saldo_cm', 'saldo_lama_cm'],
  persen_mb: ['saldo_mb', 'saldo_lama_mb'],
  persen_ml: ['saldo_ml', 'sirkulasi'],
};

export const turunan = (baris, k) => {
  const p = PECAHAN[k];
  return p ? persen(nilai(baris, p[0]), nilai(baris, p[1])) : null;
};

export const angka = (n) => (n == null ? '-' : Number(n).toLocaleString('id-ID'));

export const persenTeks = (n) =>
  n == null ? '-' : n.toLocaleString('id-ID', { style: 'percent', minimumFractionDigits: 2 });
