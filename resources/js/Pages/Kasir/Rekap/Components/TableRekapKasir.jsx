import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { router, usePage } from '@inertiajs/react';

// Rekap 1 (dan Rekap per Mantri): angka dalam ribuan. Urutan kolom mengikuti
// buku kasir: kasbon s/d tunai, titipan 9%, SU Lapangan, Sisa Uang,
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
  // Titipan 9% + Tunai.
  { judul: '', kolom: [['sisa_uang', 'Sisa Uang', 'font-semibold']] },
  // Grup STORTING (cash / transfer / katrol) disembunyikan dulu (mas
  // 2026-10-09); datanya masih dikirim server: storting_cash/_transfer/_katrol.
  // Uang yang dibawa pulang mantri (setoran_tunai).
  { judul: '', kolom: [['su_lapangan', 'SU Lapangan', 'font-semibold']] },
  // Setoran lewat transfer (setoran_transfer).
  { judul: '', kolom: [['setoran_transfer', 'Setor Transfer']] },
  // Katrolan diketik kasir (setoran_katrol), ikut -/+.
  { judul: '', kolom: [['setoran_katrol', 'Katrolan']] },
  // SU Lapangan - Sisa Uang: merah = kurang, hijau = lebih.
  { judul: '', kolom: [['selisih_uang', '-/+', 'font-bold', true]] },
];
const KOLOM = GRUP.flatMap((g) => g.kolom);
// Warna blok kolom (selang-seling tetap: ganjil/genap beda tua): Kasbon s/d
// Tunai kuning, Sisa Uang hijau, -/+ merah.
const WARNA = {
  kuning: { sel: 'bg-amber-50 group-even:bg-amber-100 group-hover:bg-amber-200', kepala: 'bg-amber-200 text-amber-900', total: 'bg-amber-200' },
  hijau: { sel: 'bg-emerald-50 group-even:bg-emerald-100 group-hover:bg-emerald-200', kepala: 'bg-emerald-200 text-emerald-900', total: 'bg-emerald-200' },
  merah: { sel: 'bg-rose-50 group-even:bg-rose-100 group-hover:bg-rose-200', kepala: 'bg-rose-200 text-rose-900', total: 'bg-rose-200' },
};
const WARNA_KOLOM = {
  ...Object.fromEntries(GRUP[0].kolom.map(([k]) => [k, WARNA.kuning])),
  sisa_uang: WARNA.hijau,
  selisih_uang: WARNA.merah,
};
// Kolom yang bisa diisi kasir -> nama kolom di daily_closings.
// Rekap 1: kasir mengisi kasbon, transport, SU Lapangan, setor transfer.
// Angka bawaan setoran yang belum diisi kasir: storting hari itu per cara
// bayar. Tampil abu-abu miring; dibekukan saat kunci kasir.
const BAWAAN = { su_lapangan: 'storting_cash', setoran_transfer: 'storting_transfer', setoran_katrol: 'storting_katrol' };
const KOLOM_ISI = {
  kasbon: 'kasbon',
  transport: 'transport',
  su_lapangan: 'setoran_tunai',
  setoran_transfer: 'setoran_transfer',
  setoran_katrol: 'setoran_katrol',
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
 * akhiran saat kotak sedang diisi. Bawaan & kosong = 0. Enter / pindah kotak menyimpan, hanya kalau
 * kasir benar-benar mengetik.
 */
const IsianSel = ({ r, k, kolom, kuning = false }) => {
  const keRibu = (v) => (v ? Number(v) / 1000 : 0);
  // Belum diisi kasir -> angka bawaan dari angsuran (kalau kolom ini punya).
  const pakaiBawaan = (r[k] === null || r[k] === undefined) && BAWAAN[k];
  const awal = keRibu(pakaiBawaan ? r[BAWAAN[k]] : r[k]);
  const [nilai, setNilai] = useState(awal);
  const [diketik, setDiketik] = useState(false);
  useEffect(() => {
    setNilai(awal);
    setDiketik(false);
  }, [r[k], pakaiBawaan ? r[BAWAAN[k]] : null]);
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
        title={pakaiBawaan && !diketik ? 'Angka sistem (dari angsuran) — belum dikonfirmasi kasir' : undefined}
        className={`${pakaiBawaan && !diketik ? 'italic text-slate-400' : ''} peer block w-full h-full min-w-[7rem] py-1.5 pl-2 pr-2 focus:pr-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-right text-sm ${kuning ? 'bg-transparent' : 'bg-sky-50/60'} border-0 rounded-none outline-none tabular-nums focus:bg-white focus:ring-2 focus:ring-inset focus:ring-sky-500`}
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
      {/* Akhiran .000 hanya saat mengetik. */}
      <span className="absolute hidden text-xs -translate-y-1/2 pointer-events-none right-2 top-1/2 text-slate-400 peer-focus:block">.000</span>
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
            <th className="sticky left-0 z-20 px-3 py-2 text-left bg-slate-100">Kelompok</th>
            {KOLOM.map(([k, label]) => (
              <th
                key={k}
                className={`px-3 py-2 font-medium text-right whitespace-nowrap ${WARNA_KOLOM[k]?.kepala ?? ''}`}
              >
                {label}
              </th>
            ))}
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
            <tr key={i} className="bg-white border-t group even:bg-slate-50 hover:bg-sky-50">
              <td className="sticky left-0 px-3 py-1.5 font-medium text-left bg-inherit whitespace-nowrap">
                {r.type == 'daily' ? r.kelompok : dayjs(r.tanggal).format('DD-MM')}
              </td>
              {KOLOM.map(([k, , kelas, bertanda]) => (
                <td
                  key={k}
                  className={`${KOLOM_ISI[k] && bisaIsiSu(r) ? 'p-0' : 'px-3 py-1.5'} text-right ${WARNA_KOLOM[k]?.sel ?? ''} ${kelas ?? ''}`}
                >
                  {KOLOM_ISI[k] && bisaIsiSu(r) ? (
                    <IsianSel r={r} k={k} kolom={KOLOM_ISI[k]} kuning={!!WARNA_KOLOM[k]} />
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
                <td key={k} className={`px-3 py-2 text-right ${WARNA_KOLOM[k]?.total ?? ''}`}>
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
