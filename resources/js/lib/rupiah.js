// Format rupiah PENUH (tidak ikut saklar ribuan - itu `angka` di modeAngka.js).
// Satu sumber untuk helper rp/rupiah yang dulu ditulis ulang di tiap halaman.
const fmt = new Intl.NumberFormat('id-ID');

/** 1500000 -> "1.500.000"; null / bukan angka -> "0". */
export const rp = (n) => fmt.format(Number(n) || 0);

/** Sama dengan rp, berawalan "Rp ". */
export const rpLengkap = (n) => 'Rp ' + rp(n);

/** null / undefined -> "—" (belum ada data), selain itu rp. */
export const rpAtauStrip = (n) => (n === null || n === undefined ? '—' : rp(n));

/** Isi kotak input nominal: kosong tetap kosong (bukan "0"). */
export const rpInput = (v) => (v === '' || v === null || v === undefined ? '' : rp(v));
