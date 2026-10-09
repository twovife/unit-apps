import React, { useState } from 'react';
import dayjs from 'dayjs';
import { router, usePage } from '@inertiajs/react';

// Rekap 1 (dan Rekap per Mantri): angka dalam ribuan. Grup kolom mengikuti
// buku kasir: TUNAI 1 (kasbon s/d tunai), titipan 9%, SU Lapangan, Sisa Uang,
// lalu -/+.
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
  // Grup STORTING (cash / transfer / katrol) disembunyikan dulu (mas
  // 2026-10-09); datanya masih dikirim server: storting_cash/_transfer/_katrol.
  // Uang yang dibawa pulang mantri (setoran_mantri).
  { judul: '', kolom: [['su_lapangan', 'SU Lapangan', 'font-semibold']] },
  // Titipan 9% + Tunai.
  { judul: '', kolom: [['sisa_uang', 'Sisa Uang', 'font-semibold']] },
  // SU Lapangan - Sisa Uang: merah = kurang, hijau = lebih.
  { judul: '', kolom: [['selisih_uang', '-/+', 'font-bold', true]] },
];
const KOLOM = GRUP.flatMap((g) => g.kolom);

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
 * Sel SU Lapangan yang bisa diisi kasir (kantor alur baru, hari belum dikunci).
 * Klik -> ketik nominal penuh (rupiah) -> Enter / klik di luar menyimpan,
 * Esc batal. Kosong = belum dicatat.
 */
const SelSuLapangan = ({ r }) => {
  const [ubah, setUbah] = useState(false);
  const [nilai, setNilai] = useState('');
  const simpan = () => {
    setUbah(false);
    const baru = nilai === '' ? null : Number(nilai);
    if (baru === (r.su_lapangan ?? null)) return;
    router.post(
      route('kasir.rekap.simpan_su_lapangan'),
      { id: r.id, date: r.tanggal, su_lapangan: baru },
      { preserveScroll: true, preserveState: true },
    );
  };
  if (ubah) {
    return (
      <input
        autoFocus
        type="number"
        min={0}
        className="w-28 h-7 px-1.5 text-right text-sm border rounded border-sky-400"
        value={nilai}
        onChange={(e) => setNilai(e.target.value)}
        onBlur={simpan}
        onKeyDown={(e) => {
          if (e.key === 'Enter') simpan();
          if (e.key === 'Escape') setUbah(false);
        }}
      />
    );
  }
  return (
    <button
      type="button"
      title="Klik untuk mengisi SU Lapangan (rupiah penuh)"
      className="px-1 rounded hover:bg-sky-100 underline decoration-dotted decoration-sky-400"
      onClick={() => {
        setNilai(r.su_lapangan ?? '');
        setUbah(true);
      }}
    >
      {r.su_lapangan === null || r.su_lapangan === undefined ? <span className="text-sky-600">isi</span> : <Angka n={r.su_lapangan} />}
    </button>
  );
};

const TableRekapKasir = ({ datas = [] }) => {
  const { auth, server_filter } = usePage().props;
  // SU Lapangan bisa diisi: kantor alur baru, baris harian, belum dikunci kasir.
  const bisaIsiSu = (r) =>
    server_filter?.migrasi && r.type == 'daily' && !r.status_approve_kasir && auth?.permissions?.includes('can-approve');
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
              {KOLOM.map(([k, , kelas, bertanda]) => (
                <td key={k} className={`px-3 py-1.5 text-right ${garis(k)} ${kelas ?? ''}`}>
                  {k === 'su_lapangan' && bisaIsiSu(r) ? <SelSuLapangan r={r} /> : <Angka n={r[k]} bertanda={bertanda} />}
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
  );
};

export default TableRekapKasir;
