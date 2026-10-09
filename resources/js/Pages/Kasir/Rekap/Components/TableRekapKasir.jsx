import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { router, usePage } from '@inertiajs/react';

// Rekap 1 (dan Rekap per Mantri): angka dalam ribuan. Grup kolom mengikuti
// buku kasir: REKAP 1 (kasbon s/d tunai), titipan 9%, SU Lapangan, Sisa Uang,
// lalu -/+.
const GRUP = [
  {
    judul: 'REKAP 1',
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
  // Grup STORTING (cash / transfer / katrol) disembunyikan dulu (mas
  // 2026-10-09); datanya masih dikirim server: storting_cash/_transfer/_katrol.
  // Uang yang dibawa pulang mantri (setoran_tunai).
  { judul: '', kolom: [['su_lapangan', 'SU Lapangan', 'font-semibold']] },
  // Setoran lewat transfer (setoran_transfer).
  { judul: '', kolom: [['setoran_transfer', 'Setor Transfer']] },
  // Titipan 9% + Tunai.
  { judul: '', kolom: [['sisa_uang', 'Sisa Uang', 'font-semibold']] },
  // SU Lapangan - Sisa Uang: merah = kurang, hijau = lebih.
  { judul: '', kolom: [['selisih_uang', '-/+', 'font-bold', true]] },
];
const KOLOM = GRUP.flatMap((g) => g.kolom);
// Kolom yang bisa diisi kasir -> nama kolom di daily_closings.
// Rekap 1: kasir mengisi kasbon, transport, SU Lapangan, setor transfer.
const KOLOM_ISI = {
  kasbon: 'kasbon',
  transport: 'transport',
  su_lapangan: 'setoran_tunai',
  setoran_transfer: 'setoran_transfer',
};

const ribu = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const ribuBertanda = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const Angka = ({ n, bertanda = false }) => {
  if (!Number(n)) return <span className="text-slate-300">–</span>;
  if (!bertanda) return ribu.format(Number(n) / 1000);
  return (
    <span className={Number(n) < 0 ? 'text-red-600' : 'text-emerald-700'}>{ribuBertanda.format(Number(n) / 1000)}</span>
  );
};

/**
 * Kotak isian kasir di Rekap 1 (kasbon, transport, SU Lapangan, setor
 * transfer): memenuhi sel, untuk kantor alur baru & hari belum dikunci.
 * Diketik dalam RIBUAN (200 = 200.000, 37,5 = 37.500); "000" tampil sebagai
 * akhiran. Bawaan & kosong = 0. Enter / pindah kotak menyimpan, hanya kalau
 * kasir benar-benar mengetik.
 */
const IsianSel = ({ r, k, kolom }) => {
  const keRibu = (v) => (v ? Number(v) / 1000 : 0);
  const awal = keRibu(r[k]);
  const [nilai, setNilai] = useState(awal);
  const [diketik, setDiketik] = useState(false);
  useEffect(() => {
    setNilai(keRibu(r[k]));
    setDiketik(false);
  }, [r[k]]);
  const simpan = () => {
    if (!diketik) return;
    setDiketik(false);
    const baru = Math.round((nilai === '' ? 0 : Number(nilai)) * 1000);
    if (baru === Number(r[k] ?? 0)) return;
    router.post(
      route('kasir.rekap.simpan_su_lapangan'),
      { id: r.id, date: r.tanggal, kolom, nilai: baru },
      { preserveScroll: true, preserveState: true },
    );
  };
  return (
    <div className="relative h-full">
      <input
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        placeholder="0"
        onFocus={(e) => e.currentTarget.select()}
        className="block w-full h-full min-w-[7rem] py-1.5 pl-2 pr-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-right text-sm bg-sky-50/60 border-0 rounded-none outline-none tabular-nums focus:bg-white focus:ring-2 focus:ring-inset focus:ring-sky-500"
        value={nilai}
        onChange={(e) => {
          setNilai(e.target.value);
          setDiketik(true);
        }}
        onBlur={simpan}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          if (e.key === 'Escape') {
            setNilai(awal);
            setDiketik(false);
          }
        }}
      />
      <span className="absolute text-xs -translate-y-1/2 pointer-events-none right-2 top-1/2 text-slate-400">.000</span>
    </div>
  );
};

const TableRekapKasir = ({ datas = [] }) => {
  const { auth, server_filter } = usePage().props;
  // Sel isian aktif: kantor alur baru, baris harian, belum dikunci kasir.
  const bisaIsiSu = (r) =>
    server_filter?.migrasi && r.type == 'daily' && !r.status_approve_kasir && auth?.permissions?.includes('can-approve');
  const total = Object.fromEntries(
    KOLOM.map(([k]) => [k, datas.reduce((a, r) => a + (Number(r[k]) || 0), 0)]),
  );
  // Batas tebal di awal tiap grup supaya grup terbaca sebagai blok.
  const awalGrup = new Set(GRUP.map((g) => g.kolom[0][0]));
  const garis = (k) => (awalGrup.has(k) ? 'border-l-2 border-slate-300' : '');

  const terkunci = server_filter?.migrasi ? datas.filter((r) => r.type == 'daily' && r.status_approve_kasir).length : 0;

  return (
    <>
    {terkunci > 0 && (
      <div className="p-2 mb-2 text-sm border rounded-md border-slate-300 bg-slate-50 text-slate-700">
        {terkunci === datas.length
          ? 'Tanggal ini sudah dikunci kasir — isian tidak bisa diubah.'
          : `${terkunci} kelompok sudah dikunci kasir — isiannya tidak bisa diubah.`}
      </div>
    )}
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
              {KOLOM.map(([k, , kelas, bertanda]) => (
                <td
                  key={k}
                  className={`${KOLOM_ISI[k] && bisaIsiSu(r) ? 'p-0' : 'px-3 py-1.5'} text-right ${garis(k)} ${kelas ?? ''}`}
                >
                  {KOLOM_ISI[k] && bisaIsiSu(r) ? (
                    <IsianSel r={r} k={k} kolom={KOLOM_ISI[k]} />
                  ) : (
                    <Angka n={r[k]} bertanda={bertanda} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {datas.length > 0 && (
          <tfoot className="font-bold border-t-2 bg-slate-100 text-slate-900">
            <tr>
              <td className="sticky left-0 px-3 py-2 text-left bg-slate-100">Total</td>
              {KOLOM.map(([k, , , bertanda]) => (
                <td key={k} className={`px-3 py-2 text-right ${garis(k)}`}>
                  <Angka n={total[k]} bertanda={bertanda} />
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
    </>
  );
};

export default TableRekapKasir;
