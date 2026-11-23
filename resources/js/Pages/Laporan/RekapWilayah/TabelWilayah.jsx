import { BLOK, PECAHAN, SEMUA_KOLOM, angka, nilai, persen, persenTeks, tandaSelisih, turunan } from './kolom';

const awalBlok = new Set(BLOK.map((b) => b.kolom[0].k));

/**
 * Tabel Rekap Sirkulasi Wilayah: satu baris per kantor, lalu baris total.
 *
 * Staf kontrol mengetik langsung di sel (keputusan mas). Tabelnya 19 kolom dan
 * harus digeser ke kanan, jadi bahaya utamanya salah kolom. Penahannya:
 * kepala tabel menempel di atas, nama kolom di title tiap isian, sel yang
 * disorot menandai baris dan kolomnya, dan Enter pindah ke kantor berikutnya
 * di kolom yang sama.
 */
export default function TabelWilayah({ baris, kemarin, hariPertama, bolehUbah, onUbah }) {
  // Persen baris total dihitung dari jumlah pembilang / jumlah penyebut,
  // BUKAN rata-rata persen tiap kantor (rancangan §2).
  const jumlah = (k) => baris.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);
  const selTotal = (k) => {
    const p = PECAHAN[k];
    return p ? persenTeks(persen(jumlah(p[0]), jumlah(p[1]))) : angka(jumlah(k));
  };

  // Enter: pindah ke kantor berikutnya pada kolom yang sama. data-sel dipakai
  // supaya tidak perlu memasang ref untuk 32 x 14 isian.
  const keBawah = (e, indeks, k) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const berikut = baris[indeks + 1];
    if (berikut) document.querySelector(`[data-sel="${berikut.branch_id}|${k}"]`)?.focus();
  };

  const kepalaKolom = (k) =>
    `${BLOK.find((b) => b.kolom.some((x) => x.k === k)).judul} · ${SEMUA_KOLOM.find((x) => x.k === k).j}`;

  return (
    <div className="max-h-[75vh] overflow-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th rowSpan={2} className="sticky left-0 top-0 z-30 border-b bg-slate-100 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Kantor
            </th>
            {BLOK.map((b) => (
              <th key={b.judul} colSpan={b.kolom.length} className="sticky top-0 z-20 border-b border-l bg-slate-100 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {b.judul}
              </th>
            ))}
            <th rowSpan={2} className="sticky top-0 z-20 border-b border-l bg-slate-100 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Cek
            </th>
          </tr>
          <tr>
            {SEMUA_KOLOM.map((k) => (
              <th
                key={k.k}
                className={`sticky top-[33px] z-20 whitespace-nowrap border-b bg-slate-100 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${awalBlok.has(k.k) ? 'border-l' : ''}`}
              >
                {k.j}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {baris.map((b, i) => (
            <tr key={b.branch_id} className="group">
              <td className="sticky left-0 z-10 whitespace-nowrap border-b bg-white px-3 py-1 font-medium group-hover:bg-slate-50">
                {b.unit}
              </td>
              {SEMUA_KOLOM.map((k) => {
                const tanda = k.hitung ? null : tandaSelisih(b, kemarin?.[b.branch_id], k.k, hariPertama);
                const bisaKetik = bolehUbah && k.ketik && !b.terkunci;

                return (
                  <td
                    key={k.k}
                    title={tanda ?? undefined}
                    className={`whitespace-nowrap border-b px-1 py-1 text-right tabular-nums group-hover:bg-slate-50 ${awalBlok.has(k.k) ? 'border-l' : ''} ${tanda ? 'bg-amber-100' : ''}`}
                  >
                    {bisaKetik ? (
                      <input
                        data-sel={`${b.branch_id}|${k.k}`}
                        title={kepalaKolom(k.k)}
                        type="number"
                        inputMode="numeric"
                        value={nilai(b, k.k)}
                        onChange={(e) => onUbah(b.branch_id, k.k, e.target.value)}
                        onKeyDown={(e) => keBawah(e, i, k.k)}
                        onFocus={(e) => e.target.select()}
                        className={`w-28 rounded border-transparent bg-transparent px-2 py-1 text-right tabular-nums hover:border-slate-200 focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-200 ${k.tebal ? 'font-semibold' : ''}`}
                      />
                    ) : (
                      <span className={`block px-2 py-1 ${k.tebal ? 'font-semibold' : ''}`}>
                        {k.hitung ? persenTeks(turunan(b, k.k)) : angka(nilai(b, k.k))}
                      </span>
                    )}
                  </td>
                );
              })}
              <td className="whitespace-nowrap border-b border-l px-3 py-1 text-center text-xs text-slate-500 group-hover:bg-slate-50">
                {b.terkunci ? (
                  <span title={`${b.dicek_oleh ?? '-'} · ${b.dicek_pada ?? '-'}`}>✓ {b.dicek_oleh ?? '-'}</span>
                ) : (
                  <span className="text-slate-300">belum</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="sticky left-0 bottom-0 z-20 border-t-2 bg-slate-100 px-3 py-2">Total Wilayah</td>
            {SEMUA_KOLOM.map((k) => (
              <td
                key={k.k}
                className={`sticky bottom-0 whitespace-nowrap border-t-2 bg-slate-100 px-3 py-2 text-right tabular-nums ${awalBlok.has(k.k) ? 'border-l' : ''}`}
              >
                {selTotal(k.k)}
              </td>
            ))}
            <td className="sticky bottom-0 border-l border-t-2 bg-slate-100 px-3 py-2" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
