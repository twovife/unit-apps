import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { UserPlus } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import Angsuran from '@/Pages/NewAngsuran/Angsuran';
import DialogKoreksi, { KoreksiBekuContext } from './Components/DialogKoreksi';

/**
 * Buku Angsuran Beku (superuser): halaman /pinjaman yang sama persis (komponen
 * Angsuran), dibungkus KoreksiBekuContext - modal nasabah menampilkan tombol
 * koreksi untuk data sebelum migrasi. /pinjaman (client) tidak tersentuh.
 */
const BukuBeku = ({ datas, dateOfWeek, sirkulasi, beku }) => {
  const [buka, setBuka] = useState(null);
  const filter = { grouping_id: beku.grouping_id, kelompok: beku.kelompok, hari: beku.hari };

  return (
    <KoreksiBekuContext.Provider value={beku.mulai ? { mulai: beku.mulai, filter } : null}>
      <Head title="Buku Angsuran Beku" />
      {beku.mulai ? (
        <div className="p-2 mb-3 text-xs border rounded-md border-sky-300 bg-sky-50 text-sky-900">
          Mode koreksi data beku: data sebelum {dayjs(beku.mulai).format('DD MMM YYYY')} dikoreksi dari modal nasabah (tombol
          biru). Tiap koreksi dipratinjau, menghitung ulang saldo bulanan, dan tercatat di log.
        </div>
      ) : (
        <div className="p-2 mb-3 text-xs border rounded-md border-amber-300 bg-amber-50 text-amber-900">
          Kantor ini belum migrasi - tidak ada data beku. Ubah lewat menu biasa.
        </div>
      )}
      <Angsuran
        datas={datas}
        dateOfWeek={dateOfWeek}
        sirkulasi={sirkulasi}
        urlLink={route('migrasi.buku_beku')}
        localState={'migrasi_buku_beku'}
        judul="Buku Angsuran Beku"
        aksi={
          beku.mulai &&
          beku.grouping_id && (
            <Button size="sm" variant="outline" className="gap-1" onClick={() => setBuka({ aksi: 'tambah_pinjaman' })}>
              <UserPlus className="w-4 h-4" />
              Tambah nasabah
            </Button>
          )
        }
      />
      <DialogKoreksi buka={buka} onClosed={() => setBuka(null)} filter={filter} mulai={beku.mulai} />
    </KoreksiBekuContext.Provider>
  );
};

export default BukuBeku;
