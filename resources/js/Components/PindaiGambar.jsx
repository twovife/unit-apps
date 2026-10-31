import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { luruskan, pindai } from '@/lib/pindai';

/** Gambar yang boleh dirapikan: semua image kecuali GIF (animasi). PDF dsb. lewat apa adanya. */
export const bisaDipindai = (file) => !!file?.type?.startsWith('image/') && file.type !== 'image/gif';

/**
 * Sudut awal kalau deteksi gagal: SELURUH gambar - Simpan tanpa digeser = gambar utuh
 * (screenshot bukti transfer dsb. tidak terpotong).
 */
const sudutBawaan = (w, h) => ({
  topLeftCorner: { x: 0, y: 0 },
  topRightCorner: { x: w, y: 0 },
  bottomRightCorner: { x: w, y: h },
  bottomLeftCorner: { x: 0, y: h },
});
const URUTAN_SUDUT = ['topLeftCorner', 'topRightCorner', 'bottomRightCorner', 'bottomLeftCorner'];
// Sudut hasil deteksi (kotak miring) bisa jatuh di luar gambar -> titik tak tersentuh.
const jepit = (sudut, w, h) =>
  Object.fromEntries(Object.entries(sudut).map(([k, p]) => [k, { x: Math.min(w, Math.max(0, p.x)), y: Math.min(h, Math.max(0, p.y)) }]));

/**
 * Geser 4 sudut kertas di atas foto. SVG ber-viewBox ukuran kanvas + ruang tepi, jadi
 * koordinat titik = piksel kanvas apa pun ukuran layarnya, dan titik di pinggir gambar
 * tetap utuh & bisa disentuh (layar sentuh & mouse lewat pointer events).
 */
const AturSudut = ({ kanvas, sudut, onUbah }) => {
  const svg = useRef(null);
  const [geser, setGeser] = useState(null);
  const url = useMemo(() => kanvas.toDataURL('image/jpeg', 0.85), [kanvas]);
  const { width: w, height: h } = kanvas;
  const r = Math.max(w, h) * 0.025;
  const tepi = r * 2.5;

  const pindah = (e) => {
    if (!geser) return;
    const pt = svg.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.current.getScreenCTM().inverse());
    onUbah(jepit({ ...sudut, [geser]: p }, w, h));
  };

  return (
    <svg
      ref={svg}
      viewBox={`${-tepi} ${-tepi} ${w + tepi * 2} ${h + tepi * 2}`}
      className="w-full max-h-[60vh] touch-none select-none bg-slate-900 rounded-md"
      onPointerMove={pindah}
      onPointerUp={() => setGeser(null)}
      onPointerCancel={() => setGeser(null)}
    >
      <image href={url} width={w} height={h} />
      <polygon
        points={URUTAN_SUDUT.map((k) => `${sudut[k].x},${sudut[k].y}`).join(' ')}
        fill="rgba(14,165,233,0.15)"
        stroke="#0ea5e9"
        strokeWidth={r / 3}
      />
      {URUTAN_SUDUT.map((k) => (
        <g key={k}>
          {/* Lingkaran transparan besar = sasaran sentuh jari. */}
          <circle cx={sudut[k].x} cy={sudut[k].y} r={r * 2.2} fill="transparent" className="cursor-move"
            onPointerDown={(e) => {
              e.currentTarget.ownerSVGElement.setPointerCapture(e.pointerId);
              setGeser(k);
            }}
          />
          <circle cx={sudut[k].x} cy={sudut[k].y} r={r} fill="#fff" stroke="#0ea5e9" strokeWidth={r / 3} pointerEvents="none" />
        </g>
      ))}
    </svg>
  );
};

/**
 * Gambar yang dipilih (kamera / file) langsung ke atur sudut (mas 2026-10-26): titik awal
 * dari deteksi otomatis, atau kotak tengah kalau tidak terdeteksi. Simpan -> pratinjau
 * hasil yang diluruskan -> Unggah. Tidak ada pilihan "asli": yang diunggah selalu hasil.
 * Pemindai gagal dimuat (koneksi) -> satu-satunya jalan: unggah gambar apa adanya.
 */
export default function DialogPindai({ file, onPilih, onBatal }) {
  const [kanvas, setKanvas] = useState(null);
  const [sudut, setSudut] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState(null);
  const urlHasil = useMemo(() => (hasil ? URL.createObjectURL(hasil) : null), [hasil]);
  useEffect(() => () => urlHasil && URL.revokeObjectURL(urlHasil), [urlHasil]);

  useEffect(() => {
    if (!file) return;
    let batal = false;
    setKanvas(null);
    setSudut(null);
    setHasil(null);
    setGalat(null);
    pindai(file, { tanpaHasil: true })
      .then((h) => {
        if (batal) return;
        const { width: w, height: hh } = h.kanvas;
        setKanvas(h.kanvas);
        setSudut(jepit(h.sudut ?? sudutBawaan(w, hh), w, hh));
      })
      .catch((e) => !batal && setGalat(e.message));
    return () => {
      batal = true;
    };
  }, [file]);

  const simpan = async () => {
    setProses(true);
    const h = await luruskan(kanvas, sudut, file.name).catch(() => null);
    setProses(false);
    if (h) setHasil(h);
    else setGalat('Sudut tidak valid. Geser titik ke empat sudut kertas lalu simpan lagi.');
  };

  return (
    <Dialog open={!!file} onOpenChange={(o) => !o && !proses && onBatal()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{hasil ? 'Pratinjau hasil' : 'Atur sudut kertas'}</DialogTitle>
          <DialogDescription>
            {hasil
              ? 'Gambar ini yang akan diunggah. Kurang pas? Atur lagi.'
              : 'Geser keempat titik ke sudut kertas, lalu Simpan. Latar di luar titik akan dibuang.'}
          </DialogDescription>
        </DialogHeader>

        {hasil ? (
          <div className="flex items-center justify-center overflow-hidden border rounded-md bg-slate-100 max-h-[60vh]">
            <img src={urlHasil} alt="Hasil" className="object-contain max-w-full max-h-[60vh]" />
          </div>
        ) : kanvas ? (
          <AturSudut kanvas={kanvas} sudut={sudut} onUbah={setSudut} />
        ) : (
          <div className="flex items-center justify-center h-64 px-4 text-sm text-center border rounded-md bg-slate-100 text-slate-500">
            {galat || 'Menyiapkan… (pertama kali memuat pemindai ±4 MB, mohon tunggu)'}
          </div>
        )}
        {galat && kanvas && <div className="p-2 text-sm rounded-md text-rose-700 bg-rose-50">{galat}</div>}

        <DialogFooter className="gap-2">
          {hasil ? (
            <>
              <Button variant="outline" onClick={() => setHasil(null)}>
                Atur lagi
              </Button>
              <Button onClick={() => onPilih(hasil)}>Unggah</Button>
            </>
          ) : kanvas ? (
            <Button disabled={proses} onClick={simpan}>
              {proses ? 'Memproses…' : 'Simpan'}
            </Button>
          ) : (
            galat && (
              <Button variant="outline" onClick={() => onPilih(file)}>
                Unggah tanpa dirapikan
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
