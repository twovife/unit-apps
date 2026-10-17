// "Pasang aplikasi" (PWA). Event beforeinstallprompt bisa datang sebelum
// halaman Inertia (dan tombolnya) termuat, jadi ditangkap di sini - modul ini
// diimpor app.jsx sejak awal.
let tunda = null;
const pendengar = new Set();
const kabari = () => pendengar.forEach((f) => f());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // tahan banner bawaan; ditampilkan lewat tombol kita
    tunda = e;
    kabari();
  });
  window.addEventListener('appinstalled', () => {
    tunda = null;
    kabari();
  });
}

export const sudahTerpasang = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

export const bisaPromptLangsung = () => tunda !== null;

export const dengar = (f) => {
  pendengar.add(f);
  return () => pendengar.delete(f);
};

// true = dialog pasang bawaan browser tampil; false = browser tidak menyediakan
// (iOS Safari, Firefox, atau Chrome belum siap) -> tampilkan petunjuk manual.
export async function pasang() {
  if (!tunda) return false;
  const e = tunda;
  tunda = null;
  e.prompt();
  await e.userChoice;
  kabari();
  return true;
}
