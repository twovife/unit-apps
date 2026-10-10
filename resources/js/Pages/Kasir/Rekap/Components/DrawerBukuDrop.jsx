import React, { useEffect, useRef } from 'react';
import useMuatDrawer from '@/Hooks/useMuatDrawer';
import dayjs from 'dayjs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import BukuTransaksi from '@/Pages/BukuTransaksi/BukuTransaksi';
import BukuTransaksiKepala from '@/Pages/BukuTransaksi/BukuTransaksiKepala';

const NAMA_HARI = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

/**
 * Buku drop (= Buku Transaksi) sebulan satu kelompok x hari tagih, dibuka
 * dari angka Drop di Rekap 1. Grup tanggal drop itu disorot & digulir ke
 * pandangan. Data dari transaction.drop_bulan; dimuat ulang sesudah aksi
 * pinjaman (Action) tersimpan.
 */
const DrawerBukuDrop = ({ target, server_filter, onClosed }) => {
  const { isi, galat } = useMuatDrawer(
    !!target,
    route('transaction.drop_bulan'),
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

  const sorot = target ? dayjs(target.tanggal).format('YYYY-MM-DD') : null;
  const kena = (item) => dayjs(item?.[0]?.tanggal_drop).format('YYYY-MM-DD') === sorot;
  const groups = isi?.datas ?? [];

  // Gulir ke grup yang disorot sekali sesudah data datang.
  const wadah = useRef(null);
  useEffect(() => {
    // Desktop & HP sama-sama dirender; ambil yang tampil.
    const el = [...(wadah.current?.querySelectorAll('[data-sorot]') ?? [])].find((e) => e.offsetParent);
    el?.scrollIntoView({ block: 'start' });
  }, [isi]);

  // Sorot tegas: bingkai + baris tabel (desktop) & kepala kartu (HP) kuning.
  const KELAS_SOROT =
    'my-2 overflow-hidden rounded-lg ring-2 ring-amber-400 bg-amber-50 [&_tbody_tr]:bg-amber-100 [&_tbody_tr:hover]:bg-amber-200 [&_.bg-muted]:bg-amber-200';
  const Label = () => (
    <div className="px-3 py-1 text-xs font-semibold text-amber-900 bg-amber-300">
      Drop {dayjs(sorot).format('dddd, DD MMMM YYYY')} — tanggal yang dicek
    </div>
  );

  return (
    <Sheet open={!!target} onOpenChange={(o) => (o ? '' : onClosed())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-5xl lg:max-w-none">
        <SheetHeader className="px-5 py-4 pr-14 border-b">
          <SheetTitle>
            Buku Drop — Kelompok {target?.kelompok},{' '}
            <span className="capitalize">{target ? NAMA_HARI[dayjs(target.tanggal).day()] : ''}</span>
          </SheetTitle>
          <SheetDescription>
            Drop {target ? dayjs(target.tanggal).format('DD MMMM YYYY') : ''} disorot kuning.
          </SheetDescription>
        </SheetHeader>
        <div className="p-3" ref={wadah}>
          {galat && <div className="text-sm text-red-600">{galat}</div>}
          {!isi && !galat && <div className="text-sm text-slate-500">Memuat…</div>}
          {isi && groups.length === 0 && <div className="text-sm text-slate-500">Tidak ada drop bulan ini.</div>}
          {isi && (
            <>
              <div className="hidden lg:block">
                {groups.map((item, i) => (
                  <div key={item?.[0]?.tanggal_drop ?? i} {...(kena(item) ? { 'data-sorot': '', className: KELAS_SOROT } : {})}>
                    {kena(item) && <Label />}
                    <BukuTransaksi datas={item} />
                  </div>
                ))}
              </div>
              <div className="space-y-3 lg:hidden">
                {groups.map((item, i) => (
                  <div key={item?.[0]?.tanggal_drop ?? i} {...(kena(item) ? { 'data-sorot': '', className: KELAS_SOROT } : {})}>
                    {kena(item) && <Label />}
                    <BukuTransaksiKepala datas={item} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerBukuDrop;
