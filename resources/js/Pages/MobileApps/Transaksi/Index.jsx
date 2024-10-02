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
import dayjs from 'dayjs';
import MobileLayout from '@/Layouts/MobileLayout';

const Index = ({ datas, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);

  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);

  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  const onNexOrPreviousTogler = (params) => {
    setNexOrPrevious(params);
  };

  return (
    <MobileLayout header={<Head>Buku Transaksi</Head>}>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Buku Transaksi
          </h1>
        </div>
        <div className="items-center justify-end flex-auto hidden w-full lg:flex">
          <SearchComponent
            urlLink={route('mobile_apps.transaksi')}
            localState={'mobile_apps_transaksi'}
            searchMonth={true}
            searchHari={true}
            searchKelompok={auth.permissions.includes('can show kelompok')}
            searchGroupingBranch={auth.permissions.includes('can show branch')}
            nexOrPrevious={nexOrPrevious}
            setNexOrPrevious={setNexOrPrevious}
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
                urlLink={route('mobile_apps.transaksi')}
                localState={'mobile_apps_transaksi'}
                searchMonth={true}
                searchHari={true}
                searchKelompok={auth.permissions.includes('can show kelompok')}
                searchGroupingBranch={auth.permissions.includes(
                  'can show branch'
                )}
                nexOrPrevious={nexOrPrevious}
                setNexOrPrevious={setNexOrPrevious}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        {datas &&
          datas.map((item, index) => {
            return (
              <div className="mb-3 border rounded-lg">
                <div className="p-1 px-2 text-sm">
                  Transaksi Tanggal :
                  {dayjs(item[0]?.tanggal_drop).format('DD-MM-YYYY')}
                </div>
                <BukuTransaksiTable key={index} datas={item} />
              </div>
            );
          })}
      </div>
    </MobileLayout>
  );
};

export default Index;
