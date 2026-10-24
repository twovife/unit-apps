import React from 'react';
import DeleteLoan from './DeleteLoan';
import { rp } from '@/lib/rupiah';


/**
 * Hapus Pinjaman dari modal Angsuran - khusus can-edit / superuser (koreksi).
 * Boleh / tidaknya dari server (AppHelper::canDeleteLoan, data.status).
 */
export default function HapusPinjamanKoreksi({ data, id, onClosed }) {
  if (!data) return null;

  return (
    <div className="p-3 mt-3 border border-red-200 rounded-lg bg-red-50/50">
      <div className="mb-1 text-sm font-semibold text-red-700">Hapus Pinjaman (koreksi)</div>
      <ul className="mb-2 space-y-0.5 text-xs list-disc list-inside text-slate-700">
        <li>
          Pinjaman ini beserta <b>{data.jumlah_angsuran} angsuran</b> (Rp {rp(data.total_angsuran)}) ikut terhapus dari buku
          angsuran.
        </li>
        {data.dari_pelunasan && (
          <li>
            Ini drop <b>pelunasan</b>: angsuran pelunasan pinjaman lama ikut terhapus, pinjaman lama kembali belum lunas.
          </li>
        )}
        {data.migrasi && <li>Kantor sudah migrasi: hari drop yang sudah dikunci dibuka otomatis (tercatat), kunci lagi lewat Rekap 1.</li>}
      </ul>
      {data.status ? (
        <div className="flex justify-end">
          <DeleteLoan id={id} onClosed={onClosed} />
        </div>
      ) : (
        <p className="text-xs font-medium text-amber-700">{data.message}</p>
      )}
    </div>
  );
}
