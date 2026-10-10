import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import TableRekapKasir from './TableRekapKasir';

/**
 * Detail tunai per hari satu kelompok (awal bulan s/d tanggal filter), dibuka
 * dari tabel Global Rekap 1. Data dari kasir.rekap.rekap_permantri_json -
 * fungsi yang sama dengan halaman Rekap per Mantri, jadi jumlahnya = baris Global.
 */
const DrawerDetailKelompok = ({ target, server_filter, onClosed, onKlikStorting = null }) => {
  const [isi, setIsi] = useState(null);
  const [galat, setGalat] = useState(null);

  useEffect(() => {
    if (!target) return;
    setIsi(null);
    setGalat(null);
    axios
      .get(route('kasir.rekap.rekap_permantri_json'), {
        params: {
          kelompok: target.kelompok,
          month: dayjs(server_filter.tanggal).format('YYYY-MM'),
          sampai: server_filter.tanggal,
          ...(server_filter.branch_id ? { branch_id: server_filter.branch_id } : {}),
          ...(server_filter.wilayah ? { wilayah: server_filter.wilayah } : {}),
        },
      })
      .then(({ data }) => setIsi(data.datas ?? []))
      .catch(() => setGalat('Detail gagal dimuat.'));
  }, [target?.kelompok, server_filter.tanggal]);

  return (
    <Sheet open={!!target} onOpenChange={(o) => (o ? '' : onClosed())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-5xl lg:max-w-none">
        <SheetHeader className="px-5 py-4 pr-14 border-b">
          <SheetTitle>Detail Tunai — Kelompok {target?.kelompok}</SheetTitle>
          <SheetDescription>
            Per hari, 1 s/d {dayjs(server_filter.tanggal).format('DD MMMM YYYY')}. Angka dalam ribuan.
          </SheetDescription>
        </SheetHeader>
        <div className="p-3">
          {galat && <div className="text-sm text-red-600">{galat}</div>}
          {!isi && !galat && <div className="text-sm text-slate-500">Memuat…</div>}
          {isi && <TableRekapKasir bacaSaja datas={isi} onKlikStorting={onKlikStorting} />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerDetailKelompok;
