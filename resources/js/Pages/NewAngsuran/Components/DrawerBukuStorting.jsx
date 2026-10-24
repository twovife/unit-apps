import React from 'react';
import useMuatDrawer from '@/Hooks/useMuatDrawer';
import dayjs from 'dayjs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import BukuStorting from './BukuStorting';
import { FilterAngsuranContext } from '../FilterAngsuran';

/**
 * Buku Storting satu kelompok x hari tagih x bulan, sebagai drawer (tanpa
 * pindah halaman). target = { kelompok, hari, tanggal }. Data dari
 * pinjaman.buku_angsuran_json (= index_pinjaman); filter buku disuntik lewat
 * FilterAngsuranContext, tutup buku & sirkulasi lewat props.
 */
const DrawerBukuStorting = ({ target, onClosed }) => {
  const { isi, galat } = useMuatDrawer(
    !!target,
    route('pinjaman.buku_angsuran_json'),
    target && { kelompok: target.kelompok, hari: target.hari, month: dayjs(target.tanggal).format('YYYY-MM') },
    `${target?.kelompok}|${target?.hari}|${target?.tanggal}`,
    { muatUlangSesudahSimpan: true },
  );

  return (
    <Sheet open={!!target} onOpenChange={(o) => (o ? '' : onClosed())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-5xl lg:max-w-none">
        <SheetHeader className="px-5 py-4 pr-14 border-b">
          <SheetTitle>
            Buku Storting — Kelompok {target?.kelompok}, <span className="capitalize">{target?.hari}</span>
          </SheetTitle>
          <SheetDescription>{target ? dayjs(target.tanggal).format('MMMM YYYY') : ''}</SheetDescription>
        </SheetHeader>
        <div className="p-3">
          {galat && <div className="text-sm text-red-600">{galat}</div>}
          {!isi && !galat && <div className="text-sm text-slate-500">Memuat…</div>}
          {isi && target && (
            <FilterAngsuranContext.Provider value={isi.server_filter}>
              <BukuStorting
                dateOfWeek={isi.dateOfWeek}
                datas={isi.datas}
                sirkulasi={isi.sirkulasi}
                tutupBuku={isi.tutup_buku ?? null}
              />
            </FilterAngsuranContext.Provider>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerBukuStorting;
