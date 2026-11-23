import { angka, useModeRibuan } from '@/lib/modeAngka';
import { nilai, persen, persenTeks } from './kolom';

const EMBER = [
  ['awal_sirkulasi', 'Sirkulasi'],
  ['awal_cm', 'Calon Macet'],
  ['awal_mb', 'Macet Baru'],
  ['awal_ml', 'Macet Lama'],
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
  const persenMacet = (k) => persenTeks(persen(total(k), total('awal_sirkulasi')));

  return (
    <details className="rounded-lg border bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-3 py-2 text-[12px] [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="font-semibold">Sirkulasi Awal {bulan}</span>
          {EMBER.map(([k, j]) => (
            <span key={k} className="tabular-nums">
              <span className="text-slate-500">{j} </span>
              <span className="font-medium">{angka(total(k))}</span>
              {k !== 'awal_sirkulasi' && <span className="text-slate-400"> ({persenMacet(k)})</span>}
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
              {EMBER.map(([k, j]) => (
                <th key={k} className="px-1.5 py-1 text-right text-[10px] font-semibold uppercase tracking-tight text-slate-500">
                  {j}
                </th>
              ))}
              <th className="px-1.5 py-1 text-right text-[10px] font-semibold uppercase tracking-tight text-slate-500">% Macet</th>
            </tr>
          </thead>
          <tbody>
            {baris.map((b) => (
              <tr key={b.branch_id} className="border-t hover:bg-slate-50">
                <td className="whitespace-nowrap px-1.5 py-0.5 font-medium">{b.unit}</td>
                {EMBER.map(([k]) => (
                  <td key={k} className="whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums">
                    {angka(nilai(b, k))}
                  </td>
                ))}
                {/* Macet = CM + MB + ML dibanding sirkulasi awal. */}
                <td className="whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums">
                  {persenTeks(
                    persen(
                      Number(nilai(b, 'awal_cm')) + Number(nilai(b, 'awal_mb')) + Number(nilai(b, 'awal_ml')),
                      Number(nilai(b, 'awal_sirkulasi')),
                    ),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 border-t-2 bg-slate-100 font-semibold">
            <tr>
              <td className="px-1.5 py-1">Total Wilayah</td>
              {EMBER.map(([k]) => (
                <td key={k} className="whitespace-nowrap px-1.5 py-1 text-right tabular-nums">
                  {angka(total(k))}
                </td>
              ))}
              <td className="whitespace-nowrap px-1.5 py-1 text-right tabular-nums">
                {persenTeks(
                  persen(total('awal_cm') + total('awal_mb') + total('awal_ml'), total('awal_sirkulasi')),
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}
