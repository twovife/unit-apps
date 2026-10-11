import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { Button } from '@/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { usePage } from '@inertiajs/react';
import { FilterIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import TableRekapKasir from './Components/TableRekapKasir';
import TableRekapPerMantri from './Components/TableRekapPerMantri';
import DrawerBukuDrop from './Components/DrawerBukuDrop';
import DrawerAccKm from './Components/DrawerAccKm';
import DrawerAngsuran from '@/Pages/BukuTransaksi/Components/DrawerAngsuran';

/**
 * Rekap Mantri: satu kelompok sebulan. Tab Tunai Mantri dibuang (2026-10-10),
 * sama dengan Rekap 1. Filter bulan + kelompok lewat FilterBar (global).
 */
const Permantri = ({ rekapData = [], saldoAwalBulan = [], urlLink, localState, title }) => {
  const { server_filter } = usePage().props;
  // jenis: 'harian' -> buku angsuran hari itu, 'drop' -> buku drop, 'acc' -> ACC KM.
  const [target, setTarget] = useState(null);
  const buka = (jenis) => (r) => setTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis });
  const tutup = () => setTarget(null);

  const bisaGantiUnit = server_filter.userAuthorized.canShowBranch || server_filter.userAuthorized.canShowGroupingBranch;

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
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
        showKelompok={server_filter.userAuthorized.canShowKelompok}
        extraParams={{
          ...(server_filter.branch_id ? { branch_id: server_filter.branch_id } : {}),
          ...(server_filter.wilayah ? { wilayah: server_filter.wilayah } : {}),
        }}
      />

      {/* ?tab=rekapkasir membuka detail tunai langsung (dari tabel Global Rekap 1). */}
      <Tabs
        defaultValue={new URLSearchParams(window.location.search).get('tab') === 'rekapkasir' ? 'rekapkasir' : 'rekapmantri'}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="rekapmantri">Rekap Mantri</TabsTrigger>
          <TabsTrigger value="rekapkasir">Rekap Kasir Mantri</TabsTrigger>
        </TabsList>

        <TabsContent value="rekapmantri">
          <TableRekapPerMantri
            saldoAwalBulan={saldoAwalBulan}
            datas={rekapData}
            onKlikStorting={buka('harian')}
            onKlikDrop={buka('drop')}
            onAcc={buka('acc')}
          />
        </TabsContent>

        <TabsContent value="rekapkasir">
          <TableRekapKasir datas={rekapData} bacaSaja onKlikStorting={buka('harian')} onKlikDrop={buka('drop')} />
        </TabsContent>
      </Tabs>

      <DrawerAngsuran target={target?.jenis === 'harian' ? target : null} onClosed={tutup} />
      <DrawerBukuDrop target={target?.jenis === 'drop' ? target : null} server_filter={server_filter} onClosed={tutup} />
      <DrawerAccKm target={target?.jenis === 'acc' ? target : null} server_filter={server_filter} onClosed={tutup} />
    </>
  );
};

export default Permantri;
