import React from 'react';
import dayjs from 'dayjs';

// Rekap 1 (dan Rekap per Mantri): angka dalam ribuan. Grup kolom mengikuti
// buku kasir: TUNAI 1 (kasbon s/d tunai), titipan 9%, STORTING per cara
// bayar, lalu SU Lapangan.
const GRUP = [
  {
    judul: 'TUNAI 1',
    kolom: [
      ['kasbon', 'Kasbon'],
      ['storting', 'Storting'],
      ['do11', 'DO 11%'],
      ['debit', 'Debit'],
      ['drop', 'Drop'],
      ['transport', 'Transport'],
      ['kredit', 'Kredit'],
      ['tunai', 'Tunai', 'font-semibold'],
    ],
  },
  { judul: '', kolom: [['titipan9', 'Titipan 9%']] },
  {
    judul: 'STORTING',
    kolom: [
      ['storting_cash', 'Cash'],
      ['storting_transfer', 'Transfer'],
      ['storting_katrol', 'Katrol'],
    ],
  },
  // Uang yang dibawa pulang mantri (setoran_mantri).
  { judul: '', kolom: [['su_lapangan', 'SU Lapangan', 'font-semibold']] },
];
const KOLOM = GRUP.flatMap((g) => g.kolom);

const ribu = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const Angka = ({ n }) => (Number(n) ? ribu.format(Number(n) / 1000) : <span className="text-slate-300">–</span>);

const TableRekapKasir = ({ datas = [] }) => {
  const total = Object.fromEntries(
    KOLOM.map(([k]) => [k, datas.reduce((a, r) => a + (Number(r[k]) || 0), 0)]),
  );
  // Batas tebal di awal tiap grup supaya grup terbaca sebagai blok.
  const awalGrup = new Set(GRUP.map((g) => g.kolom[0][0]));
  const garis = (k) => (awalGrup.has(k) ? 'border-l-2 border-slate-300' : '');

  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="w-full text-sm tabular-nums">
        <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700">
          <tr>
            <th rowSpan={2} className="sticky left-0 z-20 px-3 py-2 text-left bg-slate-100">
              Kelompok
            </th>
            {GRUP.map((g, i) => (
              <th
                key={i}
                colSpan={g.kolom.length}
                rowSpan={g.judul ? 1 : 2}
                className={`px-3 py-1.5 text-center font-bold tracking-wide border-l-2 border-slate-300 ${
                  g.judul ? 'border-b' : 'align-bottom font-medium'
                }`}
              >
                {g.judul || g.kolom[0][1]}
              </th>
            ))}
          </tr>
          <tr>
            {GRUP.filter((g) => g.judul).flatMap((g) =>
              g.kolom.map(([k, label]) => (
                <th key={k} className={`px-3 py-1.5 text-right font-medium whitespace-nowrap ${garis(k)}`}>
                  {label}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          {datas.length === 0 && (
            <tr>
              <td colSpan={KOLOM.length + 1} className="py-6 text-center text-slate-500">
                Belum ada data.
              </td>
            </tr>
          )}
          {datas.map((r, i) => (
            <tr key={i} className="bg-white border-t even:bg-slate-50 hover:bg-sky-50">
              <td className="sticky left-0 px-3 py-1.5 font-medium text-left bg-inherit whitespace-nowrap">
                {r.type == 'daily' ? r.kelompok : dayjs(r.tanggal).format('DD-MM')}
              </td>
              {KOLOM.map(([k, , kelas]) => (
                <td key={k} className={`px-3 py-1.5 text-right ${garis(k)} ${kelas ?? ''}`}>
                  <Angka n={r[k]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {datas.length > 0 && (
          <tfoot className="font-bold border-t-2 bg-slate-100 text-slate-900">
            <tr>
              <td className="sticky left-0 px-3 py-2 text-left bg-slate-100">Total</td>
              {KOLOM.map(([k]) => (
                <td key={k} className={`px-3 py-2 text-right ${garis(k)}`}>
                  <Angka n={total[k]} />
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default TableRekapKasir;
