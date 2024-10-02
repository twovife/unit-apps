import React, { useEffect, useMemo, useState } from 'react';

import Authenticated from '@/Layouts/AuthenticatedLayout';

import SearchComponent from '@/Components/shadcn/SearchComponent';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import AngsuranTable from './Components/AngsuranTable';
import BukuStorting from './Components/BukuStorting';
import MobileLayout from '@/Layouts/MobileLayout';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { FilterIcon } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';

const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  const { auth } = props;
  return (
    <MobileLayout header={<Head>Angsuran Lancar</Head>}>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Buku Transaksi
          </h1>
        </div>
        <div className="items-center justify-end flex-auto hidden w-full lg:flex">
          <SearchComponent
            urlLink={route('mobile_apps.buku_angsuran')}
            localState={'mobile_apps_buku_angsuran'}
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
                urlLink={route('mobile_apps.buku_angsuran')}
                localState={'mobile_apps_buku_angsuran'}
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
      <AngsuranTable dateOfWeek={dateOfWeek} datas={datas} />
    </MobileLayout>
  );
};

export default Index;
