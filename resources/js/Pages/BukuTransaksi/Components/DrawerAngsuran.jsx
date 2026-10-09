import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import AngsuranTableMobile from '@/Pages/NewAngsuran/Components/AngsuranTableMobile';
import { FilterAngsuranContext } from '@/Pages/NewAngsuran/FilterAngsuran';

/**
 * Buku angsuran harian (sama dengan mobile_apps.angsuran) satu tanggal +
 * kelompok, dibuka dari kolom Storting di ACC KM untuk edit cepat tanpa pindah
 * halaman. Data dari transaction.angsuran_hari (JSON); dialog bayar / hapus
 * membaca tanggal & status kunci dari FilterAngsuranContext, bukan dari filter
 * halaman Buku Transaksi.
 */
const DrawerAngsuran = ({ target, onClosed }) => {
  const [isi, setIsi] = useState(null);
  const [galat, setGalat] = useState(null);

  const muat = useCallback(() => {
    if (!target) return;
    setGalat(null);
    axios
      .get(route('transaction.angsuran_hari'), { params: { date: target.tanggal, kelompok: target.kelompok } })
      .then(({ data }) => setIsi(data))
      .catch(() => setGalat('Buku angsuran gagal dimuat.'));
  }, [target?.tanggal, target?.kelompok]);

  useEffect(() => {
    setIsi(null);
    muat();
  }, [muat]);

  // Bayar / hapus angsuran lewat Inertia -> muat ulang isi drawer sesudahnya.
  useEffect(() => (target ? router.on('success', muat) : undefined), [target, muat]);

  const f = isi?.server_filter;

  return (
    <Sheet open={!!target} onOpenChange={(o) => (o ? '' : onClosed())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader className="px-5 py-4 pr-14 border-b">
          <SheetTitle>Angsuran — {target ? dayjs(target.tanggal).format('dddd, DD MMM YYYY') : ''}</SheetTitle>
          <SheetDescription>Kelompok {target?.kelompok}. Bayar / hapus angsuran langsung di sini.</SheetDescription>
        </SheetHeader>
        <div className="p-3">
          {galat && <div className="text-sm text-red-600">{galat}</div>}
          {!isi && !galat && <div className="text-sm text-slate-500">Memuat…</div>}
          {f?.is_libur && (
            <div className="p-3 mb-3 text-sm border rounded-lg border-amber-300 bg-amber-50/60 text-amber-900">
              {f.tanggal} hari libur — tidak ada tarikan.
            </div>
          )}
          {f?.is_locked && (
            <div className="p-3 mb-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
              <b>Tanggal {f.tanggal} sudah dikunci kasir.</b> Data bisa dilihat tapi tidak bisa diubah.
            </div>
          )}
          {isi && !f?.is_libur && (
            <FilterAngsuranContext.Provider value={f}>
              <AngsuranTableMobile dateOfWeek={isi.dateOfWeek} datas={isi.datas} />
            </FilterAngsuranContext.Provider>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerAngsuran;
