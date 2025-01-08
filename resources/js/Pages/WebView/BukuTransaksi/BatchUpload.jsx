import React from 'react';
import NewNasabah from '@/Pages/NewLoan/NewNasabah';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const BatchUpload = () => {
  return (
    <Authenticated>
      <NewNasabah
        onClosed={() => void 0}
        generateAngsuran={true}
        typeInput={'text'}
        submitUrl={route('transaction.store_buku_transaksi_batch')}
      />
    </Authenticated>
  );
};

export default BatchUpload;
