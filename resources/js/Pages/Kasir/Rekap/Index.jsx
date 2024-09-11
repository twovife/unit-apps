import SearchComponent from '@/Components/shadcn/SearchComponent';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Head } from '@inertiajs/react';
import { FilterIcon, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';

const Index = ({ datas, auth, ...props }) => {
  const [onCreateShow, setOnCreateShow] = useState(false);

  // Event handler function to set the "onCreateShow" state variable to true
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
  };

  // Event handler function to set the "onCreateShow" state variable to false
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
  };

  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  const onNexOrPreviousTogler = (params) => {
    setNexOrPrevious(params);
  };

  return (
    <Authenticated header={<Head>Buku Transaksi</Head>}>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Rekap Mantri
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
    </Authenticated>
  );
};

export default Index;
