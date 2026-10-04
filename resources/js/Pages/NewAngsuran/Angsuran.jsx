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
 * Filter HP & desktop sama-sama `FilterBar` (chip instan, tanpa tombol
 * submit) seperti menu Drop; `SearchComponent` disisakan cuma untuk filter
 * Unit/Wilayah lewat popover kecil. HP (`mobile_apps.angsuran`) memilih
 * tanggal, desktop (`pinjaman.index_pinjaman`) memilih hari tagih + bulan.
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
  const searchComponentKey = `${server_filter.tanggal ?? server_filter.hari}-${server_filter.month}-${server_filter.kelompok}`;

  return (
    <>
      {/* Satu tata letak untuk HP & desktop: filter chip instan (FilterBar),
          tanpa tombol submit. HP = buku harian (pilih tanggal), desktop =
          buku bulanan (pilih hari tagih + bulan). */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Angsuran Lancar</h1>
          {type === 'desktop' && (
            <p className="text-xs text-muted-foreground">Buku angsuran bulanan per kelompok & hari tagih.</p>
          )}
        </div>
        {canFilterUnit && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="h-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Unit</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <SearchComponent
                key={searchComponentKey}
                urlLink={urlLink}
                localState={localState}
                searchBranch={server_filter.userAuthorized.canShowBranch}
                searchGroupingBranch={server_filter.userAuthorized.canShowGroupingBranch}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="mb-3">
        <FilterBar
          urlLink={urlLink}
          storageKey={localState}
          showHari={type === 'desktop'}
          showMonth={type === 'desktop'}
          showTanggal={type === 'mobile'}
          showKelompok={server_filter.userAuthorized.canShowKelompok}
          extraParams={unitExtraParams}
        />
      </div>

      {server_filter.is_libur && (
        <div className="p-3 mb-3 text-sm border rounded-lg border-amber-300 bg-amber-50/60 text-amber-900">
          <b>
            {server_filter.tanggal} — hari libur
            {server_filter.libur_alasan ? ` (${server_filter.libur_alasan})` : ''}
          </b>
          . Tidak ada tarikan pada hari libur, jadi tidak ada yang perlu diisi. Pilih tanggal hari kerja untuk melihat
          atau mengisi angsuran.
        </div>
      )}

      {server_filter.is_locked && (
        <div className="p-3 mb-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
          <b>Tanggal {server_filter.tanggal} sudah dikunci kasir.</b> Data bisa dilihat tapi tidak bisa diubah. Membuka
          kunci lewat jalur resmi kasir.
        </div>
      )}
      {type === 'mobile' && server_filter.is_libur ? null : (
      <Tabs
        // ?tab=bukustorting membuka tab Buku Storting langsung (link dari Kesiapan Migrasi).
        defaultValue={new URLSearchParams(window.location.search).get('tab') === 'bukustorting' ? 'bukustorting' : 'bukuangsuran'}
        className="w-full"
      >
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
      )}
    </>
  );
};

export default Angsuran;
