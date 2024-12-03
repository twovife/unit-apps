import Authenticated from '@/Layouts/AuthenticatedLayout';
import ManPower from '@/Pages/Administrasi/ManPower/ManPower';
import React from 'react';

const Index = ({ datas, auth, ...props }) => {
  return (
    <Authenticated>
      <ManPower datas={datas} />
    </Authenticated>
  );
};

export default Index;
