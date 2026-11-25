// Kolom Rekap Sirkulasi Wilayah. Nama kolom & warna bloknya mengikuti Rekap 2
// (KOLOM_HARIAN & WARNA_HARIAN di Kasir/Rekap/Components/TableRekap.jsx):
// drop biru, storting kuning, sirkulasi hijau, CM biru, MB kuning, ML merah.
// Yang tidak ada di Rekap 2 cuma kolom persen.
//
// ketik: diisi staf kontrol dari laporan WA kasir — HANYA mutasi hari itu.
// hitung: diturunkan di layar (persen).
// Sisanya kumulatif & saldo: dihitung server dari mutasi sebulan, tidak
// diketik dan tidak dihitung ulang di sini (keputusan mas 2026-11-23).

export const BLOK = [
  {
    judul: 'Sirkulasi',
    kolom: [
      { k: 'drop', j: 'Drop', ketik: true, warna: 'biru' },
      { k: 'total_drop', j: 'Jml Drop', warna: 'biru' },
      { k: 'storting', j: 'Storting', ketik: true, warna: 'kuning' },
      { k: 'total_storting', j: 'Jml Storting', warna: 'kuning' },
      { k: 'sirkulasi', j: 'Sirkulasi', tebal: true, warna: 'hijau' },
    ],
  },
  {
    judul: 'Calon Macet',
    kolom: [
      { k: 'angsuran_cm', j: 'Angs CM', ketik: true, warna: 'biru' },
      { k: 'total_angsuran_cm', j: 'Jml CM', warna: 'biru' },
      { k: 'saldo_cm', j: 'Saldo CM', tebal: true, warna: 'biru' },
      { k: 'persen_cm', j: '% CM', hitung: true, warna: 'biru' },
    ],
  },
  {
    judul: 'Macet Baru',
    kolom: [
      { k: 'angsuran_mb', j: 'Angs MB', ketik: true, warna: 'kuning' },
      { k: 'total_angsuran_mb', j: 'Jml MB', warna: 'kuning' },
      { k: 'saldo_mb', j: 'Saldo MB', tebal: true, warna: 'kuning' },
      { k: 'persen_mb', j: '% MB', hitung: true, warna: 'kuning' },
    ],
  },
  {
    judul: 'Macet Lama',
    kolom: [
      { k: 'angsuran_ml', j: 'Angs ML', ketik: true, warna: 'merah' },
      { k: 'total_angsuran_ml', j: 'Jml ML', warna: 'merah' },
      { k: 'saldo_ml', j: 'Saldo ML', tebal: true, warna: 'merah' },
      { k: 'persen_ml', j: '% ML', hitung: true, warna: 'merah' },
    ],
  },
];

export const SEMUA_KOLOM = BLOK.flatMap((b) => b.kolom);

/**
 * Kolom panel Sirkulasi Awal, urutan permintaan mas 2026-11-24:
 * Pemutihan | Drop Bln Lalu | Sirkulasi | Drop CM | CM | % | Drop MB | MB | % | ML | %
 *
 * atas/bagi = pembilang & penyebut kolom persen. Sama dengan tabel harian:
 * CM & MB dibagi jumlah drop bulan rujukannya, ML dibagi sirkulasi awal.
 * bulan = bulan rujukan yang ditulis di keterangan sel.
 */
export const KOLOM_AWAL = [
  { k: 'pemutihan', j: 'Pemutihan', ket: 'Pemutihan bulan lalu; keluarnya baru terlihat di saldo awal bulan ini' },
  { k: 'drop_bulan_lalu', j: 'Drop Bln Lalu', bulan: 'lalu' },
  { ketik: true, k: 'awal_sirkulasi', j: 'Sirkulasi', tebal: true },
  { k: 'drop_cm', j: 'Drop CM', bulan: 'cm' },
  { ketik: true, k: 'awal_cm', j: 'CM', tebal: true },
  { k: 'persen_cm', j: '%', atas: 'awal_cm', bagi: 'saldo_lama_cm' },
  { k: 'drop_mb', j: 'Drop MB', bulan: 'mb' },
  { ketik: true, k: 'awal_mb', j: 'MB', tebal: true },
  { k: 'persen_mb', j: '%', atas: 'awal_mb', bagi: 'saldo_lama_mb' },
  { ketik: true, k: 'awal_ml', j: 'ML', tebal: true },
  { k: 'persen_ml', j: '%', atas: 'awal_ml', bagi: 'awal_sirkulasi' },
];

/** Kolom yang nilainya dihitung server dari mutasi sebulan. */
export const KOLOM_TURUNAN = new Set([
  'total_drop', 'total_storting', 'sirkulasi',
  'total_angsuran_cm', 'saldo_cm',
  'total_angsuran_mb', 'saldo_mb',
  'total_angsuran_ml', 'saldo_ml',
]);

/** Persen; null kalau penyebut 0 supaya layar menulis '-', bukan 0%. */
export const persen = (pembilang, penyebut) => (penyebut ? pembilang / penyebut : null);

/**
 * Baris kantor + tambalan balasan simpan/cek/buka.
 *
 * t = { nilai, terkunci, dicek_oleh, dicek_pada }. Dipakai layar dan ekspor,
 * supaya keduanya melihat angka yang sama sesudah autosave.
 */
export const gabung = (b, t) =>
  t
    ? {
        ...b,
        diketik: { ...(b.diketik ?? {}), ...t.nilai },
        terkunci: t.terkunci,
        dicek_oleh: t.dicek_oleh,
        dicek_pada: t.dicek_pada,
      }
    : b;

/** Nilai satu sel: yang tersimpan kalau ada, kalau belum pakai angka sistem. */
export const nilai = (baris, k) => baris.diketik?.[k] ?? baris.sistem?.[k] ?? 0;

/**
 * Pembilang & penyebut tiap kolom persen, dipakai juga untuk baris total.
 *
 * saldo_lama_* tidak lagi jadi kolom di tabel harian (mas 2026-11-24): angkanya
 * tetap sepanjang bulan, jadi mengulangnya di tiap tanggal tidak menambah apa
 * pun. Nilainya tetap dikirim dan tetap jadi penyebut persen; rinciannya ada
 * di panel Sirkulasi Awal.
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
