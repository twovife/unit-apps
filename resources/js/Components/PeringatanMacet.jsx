import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, TriangleAlert } from 'lucide-react';

const SLIDE = [
  'Cek lagi sebelum input nasabah macet, agar nama nasabah macet dan sisa saldonya tidak selisih.',
  'Jika terjadi selisih di nasabah sebelum update, bisa konfirmasi ke staf / tim IT.',
];
const SLIDE_MIGRASI = [
  <>
    Nasabah dengan nama <b>SISA MACET BLM TERINPUT</b> adalah global sisa saldo macet yang belum terinput di sistem.
    Ketika mantri / KM input nasabah macet di menu ini, sisa saldo nasabah ini berkurang sampai dengan 0.
  </>,
  <>
    Jika sisa saldo <b>SISA MACET BLM TERINPUT</b> sudah 0, mantri / KM tidak bisa menambahkan nasabah macet lagi, yang
    berarti semua nasabah macet sudah terinput semua.
  </>,
];

// Peringatan menu macet, slider. Slide 3-4 hanya kantor migrasi: SISA MACET BLM TERINPUT tidak ada di alur lama.
// Semua slide ditumpuk di satu sel grid, jadi tinggi kotak selalu setinggi slide terpanjang.
const PeringatanMacet = ({ migrasi = false }) => {
  const slide = migrasi ? [...SLIDE, ...SLIDE_MIGRASI] : SLIDE;
  const [aktif, setAktif] = useState(0);
  const geser = (arah) => setAktif((i) => (i + arah + slide.length) % slide.length);

  useEffect(() => {
    const putar = setInterval(() => geser(1), 7000);
    return () => clearInterval(putar);
  }, [aktif, slide.length]);

  return (
    <div className="flex items-center gap-2 p-3 mb-3 text-sm border rounded-md border-amber-300 bg-amber-50 text-amber-900">
      <TriangleAlert className="w-4 h-4 shrink-0" />
      <div className="grid flex-1 min-w-0">
        {slide.map((isi, i) => (
          <div
            key={i}
            aria-hidden={i !== aktif}
            className={`[grid-area:1/1] self-center transition-opacity duration-300 ${i === aktif ? 'opacity-100' : 'invisible opacity-0'}`}
          >
            <b>{i + 1}.</b> {isi}
          </div>
        ))}
      </div>
      <div className="flex items-center shrink-0">
        <button type="button" aria-label="Sebelumnya" className="p-1 rounded hover:bg-amber-200" onClick={() => geser(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs tabular-nums">
          {aktif + 1}/{slide.length}
        </span>
        <button type="button" aria-label="Berikutnya" className="p-1 rounded hover:bg-amber-200" onClick={() => geser(1)}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PeringatanMacet;
