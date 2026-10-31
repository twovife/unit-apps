// Posisi gulir per menu (mas 2026-10-22): pindah menu lalu kembali -> posisi gulir
// menu itu dipulihkan. Kunci = path (tanpa query), jadi ganti filter di halaman yang
// sama tidak ikut (itu sudah preserveScroll). Hanya per tab browser (sessionStorage).
import { router } from '@inertiajs/react';

const KUNCI = 'gulir:';
let pathTerakhir = window.location.pathname;

const simpan = () => {
  try {
    sessionStorage.setItem(KUNCI + window.location.pathname, String(Math.round(window.scrollY)));
  } catch {
    /* storage diblokir - abaikan */
  }
};

// Dipanggil sebelum kunjungan Inertia mana pun; window.location masih halaman lama.
router.on('before', simpan);

router.on('navigate', (e) => {
  const path = new URL(e.detail.page.url, window.location.origin).pathname;
  const pindahMenu = path !== pathTerakhir;
  pathTerakhir = path;
  if (!pindahMenu) return;

  let y = 0;
  try {
    y = Number(sessionStorage.getItem(KUNCI + path)) || 0;
  } catch {
    return;
  }
  if (y <= 0) return;

  // Inertia menggulir ke atas sesudah event ini, dan isi halaman bisa menyusul (axios);
  // ulangi sebentar sampai posisi tercapai. Berhenti kalau user sendiri menggulir.
  let coba = 0;
  const berhenti = () => (coba = 99);
  window.addEventListener('wheel', berhenti, { once: true, passive: true });
  window.addEventListener('touchstart', berhenti, { once: true, passive: true });
  const ulang = () => {
    if (coba++ > 20) return;
    window.scrollTo(0, y);
    // Minimal 3 kali: reset gulir Inertia (2 frame) bisa datang sesudah percobaan pertama.
    if (coba < 3 || Math.abs(window.scrollY - y) > 2) setTimeout(ulang, 100);
  };
  setTimeout(ulang, 50);
});
