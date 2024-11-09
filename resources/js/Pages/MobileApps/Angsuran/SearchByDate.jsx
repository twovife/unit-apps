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
        urlLink={route('mobile_apps.macet')}
        localState={'mobile_apps_macet'}
        searchMonth={true}
        searchHari={true}
      />
    </MobileLayout>
  );
};

export default SearchByDate;
