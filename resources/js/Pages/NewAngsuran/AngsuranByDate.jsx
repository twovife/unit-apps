import React, { useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { router, usePage } from '@inertiajs/react';
import AngsuranByDateTable from './Components/AngsuranByDateTable';
import { Button } from '@/shadcn/ui/button';
import { FilterIcon, SearchIcon } from 'lucide-react';
import { Label } from '@/shadcn/ui/label';
import { Input } from '@/shadcn/ui/input';
import InputMacet from '../BukuTransaksi/Web/InputMacet';

/**
 * `type === 'mobile'` (dipakai `mobile_apps.macet` & `mobile_apps.byDates`,
 * lewat `MobileApps/Angsuran/SearchByDate.jsx`) filternya disamakan dengan
 * menu Drop/Angsuran: `FilterBar` (chip instan) untuk hari/bulan/kelompok,
 * `SearchComponent` disisakan cuma untuk filter Unit/Wilayah lewat popover
 * kecil terpisah. `type === 'desktop'` (dipakai `pinjaman.index_pinjaman_macet`
 * & `pinjaman.index_pinjaman_search`, lewat `WebView/Angsuran/SearchByDate.jsx`)
 * masih dropdown `SearchComponent` lama untuk hari/bulan/kelompok/Unit, sama
 * pola dengan `NewAngsuran/Angsuran.jsx` - TAPI kotak "Cari nama nasabah"
 * sekarang dipasang di KEDUA cabang (state `namaCari` & effect debounce-nya
 * dipakai bersama, tidak spesifik mobile).
 */
const AngsuranByDate = ({
  headerName,
  datas,
  urlLink,
  localState,
  searchMonth,
  searchHari,
  type = 'desktop',
}) => {
  const { server_filter } = usePage().props;
  const [showInputMacet, setShowInputMacet] = useState(false);
  const onShowMacet = () => {
    setShowInputMacet(true);
  };
  const onCloseMacet = () => {
    setShowInputMacet(false);
  };

  const canFilterUnit =
    server_filter.userAuthorized.canShowBranch ||
    server_filter.userAuthorized.canShowGroupingBranch;

  // Dibawa serta saat FilterBar bernavigasi, supaya pilihan Unit/Wilayah +
  // cari nama yang sedang aktif tidak ikut hilang ketika user cuma ganti
  // hari/bulan.
  const unitExtraParams = {};
  if (server_filter.branch_id)
    unitExtraParams.branch_id = server_filter.branch_id;
  if (server_filter.wilayah) unitExtraParams.wilayah = server_filter.wilayah;
  if (server_filter.nama) unitExtraParams.nama = server_filter.nama;

  // Remount SearchComponent (filter Unit) tiap kali hari/bulan/kelompok
  // berubah lewat FilterBar - komponen itu cuma membaca server_filter SEKALI
  // saat mount, jadi tanpa key baru dia bisa submit nilai hari/bulan lama.
  const searchComponentKey = `${server_filter.hari}-${server_filter.month}-${server_filter.kelompok}`;

  /**
   * Cari nama - server cocokkan substring biasa (LIKE), lihat
   * PinjamanTrait::getLoanMacet()/getLoanByDate(). Debounce di sini BUKAN
   * timer/polling yang mengubah query sendiri (dilarang di FilterBar) -
   * ini murni menunggu jeda ketikan user sebelum submit, tetap 100% akibat
   * langsung dari interaksi manual.
   */
  const [namaCari, setNamaCari] = useState(server_filter.nama ?? '');

  useEffect(() => {
    const nilaiAktif = server_filter.nama ?? '';
    if (namaCari === nilaiAktif) return;

    const timer = setTimeout(() => {
      router.get(
        urlLink,
        {
          hari: server_filter.hari,
          month: server_filter.month,
          kelompok: server_filter.kelompok,
          branch_id: server_filter.branch_id,
          wilayah: server_filter.wilayah,
          nama: namaCari || undefined,
        },
        { preserveState: true, preserveScroll: true, replace: true },
      );
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namaCari]);

  return (
    <>
      <InputMacet show={showInputMacet} onClosed={onCloseMacet} />
      {type === 'mobile' ? (
        <>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-xl font-semibold tracking-tight">
              {headerName}
            </h1>
            <div className="flex items-center gap-2">
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
              <Button onClick={onShowMacet} variant="outline">
                Input Macet
              </Button>
            </div>
          </div>

          <div className="relative mb-3">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama nasabah..."
              className="pl-9"
              value={namaCari}
              onChange={(e) => setNamaCari(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <FilterBar
              urlLink={urlLink}
              storageKey={localState}
              showHari={searchHari}
              showMonth={searchMonth}
              showKelompok={server_filter.userAuthorized.canShowKelompok}
              extraParams={unitExtraParams}
            />
          </div>
        </>
      ) : (
        <>
          <div className="relative mb-3 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama nasabah..."
              className="pl-9"
              value={namaCari}
              onChange={(e) => setNamaCari(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex justify-between flex-none shrink-0 whitespace-nowrap">
              <h1 className="text-xl font-semibold tracking-tight ">
                {headerName}
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
                      searchMonth={searchMonth}
                      searchHari={searchHari}
                      searchKelompok={
                        server_filter.userAuthorized.canShowKelompok
                      }
                      searchBranch={server_filter.userAuthorized.canShowBranch}
                      searchGroupingBranch={
                        server_filter.userAuthorized.canShowGroupingBranch
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={onShowMacet} color="outline">
                  Input Macet
                </Button>
              </div>
            </div>

            <div className="items-center justify-end flex-auto hidden w-full lg:flex">
              <SearchComponent
                urlLink={urlLink}
                localState={localState}
                searchMonth={searchMonth}
                searchHari={searchHari}
                searchKelompok={server_filter.userAuthorized.canShowKelompok}
                searchBranch={server_filter.userAuthorized.canShowBranch}
                searchGroupingBranch={
                  server_filter.userAuthorized.canShowGroupingBranch
                }
              ></SearchComponent>
              <div className="ml-3">
                <Label>&nbsp;</Label>
                <Button onClick={onShowMacet} color="outline">
                  Input Macet
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="overflow-auto">
        <AngsuranByDateTable datas={datas} />
      </div>
    </>
  );
};

export default AngsuranByDate;
