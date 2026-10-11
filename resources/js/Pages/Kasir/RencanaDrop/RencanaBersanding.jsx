import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ArrowDown, ArrowUp, CheckCircle, XCircle } from 'lucide-react';
import { ribu } from '@/Pages/Kasir/Rekap/Components/TabelHarian';
// Palet sama dengan Rekap 1 & 2 (tanpa blok warna per kolom).
import { WARNA } from '@/Pages/Kasir/Rekap/Components/TableRekapKasir';

// Kolom SAMA di kedua sisi (kiri = hari D, kanan = pasangannya; kunci
// sisi kanan berawalan p_). [kunci, label, kelas?]
const KOLOM = [
  ['kasbon', 'Kasbon'],
  ['target', 'Target'],
  ['masuk', 'Masuk'],
  ['keluar', 'Keluar'],
  ['storting', 'Storting'],
  ['drop', 'Drop'],
  ['baru', 'Baru'],
  ['lama', 'Lama'],
  ['rencana', 'Rencana', 'font-semibold'],
];
const KIRI = KOLOM;
const KANAN = KOLOM.map(([k, ...rest]) => [`p_${k}`, ...rest]);

const jumlah = (rows, k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
// Senin minggu itu (dayjs: Minggu = 0).
const seninDari = (t) => dayjs(t).subtract((dayjs(t).day() + 6) % 7, 'day').format('YYYY-MM-DD');

// Panah naik/turun dibanding nilai sisi kiri (mis. target minggu depan vs hari ini).
const Panah = ({ ini, dulu }) =>
  ini > dulu ? (
    <ArrowUp className="inline w-3 h-3 mr-1 text-emerald-600" aria-label="naik" />
  ) : ini < dulu ? (
    <ArrowDown className="inline w-3 h-3 mr-1 text-rose-600" aria-label="turun" />
  ) : null;

/**
 * Satu tabel kecil: judul tanggal sendiri, baris per kelompok, total hijau.
 * banding: { kunciKanan: kunciKiri } -> panah naik/turun di kolom itu.
 * kolomKm: kolom "Cek KM" sesudah kolom terakhir (Rencana) - centang kalau hari
 * D sudah dicek KM, kalau belum silang + tombol ACC (onAcc -> drawer ACC KM).
 */
const Sisi = ({ judul, tanggal, rows, kolom, kosong, klik, warna, banding = {}, kolomKm = false, onAcc = null }) => (
  <div className="overflow-hidden bg-white border rounded-lg">
    <div className={`px-3 py-1.5 text-xs font-semibold ${warna}`}>
      {judul} · <span className="capitalize">{tanggal ? dayjs(tanggal).format('dddd, DD-MM-YYYY') : '—'}</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs tabular-nums">
        <thead className={WARNA.biru.kepala}>
          <tr className="h-8">
            <th className="px-3 py-1.5 font-medium text-left">Kel</th>
            {kolom.map(([k, label]) => (
              <th key={k} className="px-3 py-1.5 font-medium text-right whitespace-nowrap">
                {label}
              </th>
            ))}
            {kolomKm && <th className="px-3 py-1.5 font-medium text-center whitespace-nowrap">Cek KM</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            // Tinggi baris tetap (h-8) supaya baris kiri (ada tombol ACC) & kanan sejajar.
            <tr key={r.grouping_id} className={`h-8 border-t even:bg-slate-50 hover:bg-sky-50 ${kosong ? 'text-slate-400' : ''}`}>
              <td className="px-3 py-1 font-medium">{r.kelompok}</td>
              {kolom.map(([k, , kelas]) => {
                const v = kosong ? 0 : r[k];
                return (
                  <td key={k} className={`px-3 py-1 text-right whitespace-nowrap ${kelas ?? ''}`}>
                    {banding[k] && !kosong && <Panah ini={r[k]} dulu={r[banding[k]]} />}
                    {klik[k] && !kosong ? (
                      <button
                        type="button"
                        onClick={() => klik[k](r)}
                        className="text-sky-700 underline decoration-dotted hover:text-sky-900"
                      >
                        {ribu(v)}
                      </button>
                    ) : (
                      ribu(v)
                    )}
                  </td>
                );
              })}
              {kolomKm && (
                <td className="px-3 py-1">
                  {!kosong && (
                    <div className="flex items-center justify-center gap-1.5">
                      {r.cek_km ? (
                        // Kuning = ACC KM otomatis saat kunci kasir (belum dicek KM).
                        <CheckCircle
                          className={`w-4 h-4 ${r.kepala_otomatis ? 'text-amber-500' : 'text-green-500'}`}
                          aria-label={r.kepala_otomatis ? 'ACC KM otomatis saat kunci (belum dicek KM)' : 'Sudah dicek KM'}
                        />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <button
                            type="button"
                            onClick={() => onAcc?.(r)}
                            title="Belum dicek KM. Klik untuk ACC KM."
                            className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md text-sky-700 ring-1 ring-sky-300 bg-white hover:bg-sky-50"
                          >
                            ACC
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={`h-8 font-bold border-t text-slate-900 ${WARNA.hijau.total}`}>
            <td className="px-3 py-1.5">Total</td>
            {kolom.map(([k, , kelas]) => (
              <td key={k} className={`px-3 py-1.5 text-right whitespace-nowrap ${kelas ?? ''}`}>
                {banding[k] && !kosong && <Panah ini={jumlah(rows, k)} dulu={jumlah(rows, banding[k])} />}
                {ribu(kosong ? 0 : jumlah(rows, k))}
              </td>
            ))}
            {kolomKm && <td />}
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

/**
 * Rencana Drop bersanding, satu MINGGU per tampilan (chip minggu di atas).
 * Tiap tanggal D = dua tabel: kiri kegiatan D, kanan pasangannya (hari sama
 * minggu depan) dengan rencana yang diinput di D & drop yang jadi.
 * Tanggal sesudah hari ini belum punya isi -> kosongan.
 *
 * - data: [{ tanggal, data: [baris] }] - baris membawa `pasangan`
 * - klik: { kunci: (baris) => void }
 * - onAcc: (baris) => void - tombol ACC di kolom Cek KM
 */
const RencanaBersanding = ({ data, klik, onAcc }) => {
  const hariIni = dayjs().format('YYYY-MM-DD');

  const minggu = useMemo(() => {
    const g = {};
    data.forEach((d) => (g[seninDari(d.tanggal)] ??= []).push(d));
    return Object.entries(g).map(([senin, hari]) => ({ senin, hari }));
  }, [data]);

  // Bawaan: minggu yang memuat hari ini, atau minggu terakhir yang sudah lewat.
  const mingguAwal = () => {
    const lewat = minggu.filter((m) => m.senin <= hariIni);
    return (lewat[lewat.length - 1] ?? minggu[0])?.senin ?? null;
  };
  const [pilih, setPilih] = useState(mingguAwal);
  useEffect(() => setPilih(mingguAwal()), [minggu]); // eslint-disable-line react-hooks/exhaustive-deps
  const aktif = minggu.find((m) => m.senin === pilih) ?? minggu[0];

  if (!aktif) return <div className="py-6 text-sm text-center text-slate-500">Belum ada data.</div>;

  return (
    <>
      <p className="mb-1 text-xs text-slate-500">Pilih minggu</p>
      <div className="flex gap-1 pb-1 mb-3 overflow-x-auto scrollbar-thin sm:flex-wrap sm:overflow-visible">
        {minggu.map((m) => {
          const awal = m.hari[0].tanggal;
          const akhir = m.hari[m.hari.length - 1].tanggal;
          const ini = awal <= hariIni && hariIni <= akhir;
          return (
            <button
              key={m.senin}
              type="button"
              onClick={() => setPilih(m.senin)}
              className={`shrink-0 h-7 px-2.5 text-xs rounded-md border tabular-nums whitespace-nowrap transition-colors ${
                m.senin === aktif.senin
                  ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                  : ini
                    ? 'border-sky-500 text-sky-700 font-semibold bg-white hover:bg-sky-50'
                    : awal > hariIni
                      ? 'border-slate-200 text-slate-300 bg-white hover:bg-slate-50'
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
              }`}
            >
              {dayjs(awal).format('D')}–{dayjs(akhir).format('D MMM')}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {aktif.hari.map((item) => {
          const kosong = item.tanggal > hariIni;
          const pasangan = item.data[0]?.pasangan;
          return (
            // Satu pasangan = dua tabel bersebelahan (HP: atas-bawah).
            <div key={item.tanggal} className="grid gap-2 p-2 border rounded-xl bg-slate-100 lg:grid-cols-2">
              <Sisi
                judul="Hari pengajuan"
                tanggal={item.tanggal}
                rows={item.data}
                kolom={KIRI}
                kosong={kosong}
                klik={klik}
                warna={dayjs(item.tanggal).day() === 1 ? WARNA.merah.kepala : WARNA.biru.kepala}
                kolomKm
                onAcc={onAcc}
              />
              <Sisi
                judul="Hari drop"
                tanggal={pasangan}
                rows={item.data}
                kolom={KANAN}
                kosong={kosong}
                klik={klik}
                warna={WARNA.hijau.kepala}
                // Target minggu depan dibanding target hari ini.
                banding={{ p_target: 'target' }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RencanaBersanding;
