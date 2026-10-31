import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PlayCircle, Video, Film, Plus, Trash2 } from 'lucide-react';
import TambahVideo from '@/Components/TambahVideo';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shadcn/ui/dialog';

const METADATA = {
  iuran: {
    judul: 'Iuran Bulanan (Tabungan & BOP)',
    singkat: 'Iuran Bulanan',
    deskripsi: 'Panduan pembayaran dan rekap iuran Tabungan 1 Juta & BOP kantor aktif.',
  },
  pinjamanmodal: {
    judul: 'Pembayaran Pinjaman Modal',
    singkat: 'Pinjaman Modal',
    deskripsi: 'Panduan pembayaran angsuran pokok dan jasa pinjaman modal pusat/tawan/sherly.',
  },
  sksw: {
    judul: 'SKSW — Laporan & Setoran Unit',
    singkat: 'SKSW Unit',
    deskripsi: 'Panduan pengecekan mutasi, transaksi aktif, dan laporan saldo SKSW karyawan.',
  },
  sksw_karyawan_baru: {
    judul: 'Buka Tabungan SKSW Pegawai Baru',
    singkat: 'SKSW Pegawai Baru',
    deskripsi: 'Panduan pendaftaran tabungan SKSW baru untuk pegawai aktif di kantor cabang.',
  },
  tabungangoro: {
    judul: 'Setoran Tabungan Goro Umrah',
    singkat: 'Tabungan Goro',
    deskripsi: 'Panduan input setoran tabungan goro umrah beserta unggah bukti transfer.',
  },
  cekaset: {
    judul: 'Pengelolaan Aset Kendaraan',
    singkat: 'Aset Kendaraan',
    deskripsi: 'Panduan registri kendaraan, pencatatan servis, dan siklus perpanjangan STNK/pajak.',
  },
  cek_pajak: {
    judul: 'Cara Cek Pajak Kendaraan',
    singkat: 'Cek Pajak',
    deskripsi: 'Panduan melihat jatuh tempo pajak tahunan / STNK dan riwayat pembayaran pajak kendaraan.',
  },
  lamaran: {
    judul: 'Pencatatan Lamaran Kerja',
    singkat: 'Lamaran Kerja',
    deskripsi: 'Panduan input data calon pelamar di cabang dan pengunggahan berkas lamaran.',
  },
  pelunasan: {
    judul: 'Pengajuan Nasabah Lama Lewat Menu Angsuran',
    singkat: 'Pengajuan Nasabah Lama',
    deskripsi: 'Panduan pengajuan kembali nasabah lama langsung dari menu Angsuran.',
  },
  input_angsuran: {
    judul: 'Perubahan Tampilan Menu Angsuran',
    singkat: 'Tampilan Angsuran',
    deskripsi: 'Panduan tata cara input dan navigasi pada tampilan baru menu Angsuran.',
  },
};

/**
 * Komponen tombol icon video dengan popup pemutar video tutorial dari MinIO.
 * Mendukung mode single video maupun multi-video (playlist tabs).
 *
 * @param {Object} props
 * @param {Record<string, string>|string} props.videos Map { key: url } atau URL string tunggal
 * @param {string} [props.defaultKey] Kunci video awal yang aktif jika multi-video
 * @param {string} [props.menu] Kode menu (VideoTutorial::MENU): memuat video tambahan menu itu
 *   dan memberi superuser tombol Tambah / Hapus Video.
 * @param {string} [props.title] Judul khusus (jika single video)
 * @param {string} [props.buttonText] Teks tombol (opsional, default: "Video Panduan")
 * @param {string} [props.className] Class ekstra untuk tombol
 * @param {'default'|'outline'|'secondary'|'ghost'} [props.variant='outline'] Varian tombol shadcn
 */
export default function VideoTutorialButton({
  videos,
  menu,
  defaultKey,
  title,
  buttonText = 'Video Panduan',
  className = '',
  variant = 'outline',
}) {
  const [buka, setBuka] = useState(false);
  const [tambahBuka, setTambahBuka] = useState(false);
  const [extra, setExtra] = useState([]);
  const [boleh, setBoleh] = useState(false);

  // Video tambahan superuser untuk menu ini (+ hak kelola).
  const muat = useCallback(() => {
    if (!menu) return;
    axios.get(route('video_tutorial.menu', menu))
      .then(({ data }) => {
        setExtra(data.videos);
        setBoleh(data.boleh_kelola);
      })
      .catch(() => {});
  }, [menu]);
  useEffect(muat, [muat]);

  const hapusExtra = (v) => {
    if (!confirm(`Hapus video "${v.judul}"?`)) return;
    axios.delete(route('video_tutorial.destroy', v.key)).then(() => {
      setBuka(false);
      muat();
    });
  };

  // Normalisasi video list
  const daftarVideo = useMemo(() => {
    const tambahan = extra.map((v) => ({
      key: v.key,
      url: v.url,
      judul: v.judul,
      singkat: v.judul,
      deskripsi: v.deskripsi,
      tambahan: true,
    }));
    if (!videos) return tambahan;
    if (typeof videos === 'string') {
      return [
        {
          key: 'single',
          url: videos,
          judul: title || 'Video Panduan',
          singkat: title || 'Video',
          deskripsi: 'Panduan pengoperasian fitur aplikasi.',
        },
        ...tambahan,
      ];
    }

    return [...Object.entries(videos)
      .filter(([_, url]) => Boolean(url))
      .map(([k, url]) => {
        const meta = METADATA[k] || {
          judul: k,
          singkat: k,
          deskripsi: 'Panduan pengoperasian fitur.',
        };
        return {
          key: k,
          url,
          ...meta,
        };
      }), ...tambahan];
  }, [videos, title, extra]);

  const [aktifKey, setAktifKey] = useState(() => {
    if (defaultKey && daftarVideo.some((v) => v.key === defaultKey)) {
      return defaultKey;
    }
    return daftarVideo[0]?.key ?? '';
  });

  // Jika tidak ada URL video yang aktif / valid, sembunyikan tombol
  if (daftarVideo.length === 0) {
    if (!boleh) return null;
    return (
      <>
        {/* HP: cukup ikon + (navbar sempit); layar lebar: + Tambah Video. */}
        <Button type="button" variant="outline" size="sm" onClick={() => setTambahBuka(true)} className="inline-flex items-center gap-1.5" title="Tambah Video">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Video</span>
        </Button>
        <TambahVideo open={tambahBuka} onOpenChange={setTambahBuka} menu={menu} onSelesai={muat} />
      </>
    );
  }

  const videoAktif = daftarVideo.find((v) => v.key === aktifKey) || daftarVideo[0];
  const isMulti = daftarVideo.length > 1;

  const handleOpen = () => {
    if (defaultKey && daftarVideo.some((v) => v.key === defaultKey)) {
      setAktifKey(defaultKey);
    } else {
      setAktifKey(daftarVideo[0]?.key ?? '');
    }
    setBuka(true);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="sm"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1.5 font-medium text-sky-700 border-sky-200 bg-sky-50/70 hover:bg-sky-100 hover:text-sky-800 hover:border-sky-300 transition-colors shadow-2xs ${className}`}
        title="Buka Video Tutorial"
      >
        <PlayCircle className="w-4 h-4 text-sky-600 shrink-0" />
        <span className="hidden sm:inline">{buttonText}</span>
      </Button>

      <Dialog open={buka} onOpenChange={setBuka}>
        <DialogContent className="max-w-4xl p-4 sm:p-6 overflow-hidden">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                <Video className="w-4 h-4" />
              </span>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {videoAktif?.judul || 'Video Tutorial'}
              </DialogTitle>
            </div>
            {videoAktif?.deskripsi && (
              <DialogDescription className="text-xs sm:text-sm text-slate-600">
                {videoAktif.deskripsi}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Tab selector jika ada lebih dari 1 video */}
          {isMulti && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg mt-2">
              {daftarVideo.map((v) => {
                const isActive = v.key === videoAktif?.key;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setAktifKey(v.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      isActive
                        ? 'bg-white text-sky-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Film className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{v.singkat}</span>
                  </button>
                );
              })}
            </div>
          )}

          {boleh && (
            <div className="flex flex-wrap justify-end gap-2 mt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setTambahBuka(true)}>
                <Plus className="w-4 h-4 mr-1" /> Tambah Video
              </Button>
              {videoAktif?.tambahan && (
                <Button type="button" variant="destructive" size="sm" onClick={() => hapusExtra(videoAktif)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Hapus Video Ini
                </Button>
              )}
            </div>
          )}

          {/* Pemutar Video */}
          <div className="mt-3 overflow-hidden rounded-xl bg-black border border-slate-800 shadow-md">
            {videoAktif?.url ? (
              <video
                key={videoAktif.url}
                src={videoAktif.url}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full max-h-[65vh] object-contain mx-auto"
              >
                Browser Anda tidak mendukung pemutar video HTML5.
              </video>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400">
                Video tidak tersedia atau belum diunggah di MinIO.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {boleh && <TambahVideo open={tambahBuka} onOpenChange={setTambahBuka} menu={menu} onSelesai={muat} />}
    </>
  );
}
