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

/** 4 titik -> sudut kiri-atas/kanan-atas/kiri-bawah/kanan-bawah (jumlah & selisih x,y). */
const urutkanSudut = (titik) => {
  const min = (f) => titik.reduce((a, b) => (f(b) < f(a) ? b : a));
  const max = (f) => titik.reduce((a, b) => (f(b) > f(a) ? b : a));
  return {
    topLeftCorner: min((p) => p.x + p.y),
    bottomRightCorner: max((p) => p.x + p.y),
    topRightCorner: min((p) => p.y - p.x),
    bottomLeftCorner: max((p) => p.y - p.x),
  };
};

/**
 * Cari 4 sudut kertas. BUKAN findPaperContour bawaan jscanify: itu mengambil kontur
 * TEPI terbesar, sehingga lipatan kain / serat meja di latar mengalahkan kertasnya
 * (staging 2026-10-26: potongan miring, separuh kertas hilang). Di sini: bidang TERANG
 * terbesar (Otsu), teks & garis tabel dirapatkan (closing), lalu poligon 4 titik; kalau
 * sudutnya tidak tegas, kotak miring terkecil yang memuat bidang itu.
 */
const cariSudut = (cv, src) => {
  const abu = new cv.Mat();
  const bin = new cv.Mat();
  const kontur = new cv.MatVector();
  const hirarki = new cv.Mat();
  const inti = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(15, 15));
  try {
    cv.cvtColor(src, abu, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(abu, abu, new cv.Size(5, 5), 0);
    cv.threshold(abu, bin, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.morphologyEx(bin, bin, cv.MORPH_CLOSE, inti);
    cv.morphologyEx(bin, bin, cv.MORPH_OPEN, inti);
    cv.findContours(bin, kontur, hirarki, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let terbesar = null;
    let luasMaks = 0;
    for (let i = 0; i < kontur.size(); i++) {
      const luas = cv.contourArea(kontur.get(i));
      if (luas > luasMaks) {
        luasMaks = luas;
        terbesar = kontur.get(i);
      }
    }
    // ponytail: 15%-90% luas gambar. Lebih kecil hampir pasti bukan kertas; lebih besar
    // = latar ikut terambil (tidak ada kertas) atau kertas sudah memenuhi foto (tak perlu dipindai).
    const luasGambar = src.cols * src.rows;
    if (!terbesar || luasMaks < 0.15 * luasGambar || luasMaks > 0.9 * luasGambar) return null;

    const keliling = cv.arcLength(terbesar, true);
    for (const eps of [0.02, 0.03, 0.05]) {
      const poli = new cv.Mat();
      cv.approxPolyDP(terbesar, poli, eps * keliling, true);
      if (poli.rows === 4 && cv.isContourConvex(poli)) {
        const titik = [0, 1, 2, 3].map((i) => ({ x: poli.data32S[i * 2], y: poli.data32S[i * 2 + 1] }));
        poli.delete();
        return urutkanSudut(titik);
      }
      poli.delete();
    }
    return urutkanSudut(cv.RotatedRect.points(cv.minAreaRect(terbesar)));
  } finally {
    abu.delete();
    bin.delete();
    kontur.delete();
    hirarki.delete();
    inti.delete();
  }
};

/**
 * Pindai satu gambar: { kanvas, sudut, hasil }. kanvas = gambar (maks 2000px) yang jadi
 * acuan koordinat sudut; sudut = hasil deteksi atau null; hasil = File lurus atau null.
 * kanvas & sudut dipakai lagi untuk atur manual (luruskan dengan sudut pilihan user).
 */
export async function pindai(file, { tanpaHasil = false } = {}) {
  await siapkanPemindai();
  const cv = window.cv;
  const img = await bacaGambar(file);

  // Dikecilkan dulu (maks 2000px): deteksi jauh lebih cepat, hasil akhir toh
  // dikompres ke 1920px.
  const skala = Math.min(1, 2000 / Math.max(img.width, img.height));
  const kanvas = document.createElement('canvas');
  kanvas.width = Math.round(img.width * skala);
  kanvas.height = Math.round(img.height * skala);
  kanvas.getContext('2d').drawImage(img, 0, 0, kanvas.width, kanvas.height);

  const src = cv.imread(kanvas);
  let sudut;
  try {
    sudut = cariSudut(cv, src);
  } finally {
    src.delete();
  }

  // tanpaHasil: alur atur sudut dulu (Lamaran) tidak butuh hasil lurus di langkah ini.
  return { kanvas, sudut, hasil: sudut && !tanpaHasil ? await luruskan(kanvas, sudut, file.name) : null };
}

/** Luruskan kanvas dengan 4 sudut (urutan bebas, diurutkan ulang) -> File JPEG atau null. */
export async function luruskan(kanvas, sudut, nama = 'dokumen.jpg') {
  const scanner = await siapkanPemindai();
  const s = urutkanSudut(Object.values(sudut));
  const { topLeftCorner: tl, topRightCorner: tr, bottomLeftCorner: bl, bottomRightCorner: br } = s;
  const lebar = Math.round(Math.max(jarak(tl, tr), jarak(bl, br)));
  const tinggi = Math.round(Math.max(jarak(tl, bl), jarak(tr, br)));
  if (lebar < 20 || tinggi < 20) return null;
  const hasil = scanner.extractPaper(kanvas, lebar, tinggi, s);
  if (!hasil) return null;

  const blob = await new Promise((ok) => hasil.toBlob(ok, 'image/jpeg', 0.9));
  if (!blob) return null;
  return new File([blob], nama.replace(/\.[^/.]+$/, '') + '-scan.jpg', { type: 'image/jpeg', lastModified: Date.now() });
}
