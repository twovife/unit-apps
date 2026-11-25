import RekapContent from '@/Pages/Kasir/Rekap/RekapContent';
import { Head } from '@inertiajs/react';
import React from 'react';

const RekapSatu = ({ datas, auth, ...props }) => {
  const title = 'REKAP 1';

  return (
    <>
      <RekapContent
        rekapData={datas}
        show="rekapkasir"
        title={title}
        urlLink={route('kasir.rekap.rekap_satu')}
        localState={'kasir_rekap_rekap_satu'}
      />
    </>
  );
};

export default RekapSatu;
