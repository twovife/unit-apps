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
import DrawerDetailKelompok from './Components/DrawerDetailKelompok';
import DrawerBukuAngsuran from './Components/DrawerBukuAngsuran';
import DrawerBukuDrop from './Components/DrawerBukuDrop';
import DrawerAngsuran from '@/Pages/BukuTransaksi/Components/DrawerAngsuran';
import DrawerAccKm from './Components/DrawerAccKm';
import DialogKunci from './Components/DialogKunci';
import BannerHariTerbuka from './Components/BannerHariTerbuka';
import Action from './Components/Action';
import SatuanAngka from '@/Components/SatuanAngka';

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
  // Drawer detail tunai per kelompok (dari tabel Global).
  const [detailKelompok, setDetailKelompok] = useState(null);
  // Baris Rekap 1 yang dialog Kunci-nya terbuka.
  const [barisKunci, setBarisKunci] = useState(null);

  // Storting -> drawer buku angsuran kelompok x hari itu, tanggalnya
  // disorot. Statusnya disimpan di sessionStorage (per tanggal filter):
  // bayar / hapus angsuran memuat ulang halaman, tanpa itu drawer tertutup.
  const KUNCI_BUKU = 'rekap1.buku';
  const bacaBuku = () => {
    try {
      const v = JSON.parse(sessionStorage.getItem(KUNCI_BUKU));
      return v && v.filter === (server_filter.tanggal ?? server_filter.month) ? v.target : null;
    } catch {
      return null;
    }
  };
  const [bukuTarget, setBukuTargetState] = useState(bacaBuku);
  const setBukuTarget = (t) => {
    setBukuTargetState(t);
    try {
      // Drawer ACC KM tidak disimpan: sesudah ACC halaman dimuat ulang dan
      // drawernya memang harus tertutup.
      t && t.jenis !== 'acc'
        ? sessionStorage.setItem(KUNCI_BUKU, JSON.stringify({ filter: server_filter.tanggal ?? server_filter.month, target: t }))
        : sessionStorage.removeItem(KUNCI_BUKU);
    } catch {
      /* tanpa storage: drawer tetap jalan, cuma tidak bertahan */
    }
  };
  // jenis: 'storting' -> buku angsuran bulanan, 'harian' -> buku angsuran hari itu, 'drop' -> buku drop,
  // 'acc' -> drawer ACC KM.
  const bukaBuku = (r) => setBukuTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis: 'storting' });
  const bukaDrop = (r) => setBukuTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis: 'drop' });

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
          {show == 'rekapkasir' && <p className="text-xs text-muted-foreground"><SatuanAngka /></p>}
        </div>
        {show == 'rekapkasir' || show == 'rekap2' ? (
          // Rekap 1 (tanggal) & Rekap 2 (bulan) lewat FilterBar (chip instan, sama dengan menu
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
      {(show == 'rekapkasir' || show == 'rekap2') && <BannerHariTerbuka hari={server_filter.hari_terbuka} />}
      {(show == 'rekapkasir' || show == 'rekap2') && (
        <div className="mb-3">
          <FilterBar
            urlLink={urlLink}
            storageKey={localState}
            showHari={false}
            showMonth={show == 'rekap2'}
            showTanggal={show == 'rekapkasir'}
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
            // Rekap 2: storting -> buku angsuran HARIAN (= mobile_apps.angsuran).
            onKlikStorting={(r) => setBukuTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis: 'harian' })}
            onKlikDrop={bukaDrop}
            onAcc={(r) => setBukuTarget({ kelompok: r.kelompok, tanggal: r.tanggal, jenis: 'acc' })}
            saldoAwalBulan={saldoAwalBulan}
          />
        )}
        {/* Rekap 1: tempat kasir mengecek & mengunci. Tab Tunai Mantri
            dibuang (2026-10-09); Titipan 9% pindah ke kolom terakhir. */}
        {show == 'rekapkasir' && (
          <>
            <TableRekapKasir
              datas={datas}
              onKlikStorting={bukaBuku}
              onKlikDrop={bukaDrop}
              // Kunci hanya kantor alur baru.
              onKunci={server_filter.migrasi ? setBarisKunci : null}
            />
            <DialogKunci baris={barisKunci} onClosed={() => setBarisKunci(null)} />
            {/* Global: awal bulan s/d tanggal filter, per kelompok. */}
            <h2 className="mt-6 mb-2 text-base font-semibold text-slate-900">
              Global — 1 s/d {dayjs(server_filter.tanggal).format('DD MMMM YYYY')}
            </h2>
            <TableRekapKasir
              bacaSaja
              // Klik kelompok -> drawer detail tunai per hari s/d tanggal ini.
              onKlikKelompok={(r) => setDetailKelompok(r)}
              datas={(datas ?? []).map((r) => ({ ...r.global, id: r.id, kelompok: r.kelompok, type: 'daily' }))}
            />
            <DrawerDetailKelompok
              target={detailKelompok}
              server_filter={server_filter}
              onKlikStorting={bukaBuku}
              onKlikDrop={bukaDrop}
              onClosed={() => setDetailKelompok(null)}
            />
          </>
        )}
      </div>
      {/* Drawer buku dari angka Storting / Drop (Rekap 1 & Rekap 2). */}
      <DrawerBukuAngsuran
        target={bukuTarget?.jenis === 'storting' ? bukuTarget : null}
        server_filter={server_filter}
        onClosed={() => setBukuTarget(null)}
      />
      <DrawerBukuDrop
        target={bukuTarget?.jenis === 'drop' ? bukuTarget : null}
        server_filter={server_filter}
        onClosed={() => setBukuTarget(null)}
      />
      <DrawerAngsuran target={bukuTarget?.jenis === 'harian' ? bukuTarget : null} onClosed={() => setBukuTarget(null)} />
      <DrawerAccKm
        target={bukuTarget?.jenis === 'acc' ? bukuTarget : null}
        server_filter={server_filter}
        onClosed={() => setBukuTarget(null)}
      />
    </>
  );
};

export default RekapContent;
