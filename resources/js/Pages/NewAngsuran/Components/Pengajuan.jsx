import React, { useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import PengajuanLama from './PengajuanLama';

/**
 * Kartu kecil di bawah Input Angsuran: sudah ada pengajuan berjalan ->
 * ringkasan + Batalkan pengajuan; syarat belum terpenuhi -> keterangan,
 * sudah -> tombol. Syaratnya dihitung server (TransactionLoan::
 * alasanTolakPengajuan), aturan yang sama dengan saat pengajuan disimpan.
 */
const Pengajuan = ({ triggeredId, triggeredPinjaman, terkunci }) => {
  const [buka, setBuka] = useState(false);
  const alasan = triggeredPinjaman?.alasan_tolak_pengajuan;
  const boleh = !alasan;

  // Sudah ada pengajuan pelunasan yang berjalan (open/acc): kartu langsung
  // menampilkan pengajuan itu + tombol Batalkan pengajuan.
  if (triggeredPinjaman?.pengajuan_pengganti) {
    return (
      <div className="p-3 border rounded-lg border-amber-300 bg-amber-50/40">
        <PengajuanLama isActive triggeredId={triggeredId} triggeredPinjaman={triggeredPinjaman} />
      </div>
    );
  }

  return (
    <div className="p-3 border rounded-lg">
      {!boleh ? (
        <p className="text-xs text-muted-foreground">
          Belum memenuhi syarat pengajuan pelunasan
          <span className="block text-[11px] opacity-80">{alasan}</span>
        </p>
      ) : terkunci ? (
        <p className="text-xs text-muted-foreground">{terkunci}</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Memenuhi syarat pengajuan pelunasan</span>
            <Button size="sm" variant={buka ? 'green' : 'outline'} onClick={() => setBuka((v) => !v)}>
              Pengajuan
            </Button>
          </div>
          {buka && (
            <div className="mt-3">
              <PengajuanLama isActive triggeredId={triggeredId} triggeredPinjaman={triggeredPinjaman} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pengajuan;
