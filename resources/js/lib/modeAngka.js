import { useSyncExternalStore } from 'react';

/**
 * Saklar global tampilan angka: ribuan (1.300.000 -> 1.300) atau rupiah penuh.
 * Bawaan ribuan. Pilihan disimpan per browser di localStorage.
 *
 * localStorage bisa tidak tersedia (mode privat, kuota penuh, diblokir) atau
 * berisi nilai rusak: semua akses dibungkus try/catch dan jatuh ke bawaan,
 * jadi tampilan tidak pernah gagal karena penyimpanan. Pilihan tetap berlaku
 * di memori selama halaman terbuka walau tidak bisa disimpan.
 */
const KUNCI = 'tampilan_angka';
const RIBUAN = 'ribuan';
const PENUH = 'penuh';

const baca = () => {
  try {
    return window.localStorage.getItem(KUNCI) === PENUH ? PENUH : RIBUAN;
  } catch {
    return RIBUAN;
  }
};

let mode = typeof window === 'undefined' ? RIBUAN : baca();
const pendengar = new Set();
const kabari = () => pendengar.forEach((f) => f());

export const modeRibuan = () => mode === RIBUAN;

export const setModeRibuan = (ribuan) => {
  mode = ribuan ? RIBUAN : PENUH;
  try {
    window.localStorage.setItem(KUNCI, mode);
  } catch {
    // Tidak bisa disimpan: tetap berlaku sampai halaman dimuat ulang.
  }
  kabari();
};

// Tab lain mengganti saklar -> ikut.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KUNCI) {
      mode = baca();
      kabari();
    }
  });
}

const langganan = (f) => {
  pendengar.add(f);
  return () => pendengar.delete(f);
};

/** Komponen yang menampilkan angka memanggil ini supaya ikut berganti saat saklar diubah. */
export const useModeRibuan = () => useSyncExternalStore(langganan, modeRibuan, () => true);

const fmtRibuan = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const fmtPenuh = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** Rupiah -> teks sesuai saklar (ribuan: dibagi 1000, maks 1 desimal). */
export const angka = (n, opsi = {}) => {
  const v = Number(n) || 0;
  if (!modeRibuan()) return fmtPenuh.format(v);
  return opsi.bulat ? fmtRibuan.format(Math.round(v / 1000)) : fmtRibuan.format(v / 1000);
};

/** Keterangan satuan untuk teks penjelas di halaman. */
export const satuanAngka = () => (modeRibuan() ? 'Angka dalam ribuan.' : 'Angka dalam rupiah penuh.');
