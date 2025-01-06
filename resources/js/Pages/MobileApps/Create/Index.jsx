import React from 'react';

import MobileLayout from '@/Layouts/MobileLayout';
import NewNasabah from '@/Pages/NewLoan/NewNasabah';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const Index = () => {
  return (
    <Authenticated>
      <NewNasabah
        onClosed={() => void 0}
        submitUrl={route('transaction.store_buku_transaksi')}
      />
    </Authenticated>
  );
};

export default Index;
