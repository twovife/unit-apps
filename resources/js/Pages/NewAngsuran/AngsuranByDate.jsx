import React, { useEffect, useMemo, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import SearchComponent from '@/Components/shadcn/SearchComponent';
import { usePage } from '@inertiajs/react';
import AngsuranByDateTable from './Components/AngsuranByDateTable';
import { Button } from '@/shadcn/ui/button';
import { FilterIcon } from 'lucide-react';

const AngsuranByDate = ({ datas, urlLink, localState }) => {
  const { auth } = usePage().props;
  return (
    <>
      <div className="flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex justify-between flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Cari Angsuran
          </h1>
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
                  searchMonth={true}
                  searchHari={true}
                  searchKelompok={auth.permissions.includes(
                    'can show kelompok'
                  )}
                  searchGroupingBranch={auth.permissions.includes(
                    'can show branch'
                  )}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="items-center justify-end flex-auto hidden w-full lg:flex">
          <SearchComponent
            urlLink={urlLink}
            localState={localState}
            searchMonth={true}
            searchHari={true}
            searchKelompok={auth.permissions.includes('can show kelompok')}
            searchGroupingBranch={auth.permissions.includes('can show branch')}
          ></SearchComponent>
        </div>
      </div>
      <div className="overflow-auto">
        <AngsuranByDateTable datas={datas} />
      </div>
    </>
  );
};

export default AngsuranByDate;
