import SearchComponent from '@/Components/shadcn/SearchComponent';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Head } from '@inertiajs/react';
import { FilterIcon, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import TableRekap from './Components/TableRekap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import TableRekapKasir from './Components/TableRekapKasir';
import TunaiMantri from './Components/TunaiMantri';
import Action from './Components/Action';

const Index = ({ datas, auth, ...props }) => {
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
    <Authenticated header={<Head>Buku Transaksi</Head>}>
      <Action
        show={onShowModal}
        onClosed={handleOnCreateShowClosed}
        triggeredData={triggeredData}
        type={triggeredType}
      />

      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Rekap Data Harian
          </h1>
        </div>
        <div className="items-center justify-end flex-auto hidden w-full lg:flex">
          <SearchComponent
            urlLink={route('kasir.rekap.rekap_index')}
            localState={'kasir_rekap_rekap_index'}
            searchDate={true}
            searchGroupingBranch={auth.permissions.includes('can show branch')}
            nexOrPrevious={nexOrPrevious}
            setNexOrPrevious={setNexOrPrevious}
          >
            {auth.permissions.includes('can create') && (
              <Button type="button" onClick={handleOnCreateShowOpen}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Tambah Pengajuan
                </span>
              </Button>
            )}
          </SearchComponent>
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
                urlLink={route('transaction.index_buku_transaksi')}
                localState={'transaction_index_buku_transaksi'}
                searchDate={true}
                searchKelompok={auth.permissions.includes('can show kelompok')}
                searchGroupingBranch={auth.permissions.includes(
                  'can show branch'
                )}
                nexOrPrevious={nexOrPrevious}
                setNexOrPrevious={setNexOrPrevious}
              />
            </PopoverContent>
          </Popover>
          <Button type="button" onClick={handleOnCreateShowOpen}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Tambah Pengajuan
            </span>
          </Button>
        </div>
      </div>
      <div className="max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <Tabs defaultValue="rekappimpinan" className="w-full">
          <TabsList>
            <TabsTrigger value="rekappimpinan">
              {auth.permissions.includes('unit pimpinan')
                ? 'Rekap Pimpinan'
                : 'Rekap 2'}
            </TabsTrigger>
            <TabsTrigger value="rekapkasir">Rekap 1</TabsTrigger>
            <TabsTrigger value="tunaimantri">Tunai Mantri</TabsTrigger>
          </TabsList>
          <TabsContent value="rekappimpinan">
            <TableRekap
              setOnShowModal={setOnShowModal}
              setTriggeredData={setTriggeredData}
              datas={datas}
            />
          </TabsContent>

          <TabsContent value="rekapkasir">
            <TableRekapKasir
              setOnShowModal={setOnShowModal}
              setTriggeredData={setTriggeredData}
              setTriggeredType={setTriggeredType}
              datas={datas}
            />
          </TabsContent>
          <TabsContent value="tunaimantri">
            <TunaiMantri
              setOnShowModal={setOnShowModal}
              setTriggeredData={setTriggeredData}
              setTriggeredType={setTriggeredType}
              datas={datas}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Authenticated>
  );
};

export default Index;
