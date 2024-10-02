import React, { useEffect, useMemo, useState } from 'react';

import Authenticated from '@/Layouts/AuthenticatedLayout';

import SearchComponent from '@/Components/shadcn/SearchComponent';
import { Head } from '@inertiajs/react';
import AngsuranTable from './Components/AngsuranTable';
import Angsuran from './Components/Angsuran';
import MobileLayout from '@/Layouts/MobileLayout';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { FilterIcon } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';

const SearchByDate = ({ datas, dateOfWeek, ...props }) => {
  const { auth } = props;
  return (
    <MobileLayout header={<Head>Cari Angsuran</Head>}>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Cari Angsuran By Date
          </h1>
        </div>
        <div className="items-center justify-end flex-auto hidden w-full lg:flex">
          <SearchComponent
            urlLink={route('mobile_apps.macet')}
            localState={'mobile_apps_macet'}
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
                urlLink={route('mobile_apps.macet')}
                localState={'mobile_apps_macet'}
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
      <div className="overflow-auto">
        <Angsuran datas={datas} />
      </div>
    </MobileLayout>
  );
};

export default SearchByDate;
