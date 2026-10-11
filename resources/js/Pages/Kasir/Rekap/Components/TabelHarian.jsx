import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

// Angka dipangkas ribuannya (1.300.000 -> 1.300).
export const ribu = (n) => new Intl.NumberFormat('id-ID').format(Math.round((Number(n) || 0) / 1000));

const jumlah = (rows, k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);

/**
 * Tabel harian sebulan (Rekap 2, Rencana Drop): satu pita per tanggal, baris
 * per kelompok, subtotal hijau. Chip "Lompat ke tanggal" di atas; saat data
 * datang otomatis loncat ke hari ini (atau hari kerja terakhir sebelumnya);
 * pita tanggal menempel di bawah header.
 *
 * - data: [{ tanggal, data: [baris] }]
 * - kolom: [[kunci, label, kelasTambahan?]]
 * - klik: { kunci: (baris) => void } - angkanya jadi tombol (termasuk 0)
 * - batasIsi: 'YYYY-MM-DD' - tanggal sesudahnya ditampilkan 0 (tabel kosongan)
 *   dan chip-nya pudar. Tanpa ini semua tanggal tampil apa adanya.
 * - ekstra: { kepala: [label], sel: (baris, tanggal, kosong) => [<td>] }
 */
const TabelHarian = ({ data = [], kolom, klik = {}, batasIsi = null, ekstra = null }) => {
  const kotak = useRef(null);
  const kepala = useRef(null);
  const deretChip = useRef(null);
  const [tinggiKepala, setTinggiKepala] = useState(0);
  const [aktif, setAktif] = useState(null);
  const hariIni = dayjs().format('YYYY-MM-DD');

  const loncat = (tgl, halus = true) => {
    const el = kotak.current?.querySelector(`[data-tanggal="${tgl}"]`);
    if (!el) return;
    const k = kotak.current;
    k.scrollTo({
      top: k.scrollTop + el.getBoundingClientRect().top - k.getBoundingClientRect().top - (kepala.current?.offsetHeight ?? 0),
      behavior: halus ? 'smooth' : 'auto',
    });
    setAktif(tgl);
  };

  // Chip aktif selalu kelihatan di deret yang digeser samping (HP).
  useEffect(() => {
    const d = deretChip.current;
    const c = d?.querySelector(`[data-chip="${aktif}"]`);
    if (c && d.scrollWidth > d.clientWidth) d.scrollLeft = c.offsetLeft - d.clientWidth / 2 + c.offsetWidth / 2;
  }, [aktif]);

  useEffect(() => {
    setTinggiKepala(kepala.current?.offsetHeight ?? 0);
    const sampaiHariIni = data.filter((d) => d.tanggal <= hariIni);
    if (sampaiHariIni.length) loncat(sampaiHariIni[sampaiHariIni.length - 1].tanggal, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const lebar = kolom.length + 1 + (ekstra?.kepala.length ?? 0);

  return (
    <>
      <p className="mb-1 text-xs text-slate-500">Lompat ke tanggal</p>
      {/* HP: satu baris geser samping; layar lebar: membungkus. */}
      <div ref={deretChip} className="relative flex gap-1 pb-1 mb-2 overflow-x-auto scrollbar-thin sm:flex-wrap sm:overflow-visible">
        {data.map((d) => (
          <button
            key={d.tanggal}
            type="button"
            data-chip={d.tanggal}
            onClick={() => loncat(d.tanggal)}
            title={dayjs(d.tanggal).format('dddd, DD MMMM YYYY')}
            className={`shrink-0 min-w-7 h-7 px-1.5 text-xs rounded-md border tabular-nums transition-colors ${
              aktif === d.tanggal
                ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                : d.tanggal === hariIni
                  ? 'border-sky-500 text-sky-700 font-semibold bg-white hover:bg-sky-50'
                  : d.tanggal > (batasIsi ?? hariIni)
                    ? 'border-slate-200 text-slate-300 bg-white hover:bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
            }`}
          >
            {dayjs(d.tanggal).date()}
          </button>
        ))}
      </div>
      <div
        ref={kotak}
        className="max-h-[65vh] bg-white border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin"
      >
        <table className="w-full text-xs tabular-nums">
          <thead ref={kepala} className="sticky top-0 z-20 bg-slate-100 text-slate-700">
            <tr>
              <th className="sticky left-0 z-20 px-3 py-2 font-medium text-left bg-slate-100">Kelompok</th>
              {kolom.map(([k, label]) => (
                <th key={k} className="px-3 py-2 font-medium text-right whitespace-nowrap">
                  {label}
                </th>
              ))}
              {ekstra?.kepala.map((label) => (
                <th key={label} className="px-3 py-2 font-medium text-center whitespace-nowrap">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={lebar} className="py-6 text-center text-slate-500">
                  Belum ada data.
                </td>
              </tr>
            )}
            {data.map((item) => {
              // Sesudah batas isi: tabel kosongan (semua 0), bukan angka
              // berjalan yang terbawa dari hari terakhir.
              const kosong = !!batasIsi && item.tanggal > batasIsi;
              const nilai = (r, k) => (kosong ? 0 : r[k]);
              return (
                <React.Fragment key={item.tanggal}>
                  <tr data-tanggal={item.tanggal}>
                    <td
                      colSpan={lebar}
                      style={{ top: tinggiKepala }}
                      className={`sticky z-10 px-3 py-1.5 font-semibold text-slate-800 ${
                        dayjs(item.tanggal).day() === 1 ? 'bg-rose-100' : 'bg-slate-200'
                      }`}
                    >
                      {dayjs(item.tanggal).format('dddd, DD-MM-YYYY')}
                    </td>
                  </tr>
                  {item.data.map((r) => (
                    <tr
                      key={r.id ?? r.grouping_id ?? r.kelompok}
                      // bg-white: kolom Kelompok yang beku mewarisi latar ini (jangan transparan).
                      className={`border-t bg-white even:bg-slate-50 hover:bg-sky-50 ${kosong ? 'text-slate-400' : ''}`}
                    >
                      <td className="sticky left-0 px-3 py-1 font-medium bg-inherit">{r.kelompok}</td>
                      {kolom.map(([k, , kelas]) => (
                        <td key={k} className={`px-3 py-1 text-right ${kelas ?? ''}`}>
                          {klik[k] && !kosong ? (
                            <button
                              type="button"
                              onClick={() => klik[k]({ ...r, tanggal: item.tanggal })}
                              className="text-sky-700 underline decoration-dotted hover:text-sky-900"
                              title={k === 'drop' ? 'Buka buku drop, tanggal ini disorot' : 'Buka buku angsuran tanggal ini'}
                            >
                              {ribu(r[k])}
                            </button>
                          ) : (
                            ribu(nilai(r, k))
                          )}
                        </td>
                      ))}
                      {ekstra?.sel(r, item.tanggal, kosong)}
                    </tr>
                  ))}
                  <tr className="font-bold border-t bg-emerald-50 text-slate-900">
                    <td className="sticky left-0 px-3 py-1.5 bg-emerald-50">Total</td>
                    {kolom.map(([k, , kelas]) => (
                      <td key={k} className={`px-3 py-1.5 text-right ${kelas ?? ''}`}>
                        {ribu(kosong ? 0 : jumlah(item.data, k))}
                      </td>
                    ))}
                    {ekstra && <td colSpan={ekstra.kepala.length} />}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TabelHarian;
