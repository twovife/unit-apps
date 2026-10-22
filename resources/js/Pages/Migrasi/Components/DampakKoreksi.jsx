import React from 'react';
import dayjs from 'dayjs';
import { rp } from '@/lib/rupiah';

const LABEL = {
  awal_month1: 'Awal M1',
  awal_month2: 'Awal M2',
  awal_ccm: 'Awal CCM',
  awal_cm: 'Awal CM',
  awal_mb: 'Awal MB',
  awal_ml: 'Awal ML',
  awal_total: 'Awal total',
  akhir_total: 'Akhir total',
};

/** Dampak koreksi ke baris bulanan: hanya baris & kolom yang berubah. */
const DampakKoreksi = ({ dampak = [] }) => {
  if (!dampak.length) {
    return <div className="text-sm text-slate-500">Tidak ada saldo bulanan yang berubah.</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-xs tabular-nums">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-2 py-1.5 font-medium text-left">Bulan</th>
            <th className="px-2 py-1.5 font-medium text-left">Kel · Hari</th>
            <th className="px-2 py-1.5 font-medium text-left">Kolom</th>
            <th className="px-2 py-1.5 font-medium text-right">Sebelum</th>
            <th className="px-2 py-1.5 font-medium text-right">Sesudah</th>
            <th className="px-2 py-1.5 font-medium text-right">Selisih</th>
          </tr>
        </thead>
        <tbody>
          {dampak.flatMap((d) =>
            Object.entries(d.kolom).map(([k, [a, b]], i) => (
              <tr key={`${d.periode}-${d.kelompok}-${d.hari}-${k}`} className="border-t">
                <td className="px-2 py-1 whitespace-nowrap">{i === 0 ? dayjs(`${d.periode}-01`).format('MMM YYYY') : ''}</td>
                <td className="px-2 py-1 capitalize whitespace-nowrap">{i === 0 ? `${d.kelompok} · ${d.hari}` : ''}</td>
                <td className={`px-2 py-1 whitespace-nowrap ${k.startsWith('awal_') && k !== 'awal_total' ? 'font-semibold' : ''}`}>
                  {LABEL[k] ?? k}
                </td>
                <td className="px-2 py-1 text-right">{rp(a)}</td>
                <td className="px-2 py-1 text-right">{rp(b)}</td>
                <td className={`px-2 py-1 text-right font-semibold ${b - a > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {b - a > 0 ? '+' : ''}
                  {rp(b - a)}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DampakKoreksi;
