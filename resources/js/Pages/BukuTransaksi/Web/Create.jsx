import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import NewNasabah from '@/Pages/NewLoan/NewNasabah';

const Create = ({ show = false, onClosed }) => {
  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : onClosed())}>
      {/*
        Isinya kolom flex: header tetap di atas, badan yang menggulung.
        Sebelumnya seluruh formulir dibungkus <DialogDescription>, yang merender
        <p> — browser membongkar-ulang DOM-nya karena <div>/<form>/<table>
        tidak sah di dalam <p>, dan semuanya mewarisi text-muted-foreground
        sehingga formulirnya tampak abu-abu. Deskripsinya sekarang benar-benar
        satu kalimat, dan formulirnya jadi saudara, bukan anaknya.
      */}
      <DialogContent className="flex h-[92vh] w-[95vw] max-w-[95vw] flex-col gap-0 p-0 sm:max-w-[95vw]">
        <DialogHeader className="px-5 pt-5 pb-3 space-y-1 border-b shrink-0">
          <DialogTitle className="text-base">
            Pengajuan Pinjaman Baru
          </DialogTitle>
          <DialogDescription>
            Mulai dengan mencari NIK nasabah. Riwayat pengajuannya muncul di
            sebelah kanan sebagai bahan pertimbangan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-5 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <NewNasabah
            onClosed={onClosed}
            submitUrl={route('transaction.store_buku_transaksi')}
            bebasTanggal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Create;
