import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const MobileLayout = ({ header, children, loading = false }) => {
  return (
    <AuthenticatedLayout header={header} loading={loading}>
      {children}
    </AuthenticatedLayout>
  );
};

export default MobileLayout;
