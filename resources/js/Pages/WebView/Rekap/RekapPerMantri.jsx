import Permantri from '@/Pages/Kasir/Rekap/Permantri';
import { Head } from '@inertiajs/react';
import React from 'react';

const RekapPerMantri = ({ datas, saldoAwalBulan, rencana, auth, ...props }) => {
  const title = 'Rekap Mantri';

  return (
    <>
      <Permantri
        rekapData={datas}
        auth={auth}
        saldoAwalBulan={saldoAwalBulan}
        rencana={rencana}
        title={title}
        urlLink={route('kasir.rekap.rekap_permantri')}
        localState={'kasir_rekap_rekap_permantri'}
      />
    </>
  );
};

export default RekapPerMantri;
