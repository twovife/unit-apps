import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Head, usePage } from '@inertiajs/react';
import { Input } from '@/shadcn/ui/input';
import { MapPin, Search, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

/**
 * Data Karyawan satu cabang (cabang aktif dari filter cabang di header).
 * Baca-saja: pembuatan akun pindah ke app_laravel (mas 2026-10-13).
 * Desktop = tabel, HP = kartu. Cari nama / NIK / username, saring status.
 */
const TAB = [
  ['aktif', 'Aktif'],
  ['resign', 'Resign'],
  ['semua', 'Semua'],
];

// Foto profil (link sementara dari server) atau inisial kalau tidak ada / gagal dimuat.
const Avatar = ({ d, besar = false, ukuran: ukuranProp = null }) => {
  const [gagal, setGagal] = useState(false);
  useEffect(() => setGagal(false), [d.avatar]);
  const ukuran = ukuranProp ?? (besar ? 'w-11 h-11 text-sm' : 'w-9 h-9 text-xs');
  const inisial = String(d.employee_name ?? '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();
  return d.avatar && !gagal ? (
    <img
      src={d.avatar}
      alt={d.employee_name}
      loading="lazy"
      onError={() => setGagal(true)}
      className={`${ukuran} rounded-full object-cover shrink-0 bg-slate-100 ${d.isActive ? '' : 'grayscale'}`}
    />
  ) : (
    <span
      className={`${ukuran} inline-flex items-center justify-center rounded-full shrink-0 font-semibold ${
        d.isActive ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'
      }`}
      aria-hidden="true"
    >
      {inisial}
    </span>
  );
};

const Baris = ({ label, children }) => (
  <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5 border-b border-slate-100 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="min-w-0 text-slate-900 break-words">{children}</span>
  </div>
);

/** Detail satu karyawan (unggah foto profil menyusul). */
const DetailKaryawan = ({ d, onClosed, superuser }) => {
  return (
    <Dialog open={!!d} onOpenChange={(o) => !o && onClosed()}>
      <DialogContent className="max-w-md">
        {d && (
          <>
            <DialogHeader className="items-center text-center">
              <Avatar d={d} ukuran="w-24 h-24 text-2xl" />
              <DialogTitle className="mt-2">{d.employee_name}</DialogTitle>
              <DialogDescription className="flex items-center justify-center gap-2 capitalize">
                {d.employment} <Status aktif={d.isActive} />
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2">
              <Baris label="NIK">{d.identity_id || '–'}</Baris>
              <Baris label="Akun">
                <Akun d={d} superuser={superuser} />
              </Baris>
              <Baris label="Alamat">{d.address || '–'}</Baris>
              <Baris label="Tanggal masuk">{tgl(d.hire_date)}</Baris>
              <Baris label="Tanggal resign">{d.resign_date ? tgl(d.resign_date) : '–'}</Baris>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

const Status = ({ aktif }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${
      aktif ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
    }`}
  >
    {aktif ? 'Aktif' : 'Resign'}
  </span>
);

const Akun = ({ d, superuser }) =>
  d.username ? (
    <div className="min-w-0">
      <span
        className={`inline-block max-w-full truncate px-1.5 py-0.5 text-xs font-medium rounded ${
          d.username_status == 1 ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500 line-through'
        }`}
        title={d.username_status == 1 ? 'Akun aktif' : 'Akun nonaktif'}
      >
        {d.username}
      </span>
      {superuser && d.rolelist?.length > 0 && (
        <div className="mt-0.5 text-[11px] text-slate-500">{d.rolelist.map((r) => r.name).join(', ')}</div>
      )}
    </div>
  ) : (
    <span className="text-xs text-slate-400">belum ada akun</span>
  );

const ManPower = ({ datas = [], title = 'Data Karyawan' }) => {
  const { auth } = usePage().props;
  const superuser = auth?.roles?.includes('superuser');
  const [pilihId, setPilihId] = useState(null);
  const pilih = datas.find((d) => d.id === pilihId) ?? null;
  const [tab, setTab] = useState('aktif');
  const [cari, setCari] = useState('');

  const jumlah = useMemo(
    () => ({ aktif: datas.filter((d) => d.isActive).length, resign: datas.filter((d) => !d.isActive).length, semua: datas.length }),
    [datas],
  );

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return datas
      .filter((d) => (tab === 'aktif' ? d.isActive : tab === 'resign' ? !d.isActive : true))
      .filter(
        (d) =>
          !q ||
          [d.employee_name, d.identity_id, d.username, d.employment].some((v) => String(v ?? '').toLowerCase().includes(q)),
      );
  }, [datas, tab, cari]);

  return (
    <div className="space-y-4">
      <Head title={title} />
      <DetailKaryawan d={pilih} onClosed={() => setPilihId(null)} superuser={superuser} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
            <Users className="w-5 h-5 text-slate-500" />
            {title}
          </h1>
          <p className="text-sm text-slate-500">
            Cabang aktif (ganti lewat filter cabang di atas). {jumlah.aktif} aktif · {jumlah.resign} resign.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" aria-hidden="true" />
          <Input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama, NIK, username, jabatan"
            className="pl-9"
          />
        </div>
      </div>

      <div className="inline-flex p-1 rounded-lg bg-slate-100">
        {TAB.map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              tab === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {label} <span className="ml-0.5 text-xs text-slate-400">{jumlah[k]}</span>
          </button>
        ))}
      </div>

      {tampil.length === 0 && (
        <div className="py-10 text-sm text-center border rounded-lg text-slate-500">Tidak ada karyawan yang cocok.</div>
      )}

      {/* Desktop: tabel */}
      {tampil.length > 0 && (
        <div className="hidden overflow-auto bg-white border rounded-lg md:block max-h-[70vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700">
              <tr>
                <th className="w-10 px-3 py-2 font-medium text-left">#</th>
                <th className="px-3 py-2 font-medium text-left">Karyawan</th>
                <th className="px-3 py-2 font-medium text-left">Jabatan</th>
                <th className="px-3 py-2 font-medium text-left">Akun</th>
                <th className="px-3 py-2 font-medium text-left">Alamat</th>
                <th className="px-3 py-2 font-medium text-left whitespace-nowrap">Masuk</th>
                <th className="px-3 py-2 font-medium text-left whitespace-nowrap">Resign</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((d, i) => (
                <tr
                  key={d.id}
                  onClick={() => setPilihId(d.id)}
                  className={`border-t align-top cursor-pointer even:bg-slate-50 hover:bg-sky-50 ${d.isActive ? '' : 'text-slate-500'}`}
                >
                  <td className="px-3 py-2 text-slate-400 tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Avatar d={d} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{d.employee_name}</span>
                          <Status aktif={d.isActive} />
                        </div>
                        <div className="text-xs text-slate-500 tabular-nums">{d.identity_id || '–'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 capitalize whitespace-nowrap">{d.employment}</td>
                  <td className="px-3 py-2">
                    <Akun d={d} superuser={superuser} />
                  </td>
                  <td className="max-w-xs px-3 py-2 text-slate-600">{d.address || '–'}</td>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">{tgl(d.hire_date)}</td>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">{d.resign_date ? tgl(d.resign_date) : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* HP: kartu */}
      <div className="space-y-2 md:hidden">
        {tampil.map((d) => (
          <button
            type="button"
            key={d.id}
            onClick={() => setPilihId(d.id)}
            className={`block w-full p-3 text-left bg-white border rounded-lg active:bg-slate-50 ${d.isActive ? '' : 'opacity-70'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center min-w-0 gap-3">
                <Avatar d={d} besar />
                <div className="min-w-0">
                  <div className="font-semibold truncate text-slate-900">{d.employee_name}</div>
                  <div className="text-xs capitalize text-slate-500">{d.employment}</div>
                </div>
              </div>
              <Status aktif={d.isActive} />
            </div>
            <div className="mt-2 text-xs text-slate-500 tabular-nums">NIK {d.identity_id || '–'}</div>
            <div className="mt-1">
              <Akun d={d} superuser={superuser} />
            </div>
            {d.address && (
              <div className="flex gap-1 mt-1 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                <span>{d.address}</span>
              </div>
            )}
            <div className="flex gap-4 mt-2 text-[11px] text-slate-500 tabular-nums">
              <span>Masuk {tgl(d.hire_date)}</span>
              {d.resign_date && <span>Resign {tgl(d.resign_date)}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManPower;
