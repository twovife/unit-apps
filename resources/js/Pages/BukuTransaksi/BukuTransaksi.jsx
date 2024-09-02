import SearchComponent from '@/Components/shadcn/SearchComponent';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import { Head } from '@inertiajs/react';
import {
  ArrowBigLeft,
  ArrowBigRight,
  PlusCircle,
  StepBack,
} from 'lucide-react';
import React, { useState } from 'react';
import Create from './Components/Create';
import BukuTransaksiTable from './Components/BukuTransaksiTable';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import Action from './Components/Action';

const BukuTransaksi = ({ datas, ...props }) => {
  // Declare a state variable to track the visibility of the "onCreateShow" component
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
      <div className="flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Buku Transaksi
          </h1>
        </div>
        <div className="flex items-center justify-end flex-auto w-full">
          <SearchComponent
            urlLink={route('transaction.index_buku_transaksi')}
            localState={'transaction_index_buku_transaksi'}
            searchDate={true}
            searchKelompok={props.select_kelompok}
            searchGroupingBranch={props.select_branch}
            nexOrPrevious={nexOrPrevious}
            setNexOrPrevious={setNexOrPrevious}
          >
            <Button type="button" onClick={handleOnCreateShowOpen}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Pengajuan
              </span>
            </Button>
          </SearchComponent>
        </div>
      </div>
      <Create show={onCreateShow} onClosed={handleOnCreateShowClosed} />

      <div className="max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <BukuTransaksiTable datas={datas} />
      </div>
      <div className="flex justify-between w-full mt-3">
        <Button onClick={() => onNexOrPreviousTogler('previous')} size="icon">
          <ArrowBigLeft />
        </Button>
        <Button onClick={() => onNexOrPreviousTogler('next')} size="icon">
          <ArrowBigRight />
        </Button>
      </div>
    </Authenticated>
  );
};

export default BukuTransaksi;
