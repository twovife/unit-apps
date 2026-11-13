import React from 'react';
import useMuatDrawer from '@/Hooks/useMuatDrawer';
import dayjs from 'dayjs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import AngsuranTable from '@/Pages/NewAngsuran/Components/AngsuranTable';
import { FilterAngsuranContext } from '@/Pages/NewAngsuran/FilterAngsuran';
import SatuanAngka from '@/Components/SatuanAngka';

const NAMA_HARI = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

/**
 * Buku angsuran bulanan satu kelompok x hari tagih, dibuka dari angka
 * Storting di Rekap 1. Kolom tanggal storting itu disorot (AngsuranTable
 * `sorot`). Data dari pinjaman.buku_angsuran_json (= index_pinjaman);
 * filter buku disuntik lewat FilterAngsuranContext. Dimuat ulang sesudah
 * bayar / hapus angsuran.
 */
const DrawerBukuAngsuran = ({ target, server_filter, onClosed }) => {
  const { isi, galat } = useMuatDrawer(
    !!target,
    route('pinjaman.buku_angsuran_json'),
    target && {
      kelompok: target.kelompok,
      hari: NAMA_HARI[dayjs(target.tanggal).day()],
      month: dayjs(target.tanggal).format('YYYY-MM'),
      ...(server_filter.branch_id ? { branch_id: server_filter.branch_id } : {}),
      ...(server_filter.wilayah ? { wilayah: server_filter.wilayah } : {}),
    },
    `${target?.kelompok}|${target?.tanggal}`,
    { muatUlangSesudahSimpan: true },
  );

  return (
    <Sheet open={!!target} onOpenChange={(o) => (o ? '' : onClosed())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-5xl lg:max-w-none">
        <SheetHeader className="px-5 py-4 pr-14 border-b">
          <SheetTitle>
            Buku Angsuran — Kelompok {target?.kelompok},{' '}
            <span className="capitalize">{target ? NAMA_HARI[dayjs(target.tanggal).day()] : ''}</span>
          </SheetTitle>
          <SheetDescription>
            Kolom {target ? dayjs(target.tanggal).format('DD MMMM YYYY') : ''} disorot kuning — storting yang dicek.
            <SatuanAngka />
          </SheetDescription>
        </SheetHeader>
        <div className="p-3">
          {galat && <div className="text-sm text-red-600">{galat}</div>}
          {!isi && !galat && <div className="text-sm text-slate-500">Memuat…</div>}
          {isi && target && (
            <FilterAngsuranContext.Provider value={isi.server_filter}>
              <AngsuranTable
                diDrawer
                dateOfWeek={isi.dateOfWeek}
                datas={isi.datas}
                sorot={dayjs(target.tanggal).format('YYYY-MM-DD')}
              />
            </FilterAngsuranContext.Provider>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerBukuAngsuran;
