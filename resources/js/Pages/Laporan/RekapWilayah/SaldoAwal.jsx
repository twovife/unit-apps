import { angka, useModeRibuan } from '@/lib/modeAngka';
import { nilai, persen, persenTeks } from './kolom';

// Urutan kolom (permintaan mas 2026-11-24):
// Pemutihan | Drop Bln Lalu | Sirkulasi | Drop CM | CM | % | Drop MB | MB | % | ML | %
//
// atas/bagi = pembilang & penyebut kolom persen. Sama dengan tabel harian:
// CM & MB dibagi saldo lama masing-masing, ML dibagi sirkulasi awal.
const KOLOM = [
  { k: 'pemutihan', j: 'Pemutihan', ket: 'Pemutihan bulan lalu; keluarnya baru terlihat di saldo awal bulan ini' },
  { k: 'drop_bulan_lalu', j: 'Drop Bln Lalu', bulan: 'lalu' },
  { k: 'awal_sirkulasi', j: 'Sirkulasi', tebal: true },
  { k: 'drop_cm', j: 'Drop CM', bulan: 'cm' },
  { k: 'awal_cm', j: 'CM', tebal: true },
  { k: 'persen_cm', j: '%', atas: 'awal_cm', bagi: 'saldo_lama_cm' },
  { k: 'drop_mb', j: 'Drop MB', bulan: 'mb' },
  { k: 'awal_mb', j: 'MB', tebal: true },
  { k: 'persen_mb', j: '%', atas: 'awal_mb', bagi: 'saldo_lama_mb' },
  { k: 'awal_ml', j: 'ML', tebal: true },
  { k: 'persen_ml', j: '%', atas: 'awal_ml', bagi: 'awal_sirkulasi' },
];

// Yang ikut ringkasan saat panel tertutup.
const RINGKAS = ['awal_sirkulasi', 'awal_cm', 'persen_cm', 'awal_mb', 'persen_mb', 'awal_ml', 'persen_ml'];

/**
 * Sirkulasi awal bulan satu wilayah. Tertutup menampilkan total wilayah saja;
 * dibuka menampilkan tiap kantor.
 *
 * Saldo awalnya dari Rekap 2 (transaction_monthly_closings untuk kantor alur
 * baru, transaction_sirculations untuk alur lama) dan tetap sepanjang bulan,
 * jadi tidak ikut berubah saat mutasi harian diketik.
 *
 * Drop bulan lalu dihitung dari transaction_loans, bukan dari
 * transaction_monthly_closings.drop: closing hanya ada sejak Oktober 2026 dan
 * tidak dipelihara untuk kantor alur lama (lihat spec §6).
 *
 * Memakai <details> bawaan browser: buka-tutupnya tidak perlu state, dan
 * isinya tetap bisa dicari dengan Ctrl+F.
 */
export default function SaldoAwal({ baris, bulan, bulanLalu, bulanCm, bulanMb }) {
  useModeRibuan(); // ikut saklar ribuan di header

  const namaBulan = { lalu: bulanLalu, cm: bulanCm, mb: bulanMb };
  const total = (k) => baris.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);

  // Persen total wilayah dari jumlah pembilang / jumlah penyebut, bukan
  // rata-rata persen tiap kantor.
  const selTotal = (c) => (c.bagi ? persenTeks(persen(total(c.atas), total(c.bagi))) : angka(total(c.k)));
  const selBaris = (b, c) =>
    c.bagi ? persenTeks(persen(Number(nilai(b, c.atas)), Number(nilai(b, c.bagi)))) : angka(nilai(b, c.k));

  const ket = (c) => c.ket ?? (c.bulan ? `Jumlah drop ${namaBulan[c.bulan] ?? '-'}` : undefined);

  return (
    <details className="rounded-lg border bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-3 py-2 text-[12px] [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="font-semibold">Sirkulasi Awal {bulan}</span>
          {KOLOM.filter((c) => RINGKAS.includes(c.k)).map((c) => (
            <span key={c.k} className="tabular-nums">
              {!c.bagi && <span className="text-slate-500">{c.j} </span>}
              <span className={c.bagi ? 'text-slate-400' : 'font-medium'}>
                {c.bagi ? `(${selTotal(c)})` : selTotal(c)}
              </span>
            </span>
          ))}
          <span className="text-[11px] text-slate-400">klik untuk rincian {baris.length} kantor</span>
        </div>
      </summary>

      <div className="max-h-80 overflow-auto border-t">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              <th className="px-1.5 py-1 text-left text-[10px] font-semibold uppercase tracking-tight text-slate-500">
                Kantor
              </th>
              {KOLOM.map((c) => (
                <th
                  key={c.k}
                  title={ket(c)}
                  className="whitespace-nowrap px-1.5 py-1 text-right text-[10px] font-semibold uppercase tracking-tight text-slate-500"
                >
                  {c.j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baris.map((b) => (
              <tr key={b.branch_id} className="border-t hover:bg-slate-50">
                <td className="whitespace-nowrap px-1.5 py-0.5 font-medium">{b.unit}</td>
                {KOLOM.map((c) => (
                  <td
                    key={c.k}
                    className={`whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums ${c.tebal ? 'font-semibold' : 'text-slate-500'}`}
                  >
                    {selBaris(b, c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 border-t-2 bg-slate-100 font-semibold">
            <tr>
              <td className="px-1.5 py-1">Total Wilayah</td>
              {KOLOM.map((c) => (
                <td key={c.k} className="whitespace-nowrap px-1.5 py-1 text-right tabular-nums">
                  {selTotal(c)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}
