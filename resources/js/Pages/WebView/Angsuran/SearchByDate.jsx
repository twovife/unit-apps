import React, { useEffect, useMemo, useState } from 'react';

import Authenticated from '@/Layouts/AuthenticatedLayout';

import SearchComponent from '@/Components/shadcn/SearchComponent';
import { Head } from '@inertiajs/react';
import AngsuranByDate from '@/Pages/NewAngsuran/AngsuranByDate';

const SearchByDate = ({ datas, dateOfWeek, ...props }) => {
  return (
    <Authenticated header={<Head>Cari Angsuran</Head>}>
      <AngsuranByDate
        datas={datas}
        dateOfWeek={dateOfWeek}
        urlLink={route('pinjaman.index_pinjaman_search')}
        localState={'pinjaman_index_pinjaman_search'}
        searchMonth={true}
        searchHari={true}
      />
    </Authenticated>
  );
};

export default SearchByDate;
