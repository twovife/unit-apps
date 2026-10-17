import React from 'react';

import { Head } from '@inertiajs/react';
import Angsuran from '@/Pages/NewAngsuran/Angsuran';
import MobileLayout from '@/Layouts/MobileLayout';

// Menu ML: Angsuran Lancar versi ML - tampilan & filter sama, isinya hanya
// pinjaman ML yang belum lunas sebelum tanggal terpilih (getLoanMantri $hanyaMl).
const Ml = ({ datas, dateOfWeek, sirkulasi }) => {
  return (
    <MobileLayout header={<Head>Angsuran ML</Head>}>
      <Angsuran
        judul="Angsuran ML"
        datas={datas}
        dateOfWeek={dateOfWeek}
        sirkulasi={sirkulasi}
        type={'mobile'}
        urlLink={route('mobile_apps.ml')}
        localState={'mobile_apps.ml'}
      />
    </MobileLayout>
  );
};

export default Ml;
