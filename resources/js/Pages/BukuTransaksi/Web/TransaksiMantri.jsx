import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import { Head, usePage } from '@inertiajs/react';
import { FilterIcon, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import BukuTransaksi from '@/Pages/BukuTransaksi/BukuTransaksi';
import BukuTransaksiKepala from '@/Pages/BukuTransaksi/BukuTransaksiKepala';
import Create from './Create';
import Rencana from '@/Pages/BukuTransaksi/Rencana';

/**
 * Satu halaman untuk `/bukutransaksi`, dipakai di semua lebar layar - tidak
 * ada lagi route/halaman terpisah untuk mobile ("buku-transaksi-kepala").
 * Tampilan bercabang lewat CSS (`hidden lg:block` / `lg:hidden`), BUKAN
 * lewat deteksi device di server maupun JS - data yang dikirim server sama.
 *
 * Filter hari/bulan/kelompok memakai `FilterBar` yang SAMA di semua lebar
 * layar (dulu desktop masih pakai dropdown `SearchComponent` terpisah dari
 * mobile - sekarang disatukan). `SearchComponent` disisakan HANYA untuk
 * filter Unit/Wilayah (`canShowBranch`/`canShowGroupingBranch`) karena
 * opsinya perlu di-fetch dari server dan cuma relevan untuk role level
 * wilayah/pusat - bukan sesuatu yang perlu tampil sebagai chip instan.
 */
const TransaksiMantri = ({ datas, buku_rencana }) => {
  const { server_filter } = usePage().props;

  const [onCreateShow, setOnCreateShow] = useState(false);
  const handleOnCreateShowOpen = () => setOnCreateShow(true);
  const handleOnCreateShowClosed = () => setOnCreateShow(false);

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
    <Authenticated header={<Head>Buku Transaksi</Head>}>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <h1 className="text-xl font-semibold tracking-tight">
          Buku Transaksi
        </h1>

        <div className="flex items-center justify-end gap-2">
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
                  urlLink={route('transaction.index_buku_transaksi')}
                  localState={'transaction_index_buku_transaksi'}
                  searchBranch={server_filter.userAuthorized.canShowBranch}
                  searchGroupingBranch={
                    server_filter.userAuthorized.canShowGroupingBranch
                  }
                />
              </PopoverContent>
            </Popover>
          )}
          {server_filter.userAuthorized.canCreate && (
            <Button type="button" onClick={handleOnCreateShowOpen}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Pengajuan
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Chip hari/bulan/kelompok - sama persis di desktop maupun mobile,
          sama seperti menu Drop. */}
      <div className="mb-3">
        <FilterBar
          urlLink={route('transaction.index_buku_transaksi')}
          storageKey="transaction.index_buku_transaksi"
          showHari={true}
          showMonth={true}
          showKelompok={server_filter.userAuthorized.canShowKelompok}
          extraParams={unitExtraParams}
        />
      </div>

      <Create show={onCreateShow} onClosed={handleOnCreateShowClosed} />

      <Tabs defaultValue="bukutransaksi" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="bukutransaksi">Buku Transaksi</TabsTrigger>
            <TabsTrigger value="dailyTarget">Rencana Drop</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bukutransaksi">
          {/* Desktop: tabel, dibungkus scroll box seperti sebelumnya */}
          <div className="hidden max-h-[70vh] lg:block border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
            {datas &&
              datas.map((item, index) => (
                <BukuTransaksi key={index} datas={item} />
              ))}
          </div>

          {/* Mobile: kartu seperti menu Drop. Tanpa max-h/overflow di sini -
              dokumen jadi satu-satunya area scroll (sama seperti Drop). */}
          <div className="space-y-3 lg:hidden">
            {datas &&
              datas.map((item, index) => (
                <BukuTransaksiKepala key={index} datas={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="dailyTarget">
          <Rencana datas={buku_rencana} dataTransaksi={datas} />
        </TabsContent>
      </Tabs>
    </Authenticated>
  );
};

export default TransaksiMantri;
