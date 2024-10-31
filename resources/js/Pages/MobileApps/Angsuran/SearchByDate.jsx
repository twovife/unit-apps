import React, { useEffect, useMemo, useState } from 'react';

import { Head } from '@inertiajs/react';
import MobileLayout from '@/Layouts/MobileLayout';
import AngsuranByDate from '@/Pages/NewAngsuran/AngsuranByDate';

const SearchByDate = ({ datas, dateOfWeek, ...props }) => {
  return (
    <MobileLayout header={<Head>Cari Angsuran</Head>}>
      <AngsuranByDate
        datas={datas}
        dateOfWeek={dateOfWeek}
        urlLink={route('pinjaman.index_pinjaman_search')}
        localState={'pinjaman_index_pinjaman_search'}
        searchMonth={true}
        searchHari={true}
      />
    </MobileLayout>
  );
};

export default SearchByDate;
