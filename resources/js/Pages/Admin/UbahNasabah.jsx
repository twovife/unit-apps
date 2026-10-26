import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

/** Form satu nasabah: 4 kolom data diri + rekening (hanya dibaca). */
const KartuNasabah = ({ n, dobel }) => {
  const form = useForm({ nama: n.nama ?? '', nik: n.nik ?? '', no_kk: n.no_kk ?? '', alamat: n.alamat ?? '' });
  const simpan = (e) => {
    e.preventDefault();
    if (!window.confirm(`Simpan perubahan data ${n.nama}?`)) return;
    form.put(route('ubah_nik.simpan', n.id), { preserveScroll: true });
  };
  const isian = [
    ['nama', 'Nama'],
    ['nik', 'NIK (16 digit)'],
    ['no_kk', 'No KK (16 digit)'],
    ['alamat', 'Alamat KTP'],
  ];

  return (
    <form onSubmit={simpan} className="p-4 space-y-4 bg-white border rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">
          {n.nama} <span className="text-xs font-normal text-slate-500">ID nasabah {n.id}</span>
        </h2>
        {dobel && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">NIK dobel</span>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {isian.map(([k, label]) => (
          <div key={k} className="grid gap-1">
            <Label>{label}</Label>
            <Input
              value={form.data[k]}
              inputMode={k === 'nik' || k === 'no_kk' ? 'numeric' : undefined}
              onChange={(e) => form.setData(k, k === 'nik' || k === 'no_kk' ? e.target.value.replace(/\D/g, '') : e.target.value)}
            />
            {form.errors[k] && <span className="text-xs text-red-600">{form.errors[k]}</span>}
          </div>
        ))}
      </div>
      <div>
        <div className="mb-1 text-xs font-semibold text-slate-600">Rekening (hanya dibaca)</div>
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-2 py-1.5 text-left font-medium">Kantor</th>
                <th className="px-2 py-1.5 text-left font-medium">Kelompok</th>
                <th className="px-2 py-1.5 text-left font-medium">Hari</th>
                <th className="px-2 py-1.5 text-left font-medium">No anggota</th>
                <th className="px-2 py-1.5 text-right font-medium">Pinjaman</th>
                <th className="px-2 py-1.5 text-left font-medium">Drop terakhir</th>
                <th className="px-2 py-1.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {n.rekening.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-2 py-3 text-center text-slate-500">Belum ada rekening.</td>
                </tr>
              )}
              {n.rekening.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-2 py-1.5">{r.kantor ?? '–'}</td>
                  <td className="px-2 py-1.5">{r.kelompok ?? '–'}</td>
                  <td className="px-2 py-1.5 capitalize">{r.hari ?? '–'}</td>
                  <td className="px-2 py-1.5">{r.nomor_anggota || '–'}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{r.jumlah_pinjaman}</td>
                  <td className="px-2 py-1.5 whitespace-nowrap">{r.drop_terakhir ? dayjs(r.drop_terakhir).format('DD MMM YYYY') : '–'}</td>
                  <td className="px-2 py-1.5 whitespace-nowrap">
                    {r.lunas === null ? (
                      '–'
                    ) : r.lunas ? (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        Lunas{r.tanggal_lunas ? ` ${dayjs(r.tanggal_lunas).format('DD MMM YYYY')}` : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Belum lunas</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={form.processing || !form.isDirty}>
          {form.processing ? 'Menyimpan…' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
};

/**
 * Ubah Data Nasabah (superuser): cari NIK persis -> ubah nama / NIK / No KK / alamat KTP.
 * NIK dobel (data lama) tampil semua; yang diubah dipilih sendiri per kartu.
 */
export default function UbahNasabah({ nik = '', hasil = [] }) {
  const [cari, setCari] = useState(nik);
  const kirimCari = (e) => {
    e.preventDefault();
    router.get(route('ubah_nik.index'), { nik: cari }, { preserveState: true });
  };

  return (
    <>
      <Head title="Ubah Data Nasabah" />
      <div className="max-w-4xl space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Ubah Data Nasabah</h1>
          <p className="text-sm text-slate-500">Cari dengan NIK persis. Yang bisa diubah: nama, NIK, No KK, alamat KTP. Tiap perubahan tercatat di log.</p>
        </div>
        <form onSubmit={kirimCari} className="flex gap-2">
          <Input
            value={cari}
            inputMode="numeric"
            placeholder="NIK 16 digit"
            onChange={(e) => setCari(e.target.value.replace(/\D/g, ''))}
            className="max-w-xs"
          />
          <Button type="submit" disabled={!cari} className="gap-1">
            <Search className="w-4 h-4" /> Cari
          </Button>
        </form>
        {nik && hasil.length === 0 && <div className="p-3 text-sm rounded-md bg-slate-50 text-slate-600">Tidak ada nasabah dengan NIK {nik}.</div>}
        {hasil.length > 1 && (
          <div className="p-3 text-sm rounded-md bg-amber-50 text-amber-800">
            NIK {nik} dipakai {hasil.length} nasabah. Periksa rekeningnya, lalu ubah yang perlu diubah.
          </div>
        )}
        {hasil.map((n) => (
          <KartuNasabah key={`${n.id}-${n.nik}`} n={n} dobel={hasil.length > 1} />
        ))}
      </div>
    </>
  );
}
