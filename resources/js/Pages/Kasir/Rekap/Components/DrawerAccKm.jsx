import React, { useState } from 'react';
import useMuatDrawer from '@/Hooks/useMuatDrawer';
import dayjs from 'dayjs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import Rencana from '@/Pages/BukuTransaksi/Rencana';
import DrawerAngsuran from '@/Pages/BukuTransaksi/Components/DrawerAngsuran';

const NAMA_HARI = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

/**
 * Drawer ACC KM (Ceklist Kepala) satu kelompok x hari tagih x bulan, dibuka
 * dari halaman lain tanpa pindah ke Buku Transaksi. Isinya komponen Rencana
 * yang SAMA dengan drawer ACC KM di Buku Transaksi; datanya dari
 * transaction.drop_bulan (getTransactionLoan - sumber yang sama). Rencana &
 * Approval membaca server_filter.migrasi dari halaman pemanggil, jadi halaman
 * itu wajib mengirimnya. Dimuat ulang sesudah ACC tersimpan.
 */
const DrawerAccKm = ({ target, server_filter, onClosed }) => {
  const hari = target ? NAMA_HARI[dayjs(target.tanggal).day()] : '';
  const { isi, galat } = useMuatDrawer(
    !!target,
    route('transaction.drop_bulan'),
    target && {
      kelompok: target.kelompok,
      hari,
      month: dayjs(target.tanggal).format('YYYY-MM'),
      ...(server_filter.branch_id ? { branch_id: server_filter.branch_id } : {}),
      ...(server_filter.wilayah ? { wilayah: server_filter.wilayah } : {}),
    },
    `${target?.kelompok}|${target?.tanggal}`,
    { muatUlangSesudahSimpan: true },
  );
  // Storting di dalam ACC KM -> buku angsuran hari itu, di atas drawer ini.
  const [angsuran, setAngsuran] = useState(null);

  return (
    <>
      <Sheet open={!!target} onOpenChange={(o) => (o ? '' : onClosed())}>
        <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-5xl lg:max-w-none">
          <SheetHeader className="px-5 py-4 pr-14 border-b">
            <SheetTitle>ACC KM</SheetTitle>
            <SheetDescription>
              Kelompok {target?.kelompok} · <span className="capitalize">{hari}</span> ·{' '}
              {target ? dayjs(target.tanggal).format('MMMM YYYY') : ''}. Cari baris tanggal{' '}
              {target ? dayjs(target.tanggal).format('DD-MM') : ''} lalu klik ACC. Angka dalam ribuan.
            </SheetDescription>
          </SheetHeader>
          <div className="p-3 overflow-x-auto">
            {galat && <div className="text-sm text-red-600">{galat}</div>}
            {!isi && !galat && <div className="text-sm text-slate-500">Memuat…</div>}
            {isi && (
              <Rencana
                datas={isi.buku_rencana}
                dataTransaksi={isi.datas}
                onStorting={(item) => setAngsuran({ tanggal: item.tanggal, kelompok: item.kelompok })}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
      <DrawerAngsuran target={angsuran} onClosed={() => setAngsuran(null)} />
    </>
  );
};

export default DrawerAccKm;
