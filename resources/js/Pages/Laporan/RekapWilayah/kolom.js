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

/** Pengali sirkulasi; cermin RekapWilayah::PENGALI di PHP. */
export const PENGALI = 1.3;

/**
 * Kolom kumulatif dan asal angkanya: kumulatif hari kerja sebelumnya,
 * ditambah atau dikurangi mutasi hari ini.
 *
 * saldo CM/MB/ML BERKURANG oleh angsuran, karena saldo = saldo awal - angsuran.
 */
export const RANTAI = {
  total_drop: { dari: 'total_drop', tambah: ['drop'] },
  total_storting: { dari: 'total_storting', tambah: ['storting'] },
  total_angsuran_cm: { dari: 'total_angsuran_cm', tambah: ['angsuran_cm'] },
  total_angsuran_mb: { dari: 'total_angsuran_mb', tambah: ['angsuran_mb'] },
  total_angsuran_ml: { dari: 'total_angsuran_ml', tambah: ['angsuran_ml'] },
  sirkulasi: { dari: 'sirkulasi', tambah: ['drop'], kurang: ['storting'], kaliTambah: PENGALI },
  saldo_cm: { dari: 'saldo_cm', kurang: ['angsuran_cm'] },
  saldo_mb: { dari: 'saldo_mb', kurang: ['angsuran_mb'] },
  saldo_ml: { dari: 'saldo_ml', kurang: ['angsuran_ml'] },
};

/** Kolom kumulatif pada hari kerja pertama bulan: asalnya saldo awal bulan. */
const AWAL = { sirkulasi: 'awal_sirkulasi', saldo_cm: 'awal_cm', saldo_mb: 'awal_mb', saldo_ml: 'awal_ml' };

/**
 * Angka kumulatif "sebelumnya" untuk satu kolom; null kalau tidak bisa dinilai.
 *
 * hariPertama penting: di tengah bulan, hari kerja sebelumnya yang BELUM
 * diketik berarti rantainya tidak bisa dinilai. Tanpa pembeda ini, sel akan
 * ditandai kuning hanya karena kemarin belum diisi.
 */
const sebelumnya = (baris, kemarinBaris, k, hariPertama) => {
  if (kemarinBaris) return kemarinBaris[RANTAI[k].dari] ?? null;
  if (!hariPertama) return null;

  // Hari kerja pertama bulan: total_* mulai dari 0, saldo dari saldo awal bulan.
  if (AWAL[k]) return baris.diketik?.[AWAL[k]] ?? baris.sistem?.[AWAL[k]] ?? null;
  return k.startsWith('total_') ? 0 : null;
};

/**
 * Harusnya berapa menurut rantai; null kalau tidak bisa dinilai.
 * Dipakai hanya untuk MENANDAI, tidak pernah mengganti angka yang diketik.
 */
export const harusnya = (baris, kemarinBaris, k, hariPertama = false) => {
  const r = RANTAI[k];
  if (!r) return null;

  const awal = sebelumnya(baris, kemarinBaris, k, hariPertama);
  if (awal == null) return null;

  const tambah = (r.tambah ?? []).reduce((t, m) => t + Number(nilai(baris, m) || 0) * (r.kaliTambah ?? 1), 0);
  const kurang = (r.kurang ?? []).reduce((t, m) => t + Number(nilai(baris, m) || 0), 0);

  return Math.round(Number(awal) + tambah - kurang);
};

/**
 * Tanda selisih satu sel. Dua jenis, keduanya hanya penanda:
 * beda dengan Rekap 2, dan tidak cocok dengan angka sendiri.
 * Tanpa toleransi — beda Rp1 pun ditandai.
 */
export const tandaSelisih = (baris, kemarinBaris, k, hariPertama = false) => {
  const diketik = baris.diketik?.[k];
  if (diketik == null) return null;

  const pesan = [];

  const sistem = baris.sistem?.[k];
  if (sistem != null && Number(diketik) !== Number(sistem)) {
    pesan.push(`Rekap 2: ${angka(sistem)}`);
  }

  const rantai = harusnya(baris, kemarinBaris, k, hariPertama);
  if (rantai != null && Number(diketik) !== rantai) {
    pesan.push(`Menurut hari sebelumnya: ${angka(rantai)}`);
  }

  return pesan.length ? pesan.join(' · ') : null;
};

export const angka = (n) => (n == null ? '-' : Number(n).toLocaleString('id-ID'));

export const persenTeks = (n) =>
  n == null ? '-' : n.toLocaleString('id-ID', { style: 'percent', minimumFractionDigits: 2 });
