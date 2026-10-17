import React, { useState } from 'react';

import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { usePage } from '@inertiajs/react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import AngsuranTable from './Components/AngsuranTable';
import BukuStorting from './Components/BukuStorting';
import { Button } from '@/shadcn/ui/button';
import { BookOpen, FilterIcon } from 'lucide-react';
import AngsuranTableMobile from './Components/AngsuranTableMobile';
import { Input } from '@/shadcn/ui/input';
import BukuStortingMobile from './Components/BukuStortingMobile';
import SatuanAngka from '@/Components/SatuanAngka';
import VideoTutorialButton from '@/Components/VideoTutorialButton';

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
  judul = 'Angsuran Lancar',
  videoTutorials,
}) => {
  const { server_filter } = usePage().props;
  const [stortingBuka, setStortingBuka] = useState(
    () => new URLSearchParams(window.location.search).get('tab') === 'bukustorting',
  );

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{judul}</h1>
            {videoTutorials && (
              <VideoTutorialButton videos={videoTutorials} buttonText="Video Panduan" />
            )}
          </div>
          {type === 'desktop' && (
            <p className="text-xs text-muted-foreground">Buku angsuran bulanan per kelompok & hari tagih. <SatuanAngka /></p>
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

      {server_filter.koreksi_kunci && (
        <div className="p-3 mb-3 text-sm border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
          <b>Tanggal {server_filter.tanggal} sudah dikunci kasir.</b> Anda boleh mengoreksi — perubahan akan membuka kunci
          tanggal ini otomatis (tercatat). Kunci lagi lewat Rekap 1.
        </div>
      )}
      {server_filter.is_locked && (
        <div className="p-3 mb-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
          <b>Tanggal {server_filter.tanggal} sudah dikunci kasir.</b> Data bisa dilihat tapi tidak bisa diubah. Membuka
          kunci lewat jalur resmi kasir.
        </div>
      )}
      {type === 'mobile' && server_filter.is_libur ? null : (
      <>
        {/* Buku Storting dibuka sebagai drawer di atas buku angsuran (dulu
            tab). Datanya sama dengan halaman ini - tidak ada muat tambahan.
            ?tab=bukustorting (link dari Kesiapan Migrasi) membukanya langsung. */}
        <div className="flex justify-end mb-2">
          {/* Tombol utama halaman ini - dibuat menonjol (isi biru, teks putih). */}
          <Button
            type="button"
            onClick={() => setStortingBuka(true)}
            className="gap-1 font-semibold text-white shadow-sm bg-sky-600 hover:bg-sky-700"
          >
            <BookOpen className="w-4 h-4" />
            Buku Storting
          </Button>
        </div>
        {type === 'mobile' && <AngsuranTableMobile dateOfWeek={dateOfWeek} datas={datas} />}
        {type === 'desktop' && <AngsuranTable dateOfWeek={dateOfWeek} datas={datas} />}

        <Sheet open={stortingBuka} onOpenChange={setStortingBuka}>
          <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-5xl lg:max-w-none">
            <SheetHeader className="px-5 py-4 pr-14 border-b">
              <SheetTitle>Buku Storting</SheetTitle>
              <SheetDescription>
                Kelompok {server_filter.kelompok}
                {server_filter.hari ? ` · ${server_filter.hari}` : ''}
                {server_filter.tanggal ? ` · ${server_filter.tanggal}` : server_filter.month ? ` · ${server_filter.month}` : ''}
              </SheetDescription>
            </SheetHeader>
            <div className="p-3">
              {type === 'mobile' && (
                <BukuStortingMobile dateOfWeek={dateOfWeek} datas={datas} sirkulasi={sirkulasi} />
              )}
              {type === 'desktop' && <BukuStorting dateOfWeek={dateOfWeek} datas={datas} sirkulasi={sirkulasi} />}
            </div>
          </SheetContent>
        </Sheet>
      </>
      )}
    </>
  );
};

export default Angsuran;
