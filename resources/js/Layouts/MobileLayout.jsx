import React from 'react';
import Loading from '@/Components/Loading';

// Layout utama (sidebar + navbar) dipasang sekali dari app.jsx (persistent layout);
// pembungkus ini tinggal menyisakan indikator loading halaman HP.
const MobileLayout = ({ children, loading = false }) => (
  <>
    <Loading show={loading} />
    {children}
  </>
);

export default MobileLayout;
