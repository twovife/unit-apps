import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Head, router, useForm } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import InputError from '@/Components/InputError';
import { FileText, Paperclip, Pencil, Plus, Search, Trash2, Upload, UserPlus } from 'lucide-react';

/**
 * Lamaran Kerja (cabang aktif): catat pelamar + unggah dokumen. Edit & hapus
 * selama masih menunggu; terima / tolak oleh HRD di app_laravel.
 */
const NAMA_DOK = { lamaran_kerja: 'Surat lamaran', ijazah: 'Ijazah', ktp: 'KTP', kk: 'KK', skck: 'SKCK' };
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
const FormLamaran = ({ buka, edit, onClosed, jabatan, referensi }) => {
  const kosong = {
    nama: '',
    nik: '',
    no_hp: '',
    alamat: '',
    tanggal_lamaran: dayjs().format('YYYY-MM-DD'),
    employment_id: '',
    referensi_employee_id: '',
    catatan: '',
  };
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(kosong);
  const [nikAktif, setNikAktif] = useState(false);

  useEffect(() => {
    clearErrors();
    if (!buka) return;
    if (edit) {
      setData(Object.fromEntries(Object.keys(kosong).map((k) => [k, edit[k] ?? ''])));
    } else {
      reset();
    }
  }, [buka, edit?.id]);

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
              <Label htmlFor="referensi_employee_id">Referensi</Label>
              <select id="referensi_employee_id" name="referensi_employee_id" className={PILIH} value={data.referensi_employee_id} onChange={ubah}>
                <option value="">—</option>
                {referensi.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nama_karyawan}
                  </option>
                ))}
              </select>
              <InputError message={errors.referensi_employee_id} />
            </div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="catatan">Catatan</Label>
            <textarea id="catatan" name="catatan" rows={2} className="px-3 py-2 text-sm border rounded-md border-input" value={data.catatan} onChange={ubah} />
            <InputError message={errors.catatan} />
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

/** Detail satu lamaran: data, dokumen (unggah sekali per jenis), edit & hapus selama menunggu. */
const Detail = ({ l, jenis, onClosed, onEdit }) => {
  const input = useRef(null);
  const [jenisUnggah, setJenisUnggah] = useState(null);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState(null);
  const menunggu = l?.status === 'menunggu';

  const pilihFile = (j) => {
    setJenisUnggah(j);
    setGalat(null);
    input.current?.click();
  };
  const unggah = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !jenisUnggah) return;
    setProses(true);
    router.post(
      route('administrasi.lamaran.unggah_dokumen', l.id),
      { type: jenisUnggah, file },
      {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        onError: (err) => setGalat(err.file ?? err.type ?? Object.values(err)[0] ?? 'Gagal mengunggah.'),
        onFinish: () => setProses(false),
      },
    );
  };
  const hapus = () => {
    if (!window.confirm(`Hapus lamaran ${l.nama}? Dokumennya ikut terhapus.`)) return;
    router.delete(route('administrasi.lamaran.destroy', l.id), { preserveScroll: true, onSuccess: onClosed });
  };

  return (
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
                ['Catatan', l.catatan],
                ['Diinput oleh', l.diinput_oleh],
                ...(l.status === 'ditolak' ? [['Alasan ditolak', l.alasan_tolak]] : []),
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
                  <span className="text-slate-500">{k}</span>
                  <span className="break-words text-slate-900">{v || '–'}</span>
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
              <input ref={input} type="file" accept="image/jpeg,image/png,application/pdf" className="hidden" onChange={unggah} />
              <div className="grid gap-2 sm:grid-cols-2">
                {jenis.map((j) => {
                  const ada = l.dokumen.find((d) => d.type === j);
                  return (
                    <div
                      key={j}
                      className={`flex items-center gap-3 p-3 border-2 rounded-xl ${
                        ada ? 'border-emerald-300 bg-emerald-50' : 'border-dashed border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                          ada ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900">{NAMA_DOK[j] ?? j}</div>
                        <div className={`text-xs ${ada ? 'text-emerald-700' : 'text-slate-500'}`}>{ada ? 'Sudah diunggah' : 'Belum ada'}</div>
                      </div>
                      {ada ? (
                        <a
                          href={ada.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center h-9 px-3 text-sm font-semibold text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
                        >
                          Lihat
                        </a>
                      ) : menunggu ? (
                        <Button className="gap-1.5 h-9" disabled={proses} onClick={() => pilihFile(j)}>
                          <Upload className="w-4 h-4" />
                          {proses && jenisUnggah === j ? 'Mengunggah…' : 'Unggah'}
                        </Button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-slate-500">Foto (JPEG / PNG) atau PDF, maks 5MB. Tiap dokumen sekali unggah, tidak bisa diganti.</p>
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
  );
};

const Index = ({ lamaran = [], jumlah = {}, filter = {}, unit, jabatan = [], referensi = [], jenis_dokumen = [] }) => {
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
    <Authenticated>
      <Head title="Lamaran Kerja" />
      <FormLamaran
        buka={form.buka}
        edit={form.edit}
        onClosed={() => setForm({ buka: false, edit: null })}
        jabatan={jabatan}
        referensi={referensi}
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
            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
              <UserPlus className="w-5 h-5 text-slate-500" /> Lamaran Kerja
            </h1>
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
    </Authenticated>
  );
};

export default Index;
