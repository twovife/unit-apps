import Authenticated from '@/Layouts/AuthenticatedLayout';
import MobileLayout from '@/Layouts/MobileLayout';
import RekapContent from '@/Pages/Kasir/Rekap/RekapContent';
import { Head } from '@inertiajs/react';
import React from 'react';

const RekapDua = ({ datas, auth, ...props }) => {
  const title = auth.permissions.includes('unit pimpinan')
    ? 'Rekap Pimpinan'
    : 'Rekap 2';

  return (
    <MobileLayout header={<Head>{title}</Head>}>
      <RekapContent rekapData={datas} show="rekap2" title={title} />
    </MobileLayout>
  );
};

export default RekapDua;
