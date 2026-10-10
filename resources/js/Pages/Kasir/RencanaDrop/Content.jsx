import React, { useMemo, useState } from 'react';
import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { Button } from '@/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { usePage } from '@inertiajs/react';
import { FilterIcon } from 'lucide-react';
import RencanaBersanding from './RencanaBersanding';
import DrawerBukuDrop from '@/Pages/Kasir/Rekap/Components/DrawerBukuDrop';
import DrawerAngsuran from '@/Pages/BukuTransaksi/Components/DrawerAngsuran';

/**
 * Rencana Drop sebulan, BERSANDINGAN per minggu (RencanaBersanding): tiap
 * tanggal D dengan pasangannya (hari sama minggu depan, lompati libur).
 * Klik Storting -> buku angsuran D; klik Drop -> buku drop pasangannya.
 * Selisih = Rencana - Lama (drop dari pengajuan; drop langsung tidak direncanakan).
 */
const Content = ({ urlLink, localState, triggeredData }) => {
  const { server_filter } = usePage().props;
  // Server mengirim per tanggal: [baris kelompok...]; RencanaBersanding minta {tanggal, data}.
  // useMemo: minggu bawaan dipilih ulang tiap `data` berganti - jangan tiap render.
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
      <RencanaBersanding
        data={data}
        klik={{
          storting: (r) => setTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis: 'harian' }),
          drop: (r) => setTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis: 'drop' }),
          p_storting: (r) => setTarget({ kelompok: r.kelompok, tanggal: r.pasangan, jenis: 'harian' }),
          p_drop: (r) => setTarget({ kelompok: r.kelompok, tanggal: r.pasangan, jenis: 'drop' }),
        }}
      />
      <DrawerAngsuran target={target?.jenis === 'harian' ? target : null} onClosed={tutup} />
      <DrawerBukuDrop target={target?.jenis === 'drop' ? target : null} server_filter={server_filter} onClosed={tutup} />
    </>
  );
};

export default Content;
