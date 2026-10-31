import React, { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Head, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  IdCard,
  ImageUp,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Upload,
  UserCheck,
  Users,
  UserX,
  X,
  ZoomIn,
} from 'lucide-react';

import { Input } from '@/shadcn/ui/input';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import DialogPindai, { bisaDipindai } from '@/Components/PindaiGambar';

/** Ukuran area potong di layar dan dimensi hasil ekspor foto (px) */
const AREA_CROP = 280;
const HASIL_CROP = 512;

const TAB = [
  ['aktif', 'Aktif'],
  ['resign', 'Resign'],
  ['semua', 'Semua'],
];

/** Daftar jenis berkas digital resmi karyawan UBMI */
const DOCUMENT_TYPES = [
  { type: 'ktp', label: 'KTP Digital' },
  { type: 'pasfoto', label: 'Pas Foto' },
  { type: 'kk', label: 'Kartu Keluarga (KK)' },
  { type: 'skck', label: 'SKCK Digital' },
  { type: 'ijazah', label: 'Ijazah Terakhir' },
  { type: 'lamaran_kerja', label: 'Surat Lamaran Kerja' },
];

const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

/** Hitung masa kerja sederhana (mis. '1 thn 4 bln' atau '5 bln') */
const durasiKerja = (hireDate, resignDate) => {
  if (!hireDate) return null;
  const start = dayjs(hireDate);
  const end = resignDate ? dayjs(resignDate) : dayjs();
  const totalBulan = end.diff(start, 'month');
  if (totalBulan < 1) return '< 1 bln';
  const thn = Math.floor(totalBulan / 12);
  const bln = totalBulan % 12;
  if (thn > 0 && bln > 0) return `${thn} thn ${bln} bln`;
  if (thn > 0) return `${thn} thn`;
  return `${bln} bln`;
};

/**
 * Komponen Avatar Karyawan
 * Menampilkan foto profil atau inisial nama dengan ring halus dan status badge.
 */
const Avatar = ({ d, ukuran = 'w-10 h-10 text-xs', onLihatFoto = null, className = '' }) => {
  const [gagal, setGagal] = useState(false);
  useEffect(() => setGagal(false), [d?.avatar]);

  const inisial = String(d?.employee_name ?? '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

  const konten =
    d?.avatar && !gagal ? (
      <img
        src={d.avatar}
        alt={d.employee_name}
        loading="lazy"
        onError={() => setGagal(true)}
        className={`${ukuran} rounded-full object-cover shrink-0 bg-slate-100 ring-2 ring-slate-100 shadow-xs ${
          d.isActive ? '' : 'grayscale opacity-75'
        } ${className}`}
      />
    ) : (
      <span
        className={`${ukuran} inline-flex items-center justify-center rounded-full shrink-0 font-bold tracking-tight shadow-xs ring-2 ring-slate-100 ${
          d?.isActive
            ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white'
            : 'bg-slate-200 text-slate-500'
        } ${className}`}
        aria-hidden="true"
      >
        {inisial}
      </span>
    );

  if (d?.avatar && !gagal && onLihatFoto) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onLihatFoto(d);
        }}
        title="Klik untuk melihat foto profil besar"
        className="relative transition-transform cursor-pointer shrink-0 hover:scale-105 active:scale-95 focus:outline-hidden"
      >
        {konten}
      </button>
    );
  }

  return konten;
};

/**
 * Modal Cropper Foto Profil Karyawan (Canvas Native + Touch / Mouse Drag + Zoom Slider)
 * Seperti implementasi di app_laravel tanpa dependensi library eksternal.
 */
const ModalCropAvatar = ({ employee, file, onBatal, onSelesai }) => {
  const [src, setSrc] = useState(null);
  const [gambar, setGambar] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0, zoom: 1 });
  const [proses, setProses] = useState(false);
  const seret = useRef(null);

  // Skala dasar agar gambar selalu memenuhi (cover) area crop
  const dasar = gambar ? Math.max(AREA_CROP / gambar.naturalWidth, AREA_CROP / gambar.naturalHeight) : 1;
  const skala = dasar * pos.zoom;

  // Jaga posisi agar gambar tidak bergeser keluar dari area crop
  const jepit = (p) => {
    if (!gambar) return p;
    const s = dasar * p.zoom;
    const minX = AREA_CROP - gambar.naturalWidth * s;
    const minY = AREA_CROP - gambar.naturalHeight * s;
    return { ...p, x: Math.min(0, Math.max(minX, p.x)), y: Math.min(0, Math.max(minY, p.y)) };
  };

  useEffect(() => {
    if (!file) {
      setSrc(null);
      setGambar(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.max(AREA_CROP / img.naturalWidth, AREA_CROP / img.naturalHeight);
      setGambar(img);
      setPos({
        x: (AREA_CROP - img.naturalWidth * s) / 2,
        y: (AREA_CROP - img.naturalHeight * s) / 2,
        zoom: 1,
      });
      setSrc(url);
    };
    img.onerror = () => {
      toast.error('Format gambar tidak dapat dibaca.');
      onBatal();
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const ubahZoom = (zoom) => {
    const tengah = AREA_CROP / 2;
    const rasio = zoom / pos.zoom;
    setPos(jepit({ zoom, x: tengah - (tengah - pos.x) * rasio, y: tengah - (tengah - pos.y) * rasio }));
  };

  const simpan = () => {
    if (!gambar || !employee) return;

    const canvas = document.createElement('canvas');
    canvas.width = HASIL_CROP;
    canvas.height = HASIL_CROP;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Gagal memproses gambar pada peramban.');
      return;
    }

    ctx.drawImage(
      gambar,
      -pos.x / skala,
      -pos.y / skala,
      AREA_CROP / skala,
      AREA_CROP / skala,
      0,
      0,
      HASIL_CROP,
      HASIL_CROP
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error('Gagal mengekspor foto.');
          return;
        }

        const formDataFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        setProses(true);

        router.post(
          route('administrasi.manpower.avatar', employee.id),
          { avatar: formDataFile },
          {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
              toast.success('Foto profil berhasil diperbarui.');
              onSelesai();
            },
            onError: (err) => {
              toast.error(err.avatar ?? Object.values(err)[0] ?? 'Gagal mengunggah foto profil.');
            },
            onFinish: () => setProses(false),
          }
        );
      },
      'image/jpeg',
      0.9
    );
  };

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && !proses && onBatal()}>
      <DialogContent className="max-w-xs sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-900">Atur Foto Profil</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Geser foto atau gunakan slider zoom untuk menyesuaikan posisi avatar {employee?.employee_name}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* Area Crop dengan Masking Lingkaran */}
          <div
            className="relative overflow-hidden bg-slate-900 rounded-xl cursor-grab touch-none active:cursor-grabbing shadow-inner select-none"
            style={{ width: AREA_CROP, height: AREA_CROP }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              seret.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
            }}
            onPointerMove={(e) => {
              const s = seret.current;
              if (s) {
                setPos(jepit({ ...pos, x: s.px + e.clientX - s.x, y: s.py + e.clientY - s.y }));
              }
            }}
            onPointerUp={() => (seret.current = null)}
            onPointerCancel={() => (seret.current = null)}
          >
            {src && gambar && (
              <img
                src={src}
                alt="Crop preview"
                draggable={false}
                className="absolute top-0 left-0 pointer-events-none max-w-none select-none"
                style={{
                  width: gambar.naturalWidth * skala,
                  height: gambar.naturalHeight * skala,
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                }}
              />
            )}
            <div className="absolute inset-0 pointer-events-none rounded-full shadow-[0_0_0_999px_rgba(15,23,42,0.65)] border-2 border-white/50" />
          </div>

          {/* Slider Zoom */}
          <div className="flex items-center w-full gap-3 px-2 text-xs text-slate-600">
            <ZoomIn className="w-4 h-4 shrink-0 text-slate-400" />
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={pos.zoom}
              onChange={(e) => ubahZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              aria-label="Perbesar foto"
            />
            <span className="w-8 text-right font-mono text-[11px] text-slate-500">
              {pos.zoom.toFixed(1)}x
            </span>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onBatal} disabled={proses}>
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={simpan}
            disabled={proses || !gambar}
            className="gap-1.5 bg-red-600 hover:bg-red-700 text-white"
          >
            {proses ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageUp className="w-4 h-4" />}
            {proses ? 'Menyimpan…' : 'Simpan Foto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Modal Preview Foto Profil Besar (Viewer)
 */
const ModalLihatFoto = ({ data, onTutup }) => (
  <Dialog open={!!data} onOpenChange={(o) => !o && onTutup()}>
    <DialogContent className="max-w-md p-4 bg-white/95 backdrop-blur-md border-slate-200/80 rounded-2xl shadow-2xl">
      <DialogHeader className="pb-2 text-left border-b border-slate-100">
        <DialogTitle className="text-base font-semibold text-slate-900">{data?.employee_name}</DialogTitle>
        <DialogDescription className="text-xs text-slate-500">
          Foto profil karyawan · NIK: {data?.identity_id || '–'}
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-center p-2">
        <img
          src={data?.avatar}
          alt={data?.employee_name}
          className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-md"
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={onTutup}>
          Tutup
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

/**
 * Badge Jabatan dengan warna dan aksen modern
 */
const JabatanBadge = ({ jabatan = '' }) => {
  const j = String(jabatan).toLowerCase();
  let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200/60';

  if (j.includes('mantri')) {
    badgeClass = 'bg-sky-50 text-sky-700 border-sky-200/70';
  } else if (j.includes('kasir')) {
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
  } else if (j.includes('kepala') || j.includes('pimpinan') || j.includes('pengawas')) {
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200/70';
  } else if (j.includes('staf') || j.includes('kontrol')) {
    badgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border capitalize tracking-tight ${badgeClass}`}
    >
      {jabatan || '–'}
    </span>
  );
};

/**
 * Badge Status Aktif / Resign dengan dot indikator
 */
const StatusBadge = ({ aktif }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${
      aktif
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
        : 'bg-slate-100 text-slate-500 border-slate-200/80'
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${aktif ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
    />
    {aktif ? 'Aktif' : 'Resign'}
  </span>
);

/**
 * Komponen Baris Upload & Kelola Dokumen (seperti di app_laravel dengan Last Update)
 */
const DocumentUploaderRow = ({ employee, type, label, existingDoc, bolehUnggah }) => {
  const inputRef = useRef(null);
  const [sedangUpload, setSedangUpload] = useState(false);
  const [sedangHapus, setSedangHapus] = useState(false);
  const [filePindai, setFilePindai] = useState(null);

  // Foto dokumen dirapikan dulu (atur sudut -> pratinjau -> unggah); PDF langsung.
  const handleFilePilih = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (bisaDipindai(file)) {
      setFilePindai(file);
      return;
    }
    kirim(file);
  };

  const kirim = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    setSedangUpload(true);
    router.post(route('administrasi.manpower.documents.upload', employee.id), formData, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success(`Dokumen ${label} berhasil diperbarui.`);
      },
      onError: (err) => {
        toast.error(err.file ?? err.type ?? Object.values(err)[0] ?? 'Gagal mengunggah dokumen.');
      },
      onFinish: () => setSedangUpload(false),
    });
  };

  const handleHapusDokumen = () => {
    if (!existingDoc) return;
    if (!confirm(`Apakah Anda yakin ingin menghapus dokumen ${label}?`)) return;

    setSedangHapus(true);
    router.delete(
      route('administrasi.manpower.documents.destroy', [employee.id, existingDoc.id]),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success(`Dokumen ${label} berhasil dihapus.`);
        },
        onError: () => {
          toast.error(`Gagal menghapus dokumen ${label}.`);
        },
        onFinish: () => setSedangHapus(false),
      }
    );
  };

  const bukaFile = () => {
    if (!existingDoc) return;
    const url =
      existingDoc.url ||
      route('administrasi.manpower.documents.show', [employee.id, existingDoc.id]);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border rounded-xl border-slate-200/80 shadow-2xs gap-3 transition-colors hover:border-slate-300">
      {/* File Input Tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFilePilih}
      />
      <DialogPindai
        file={filePindai}
        onBatal={() => setFilePindai(null)}
        onPilih={(f) => {
          setFilePindai(null);
          kirim(f);
        }}
      />

      {/* Info Dokumen */}
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
            existingDoc
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-slate-100 text-slate-400 border border-slate-200/60'
          }`}
        >
          {sedangUpload || sedangHapus ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          ) : existingDoc ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
              {label}
            </span>
            <span
              className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium ${
                existingDoc
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-slate-100 text-slate-500 border border-slate-200/60'
              }`}
            >
              {existingDoc ? 'Sudah Ada' : 'Belum Ada'}
            </span>
          </div>

          {/* Last Update Dokumen */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            {existingDoc ? (
              <>
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>
                  Update: <strong className="text-slate-700">{existingDoc.updated_at}</strong>
                  {existingDoc.human_updated && (
                    <span className="text-slate-400 ml-1">({existingDoc.human_updated})</span>
                  )}
                </span>
              </>
            ) : (
              <span className="text-slate-400 italic">Belum ada file yang diunggah</span>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Aksi Dokumen */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {existingDoc ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={bukaFile}
              className="h-8 gap-1.5 text-xs font-medium border-slate-200 hover:bg-slate-50"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              Lihat File
            </Button>

            {bolehUnggah && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={sedangUpload || sedangHapus}
                  onClick={() => inputRef.current?.click()}
                  className="h-8 gap-1.5 text-xs font-medium border-slate-200 hover:bg-slate-50"
                  title="Ganti dokumen ini dengan berkas baru"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  Ganti
                </Button>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={sedangUpload || sedangHapus}
                  onClick={handleHapusDokumen}
                  className="w-8 h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                  title={`Hapus berkas ${label}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </>
        ) : (
          bolehUnggah && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={sedangUpload}
              onClick={() => inputRef.current?.click()}
              className="h-8 gap-1.5 text-xs font-medium bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              Unggah File
            </Button>
          )
        )}
      </div>
    </div>
  );
};

/**
 * Dialog Detail Karyawan Lengkap (Profil + Berkas Dokumen Digital + Cropper Foto)
 */
const DetailKaryawan = ({
  d,
  onClosed,
  superuser,
  bolehUnggah,
  onMulaiGantiFoto,
  onHapusFoto,
  onLihatFoto,
}) => {
  if (!d) return null;

  // Hitung jumlah dokumen yang sudah diunggah
  const totalDiunggah = DOCUMENT_TYPES.filter((dt) =>
    d.documents?.some((doc) => doc.type === dt.type)
  ).length;

  return (
    <Dialog open={!!d} onOpenChange={(o) => !o && onClosed()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header Profil */}
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 shrink-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* Avatar dengan Action Overlay */}
            <div className="relative group shrink-0">
              <Avatar d={d} ukuran="w-24 h-24 text-2xl" onLihatFoto={onLihatFoto} />
              {bolehUnggah && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black/40 rounded-full opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-white hover:bg-white/20"
                    onClick={() => onMulaiGantiFoto(d)}
                    title="Ganti foto profil"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <DialogTitle className="text-xl font-bold text-slate-900 truncate">
                  {d.employee_name}
                </DialogTitle>
                <StatusBadge aktif={d.isActive} />
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                <JabatanBadge jabatan={d.employment} />
                <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  NIK: {d.identity_id || '–'}
                </span>
              </div>

              {/* Tombol Ganti / Hapus Foto Profil di dalam Detail */}
              {bolehUnggah && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMulaiGantiFoto(d)}
                    className="h-8 gap-1.5 text-xs font-medium border-slate-200 hover:bg-slate-50"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    {d.avatar ? 'Ganti Foto Profil' : 'Unggah Foto Profil'}
                  </Button>
                  {d.avatar && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onHapusFoto(d)}
                      className="h-8 gap-1.5 text-xs font-medium text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus Foto
                    </Button>
                  )}
                  {d.avatar && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onLihatFoto(d)}
                      className="h-8 gap-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lihat Foto Penuh
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Konten Tabs: Profil vs Berkas Dokumen Digital */}
        <div className="flex-1 overflow-y-auto p-6 pt-3">
          <Tabs defaultValue="dokumen" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4">
              <TabsTrigger value="dokumen" className="text-xs font-semibold py-1.5 rounded-lg gap-2">
                <FileText className="w-3.5 h-3.5" />
                Berkas Dokumen
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-slate-700 shadow-2xs font-mono">
                  {totalDiunggah} / {DOCUMENT_TYPES.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="profil" className="text-xs font-semibold py-1.5 rounded-lg gap-2">
                <IdCard className="w-3.5 h-3.5" />
                Data Pribadi
              </TabsTrigger>
            </TabsList>

            {/* Tab: Berkas Dokumen Digital */}
            <TabsContent value="dokumen" className="space-y-3 mt-0 focus:outline-hidden">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Dokumen Kelengkapan Karyawan
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Format: PDF, JPG, JPEG, PNG (Maksimal 5MB per berkas).
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {DOCUMENT_TYPES.map((item) => {
                  const existingDoc = d.documents?.find((doc) => doc.type === item.type) ?? null;
                  return (
                    <DocumentUploaderRow
                      key={item.type}
                      employee={d}
                      type={item.type}
                      label={item.label}
                      existingDoc={existingDoc}
                      bolehUnggah={bolehUnggah}
                    />
                  );
                })}
              </div>
            </TabsContent>

            {/* Tab: Data Pribadi */}
            <TabsContent value="profil" className="space-y-3 mt-0 focus:outline-hidden">
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2 font-medium text-slate-500">
                    <IdCard className="w-4 h-4 text-slate-400" /> NIK (Nomor Induk Kependudukan)
                  </span>
                  <span className="font-mono font-semibold text-slate-800">{d.identity_id || '–'}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2 font-medium text-slate-500">
                    <Shield className="w-4 h-4 text-slate-400" /> Akun Login Aplikasi
                  </span>
                  <div className="text-right">
                    {d.username ? (
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-mono font-medium rounded ${
                            d.username_status == 1
                              ? 'bg-sky-50 text-sky-800 border border-sky-200/60'
                              : 'bg-slate-200 text-slate-500 line-through'
                          }`}
                        >
                          @{d.username}
                        </span>
                        {superuser && d.rolelist?.length > 0 && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {d.rolelist.map((r) => r.name).join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Belum ada akun</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2 font-medium text-slate-500 mt-0.5">
                    <MapPin className="w-4 h-4 text-slate-400" /> Alamat Domisili
                  </span>
                  <span className="max-w-[65%] text-right text-slate-700 break-words leading-relaxed">
                    {d.address || '–'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex items-center gap-1.5 font-medium text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Masuk
                    </span>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{tgl(d.hire_date)}</div>
                    {d.hire_date && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Masa kerja: <strong>{durasiKerja(d.hire_date, d.resign_date)}</strong>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex items-center gap-1.5 font-medium text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Resign
                    </span>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{tgl(d.resign_date)}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {d.isActive ? 'Masih aktif bertugas' : 'Sudah tidak bertugas'}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <Button variant="outline" size="sm" onClick={onClosed} className="px-5">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ManPower = ({ datas = [], title = 'Data Karyawan' }) => {
  const { auth } = usePage().props;
  const superuser = auth?.roles?.includes('superuser');
  const bolehUnggah = superuser || auth?.roles?.includes('kasir');

  const [pilihId, setPilihId] = useState(null);
  const pilih = datas.find((d) => d.id === pilihId) ?? null;

  const [tab, setTab] = useState('aktif');
  const [cari, setCari] = useState('');

  // State untuk Cropper Foto Profil
  const fileInputRef = useRef(null);
  const [targetEmployee, setTargetEmployee] = useState(null);
  const [fileToCrop, setFileToCrop] = useState(null);

  // State untuk Viewer Foto Besar
  const [previewFotoData, setPreviewFotoData] = useState(null);

  const jumlah = useMemo(
    () => ({
      aktif: datas.filter((d) => d.isActive).length,
      resign: datas.filter((d) => !d.isActive).length,
      semua: datas.length,
    }),
    [datas]
  );

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return datas
      .filter((d) => (tab === 'aktif' ? d.isActive : tab === 'resign' ? !d.isActive : true))
      .filter(
        (d) =>
          !q ||
          [d.employee_name, d.identity_id, d.username, d.employment].some((v) =>
            String(v ?? '').toLowerCase().includes(q)
          )
      );
  }, [datas, tab, cari]);

  // Handler memilih file foto profil untuk dicrop
  const mulaiGantiFoto = (employee) => {
    setTargetEmployee(employee);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const onFileTerpilih = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa foto.');
      return;
    }
    setFileToCrop(file);
  };

  // Handler Hapus Foto Profil
  const konfirmasiHapusFoto = (employee) => {
    if (!employee) return;
    if (!confirm(`Hapus foto profil karyawan "${employee.employee_name}"?`)) return;

    router.delete(route('administrasi.manpower.avatar.delete', employee.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Foto profil berhasil dihapus.');
      },
      onError: () => {
        toast.error('Gagal menghapus foto profil.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <Head title={title} />

      {/* Input File Tersembunyi untuk Upload Foto Profil */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileTerpilih}
      />

      {/* Modal Cropper Foto */}
      <ModalCropAvatar
        employee={targetEmployee}
        file={fileToCrop}
        onBatal={() => {
          setFileToCrop(null);
          setTargetEmployee(null);
        }}
        onSelesai={() => {
          setFileToCrop(null);
          setTargetEmployee(null);
        }}
      />

      {/* Modal Viewer Foto Besar */}
      <ModalLihatFoto data={previewFotoData} onTutup={() => setPreviewFotoData(null)} />

      {/* Modal Detail Karyawan (Profil, Upload Foto, dan Dokumen Berkas Digital) */}
      <DetailKaryawan
        d={pilih}
        onClosed={() => setPilihId(null)}
        superuser={superuser}
        bolehUnggah={bolehUnggah}
        onMulaiGantiFoto={mulaiGantiFoto}
        onHapusFoto={konfirmasiHapusFoto}
        onLihatFoto={setPreviewFotoData}
      />

      {/* Header Halaman & Statistik Ringkas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900">
            <Users className="w-6 h-6 text-red-600" />
            {title}
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Klik nama karyawan untuk melihat detail, kelola foto profil, dan dokumen berkas digital.
          </p>
        </div>

        {/* Kartu Ringkasan Metrik */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border rounded-xl shadow-xs border-slate-200/80">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="text-xs text-slate-500">Aktif</div>
              <div className="text-base font-bold text-slate-900">{jumlah.aktif}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border rounded-xl shadow-xs border-slate-200/80">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600">
              <UserX className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="text-xs text-slate-500">Resign</div>
              <div className="text-base font-bold text-slate-900">{jumlah.resign}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border rounded-xl shadow-xs border-slate-200/80">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600">
              <Users className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-base font-bold text-slate-900">{jumlah.semua}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontrol Toolbar: Tabs Status + Pencarian Cepat */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tab Status (Aktif / Resign / Semua) */}
        <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-xs">
          {TAB.map(([k, label]) => {
            const isAktif = tab === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isAktif
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${
                    isAktif ? 'bg-red-50 text-red-600 font-bold' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {jumlah[k]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" aria-hidden="true" />
          <Input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama, NIK, username, jabatan…"
            className="h-9 pl-9 pr-8 text-xs bg-white rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
          />
          {cari && (
            <button
              type="button"
              onClick={() => setCari('')}
              className="absolute -translate-y-1/2 right-2.5 top-1/2 text-slate-400 hover:text-slate-600"
              title="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Kosong */}
      {tampil.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed rounded-2xl border-slate-300">
          <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-slate-100 text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Tidak ada karyawan yang cocok</h3>
          <p className="mt-1 text-xs text-slate-500">
            Silakan ubah kata kunci pencarian atau ganti filter tab status di atas.
          </p>
        </div>
      )}

      {/* Desktop: Tabel Modern */}
      {tampil.length > 0 && (
        <div className="hidden overflow-hidden bg-white border rounded-2xl shadow-xs border-slate-200/90 md:block">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="w-12 px-4 py-3 text-center">#</th>
                  <th className="px-4 py-3">Karyawan</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Berkas</th>
                  <th className="px-4 py-3">Akun Login</th>
                  <th className="px-4 py-3">Masa Kerja</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="w-24 px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tampil.map((d, i) => {
                  const jumlahDokumen = d.documents?.length ?? 0;
                  return (
                    <tr
                      key={d.id}
                      className="transition-colors hover:bg-slate-50/80 group"
                    >
                      {/* Nomor Urut */}
                      <td className="px-4 py-3 text-center font-mono text-slate-400">
                        {i + 1}
                      </td>

                      {/* Identitas Karyawan & Foto Profil (Klik nama = Buka Detail) */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar d={d} onLihatFoto={setPreviewFotoData} />
                            {bolehUnggah && (
                              <button
                                type="button"
                                onClick={() => mulaiGantiFoto(d)}
                                title="Ganti foto profil"
                                className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 text-white transition-transform bg-slate-800 rounded-full shadow-xs hover:bg-red-600 hover:scale-110"
                              >
                                <Camera className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setPilihId(d.id)}
                              className="font-bold text-slate-900 hover:text-red-600 text-left cursor-pointer transition-colors truncate max-w-[200px] block"
                              title={`Klik untuk melihat detail & dokumen ${d.employee_name}`}
                            >
                              {d.employee_name}
                            </button>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                                {d.identity_id || '–'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Jabatan */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <JabatanBadge jabatan={d.employment} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge aktif={d.isActive} />
                      </td>

                      {/* Berkas Dokumen Indikator */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setPilihId(d.id)}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
                            jumlahDokumen > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100/60'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Klik untuk membuka kelola dokumen"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{jumlahDokumen} / {DOCUMENT_TYPES.length} Berkas</span>
                        </button>
                      </td>

                      {/* Akun */}
                      <td className="px-4 py-3">
                        {d.username ? (
                          <div className="min-w-0">
                            <span
                              className={`inline-block font-mono text-[11px] font-medium px-2 py-0.5 rounded border ${
                                d.username_status == 1
                                  ? 'bg-sky-50 text-sky-700 border-sky-200/70'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                              }`}
                            >
                              @{d.username}
                            </span>
                            {superuser && d.rolelist?.length > 0 && (
                              <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                                {d.rolelist.map((r) => r.name).join(', ')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum ada akun</span>
                        )}
                      </td>

                      {/* Masa Kerja */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">{tgl(d.hire_date)}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {d.isActive ? durasiKerja(d.hire_date, null) : `Resign: ${tgl(d.resign_date)}`}
                        </div>
                      </td>

                      {/* Alamat */}
                      <td className="px-4 py-3 max-w-[180px] text-slate-600 truncate" title={d.address}>
                        {d.address || '–'}
                      </td>

                      {/* Aksi Kolom */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPilihId(d.id)}
                            className="h-8 px-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs gap-1 font-medium"
                            title="Buka detail & kelola dokumen karyawan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Detail
                          </Button>

                          {bolehUnggah && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                  title="Menu foto profil"
                                >
                                  <Camera className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 text-xs">
                                <DropdownMenuItem
                                  onClick={() => mulaiGantiFoto(d)}
                                  className="cursor-pointer gap-2"
                                >
                                  <ImageUp className="w-3.5 h-3.5 text-slate-500" />
                                  {d.avatar ? 'Ganti Foto Profil' : 'Unggah Foto Profil'}
                                </DropdownMenuItem>
                                {d.avatar && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => setPreviewFotoData(d)}
                                      className="cursor-pointer gap-2"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                                      Lihat Foto Profil
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => konfirmasiHapusFoto(d)}
                                      className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Hapus Foto Profil
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tampilan HP: Kartu Modern (Klik Nama = Detail) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {tampil.map((d) => {
          const jumlahDokumen = d.documents?.length ?? 0;
          return (
            <div
              key={d.id}
              className={`p-4 bg-white border rounded-2xl shadow-xs transition-all border-slate-200/90 ${
                d.isActive ? '' : 'opacity-80 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar d={d} ukuran="w-12 h-12 text-sm" onLihatFoto={setPreviewFotoData} />
                    {bolehUnggah && (
                      <button
                        type="button"
                        onClick={() => mulaiGantiFoto(d)}
                        className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 text-white bg-slate-800 rounded-full shadow-xs"
                      >
                        <Camera className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setPilihId(d.id)}
                      className="font-bold text-slate-900 truncate hover:text-red-600 cursor-pointer text-left block"
                    >
                      {d.employee_name}
                    </button>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {d.identity_id || '–'}
                      </span>
                    </div>
                  </div>
                </div>

                <StatusBadge aktif={d.isActive} />
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <JabatanBadge jabatan={d.employment} />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <FileText className="w-3 h-3" /> {jumlahDokumen} Dokumen
                </span>
                {d.username && (
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
                    @{d.username}
                  </span>
                )}
              </div>

              {d.address && (
                <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                  <span className="truncate">{d.address}</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="text-[11px] text-slate-500">
                  Masuk: <span className="font-medium text-slate-700">{tgl(d.hire_date)}</span>
                  {d.resign_date && <span className="ml-2 text-red-500">Resign: {tgl(d.resign_date)}</span>}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPilihId(d.id)}
                  className="h-8 px-3 text-xs font-semibold rounded-lg text-slate-700 hover:text-red-600"
                >
                  Detail & Berkas
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManPower;
