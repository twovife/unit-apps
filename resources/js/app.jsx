import './bootstrap';
import '../css/app.css';
import dayjs from './dayJsConfig';
import './backTutupOverlay';
import './lib/pasangAplikasi';
import './lib/ingatGulir';

// Sesudah deploy, potongan JS lama sudah tidak ada di server: muat ulang halaman
// supaya mengambil build baru, bukan fitur diam karena impor gagal (anjuran Vite).
// Dibatasi sekali per 30 detik: kalau potongannya memang rusak, jangan reload berputar.
window.addEventListener('vite:preloadError', () => {
  try {
    if (Date.now() - Number(sessionStorage.getItem('reloadPreload') || 0) < 30000) return;
    sessionStorage.setItem('reloadPreload', String(Date.now()));
  } catch {
    // sessionStorage tidak tersedia: tetap reload sekali.
  }
  window.location.reload();
});
import { createRoot } from 'react-dom/client';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';

// Persistent layout: sidebar + navbar dipasang SEKALI untuk semua halaman, jadi pindah
// menu hanya mengganti isi (sidebar tidak dibuat ulang / berkedip). Halaman tamu tanpa layout.
const TANPA_LAYOUT = /^Auth\/(Login|ConfirmPassword|ForgotPassword|ResetPassword|VerifyEmail)$|^BukuTransaksi\/Web\/InputMacet$/;

// Nama tetap, tidak ikut APP_NAME di .env (masih 'Laravel' di beberapa server).
const appName = 'UBMI DIGITAL';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')).then((page) => {
      if (!TANPA_LAYOUT.test(name) && page.default.layout === undefined) {
        page.default.layout = (isi) => <AuthenticatedLayout>{isi}</AuthenticatedLayout>;
      }
      return page;
    }),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
