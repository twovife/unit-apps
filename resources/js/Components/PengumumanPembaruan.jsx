import { useState } from 'react';
import { ChevronDown, Megaphone, PlayCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

// Pengumuman pembaruan aplikasi, per bagian. `judul` null = tanpa judul.
// `penting` = ditampilkan merah. `video` = kunci video panduan (props.video,
// link sementara MinIO dari VideoPengumuman) -> klik membuka modal pemutar.
const PENGUMUMAN = [
  {
    judul: null,
    isi: [
      { teks: 'Update tampilan aplikasi.', video: 'tampilan_baru' },
      { teks: 'Pengajuan nasabah lama lewat menu Angsuran.', video: 'pelunasan' },
      { teks: 'Perubahan tampilan menu Angsuran.', video: 'input_angsuran' },
      { teks: 'Input Nomor Anggota (agar nama nasabah urut berdasarkan nomor anggota).', video: 'nasabah_baru' },
      { teks: 'Perubahan pemilihan Tanggal Drop (agar tidak salah input tanggal libur).' },
      { teks: 'Perubahan tampilan menu Drop & input Target.' },
      { teks: 'Perubahan tampilan menu Buku Angsuran.' },
    ],
  },
  {
    judul: 'KM, Kasir, Staf dan Pimpinan',
    isi: [
      { teks: 'Perubahan tampilan menu Rekap 1 & Tunai Mantri.' },
      { teks: 'Perubahan tampilan menu Rekap 2 (bisa input target & input tunai mantri dari sini).' },
    ],
  },
  {
    judul: 'Perubahan Sistem',
    isi: [
      {
        teks: 'Kunci Hari (hari yang sudah dikunci oleh KM & Staf tidak bisa diedit / dihapus lagi).',
        penting: true,
      },
      {
        teks: 'Sistem pengajuan dari menu Angsuran (jika pengajuan diinput dari sini dan drop sudah sukses / diklik drop, angsuran otomatis melunasi).',
      },
      { teks: 'TD (otomatis input TD untuk yang gagal drop).' },
    ],
  },
];

/** `lipat` = tertutup dulu (Dashboard Kasir), klik judul untuk membuka. */
export default function PengumumanPembaruan({ video = {}, lipat = false }) {
  const [putar, setPutar] = useState(null); // { judul, src }
  const [buka, setBuka] = useState(!lipat);

  return (
    <>
      <div className="max-w-3xl space-y-4">
        <section className={`overflow-hidden bg-white border ${lipat ? 'rounded-2xl border-slate-200/70' : 'rounded-lg shadow-sm'}`}>
          <button
            type="button"
            onClick={() => lipat && setBuka(!buka)}
            className={`flex items-center w-full gap-3 px-4 py-3 text-left bg-slate-50 ${buka ? 'border-b' : ''} ${lipat ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Megaphone className="w-5 h-5 text-sky-600 shrink-0" aria-hidden="true" />
            <h2 className="font-semibold text-slate-900">Pengumuman Pembaruan</h2>
            {lipat && <ChevronDown className={`w-4 h-4 ml-auto text-slate-400 transition-transform ${buka ? 'rotate-180' : ''}`} />}
          </button>
          {buka && (
          <div className="px-4 py-3 space-y-4 text-sm">
            {PENGUMUMAN.map((bagian, b) => (
              <div key={b}>
                {bagian.judul && <h3 className="mb-1.5 font-semibold text-slate-900">{bagian.judul}</h3>}
                <ol className="space-y-2">
                  {bagian.isi.map((p, i) => (
                    <li
                      key={i}
                      className={`flex gap-2 ${p.penting ? 'p-2 -mx-2 rounded-md bg-red-50 text-red-700 font-semibold' : 'text-slate-700'}`}
                    >
                      <span className="w-5 text-right shrink-0 tabular-nums">{i + 1}.</span>
                      {p.video && video[p.video] ? (
                        <button
                          type="button"
                          onClick={() => setPutar({ judul: p.teks, src: video[p.video] })}
                          className="flex items-start gap-1.5 text-left text-sky-700 hover:text-sky-900"
                        >
                          <span className="underline decoration-dotted underline-offset-2">{p.teks}</span>
                          <PlayCircle className="w-4 h-4 mt-0.5 shrink-0" aria-label="putar video" />
                        </button>
                      ) : (
                        <span>{p.teks}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          )}
        </section>
      </div>

      <Dialog open={!!putar} onOpenChange={(o) => !o && setPutar(null)}>
        <DialogContent className="max-w-3xl p-3 sm:p-4">
          <DialogHeader>
            <DialogTitle className="pr-8 text-base">{putar?.judul}</DialogTitle>
          </DialogHeader>
          {/* key: ganti video -> elemen baru, mulai dari awal. */}
          {putar && (
            <video key={putar.src} src={putar.src} controls autoPlay playsInline className="w-full bg-black rounded-md max-h-[75vh]" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
