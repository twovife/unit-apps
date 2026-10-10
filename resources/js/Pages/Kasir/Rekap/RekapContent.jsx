import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Head, usePage } from '@inertiajs/react';
import { FilterIcon, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import TableRekap from './Components/TableRekap';
import TableRekapKasir from './Components/TableRekapKasir';
import Action from './Components/Action';

const RekapContent = ({
  rekapData,
  saldoAwalBulan,
  show,
  title,
  urlLink,
  localState,
}) => {
  const { auth, server_filter } = usePage().props;
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    setDatas(rekapData);
  }, [rekapData]);

  const [onShowModal, setOnShowModal] = useState(false);
  const [triggeredData, setTriggeredData] = useState();
  const [triggeredType, setTriggeredType] = useState();

  // Event handler function to set the "onCreateShow" state variable to true
  const handleOnCreateShowOpen = (e) => {
    setOnShowModal(true);
  };

  // Event handler function to set the "onCreateShow" state variable to false
  const handleOnCreateShowClosed = (e) => {
    setOnShowModal(false);
    setTriggeredData();
  };

  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  const onNexOrPreviousTogler = (params) => {
    setNexOrPrevious(params);
  };

  return (
    <>
      <Action
        show={onShowModal}
        onClosed={handleOnCreateShowClosed}
        triggeredData={triggeredData}
        type={triggeredType}
      />

      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">{title}</h1>
          {show == 'rekapkasir' && <p className="text-xs text-muted-foreground">Angka dalam ribuan.</p>}
        </div>
        {show == 'rekapkasir' ? (
          // Rekap 1: tanggal lewat FilterBar (chip instan, sama dengan menu
          // lain); Unit/Wilayah tetap lewat popover kecil.
          (server_filter.userAuthorized.canShowBranch || server_filter.userAuthorized.canShowGroupingBranch) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FilterIcon className="h-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Unit</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <SearchComponent
                  key={server_filter.tanggal}
                  urlLink={urlLink}
                  localState={localState}
                  searchBranch={server_filter.userAuthorized.canShowBranch}
                  searchGroupingBranch={server_filter.userAuthorized.canShowGroupingBranch}
                />
              </PopoverContent>
            </Popover>
          )
        ) : (
          <>
        <div className="items-center justify-end flex-auto hidden w-full lg:flex">
          <SearchComponent
            urlLink={urlLink}
            localState={localState}
            searchDate={true}
            // searchKelompok={server_filter.userAuthorized.canShowKelompok}
            searchBranch={server_filter.userAuthorized.canShowBranch}
            searchGroupingBranch={
              server_filter.userAuthorized.canShowGroupingBranch
            }
          ></SearchComponent>
        </div>
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
                searchDate={true}
                // searchKelompok={server_filter.userAuthorized.canShowKelompok}
                searchBranch={server_filter.userAuthorized.canShowBranch}
                searchGroupingBranch={
                  server_filter.userAuthorized.canShowGroupingBranch
                }
              />
            </PopoverContent>
          </Popover>
        </div>
          </>
        )}
      </div>
      {show == 'rekapkasir' && (
        <div className="mb-3">
          <FilterBar
            urlLink={urlLink}
            storageKey={localState}
            showHari={false}
            showMonth={false}
            showTanggal={true}
            extraParams={{
              ...(server_filter.branch_id ? { branch_id: server_filter.branch_id } : {}),
              ...(server_filter.wilayah ? { wilayah: server_filter.wilayah } : {}),
            }}
          />
        </div>
      )}
      <div>
        {show == 'rekap2' && (
          // <div>rekap 2 show</div>
          <TableRekap
            setOnShowModal={setOnShowModal}
            setTriggeredData={setTriggeredData}
            datas={datas}
            saldoAwalBulan={saldoAwalBulan}
          />
        )}
        {/* Rekap 1: tempat kasir mengecek & mengunci. Tab Tunai Mantri
            dibuang (2026-10-09); Titipan 9% pindah ke kolom terakhir. */}
        {show == 'rekapkasir' && (
          <>
            <TableRekapKasir datas={datas} />
            {/* Global: awal bulan s/d tanggal filter, per kelompok. */}
            <h2 className="mt-6 mb-2 text-base font-semibold text-slate-900">
              Global — 1 s/d {dayjs(server_filter.tanggal).format('DD MMMM YYYY')}
            </h2>
            <TableRekapKasir
              bacaSaja
              // Klik kelompok -> detail tunai per hari (Rekap per Mantri) s/d tanggal ini.
              tautanKelompok={(r) =>
                route('kasir.rekap.rekap_permantri', {
                  kelompok: r.kelompok,
                  month: dayjs(server_filter.tanggal).format('YYYY-MM'),
                  sampai: server_filter.tanggal,
                  tab: 'rekapkasir',
                  ...(server_filter.branch_id ? { branch_id: server_filter.branch_id } : {}),
                  ...(server_filter.wilayah ? { wilayah: server_filter.wilayah } : {}),
                })
              }
              datas={(datas ?? []).map((r) => ({ ...r.global, id: r.id, kelompok: r.kelompok, type: 'daily' }))}
            />
          </>
        )}
      </div>
    </>
  );
};

export default RekapContent;
