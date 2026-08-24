import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import MobileLayout from '@/Layouts/MobileLayout';
import BukuTransaksiKepala from '@/Pages/BukuTransaksi/BukuTransaksiKepala';
import FilterBar from '@/Components/FilterBar';

const TransaksiMantri = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  const { server_filter } = usePage().props;

  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);

  return (
    <MobileLayout header={<Head>Buku Transaksi</Head>}>
      <div className="mb-3">
        <h1 className="text-xl font-semibold tracking-tight">Buku Transaksi</h1>
      </div>

      <FilterBar
        urlLink={route('mobile_apps.transaksi')}
        storageKey="mobile_apps.transaksi"
        showHari={true}
        showMonth={true}
        showKelompok={server_filter.userAuthorized.canShowKelompok}
      />

      {/* Tanpa max-h/overflow di sini: dokumen jadi satu-satunya area scroll,
          sehingga kepala tanggal tiap grup bisa menempel di bawah navbar. */}
      <div className="space-y-3">
        {datas &&
          datas.map((item, index) => (
            <BukuTransaksiKepala key={index} datas={item} />
          ))}
      </div>
    </MobileLayout>
  );
};

export default TransaksiMantri;
