import { BLOK, PECAHAN, SEMUA_KOLOM, angka, nilai, persen, persenTeks, turunan } from './kolom';

/**
 * Tabel Rekap Sirkulasi Wilayah: satu baris per kantor, lalu baris total.
 * Header dua lapis — lapis pertama nama blok, lapis kedua nama kolom.
 */
export default function TabelWilayah({ baris }) {
  // Persen baris total dihitung dari jumlah pembilang / jumlah penyebut,
  // BUKAN rata-rata persen tiap kantor (rancangan §2).
  const jumlah = (k) => baris.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);

  const selTotal = (k) => {
    const p = PECAHAN[k];
    return p ? persenTeks(persen(jumlah(p[0]), jumlah(p[1]))) : angka(jumlah(k));
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th rowSpan={2} className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Kantor
            </th>
            {BLOK.map((b) => (
              <th key={b.judul} colSpan={b.kolom.length} className="border-l px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {b.judul}
              </th>
            ))}
            <th rowSpan={2} className="border-l px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Cek
            </th>
          </tr>
          <tr>
            {BLOK.flatMap((b, bi) =>
              b.kolom.map((k, ki) => (
                <th
                  key={k.k}
                  className={`whitespace-nowrap px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${ki === 0 && bi >= 0 ? 'border-l' : ''}`}
                >
                  {k.j}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {baris.map((b) => (
            <tr key={b.branch_id} className="hover:bg-slate-50">
              <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 font-medium hover:bg-slate-50">{b.unit}</td>
              {SEMUA_KOLOM.map((k, i) => (
                <td
                  key={k.k}
                  className={`whitespace-nowrap px-3 py-2 text-right tabular-nums ${k.tebal ? 'font-semibold' : ''} ${BLOK.some((bl) => bl.kolom[0].k === k.k) && i > 0 ? 'border-l' : ''}`}
                >
                  {k.hitung ? persenTeks(turunan(b, k.k)) : angka(nilai(b, k.k))}
                </td>
              ))}
              <td className="whitespace-nowrap border-l px-3 py-2 text-center text-xs text-slate-500">
                {b.terkunci ? (
                  <span title={`${b.dicek_oleh ?? '-'} · ${b.dicek_pada ?? '-'}`}>✓ {b.dicek_oleh ?? '-'}</span>
                ) : (
                  <span className="text-slate-300">belum</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 bg-slate-50 font-semibold">
          <tr>
            <td className="sticky left-0 z-10 bg-slate-50 px-3 py-2">Total Wilayah</td>
            {SEMUA_KOLOM.map((k, i) => (
              <td
                key={k.k}
                className={`whitespace-nowrap px-3 py-2 text-right tabular-nums ${BLOK.some((bl) => bl.kolom[0].k === k.k) && i > 0 ? 'border-l' : ''}`}
              >
                {selTotal(k.k)}
              </td>
            ))}
            <td className="border-l px-3 py-2" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
