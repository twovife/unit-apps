/**
 * Pindai dokumen/foto di browser: cari tepi kertas, luruskan perspektif, buang latar
 * (meja dsb). Pakai jscanify + OpenCV.js dari public/vendor/scan (disimpan sendiri,
 * bukan CDN luar). OpenCV ±10 MB (±4 MB gzip). nginx mengirim .js `immutable` 30 hari, jadi
 * folder WAJIB berversi: naik versi = folder baru = URL baru, cache lama tidak terpakai.
 */

// Ganti versi OpenCV / jscanify -> buat folder baru dan ubah konstanta ini.
const DASAR = '/vendor/scan/4.10.0-1.4.3';
const BERKAS = [`${DASAR}/opencv.js`, `${DASAR}/jscanify.js`];

let siap = null;

/**
 * Unduh berkas pemindai ke cache browser di belakang layar, TANPA menjalankannya
 * (OpenCV berat di CPU/RAM). Dipanggil sekali per sesi untuk user bermenu Lamaran.
 */
export const unduhPemindaiNanti = () => {
  const jalan = () =>
    BERKAS.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.as = 'script';
      l.href = href;
      document.head.appendChild(l);
    });
  'requestIdleCallback' in window ? requestIdleCallback(jalan, { timeout: 10000 }) : setTimeout(jalan, 5000);
};

const muatScript = (src) =>
  new Promise((ok, gagal) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = ok;
    s.onerror = () => gagal(new Error('Pemindai gagal dimuat. Periksa koneksi lalu coba lagi.'));
    document.head.appendChild(s);
  });

// OpenCV.js build Emscripten: `cv` bisa langsung siap, bisa Promise, bisa Module yang
// menunggu onRuntimeInitialized. JANGAN `await cv` mentah: Module punya then() yang
// me-resolve dirinya sendiri -> await berputar terus.
const tungguCv = () =>
  new Promise((ok) => {
    const cv = window.cv;
    if (cv?.Mat) return ok();
    if (typeof cv?.then === 'function') {
      cv.then((m) => {
        if (m?.Mat) window.cv = m;
        ok();
      });
      return;
    }
    cv.onRuntimeInitialized = ok;
  });

/** Siapkan pemindai (sekali). Gagal -> boleh dicoba lagi. */
export const siapkanPemindai = () =>
  (siap ??= (async () => {
    await muatScript(BERKAS[0]);
    await tungguCv();
    await muatScript(BERKAS[1]);
    return new window.jscanify();
  })().catch((e) => {
    siap = null;
    throw e;
  }));

const bacaGambar = (file) =>
  new Promise((ok, gagal) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      ok(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      gagal(new Error('Gambar tidak bisa dibaca.'));
    };
    img.src = url;
  });

const jarak = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Pindai satu gambar. Hasil: File JPEG yang sudah diluruskan, atau null kalau kertas
 * tidak ditemukan (sudut tidak lengkap / bidang terlalu kecil -> kemungkinan salah deteksi).
 */
export async function pindai(file) {
  const scanner = await siapkanPemindai();
  const cv = window.cv;
  const img = await bacaGambar(file);

  // Dikecilkan dulu (maks 2000px): deteksi tepi jauh lebih cepat, hasil akhir toh
  // dikompres ke 1920px.
  const skala = Math.min(1, 2000 / Math.max(img.width, img.height));
  const kanvas = document.createElement('canvas');
  kanvas.width = Math.round(img.width * skala);
  kanvas.height = Math.round(img.height * skala);
  kanvas.getContext('2d').drawImage(img, 0, 0, kanvas.width, kanvas.height);

  const src = cv.imread(kanvas);
  let sudut = null;
  try {
    const kontur = scanner.findPaperContour(src);
    // ponytail: ambang 20% luas gambar - di bawah itu hampir pasti bukan kertasnya.
    if (kontur && cv.contourArea(kontur) >= 0.2 * kanvas.width * kanvas.height) {
      sudut = scanner.getCornerPoints(kontur, src);
    }
  } finally {
    src.delete();
  }
  if (!sudut || Object.values(sudut).some((p) => !p)) return null;

  const { topLeftCorner: tl, topRightCorner: tr, bottomLeftCorner: bl, bottomRightCorner: br } = sudut;
  const lebar = Math.round(Math.max(jarak(tl, tr), jarak(bl, br)));
  const tinggi = Math.round(Math.max(jarak(tl, bl), jarak(tr, br)));
  const hasil = scanner.extractPaper(kanvas, lebar, tinggi, sudut);
  if (!hasil) return null;

  const blob = await new Promise((ok) => hasil.toBlob(ok, 'image/jpeg', 0.9));
  if (!blob) return null;
  return new File([blob], file.name.replace(/\.[^/.]+$/, '') + '-scan.jpg', { type: 'image/jpeg', lastModified: Date.now() });
}
