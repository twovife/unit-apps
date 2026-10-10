import React, { useMemo, useState } from 'react';
import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { Button } from '@/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { usePage } from '@inertiajs/react';
import { FilterIcon } from 'lucide-react';
import dayjs from 'dayjs';
import TabelHarian from '@/Pages/Kasir/Rekap/Components/TabelHarian';
import DrawerBukuDrop from '@/Pages/Kasir/Rekap/Components/DrawerBukuDrop';
import DrawerAngsuran from '@/Pages/BukuTransaksi/Components/DrawerAngsuran';

// [kunci, label, kelas tambahan]. Kiri = hari D, kanan (garis tebal) =
// pasangannya minggu depan: rencana yang diinput di D & drop yang jadi.
const KOLOM = [
  ['target', 'Target'],
  ['storting', 'Storting'],
  ['kasbon', 'Kasbon'],
  ['masuk', 'Masuk'],
  ['keluar', 'Keluar'],
  ['p_rencana', 'Rencana', 'border-l-2 border-slate-300 font-semibold'],
  ['p_drop', 'Drop'],
  ['p_baru', 'Baru'],
  ['p_lama', 'Lama'],
  ['p_selisih', 'Selisih', 'font-semibold text-rose-700'],
];

/**
 * Rencana Drop sebulan, BERSANDINGAN: tiap tanggal D dengan pasangannya
 * (hari sama minggu depan, lompati libur). Tampilan seragam dengan Rekap 2
 * (TabelHarian). Rencana untuk D+7 diinput di D, jadi tanggal sesudah hari
 * ini belum punya isi apa pun -> kosongan.
 * Klik Storting -> buku angsuran D; klik Drop -> buku drop pasangannya.
 * Selisih = Rencana - Lama (drop dari pengajuan; drop langsung tidak direncanakan).
 */
const Content = ({ urlLink, localState, triggeredData }) => {
  const { server_filter } = usePage().props;
  // Server mengirim per tanggal: [baris kelompok...]; TabelHarian minta {tanggal, data}.
  // useMemo: TabelHarian loncat ke hari ini tiap `data` berganti - jangan tiap render.
  const data = useMemo(
    () => (triggeredData ?? []).map((rows) => ({ tanggal: rows[0]?.tanggal, data: rows })),
    [triggeredData],
  );
  const [target, setTarget] = useState(null);
  const tutup = () => setTarget(null);

  const bisaGantiUnit = server_filter.userAuthorized.canShowBranch || server_filter.userAuthorized.canShowGroupingBranch;

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <h1 className="text-xl font-semibold tracking-tight">Rencana Drop</h1>
        {bisaGantiUnit && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="h-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Unit</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <SearchComponent
                urlLink={urlLink}
                localState={localState}
                searchBranch={server_filter.userAuthorized.canShowBranch}
                searchGroupingBranch={server_filter.userAuthorized.canShowGroupingBranch}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      <FilterBar
        urlLink={urlLink}
        storageKey={localState}
        showHari={false}
        showMonth
        extraParams={{
          ...(server_filter.branch_id ? { branch_id: server_filter.branch_id } : {}),
          ...(server_filter.wilayah ? { wilayah: server_filter.wilayah } : {}),
        }}
      />
      <TabelHarian
        data={data}
        kolom={KOLOM}
        batasIsi={dayjs().format('YYYY-MM-DD')}
        judulPita={(item) => {
          const p = item.data[0]?.pasangan;
          return (
            <>
              {dayjs(item.tanggal).format('dddd, DD-MM-YYYY')}
              <span className="mx-2 text-slate-500">→</span>
              {p ? dayjs(p).format('dddd, DD-MM-YYYY') : '—'}
            </>
          );
        }}
        klik={{
          storting: (r) => setTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis: 'harian' }),
          p_drop: (r) => setTarget({ kelompok: r.kelompok, tanggal: r.pasangan, jenis: 'drop' }),
        }}
      />
      <DrawerAngsuran target={target?.jenis === 'harian' ? target : null} onClosed={tutup} />
      <DrawerBukuDrop target={target?.jenis === 'drop' ? target : null} server_filter={server_filter} onClosed={tutup} />
    </>
  );
};

export default Content;
