import React, { useState } from 'react';

import { Head, router, usePage } from '@inertiajs/react';
import Angsuran from '@/Pages/NewAngsuran/Angsuran';
import MobileLayout from '@/Layouts/MobileLayout';
import DialogInputMl from '@/Components/DialogInputMl';
import { Button } from '@/shadcn/ui/button';

// Menu ML: Angsuran Lancar versi ML - tampilan & filter sama, isinya hanya
// pinjaman ML yang belum lunas sebelum tanggal terpilih (getLoanMantri $hanyaMl).
// Kantor migrasi: tombol Input ML (setoran nasabah macet lama, pecahan MACET LAMA).
const Ml = ({ datas, dateOfWeek, sirkulasi, input_ml = false }) => {
  const { server_filter } = usePage().props;
  const [buka, setBuka] = useState(false);
  return (
    <MobileLayout header={<Head>Angsuran ML</Head>}>
      <Angsuran
        judul="Angsuran ML"
        datas={datas}
        dateOfWeek={dateOfWeek}
        sirkulasi={sirkulasi}
        type={'mobile'}
        urlLink={route('mobile_apps.ml')}
        localState={'mobile_apps.ml'}
        aksi={
          input_ml && (
            <Button size="sm" variant="outline" onClick={() => setBuka(true)}>
              Input ML
            </Button>
          )
        }
      />
      {input_ml && (
        <DialogInputMl
          buka={buka}
          kelompok={server_filter.kelompok}
          hari={server_filter.hari}
          onClosed={() => {
            setBuka(false);
            router.reload({ only: ['datas', 'sirkulasi'] });
          }}
        />
      )}
    </MobileLayout>
  );
};

export default Ml;
