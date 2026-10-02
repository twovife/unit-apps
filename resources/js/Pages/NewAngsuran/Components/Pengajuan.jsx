import React, { useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import PengajuanLama from './PengajuanLama';

/**
 * Syarat pengajuan pelunasan (top-up/refinance): sisa saldo sudah kecil DAN
 * belum masuk kategori macet berat.
 *
 *  - saldo <= 40% dari pokok pinjaman (sudah bayar >= 60%)
 *  - status_pinjaman (kategori umur tunggakan) masih 'normal' atau 'cm' -
 *    'mb'/'ml' berarti sudah macet, tidak layak ditawari top-up.
 */
const canAjukanPengajuan = (triggeredPinjaman) => {
  const pinjaman = triggeredPinjaman?.pinjaman ?? 0;
  const saldo = triggeredPinjaman?.saldo ?? 0;
  if (pinjaman <= 0) return false;
  if (saldo / pinjaman > 0.4) return false;
  return ['normal', 'cm'].includes(triggeredPinjaman?.status_pinjaman);
};

/** Kartu kecil di bawah Input Angsuran: syarat belum terpenuhi -> keterangan, sudah -> tombol. */
const Pengajuan = ({ triggeredId, triggeredPinjaman, terkunci }) => {
  const [buka, setBuka] = useState(false);
  const boleh = canAjukanPengajuan(triggeredPinjaman);

  return (
    <div className="p-3 border rounded-lg">
      {!boleh ? (
        <p className="text-xs text-muted-foreground">Belum memenuhi syarat pengajuan pelunasan</p>
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
