import React, { useEffect, useMemo, useState } from 'react';

import Authenticated from '@/Layouts/AuthenticatedLayout';

import SearchComponent from '@/Components/shadcn/SearchComponent';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import AngsuranTable from './Components/AngsuranTable';
import BukuStorting from './Components/BukuStorting';

const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
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
      <Tabs defaultValue="bukuangsuran" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="bukuangsuran">Buku Angsuran</TabsTrigger>
            <TabsTrigger value="bukustorting">Buku Storting</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="bukuangsuran">
          <AngsuranTable dateOfWeek={dateOfWeek} datas={datas} />
        </TabsContent>
        <TabsContent value="bukustorting">
          <BukuStorting
            dateOfWeek={dateOfWeek}
            datas={datas}
            sirkulasi={sirkulasi}
          />
          {/* <Rencana datas={buku_rencana} /> */}
        </TabsContent>
      </Tabs>
    </Authenticated>
  );
};

export default Index;
