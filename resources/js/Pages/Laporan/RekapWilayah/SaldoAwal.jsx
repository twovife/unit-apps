import { Fragment } from 'react';
import { angka, useModeRibuan } from '@/lib/modeAngka';
import { nilai, persen, persenTeks } from './kolom';

// bagi = penyebut persennya, sama dengan tabel harian: CM & MB dibagi saldo
// lama masing-masing, ML dibagi sirkulasi.
const EMBER = [
  { k: 'awal_sirkulasi', j: 'Sirkulasi' },
  { k: 'awal_cm', j: 'Calon Macet', bagi: 'saldo_lama_cm' },
  { k: 'awal_mb', j: 'Macet Baru', bagi: 'saldo_lama_mb' },
  { k: 'awal_ml', j: 'Macet Lama', bagi: 'awal_sirkulasi' },
];

/**
 * Sirkulasi awal bulan satu wilayah. Tertutup menampilkan total wilayah saja;
 * dibuka menampilkan tiap kantor.
 *
 * Angkanya dari Rekap 2 (transaction_monthly_closings untuk kantor alur baru,
 * transaction_sirculations untuk alur lama), dan tetap sepanjang bulan — jadi
 * tidak ikut berubah saat mutasi harian diketik.
 *
 * Memakai <details> bawaan browser: buka-tutupnya tidak perlu state, dan
 * isinya tetap bisa dicari dengan Ctrl+F.
 */
export default function SaldoAwal({ baris, bulan }) {
  useModeRibuan(); // ikut saklar ribuan di header

  const total = (k) => baris.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);
  // Persen total wilayah dari jumlah pembilang / jumlah penyebut, bukan
  // rata-rata persen tiap kantor.
  const persenTotal = (e) => (e.bagi ? persenTeks(persen(total(e.k), total(e.bagi))) : null);
  const persenBaris = (b, e) => (e.bagi ? persenTeks(persen(Number(nilai(b, e.k)), Number(nilai(b, e.bagi)))) : null);

  return (
    <details className="rounded-lg border bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-3 py-2 text-[12px] [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="font-semibold">Sirkulasi Awal {bulan}</span>
          {EMBER.map((e) => (
            <span key={e.k} className="tabular-nums">
              <span className="text-slate-500">{e.j} </span>
              <span className="font-medium">{angka(total(e.k))}</span>
              {e.bagi && <span className="text-slate-400"> ({persenTotal(e)})</span>}
            </span>
          ))}
          <span className="text-[11px] text-slate-400">klik untuk rincian {baris.length} kantor</span>
        </div>
      </summary>

      <div className="max-h-80 overflow-auto border-t">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              <th className="px-1.5 py-1 text-left text-[10px] font-semibold uppercase tracking-tight text-slate-500">Kantor</th>
              {EMBER.map((e) => (
                <th key={e.k} colSpan={e.bagi ? 2 : 1} className="px-1.5 py-1 text-right text-[10px] font-semibold uppercase tracking-tight text-slate-500">
                  {e.j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baris.map((b) => (
              <tr key={b.branch_id} className="border-t hover:bg-slate-50">
                <td className="whitespace-nowrap px-1.5 py-0.5 font-medium">{b.unit}</td>
                {EMBER.map((e) => (
                  <Fragment key={e.k}>
                    <td className="whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums">{angka(nilai(b, e.k))}</td>
                    {e.bagi && (
                      <td className="whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums text-slate-500">
                        {persenBaris(b, e)}
                      </td>
                    )}
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 border-t-2 bg-slate-100 font-semibold">
            <tr>
              <td className="px-1.5 py-1">Total Wilayah</td>
              {EMBER.map((e) => (
                <Fragment key={e.k}>
                  <td className="whitespace-nowrap px-1.5 py-1 text-right tabular-nums">{angka(total(e.k))}</td>
                  {e.bagi && <td className="whitespace-nowrap px-1.5 py-1 text-right tabular-nums">{persenTotal(e)}</td>}
                </Fragment>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}
