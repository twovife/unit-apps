import SearchComponent from '@/Components/shadcn/SearchComponent';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import { Head } from '@inertiajs/react';
import {
  ArrowBigLeft,
  ArrowBigRight,
  FilterIcon,
  PlusCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Create from './Components/Create';
import BukuTransaksiTable from './Components/BukuTransaksiTable';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import Rencana from './Components/Rencana';
import BukuTransaksiNextTable from './Components/BukuTransaksiNextTable';
import Approval from './Components/Approval';
import MobileLayout from '@/Layouts/MobileLayout';

const BukuTransaksi = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);

  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);

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
  // Declare a state variable to track the visibility of the "onCreateShow" component
  const [onApprovalShow, setOnApprovalShow] = useState(false);
  const [triggeredDate, setTriggeredDate] = useState(false);

  // Event handler function to set the "onApprovalShow" state variable to true
  const handleOnApprovalShowOpen = (e) => {
    setOnApprovalShow(true);
  };

  // Event handler function to set the "onApprovalShow" state variable to false
  const handleOnApprovalShowClosed = (e) => {
    setOnApprovalShow(false);
  };

  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  const onNexOrPreviousTogler = (params) => {
    setNexOrPrevious(params);
  };

  return (
    <MobileLayout header={<Head>Buku Transaksi</Head>}>
      <Approval
        show={onApprovalShow}
        onClosed={handleOnApprovalShowClosed}
        triggeredData={flatData}
        triggeredDate={triggeredDate}
      />
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Buku Transaksi
          </h1>
        </div>
        <div className="items-center justify-end flex-auto hidden w-full lg:flex">
          <SearchComponent
            urlLink={route('mobile_apps.buku_transaksi_kepala')}
            localState={'mobile_apps_buku_transaksi_kepala'}
            searchMonth={true}
            searchHari={true}
            searchKelompok={auth.permissions.includes('can show kelompok')}
            searchGroupingBranch={auth.permissions.includes('can show branch')}
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
                urlLink={route('mobile_apps.buku_transaksi_kepala')}
                localState={'mobile_apps_buku_transaksi_kepala'}
                searchMonth={true}
                searchHari={true}
                searchKelompok={auth.permissions.includes('can show kelompok')}
                searchGroupingBranch={auth.permissions.includes(
                  'can show branch'
                )}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Create show={onCreateShow} onClosed={handleOnCreateShowClosed} />

      <div className="max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <Tabs defaultValue="bukutransaksi" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="bukutransaksi">Buku Transaksi</TabsTrigger>
              <TabsTrigger value="dailyTarget">Rencana Drop</TabsTrigger>
            </TabsList>
            <Button
              onClick={handleOnApprovalShowOpen}
              size="sm"
              className="mr-3"
            >
              Cek Transaksi
            </Button>
          </div>
          <TabsContent value="bukutransaksi">
            {datas &&
              datas.map((item, index) => (
                <BukuTransaksiTable key={index} datas={item} />
              ))}
            {/* <BukuTransaksiNextTable datas={pengajuan_next} /> */}
          </TabsContent>
          <TabsContent value="dailyTarget">
            <Rencana datas={buku_rencana} dataTransaksi={datas} />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default BukuTransaksi;
