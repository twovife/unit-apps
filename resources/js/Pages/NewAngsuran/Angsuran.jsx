import React from 'react';

import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { usePage } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import AngsuranTable from './Components/AngsuranTable';
import BukuStorting from './Components/BukuStorting';
import { Button } from '@/shadcn/ui/button';
import { FilterIcon } from 'lucide-react';
import AngsuranTableMobile from './Components/AngsuranTableMobile';
import { Input } from '@/shadcn/ui/input';
import BukuStortingMobile from './Components/BukuStortingMobile';

/**
 * `type === 'mobile'` (dipakai `mobile_apps.angsuran`) filternya sudah
 * disamakan dengan menu Drop: `FilterBar` (chip instan) untuk hari/bulan/
 * kelompok, `SearchComponent` disisakan cuma untuk filter Unit/Wilayah lewat
 * popover kecil terpisah - persis pola yang dipakai `BukuTransaksi/Web/
 * TransaksiMantri.jsx`. `type === 'desktop'` (dipakai `pinjaman.index_pinjaman`)
 * SENGAJA tidak diubah - masih dropdown `SearchComponent` lama.
 */
const Angsuran = ({
  datas,
  dateOfWeek,
  sirkulasi,
  urlLink,
  localState,
  type = 'desktop',
}) => {
  const { server_filter } = usePage().props;

  const canFilterUnit =
    server_filter.userAuthorized.canShowBranch ||
    server_filter.userAuthorized.canShowGroupingBranch;

  // Dibawa serta saat FilterBar bernavigasi, supaya pilihan Unit/Wilayah
  // yang sedang aktif tidak ikut hilang ketika user cuma ganti hari/bulan.
  const unitExtraParams = {};
  if (server_filter.branch_id) unitExtraParams.branch_id = server_filter.branch_id;
  if (server_filter.wilayah) unitExtraParams.wilayah = server_filter.wilayah;

  // Remount SearchComponent (filter Unit) tiap kali hari/bulan/kelompok
  // berubah lewat FilterBar - komponen itu cuma membaca server_filter SEKALI
  // saat mount, jadi tanpa key baru dia bisa submit nilai hari/bulan lama.
  const searchComponentKey = `${server_filter.hari}-${server_filter.month}-${server_filter.kelompok}`;

  return (
    <>
      {type === 'mobile' ? (
        <>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-xl font-semibold tracking-tight">
              Angsuran Lancar
            </h1>
            {canFilterUnit && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <FilterIcon className="h-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Unit
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <SearchComponent
                    key={searchComponentKey}
                    urlLink={urlLink}
                    localState={localState}
                    searchBranch={server_filter.userAuthorized.canShowBranch}
                    searchGroupingBranch={
                      server_filter.userAuthorized.canShowGroupingBranch
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="mb-3">
            <FilterBar
              urlLink={urlLink}
              storageKey={localState}
              showHari={true}
              showMonth={true}
              showKelompok={server_filter.userAuthorized.canShowKelompok}
              extraParams={unitExtraParams}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex justify-between flex-none shrink-0 whitespace-nowrap">
            <h1 className="text-xl font-semibold tracking-tight ">
              Angsuran Lancar
            </h1>
            <div className="flex justify-end gap-3 lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <FilterIcon className="h-4" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <SearchComponent
                    urlLink={urlLink}
                    localState={localState}
                    searchMonth={true}
                    searchHari={true}
                    searchKelompok={server_filter.userAuthorized.canShowKelompok}
                    searchBranch={server_filter.userAuthorized.canShowBranch}
                    searchGroupingBranch={
                      server_filter.userAuthorized.canShowGroupingBranch
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="items-center justify-end flex-auto hidden w-full lg:flex">
            <SearchComponent
              urlLink={urlLink}
              localState={localState}
              searchMonth={true}
              searchHari={true}
              searchKelompok={server_filter.userAuthorized.canShowKelompok}
              searchBranch={server_filter.userAuthorized.canShowBranch}
              searchGroupingBranch={
                server_filter.userAuthorized.canShowGroupingBranch
              }
            ></SearchComponent>
          </div>
        </div>
      )}
      <Tabs defaultValue="bukuangsuran" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="bukuangsuran">Buku Angsuran</TabsTrigger>
            <TabsTrigger value="bukustorting">Buku Storting</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="bukuangsuran">
          {type === 'mobile' && (
            <AngsuranTableMobile dateOfWeek={dateOfWeek} datas={datas} />
          )}
          {type === 'desktop' && (
            <AngsuranTable dateOfWeek={dateOfWeek} datas={datas} />
          )}
        </TabsContent>
        <TabsContent value="bukustorting">
          {type === 'mobile' && (
            <BukuStortingMobile
              dateOfWeek={dateOfWeek}
              datas={datas}
              sirkulasi={sirkulasi}
            />
          )}
          {type === 'desktop' && (
            <BukuStorting
              dateOfWeek={dateOfWeek}
              datas={datas}
              sirkulasi={sirkulasi}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Angsuran;
