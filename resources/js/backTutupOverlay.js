/**
 * Tombol Back (HP/browser) saat drawer/modal terbuka: tutup overlay-nya,
 * jangan pindah halaman.
 *
 * Cara kerja: begitu ada overlay terbuka, sisipkan satu entri history
 * (URL sama). Back memakan entri itu -> kita kirim Escape (Radix/vaul,
 * Headless UI, SweetAlert2 semua menutup dengan Escape) dan menahan
 * popstate supaya Inertia tidak me-render ulang halaman. Kalau overlay
 * ditutup biasa (X / klik luar), entri tambahan dibuang dengan history.back().
 */
const SELEKTOR = '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], [role="dialog"][aria-modal="true"]';

let terpasang = null; // URL saat entri tambahan disisipkan
let abaikan = 0; // popstate hasil history.back() kita sendiri

function sinkron() {
  const buka = document.querySelector(SELEKTOR) !== null;
  if (buka && !terpasang) {
    history.pushState(history.state, '', location.href);
    terpasang = location.href;
  } else if (!buka && terpasang) {
    // URL berubah = Inertia sudah pindah halaman dari dalam overlay; entri
    // tambahan tertinggal di belakang, biarkan (cuma jadi satu langkah Back ekstra).
    if (location.href === terpasang) {
      abaikan++;
      history.back();
    }
    terpasang = null;
  }
}

window.addEventListener(
  'popstate',
  (e) => {
    if (abaikan) {
      abaikan--;
      e.stopImmediatePropagation();
      return;
    }
    if (!terpasang) return;
    // Capture di window jalan sebelum listener popstate Inertia.
    e.stopImmediatePropagation();
    terpasang = null;
    (document.activeElement || document.body).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true, cancelable: true }),
    );
    // Overlay bertingkat / yang menolak Escape: pasang lagi kalau masih terbuka.
    setTimeout(sinkron, 400);
  },
  true,
);

new MutationObserver(sinkron).observe(document.body, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['data-state', 'aria-modal'],
});
