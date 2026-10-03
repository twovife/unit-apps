import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import { Input } from '@/shadcn/ui/input';
import dayjs from 'dayjs';

const rp = (n) => (n === null || n === undefined ? '—' : new Intl.NumberFormat('id-ID').format(n));

const Kartu = ({ judul, utama, bawah, nada = 'netral' }) => (
  <div
    className={`rounded-lg border bg-white p-4 ${
      { netral: 'border-slate-200', baik: 'border-emerald-200', ingat: 'border-amber-300' }[nada]
    }`}
  >
    <div className="text-xs font-medium tracking-wide uppercase text-slate-500">{judul}</div>
    <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{utama}</div>
    {bawah && <div className="mt-0.5 text-xs text-slate-500">{bawah}</div>}
  </div>
);

/** Satu kategori: angka sistem di atas, sirkulasi lama di bawah, selisih merah kalau ada. */
const Sel = ({ sistem, lama, selisih, rinci }) => (
  <TableCell className="text-right align-top tabular-nums whitespace-nowrap">
    <div className="font-medium">{rp(sistem)}</div>
    {rinci && <div className="text-[10px] text-slate-400">{rinci}</div>}
    <div className="text-xs text-slate-500">{rp(lama)}</div>
    {!!selisih && <div className="text-xs font-semibold text-red-600">{selisih > 0 ? '+' : ''}{rp(selisih)}</div>}
  </TableCell>
);

const Kesiapan = ({ datas = [], ringkasan, server_filter }) => {
  const [hanyaBelum, setHanyaBelum] = useState(false);
  const baris = hanyaBelum ? datas.filter((b) => !b.siap) : datas;
  const lancarSistem = (s) => s.month1 + s.month2 + s.ccm;

  const gantiPeriode = (nilai) =>
    nilai && router.get(route('migrasi.kesiapan'), { periode: `${nilai}-01` }, { preserveScroll: true });

  return (
    <Authenticated>
      <Head title="Kesiapan Migrasi" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Kesiapan Migrasi — {server_filter?.unit}</h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Saldo awal {dayjs(server_filter?.periode).format('MMMM YYYY')} per kelompok &amp; hari: angka{' '}
              <b>sistem</b> (dari daftar nasabah) dibanding <b>sirkulasi lama</b>. Lancar, CM, dan MB harus sama
              persis; ML boleh lebih besar di sirkulasi lama — selisihnya adalah <b>Z</b> (ML belum terinput). Layar
              ini hanya menunjukkan, tidak mengubah apa pun.
            </p>
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-600">Periode</label>
            <Input
              type="month"
              className="w-40"
              defaultValue={dayjs(server_filter?.periode).format('YYYY-MM')}
              onChange={(e) => gantiPeriode(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu
            judul="Siap"
            utama={`${ringkasan?.siap ?? 0} / ${ringkasan?.baris ?? 0}`}
            bawah="kelompok × hari"
            nada={ringkasan?.siap === ringkasan?.baris ? 'baik' : 'ingat'}
          />
          <Kartu judul="Z total" utama={`Rp ${rp(ringkasan?.z)}`} bawah="ML belum terinput (Z positif)" />
          <Kartu
            judul="Z minus"
            utama={ringkasan?.z_minus ?? 0}
            bawah="ML sistem lebih besar dari sirkulasi lama"
            nada={ringkasan?.z_minus ? 'ingat' : 'netral'}
          />
          <Kartu
            judul="Status kantor"
            utama={server_filter?.sudah_migrasi ? 'Sudah migrasi' : 'Belum migrasi'}
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={hanyaBelum} onChange={(e) => setHanyaBelum(e.target.checked)} />
          Tampilkan yang belum siap saja
        </label>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Kel</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead className="text-right">Lancar</TableHead>
                <TableHead className="text-right">CM</TableHead>
                <TableHead className="text-right">MB</TableHead>
                <TableHead className="text-right">ML</TableHead>
                <TableHead className="text-right">Z</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
              <TableRow className="text-[11px] text-slate-500">
                <TableCell colSpan={8} className="py-1">
                  Tiap sel: <b>sistem</b> · sirkulasi lama · <span className="text-red-600">selisih</span>. Lancar
                  dirinci m1 / m2 / ccm (sistem lama tidak menyimpan rinciannya).
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baris.map((b) => (
                <TableRow key={b.kunci} className={b.siap ? '' : 'bg-amber-50/40'}>
                  <TableCell className="align-top">{b.kelompok}</TableCell>
                  <TableCell className="capitalize align-top">{b.hari}</TableCell>
                  <Sel
                    sistem={lancarSistem(b.sistem)}
                    lama={b.lama?.lancar}
                    selisih={b.selisih?.lancar}
                    rinci={`${rp(b.sistem.month1)} / ${rp(b.sistem.month2)} / ${rp(b.sistem.ccm)}`}
                  />
                  <Sel sistem={b.sistem.cm} lama={b.lama?.cm} selisih={b.selisih?.cm} />
                  <Sel sistem={b.sistem.mb} lama={b.lama?.mb} selisih={b.selisih?.mb} />
                  <Sel sistem={b.sistem.ml} lama={b.lama?.ml} />
                  <TableCell
                    className={`text-right align-top font-semibold tabular-nums ${
                      b.z < 0 ? 'text-red-600' : b.z > 0 ? 'text-violet-700' : 'text-slate-400'
                    }`}
                  >
                    {rp(b.z)}
                  </TableCell>
                  <TableCell className="text-xs align-top">
                    {b.siap ? (
                      <span className="font-semibold text-emerald-700">Siap</span>
                    ) : (
                      <span className="text-amber-800">{b.alasan.join(' · ')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-slate-50">
                <TableCell colSpan={2}>Total</TableCell>
                <Sel sistem={ringkasan ? lancarSistem(ringkasan.sistem) : 0} lama={ringkasan?.lama?.lancar} />
                <Sel sistem={ringkasan?.sistem?.cm} lama={ringkasan?.lama?.cm} />
                <Sel sistem={ringkasan?.sistem?.mb} lama={ringkasan?.lama?.mb} />
                <Sel sistem={ringkasan?.sistem?.ml} lama={ringkasan?.lama?.ml} />
                <TableCell className="text-right tabular-nums">{rp(ringkasan?.z)}</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Authenticated>
  );
};

export default Kesiapan;
