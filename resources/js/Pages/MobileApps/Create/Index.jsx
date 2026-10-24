import React from 'react';

import MobileLayout from '@/Layouts/MobileLayout';
import NewNasabah from '@/Pages/NewLoan/NewNasabah';

const Index = () => {
  return (
    <MobileLayout>
      <NewNasabah
        onClosed={() => void 0}
        submitUrl={route('transaction.store_buku_transaksi')}
        aturanDrop={true}
        batasiPengajuan={true}
      />
    </MobileLayout>
  );
};

export default Index;
