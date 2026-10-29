import FilterBar from '@/Components/FilterBar';
import SearchComponent from '@/Components/shadcn/SearchComponent';
import PilihBulan from '@/Components/shadcn/PilihBulan';
import { Label } from '@/shadcn/ui/label';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import SatuanAngka from '@/Components/SatuanAngka';
import Action from '@/Pages/NewAngsuran/Components/Action';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { FilterIcon } from 'lucide-react';
import DialogGantiNik from './Components/DialogGantiNik';
import { useState } from 'react';

/**
 * Daftar Nasabah (mas 2026-10-22): nasabah yang di-drop pada bulan + hari tagih terpilih
 * (kelompok aktif), pinjaman & saldo sekarang. Bentuk & filter = /pinjaman (Angsuran
 * Lancar); tombol Pay membuka dialog angsuran yang sama (Action).
 */
const Angka = ({ v, kelas = '' }) => (
  <TableCell className={`px-2 py-1.5 text-right tabular-nums ${kelas}`}>
    {v ? <FormatNumbering ribuan value={v} /> : <span className="text-slate-300">–</span>}
  </TableCell>
);

export default function DaftarNasabah({ server_filter, unit, nasabah = [] }) {
  const [cari, setCari] = useState('');
  const [bayarId, setBayarId] = useState(null);
  const [gantiNik, setGantiNik] = useState(null);
  // Mode "ganti" = menu Ganti Nasabah (superuser): NIK bisa diklik, tanpa Pay.
  const ganti = server_filter.mode === 'ganti';
  const urlLink = route(ganti ? 'ganti_nasabah.index' : 'pinjaman.daftar_nasabah');
  const auth = server_filter.userAuthorized ?? {};
  const unitParams = {};
  if (server_filter.branch_id) unitParams.branch_id = server_filter.branch_id;
  if (server_filter.wilayah) unitParams.wilayah = server_filter.wilayah;
  // Bulan drop terpisah dari bulan filter global (lihat controller): ikut tiap navigasi FilterBar.
  unitParams.bulan_drop = server_filter.bulan_drop;
  const gantiBulan = (bulan) =>
    bulan !== server_filter.bulan_drop &&
    router.get(urlLink, { ...unitParams, hari: server_filter.hari, kelompok: server_filter.kelompok, bulan_drop: bulan }, { preserveScroll: true });

  const q = cari.trim().toLowerCase();
  const tampil = q
    ? nasabah.filter((n) => [n.nama, n.nik, n.nomor_anggota, n.alamat].some((x) => String(x ?? '').toLowerCase().includes(q)))
    : nasabah;

  return (
    <>
      <Head title={ganti ? 'Ganti Nasabah' : 'Daftar Nasabah'} />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{ganti ? 'Ganti Nasabah (NIK)' : 'Daftar Nasabah'}</h1>
          {ganti && <p className="text-xs text-rose-700">Klik NIK untuk memindah pinjaman itu ke nasabah lain.</p>}
          <p className="text-xs text-muted-foreground">
            {unit} · Kelompok {server_filter.kelompok}: nasabah drop per bulan & hari tagih, saldo sekarang. <SatuanAngka />
          </p>
        </div>
        {(auth.canShowBranch || auth.canShowGroupingBranch) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="h-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Unit</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <SearchComponent
                key={`${server_filter.hari}-${server_filter.bulan_drop}-${server_filter.kelompok}`}
                urlLink={urlLink}
                localState="daftar_nasabah"
                searchBranch={auth.canShowBranch}
                searchGroupingBranch={auth.canShowGroupingBranch}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="mb-3">
        <FilterBar urlLink={urlLink} storageKey="daftar_nasabah" showHari showMonth={false} showKelompok={auth.canShowKelompok} extraParams={unitParams} />
        <div className="mt-2 sm:max-w-xs">
          <Label className="text-xs font-medium uppercase text-slate-500">Bulan drop</Label>
          <PilihBulan name="bulan_drop" className="mt-1" value={server_filter.bulan_drop} onChange={(e) => gantiBulan(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <Input
          type="search"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari nama / NIK / no anggota / alamat"
          className="h-9 sm:max-w-xs"
        />
      </div>

      {/* Desktop tanpa kotak gulir sendiri supaya footer total sticky ke layar; HP tetap geser samping. */}
      <div className="overflow-x-auto bg-white border rounded-lg lg:overflow-visible">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead className="px-2">No</TableHead>
              <TableHead className="px-2">Tgl drop</TableHead>
              <TableHead className="px-2">No Ang</TableHead>
              <TableHead className="px-2">Nama</TableHead>
              <TableHead className="px-2">NIK</TableHead>
              <TableHead className="px-2">Alamat</TableHead>
              <TableHead className="px-2 text-right">Drop</TableHead>
              <TableHead className="px-2 text-right">Pinjaman</TableHead>
              <TableHead className="px-2 text-right bg-emerald-200">Saldo</TableHead>
              <TableHead className="px-2">Tgl lunas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tampil.map((n, i) => (
              <TableRow key={n.id} className="bg-white even:bg-slate-50 hover:bg-sky-50">
                <TableCell className="px-2 py-1.5 text-slate-500">{i + 1}</TableCell>
                <TableCell className="px-2 py-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="whitespace-nowrap">{dayjs(n.tanggal).format('DD-MM')}</span>
                    {n.lunas ? (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">Lunas</span>
                    ) : (
                      !ganti && (
                        <Button size="xs" onClick={() => setBayarId(n.id)}>
                          Pay
                        </Button>
                      )
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-2 py-1.5 whitespace-nowrap">{n.nomor_anggota ?? '–'}</TableCell>
                <TableCell className="px-2 py-1.5 font-medium whitespace-nowrap">{n.nama}</TableCell>
                <TableCell className="px-2 py-1.5 whitespace-nowrap tabular-nums text-slate-500">
                  {ganti ? (
                    <button type="button" className="text-sky-700 hover:underline" onClick={() => setGantiNik(n)}>
                      {n.nik || '(kosong)'}
                    </button>
                  ) : (
                    n.nik
                  )}
                </TableCell>
                <TableCell className="px-2 py-1.5 max-w-[16rem] truncate" title={n.alamat ?? ''}>
                  {n.alamat ?? '–'}
                </TableCell>
                <Angka v={n.drop} />
                <Angka v={n.pinjaman} />
                <Angka v={n.saldo} kelas="font-semibold bg-emerald-50" />
                <TableCell className="px-2 py-1.5 whitespace-nowrap">{n.lunas && n.tanggal_lunas ? dayjs(n.tanggal_lunas).format('DD-MM-YY') : ''}</TableCell>
              </TableRow>
            ))}
            {tampil.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="px-3 py-6 text-center text-slate-500">
                  Tidak ada nasabah drop di bulan & hari ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* Total baris yang tampil (ikut pencarian), menempel di dasar layar. */}
          {tampil.length > 0 && (
            <TableFooter className="sticky bottom-0 z-10">
              <TableRow className="font-bold text-white bg-gray-900 hover:bg-gray-900">
                <TableCell colSpan={6} className="px-2 py-2">
                  JUMLAH {tampil.length} nasabah ({tampil.filter((n) => n.lunas).length} lunas)
                </TableCell>
                <Angka v={tampil.reduce((t, n) => t + n.drop, 0)} />
                <Angka v={tampil.reduce((t, n) => t + n.pinjaman, 0)} />
                <Angka v={tampil.reduce((t, n) => t + n.saldo, 0)} kelas="text-green-300" />
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {gantiNik && (
        <DialogGantiNik
          key={gantiNik.id}
          n={gantiNik}
          onClosed={() => {
            setGantiNik(null);
            router.reload({ only: ['nasabah'] });
          }}
        />
      )}
      <Action
        datas={nasabah}
        show={!!bayarId}
        triggeredId={bayarId}
        onClosed={() => {
          setBayarId(null);
          router.reload({ only: ['nasabah'] }); // saldo ikut terbarui sesudah bayar
        }}
      />
    </>
  );
}
