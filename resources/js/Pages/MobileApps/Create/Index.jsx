import React from 'react';

import MobileLayout from '@/Layouts/MobileLayout';
import NewNasabah from '@/Pages/NewLoan/NewNasabah';

const Index = () => {
  return (
    <MobileLayout>
      <NewNasabah onClosed={() => void 0} />
    </MobileLayout>
  );
};

export default Index;
