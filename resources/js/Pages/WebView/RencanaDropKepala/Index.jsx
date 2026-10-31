import Content from '@/Pages/Kasir/RencanaDrop/Content';
import { Head } from '@inertiajs/react';
import React from 'react';

const Index = ({ datas, ...props }) => {
  return (
    <>
      <Content
        urlLink={route('kasir.rekap.rencana_drop')}
        localState={'kasir_rekap_rencana_drop'}
        triggeredData={datas}
      />
    </>
  );
};

export default Index;
