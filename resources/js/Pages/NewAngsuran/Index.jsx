import React, { useEffect, useMemo, useState } from 'react';

import Authenticated from '@/Layouts/AuthenticatedLayout';

import SearchComponent from '@/Components/shadcn/SearchComponent';
import { Head } from '@inertiajs/react';
import AngsuranTable from './Components/AngsuranTable';

const Index = ({ datas, dateOfWeek, ...props }) => {
  return (
    <Authenticated header={<Head>Angsuran Lancar</Head>}>
      <div className="flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Angsuran Lancar
          </h1>
        </div>
        <div className="flex items-center justify-end flex-auto w-full">
          <SearchComponent
            urlLink={route('pinjaman.index_pinjaman')}
            localState={'pinjaman_index_pinjaman'}
            searchMonth={true}
            searchHari={true}
            searchKelompok={props.select_kelompok}
            searchGroupingBranch={props.select_branch}
            // nexOrPrevious={nexOrPrevious}
            // setNexOrPrevious={setNexOrPrevious}
          ></SearchComponent>
        </div>
      </div>
      <div className="overflow-auto">
        <AngsuranTable dateOfWeek={dateOfWeek} datas={datas} />
      </div>
    </Authenticated>
  );
};

export default Index;
