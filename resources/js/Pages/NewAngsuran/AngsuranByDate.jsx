import React, { useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { router, usePage } from '@inertiajs/react';
import AngsuranByDateTable from './Components/AngsuranByDateTable';
import AngsuranTable from './Components/AngsuranTable';
import { Button } from '@/shadcn/ui/button';
import { FilterIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/shadcn/ui/input';
import InputMacet from '../BukuTransaksi/Web/InputMacet';

/**
 * CATATAN: cabang `type === 'mobile'` sudah tidak dipakai lagi - caller-nya
 * (`MobileApps/Angsuran/SearchByDate.jsx`, menu `mobile_apps.macet`/`byDates`)
 * dihapus saat menu mobile yang identik dengan web digabung. Kode cabangnya
 * dibiarkan untuk sekarang; hanya `type === 'desktop'` yang aktif.
 *
 * `type === 'mobile'` (dahulu) filternya disamakan dengan
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
  dateOfWeek = [],
  urlLink,
  localState,
  searchMonth,
  searchHari,
  type = 'desktop',
}) => {
  const { server_filter, input_macet_mati } = usePage().props;
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
      {/* Satu tata letak HP & desktop: filter chip instan, tanpa tombol submit. */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{headerName}</h1>
          {server_filter.type_show === 'macet' && (
            <p className="text-xs text-muted-foreground">Nasabah ML per bulan, termasuk yang lunas di bulan itu. Angka dalam ribuan.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
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
          {!input_macet_mati && (
            <Button onClick={onShowMacet} variant="outline">
              Input Macet
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-3 lg:flex-row lg:items-start">
        <div className="flex-1 min-w-0">
          <FilterBar
            urlLink={urlLink}
            storageKey={localState}
            showHari={searchHari}
            showMonth={searchMonth}
            showKelompok={server_filter.userAuthorized.canShowKelompok}
            extraParams={unitExtraParams}
          />
        </div>
        <div className="relative lg:w-72">
          <SearchIcon className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama nasabah..."
            className="pl-9"
            value={namaCari}
            onChange={(e) => setNamaCari(e.target.value)}
          />
        </div>
      </div>
      {/* Macet memakai buku angsuran yang sama dengan Angsuran Lancar
          (saldo awal, angsuran per tanggal tagih, angsuran, MD, saldo); tabel
          itu punya wadah gulir sendiri. */}
      {server_filter.type_show === 'macet' ? (
        <AngsuranTable datas={datas} dateOfWeek={dateOfWeek} />
      ) : (
        <div className="overflow-auto">
          <AngsuranByDateTable datas={datas} />
        </div>
      )}
    </>
  );
};

export default AngsuranByDate;
