import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import InputError from '@/Components/InputError';
import { ExternalLink, Eye, FileText, Paperclip, Pencil, Plus, Search, Trash2, Upload, User, UserPlus } from 'lucide-react';
import VideoTutorialButton from '@/Components/VideoTutorialButton';
import { pindai } from '@/lib/pindai';

/**
 * Lamaran Kerja (cabang aktif): catat pelamar + unggah dokumen. Edit & hapus
 * selama masih menunggu; terima / tolak oleh HRD di app_laravel.
 */
const NAMA_DOK = {
  pasfoto: 'Pas Foto',
  ktp: 'SCAN KTP',
  kk: 'SCAN KK',
  ijazah: 'SCAN IJAZAH',
  skck: 'SKCK',
  lamaran_kerja: 'Surat lamaran',
};

/**
 * Kompresi gambar langsung di browser peramban sebelum dikirim ke server.
 * Foto HP beresolusi tinggi (3MB - 15MB) dikecilkan menjadi JPEG terkompresi (~300KB - 700KB)
 * dengan dimensi maksimal 1920px dan kualitas 0.82. PDF dikirim apa adanya.
 */
const kompresGambar = (file) =>
  new Promise((resolve) => {
    if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') {
      return resolve(file);
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_DIM = 1920;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(file);

      // Background putih jika sumber gambar adalah PNG/transparan
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const namaFile = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
          resolve(new File([blob], namaFile, { type: 'image/jpeg', lastModified: Date.now() }));
        },
        'image/jpeg',
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
const TAB = [
  ['menunggu', 'Menunggu'],
  ['selesai', 'Selesai'],
  ['semua', 'Semua'],
];
const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');
const PILIH = 'w-full h-9 px-3 text-sm border rounded-md border-input bg-background';

const Status = ({ s }) => {
  const w = { menunggu: 'bg-amber-100 text-amber-800', diterima: 'bg-emerald-100 text-emerald-800', ditolak: 'bg-rose-100 text-rose-800' };
  return <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full capitalize ${w[s] ?? 'bg-slate-100'}`}>{s}</span>;
};

/** Hasil cek NIK: karyawan aktif (ditolak server), mantan, riwayat lamaran. */
const CekNik = ({ nik, kecuali, onAktif }) => {
  const [hasil, setHasil] = useState(null);
  // Beri tahu form: NIK karyawan aktif -> tombol Simpan dimatikan.
  useEffect(() => onAktif?.(!!hasil?.aktif), [hasil]);
  useEffect(() => {
    setHasil(null);
    if (!/^\d{15,16}$/.test(nik ?? '')) return;
    const c = new AbortController();
    const t = setTimeout(() => {
      axios
        .get(route('administrasi.lamaran.cek_nik'), { params: { nik, kecuali }, signal: c.signal })
        .then(({ data }) => setHasil(data))
        .catch(() => {});
    }, 400);
    return () => {
      clearTimeout(t);
      c.abort();
    };
  }, [nik, kecuali]);

  if (!hasil) return null;
  return (
    <div className="space-y-1 text-xs">
      {hasil.aktif && (
        <div className="p-2 font-medium rounded bg-rose-50 text-rose-800">
          NIK milik karyawan aktif {hasil.aktif.nama} ({hasil.aktif.kantor}) — tidak bisa diinput sebagai pelamar. Mohon
          hubungi STAF PUSAT / IT.
        </div>
      )}
      {hasil.mantan && (
        <div className="p-2 rounded bg-amber-50 text-amber-800">
          Mantan karyawan: {hasil.mantan.nama}, {hasil.mantan.kantor}, resign {tgl(hasil.mantan.resign)}.
        </div>
      )}
      {hasil.lamaran?.length > 0 && (
        <div className="p-2 rounded bg-slate-50 text-slate-700">
          Pernah melamar:{' '}
          {hasil.lamaran.map((l, i) => (
            <span key={i}>
              {i > 0 && ', '}
              {tgl(l.tanggal)} di {l.kantor} ({l.status})
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/** Form catat / edit lamaran. */
const FormLamaran = ({ buka, edit, onClosed, jabatan, referensi, referensi_luar = ['Pak Hertawan'] }) => {
  const kosong = {
    nama: '',
    nik: '',
    no_hp: '',
    alamat: '',
    tanggal_lamaran: dayjs().format('YYYY-MM-DD'),
    employment_id: '',
    referensi_employee_id: '',
    referensi_luar: '',
    catatan: '',
  };
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(kosong);
  const [nikAktif, setNikAktif] = useState(false);

  useEffect(() => {
    clearErrors();
    if (!buka) return;
    if (edit) {
      setData({
        nama: edit.nama ?? '',
        nik: edit.nik ?? '',
        no_hp: edit.no_hp ?? '',
        alamat: edit.alamat ?? '',
        tanggal_lamaran: edit.tanggal_lamaran ?? dayjs().format('YYYY-MM-DD'),
        employment_id: edit.employment_id ?? '',
        referensi_employee_id: edit.referensi_employee_id ? String(edit.referensi_employee_id) : '',
        referensi_luar: edit.referensi_luar ?? '',
        catatan: edit.catatan ?? '',
      });
    } else {
      reset();
    }
  }, [buka, edit?.id]);

  const nilaiReferensi = data.referensi_luar
    ? `luar:${data.referensi_luar}`
    : data.referensi_employee_id
    ? String(data.referensi_employee_id)
    : '';

  const gantiReferensi = (e) => {
    const val = e.target.value;
    if (!val) {
      setData((d) => ({ ...d, referensi_employee_id: '', referensi_luar: '' }));
    } else if (val.startsWith('luar:')) {
      const namaLuar = val.replace(/^luar:/, '');
      setData((d) => ({ ...d, referensi_employee_id: '', referensi_luar: namaLuar }));
    } else {
      setData((d) => ({ ...d, referensi_employee_id: val, referensi_luar: '' }));
    }
  };

  const kirim = (e) => {
    e.preventDefault();
    const opsi = { preserveScroll: true, onSuccess: () => onClosed() };
    edit ? put(route('administrasi.lamaran.update', edit.id), opsi) : post(route('administrasi.lamaran.store'), opsi);
  };
  const ubah = (e) => setData(e.target.name, e.target.value);

  return (
    <Dialog open={buka} onOpenChange={(o) => !o && !processing && onClosed()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{edit ? 'Edit lamaran' : 'Catat lamaran'}</DialogTitle>
          <DialogDescription>Diputuskan (terima / tolak) oleh HRD di aplikasi pusat.</DialogDescription>
        </DialogHeader>
        <form id="form-lamaran" onSubmit={kirim} className="grid gap-3">
          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="nik">NIK</Label>
              {/* Penghitung digit: NIK 15-16 angka. */}
              <span
                className={`text-xs tabular-nums ${
                  !data.nik ? 'text-slate-400' : data.nik.length < 15 ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {data.nik.length}/16 digit{data.nik && data.nik.length < 15 ? ' (min 15)' : ''}
              </span>
            </div>
            <Input
              id="nik"
              name="nik"
              inputMode="numeric"
              minLength={15}
              maxLength={16}
              pattern="[0-9]{15,16}"
              title="NIK 15-16 digit angka"
              value={data.nik}
              onChange={(e) => setData('nik', e.target.value.replace(/\D/g, '').slice(0, 16))}
              required
            />
            <InputError message={errors.nik} />
            <CekNik nik={data.nik} kecuali={edit?.id} onAktif={setNikAktif} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="nama">Nama</Label>
            <Input id="nama" name="nama" value={data.nama} onChange={ubah} required />
            <InputError message={errors.nama} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label htmlFor="no_hp">No HP</Label>
              <Input id="no_hp" name="no_hp" inputMode="tel" value={data.no_hp} onChange={ubah} />
              <InputError message={errors.no_hp} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="tanggal_lamaran">Tanggal lamaran</Label>
              <Input id="tanggal_lamaran" name="tanggal_lamaran" type="date" max={dayjs().format('YYYY-MM-DD')} value={data.tanggal_lamaran} onChange={ubah} required />
              <InputError message={errors.tanggal_lamaran} />
            </div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="alamat">Alamat</Label>
            <Input id="alamat" name="alamat" value={data.alamat} onChange={ubah} required />
            <InputError message={errors.alamat} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label htmlFor="employment_id">Jabatan dilamar</Label>
              <select id="employment_id" name="employment_id" className={PILIH} value={data.employment_id} onChange={ubah}>
                <option value="">—</option>
                {jabatan.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.jabatan}
                  </option>
                ))}
              </select>
              <InputError message={errors.employment_id} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="referensi">Referensi</Label>
              <select id="referensi" name="referensi" className={PILIH} value={nilaiReferensi} onChange={gantiReferensi}>
                <option value="">— Tidak ada —</option>
                {referensi_luar.map((nama) => (
                  <option key={nama} value={`luar:${nama}`}>
                    {nama}
                  </option>
                ))}
                {referensi.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nama_karyawan}
                  </option>
                ))}
              </select>
              <InputError message={errors.referensi_employee_id ?? errors.referensi_luar} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="catatan">Track Record dan Catatan</Label>
            <textarea
              id="catatan"
              name="catatan"
              rows={4}
              placeholder="* Koperasi bangun jaya&#10;* Kasir Alfamart&#10;* Sebelumnya tidak pernah masuk di UB&#10;* Interview pak Jono pimpinan&#10;* Recommend dari pimpinan diterima&#10;* Perantara pak dilan mantri 1&#10;* Calon mantri unit Krian 10 klp 2"
              className="px-3 py-2 text-sm border rounded-md border-input focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={data.catatan}
              onChange={ubah}
            />
            <InputError message={errors.catatan} />
            <div className="p-3 mt-0.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-900">Format Track record &amp; catatan</span>
                {!data.catatan && (
                  <button
                    type="button"
                    onClick={() =>
                      setData(
                        'catatan',
                        `* Koperasi bangun jaya\n* Kasir Alfamart\n* Sebelumnya tidak pernah masuk di UB\n* Interview pak Jono pimpinan\n* Recommend dari pimpinan diterima\n* Perantara pak dilan mantri 1\n* Calon mantri unit Krian 10 klp 2`
                      )
                    }
                    className="text-[11px] font-medium text-sky-600 hover:text-sky-800 hover:underline"
                  >
                    Gunakan format contoh
                  </button>
                )}
              </div>
              <ul className="space-y-0.5 text-slate-600 font-mono text-[11px] leading-relaxed">
                <li>* Koperasi bangun jaya</li>
                <li>* Kasir Alfamart</li>
                <li>* Sebelumnya tidak pernah masuk di UB</li>
                <li>* Interview pak Jono pimpinan</li>
                <li>* Recommend dari pimpinan diterima</li>
                <li>* Perantara pak dilan mantri 1</li>
                <li>* Calon mantri unit Krian 10 klp 2</li>
              </ul>
            </div>
          </div>
        </form>
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={processing} onClick={onClosed}>
            Batal
          </Button>
          <Button type="submit" form="form-lamaran" disabled={processing || nikAktif || data.nik.length < 15}>
            {processing ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Modal Viewer Dokumen: preview gambar atau PDF langsung di dalam aplikasi */
const ModalLihatDokumen = ({ data, onTutup }) => {
  if (!data) return null;
  const isPdf = data.url?.toLowerCase().includes('.pdf') || data.type === 'pdf';
  return (
    <Dialog open={!!data} onOpenChange={(o) => !o && onTutup()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-4 bg-white border-slate-200 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2 text-left border-b border-slate-100 shrink-0">
          <DialogTitle className="flex items-center justify-between text-base font-semibold text-slate-900">
            <span>{data.judul}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Dokumen pelamar · {data.namaPelamar}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto flex items-center justify-center p-2 min-h-[300px]">
          {isPdf ? (
            <iframe src={data.url} className="w-full h-[60vh] rounded-lg border border-slate-200" title={data.judul} />
          ) : (
            <img
              src={data.url}
              alt={data.judul}
              className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-sm border border-slate-100"
            />
          )}
        </div>
        <DialogFooter className="flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 shrink-0 sm:justify-between">
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Buka di tab baru
          </a>
          <Button variant="outline" size="sm" onClick={onTutup}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Gambar yang dipilih (kamera / file) dipindai dulu: tepi kertas dicari, perspektif
 * diluruskan, latar (meja) dibuang. Kasir memilih Asli atau Hasil scan - deteksi
 * otomatis bisa meleset, jadi hasilnya tidak pernah dipakai diam-diam.
 */
const DialogPindai = ({ file, onPilih, onBatal }) => {
  const [hasil, setHasil] = useState(undefined); // undefined = memproses, null = tidak terdeteksi
  const [galat, setGalat] = useState(null);
  const urlAsli = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const urlHasil = useMemo(() => (hasil ? URL.createObjectURL(hasil) : null), [hasil]);
  useEffect(() => () => urlAsli && URL.revokeObjectURL(urlAsli), [urlAsli]);
  useEffect(() => () => urlHasil && URL.revokeObjectURL(urlHasil), [urlHasil]);

  useEffect(() => {
    if (!file) return;
    let batal = false;
    setHasil(undefined);
    setGalat(null);
    pindai(file)
      .then((h) => !batal && setHasil(h))
      .catch((e) => {
        if (batal) return;
        setGalat(e.message);
        setHasil(null);
      });
    return () => {
      batal = true;
    };
  }, [file]);

  const Pratinjau = ({ judul, url, children }) => (
    <div className="grid gap-1">
      <span className="text-xs font-semibold text-slate-600">{judul}</span>
      <div className="flex items-center justify-center h-64 overflow-hidden border rounded-md bg-slate-100">
        {url ? <img src={url} alt={judul} className="object-contain max-w-full max-h-full" /> : children}
      </div>
    </div>
  );

  return (
    <Dialog open={!!file} onOpenChange={(o) => !o && onBatal()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Rapikan gambar</DialogTitle>
          <DialogDescription>Tepi kertas dicari otomatis dan latarnya dibuang. Pilih yang paling jelas.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pratinjau judul="Asli" url={urlAsli} />
          <Pratinjau judul="Hasil scan" url={urlHasil}>
            <span className="px-4 text-sm text-center text-slate-500">
              {hasil === undefined
                ? 'Memindai… (pertama kali memuat pemindai ±3 MB, mohon tunggu)'
                : galat || 'Tepi kertas tidak ditemukan. Pakai gambar asli, atau foto ulang dengan latar yang kontras.'}
            </span>
          </Pratinjau>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onPilih(file)}>
            Pakai asli
          </Button>
          <Button disabled={!hasil} onClick={() => onPilih(hasil)}>
            Pakai hasil scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Detail satu lamaran: data, dokumen (unggah sekali per jenis), edit & hapus selama menunggu. */
const Detail = ({ l, jenis, onClosed, onEdit }) => {
  const input = useRef(null);
  const [jenisUnggah, setJenisUnggah] = useState(null);
  const [proses, setProses] = useState(false);
  const [statusTeks, setStatusTeks] = useState(null);
  const [galat, setGalat] = useState(null);
  const [previewDokumen, setPreviewDokumen] = useState(null);
  const [filePindai, setFilePindai] = useState(null);
  const menunggu = l?.status === 'menunggu';

  const pilihFile = (j) => {
    setJenisUnggah(j);
    setGalat(null);
    input.current?.click();
  };
  const unggah = (e) => {
    const fileMentah = e.target.files?.[0];
    e.target.value = '';
    if (!fileMentah || !jenisUnggah) return;
    // Gambar (kamera / file) dirapikan dulu lewat DialogPindai; PDF langsung dikirim.
    if (fileMentah.type?.startsWith('image/') && fileMentah.type !== 'image/gif') {
      setFilePindai(fileMentah);
      return;
    }
    kirim(fileMentah);
  };
  const kirim = async (fileMentah) => {
    setGalat(null);
    setProses(true);
    setStatusTeks('Mengompresi…');

    try {
      const file = await kompresGambar(fileMentah);
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Ukuran file melebihi 10MB.');
      }
      setStatusTeks('Mengunggah…');
      router.post(
        route('administrasi.lamaran.unggah_dokumen', l.id),
        { type: jenisUnggah, file },
        {
          forceFormData: true,
          preserveScroll: true,
          preserveState: true,
          onError: (err) => setGalat(err.file ?? err.type ?? Object.values(err)[0] ?? 'Gagal mengunggah.'),
          onFinish: () => {
            setProses(false);
            setStatusTeks(null);
          },
        },
      );
    } catch (err) {
      setGalat(err instanceof Error ? err.message : 'Gagal memproses file.');
      setProses(false);
      setStatusTeks(null);
    }
  };
  const hapusBerkas = (j, doc) => {
    const label = NAMA_DOK[j] ?? j;
    if (!window.confirm(`Hapus dokumen ${label} milik ${l.nama}?`)) return;
    setProses(true);
    setStatusTeks('Menghapus…');
    setGalat(null);
    router.delete(route('administrasi.lamaran.hapus_dokumen', [l.id, doc.id]), {
      preserveScroll: true,
      preserveState: true,
      onError: (err) => setGalat(Object.values(err)[0] ?? 'Gagal menghapus dokumen.'),
      onFinish: () => {
        setProses(false);
        setStatusTeks(null);
      },
    });
  };
  const hapus = () => {
    if (!window.confirm(`Hapus lamaran ${l.nama}? Dokumennya ikut terhapus.`)) return;
    router.delete(route('administrasi.lamaran.destroy', l.id), { preserveScroll: true, onSuccess: onClosed });
  };

  return (
    <>
      <ModalLihatDokumen data={previewDokumen} onTutup={() => setPreviewDokumen(null)} />
      <DialogPindai
        file={filePindai}
        onBatal={() => setFilePindai(null)}
        onPilih={(f) => {
          setFilePindai(null);
          kirim(f);
        }}
      />
      <Dialog open={!!l} onOpenChange={(o) => !o && !proses && onClosed()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {l && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {l.nama} <Status s={l.status} />
                </DialogTitle>
                <DialogDescription>
                  NIK {l.nik} · melamar {tgl(l.tanggal_lamaran)}
                </DialogDescription>
              </DialogHeader>

              <div className="text-sm divide-y divide-slate-100">
                {[
                  ['No HP', l.no_hp],
                  ['Alamat', l.alamat],
                  ['Jabatan', l.employment],
                  ['Referensi', l.referensi],
                  ['Track Record & Catatan', l.catatan],
                  ['Diinput oleh', l.diinput_oleh],
                  ...(l.status === 'ditolak' ? [['Alasan ditolak', l.alasan_tolak]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[10.5rem_1fr] gap-2 py-1.5">
                    <span className="text-slate-500">{k}</span>
                    <span className="break-words whitespace-pre-wrap text-slate-900">{v || '–'}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-base font-semibold text-slate-900">Dokumen pelamar</h3>
                  <span className="text-sm font-medium tabular-nums text-slate-600">
                    {l.dokumen.length}/{jenis.length} lengkap
                  </span>
                </div>
                <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={unggah} />
                <div className="grid gap-2 sm:grid-cols-2">
                  {jenis.map((j) => {
                    const ada = l.dokumen.find((d) => d.type === j);
                    const label = NAMA_DOK[j] ?? j;
                    return (
                      <div
                        key={j}
                        className={`flex items-center gap-3 p-3 border-2 rounded-xl transition-colors ${
                          ada ? 'border-emerald-300 bg-emerald-50/70' : 'border-dashed border-slate-300 bg-white'
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                            ada ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {j === 'pasfoto' ? <User className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate text-slate-900">{label}</div>
                          <div className={`text-xs ${ada ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>{ada ? 'Sudah diunggah' : 'Belum ada'}</div>
                        </div>
                        {ada ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPreviewDokumen({
                                  url: ada.url,
                                  judul: label,
                                  namaPelamar: l.nama,
                                  type: j,
                                })
                              }
                              className="gap-1 h-8 px-2.5 text-xs font-semibold text-emerald-800 border-emerald-300 bg-white hover:bg-emerald-100/70"
                              title={`Lihat ${label}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat</span>
                            </Button>
                            {menunggu && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={proses}
                                onClick={() => hapusBerkas(j, ada)}
                                className="gap-1 h-8 px-2 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                                title={`Hapus ${label}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Hapus</span>
                              </Button>
                            )}
                          </div>
                        ) : menunggu ? (
                          <Button className="gap-1.5 h-8 px-3 text-xs" disabled={proses} onClick={() => pilihFile(j)}>
                            <Upload className="w-3.5 h-3.5" />
                            {proses && jenisUnggah === j ? statusTeks || 'Memproses…' : 'Unggah'}
                          </Button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Foto (JPEG / PNG) otomatis dikompresi di browser, atau PDF (maks 10MB). Dokumen dapat dilihat dan dihapus selama status masih menunggu keputusan HRD.
                </p>
                {galat && <p className="mt-1 text-sm font-medium text-red-600">{galat}</p>}
              </div>

              {menunggu && (
                <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
                  <Button variant="outline" className="gap-1 text-rose-700 border-rose-300 hover:bg-rose-50" onClick={hapus}>
                    <Trash2 className="w-4 h-4" /> Hapus
                  </Button>
                  <Button variant="outline" className="gap-1" onClick={() => onEdit(l)}>
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Index = ({ lamaran = [], jumlah = {}, filter = {}, unit, jabatan = [], referensi = [], referensi_luar = ['Pak Hertawan'], jenis_dokumen = [], video }) => {
  const [cari, setCari] = useState('');
  const [form, setForm] = useState({ buka: false, edit: null });
  // Simpan id: sesudah unggah / edit data dimuat ulang.
  const [pilihId, setPilihId] = useState(null);
  const pilih = lamaran.find((l) => l.id === pilihId) ?? null;

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return q ? lamaran.filter((l) => [l.nama, l.nik, l.no_hp].some((v) => String(v ?? '').toLowerCase().includes(q))) : lamaran;
  }, [lamaran, cari]);

  const gantiTab = (s) => router.get(route('administrasi.lamaran.index'), { status: s }, { preserveScroll: true, preserveState: true });

  return (
    <>
      <Head title="Lamaran Kerja" />
      <FormLamaran
        buka={form.buka}
        edit={form.edit}
        onClosed={() => setForm({ buka: false, edit: null })}
        jabatan={jabatan}
        referensi={referensi}
        referensi_luar={referensi_luar}
      />
      <Detail
        l={pilih}
        jenis={jenis_dokumen}
        onClosed={() => setPilihId(null)}
        onEdit={(l) => {
          setPilihId(null);
          setForm({ buka: true, edit: l });
        }}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
                <UserPlus className="w-5 h-5 text-slate-500" /> Lamaran Kerja
              </h1>
              <VideoTutorialButton videos={video} menu="lamaran" title="Panduan Lamaran Kerja" />
            </div>
            <p className="text-sm text-slate-500">{unit} · diputuskan HRD di aplikasi pusat.</p>
          </div>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama, NIK, no HP" className="pl-9" />
            </div>
            <Button className="gap-1" onClick={() => setForm({ buka: true, edit: null })}>
              <Plus className="w-4 h-4" /> Catat
            </Button>
          </div>
        </div>

        <div className="inline-flex p-1 rounded-lg bg-slate-100">
          {TAB.map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => gantiTab(k)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                (filter.status ?? 'menunggu') === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label} <span className="ml-0.5 text-xs text-slate-400">{jumlah[k] ?? 0}</span>
            </button>
          ))}
        </div>

        {tampil.length === 0 ? (
          <div className="py-10 text-sm text-center border rounded-lg text-slate-500">Belum ada lamaran.</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tampil.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setPilihId(l.id)}
                className="p-3 text-left bg-white border rounded-lg hover:border-sky-300 hover:bg-sky-50/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold truncate text-slate-900">{l.nama}</div>
                    <div className="text-xs text-slate-500 tabular-nums">{l.nik}</div>
                  </div>
                  <Status s={l.status} />
                </div>
                <div className="mt-2 text-xs text-slate-600">{l.employment ?? 'Jabatan belum diisi'}</div>
                <div className="mt-1 text-[11px] text-slate-500">{tgl(l.tanggal_lamaran)}</div>
                {/* Kelengkapan dokumen: satu cip per jenis, hijau = sudah diunggah. */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {jenis_dokumen.map((j) => {
                    const ada = l.dokumen.some((d) => d.type === j);
                    return (
                      <span
                        key={j}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                          ada ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Paperclip className="w-3 h-3" />
                        {NAMA_DOK[j] ?? j}
                      </span>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
