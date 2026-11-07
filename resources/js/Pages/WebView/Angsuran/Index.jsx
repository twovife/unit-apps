import React from 'react';


import { Head } from '@inertiajs/react';
import Angsuran from '@/Pages/NewAngsuran/Angsuran';

const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  return (
    <>
      <Angsuran
        datas={datas}
        dateOfWeek={dateOfWeek}
        sirkulasi={sirkulasi}
        urlLink={route('pinjaman.index_pinjaman')}
        localState={'pinjaman_index_pinjaman'}
      />
    </>
  );
};

export default Index;
