import { useState } from 'react';
import { angka, useModeRibuan } from '@/lib/modeAngka';

// Mutasi saja. Kumulatif dan saldo milik baris kantornya, bukan kelompoknya.
const KOLOM = [
  ['drop', 'Drop'],
  ['storting', 'Storting'],
  ['angsuran_cm', 'Angs CM'],
  ['angsuran_mb', 'Angs MB'],
  ['angsuran_ml', 'Angs ML'],
];

const tgl = (t) => new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

const jumlahHari = (hari, k) => hari.reduce((t, h) => t + h[k], 0);

/** Satu kelompok: tertutup menampilkan jumlah sebulan, dibuka per tanggal. */
function BlokKelompok({ k, sorot }) {
  const [buka, setBuka] = useState(false);

  return (
    <>
      <tr className="border-t bg-slate-50">
        <td className="px-1.5 py-1">
          <button
            type="button"
            onClick={() => setBuka((b) => !b)}
            className="font-medium hover:text-sky-700"
          >
            {buka ? '▾' : '▸'} Kelompok {k.kelompok}
          </button>
        </td>
        {KOLOM.map(([kol]) => (
          <td key={kol} className="whitespace-nowrap px-1.5 py-1 text-right font-medium tabular-nums">
            {angka(jumlahHari(k.hari, kol))}
          </td>
        ))}
        <td className="px-1.5 py-1 text-center text-[10px] text-slate-500">
          {k.hari.filter((h) => h.kasir).length}/{k.hari.length}
        </td>
        <td className="px-1.5 py-1 text-center text-[10px] text-slate-500">
          {k.hari.filter((h) => h.km).length}/{k.hari.length}
        </td>
      </tr>

      {buka &&
        k.hari.map((h) => (
          <tr key={h.tanggal} className={`border-t ${h.tanggal === sorot ? 'bg-sky-50' : ''}`}>
            <td className="whitespace-nowrap py-0.5 pl-6 pr-1.5 text-slate-500">{tgl(h.tanggal)}</td>
            {KOLOM.map(([kol]) => (
              <td key={kol} className="whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums">
                {angka(h[kol])}
              </td>
            ))}
            <td className={`px-1.5 py-0.5 text-center ${h.kasir ? 'text-emerald-700' : 'text-slate-300'}`}>
              {h.kasir ? '✓' : '–'}
            </td>
            <td className={`px-1.5 py-0.5 text-center ${h.km ? 'text-emerald-700' : 'text-slate-300'}`}>
              {h.km ? '✓' : '–'}
            </td>
          </tr>
        ))}
    </>
  );
}

/**
 * Rincian angka sistem satu kantor SEBULAN, per kelompok.
 *
 * Yang dibuka dari nama kantor di tabel wilayah. Angkanya dari sumber yang
 * sama dengan baris kantornya (AngkaRekapWilayah), jadi baris "Jumlah kantor"
 * di bawah selalu cocok dengan tabel di belakang drawer ini —
 * .agents/uji/uji_kelompok_bulan.php menjaganya.
 *
 * Tanggal yang diklik disorot biru. Tanggal yang belum terjadi tidak dikirim.
 */
export default function DrawerKelompok({ judul, sorot, isi, onTutup }) {
  useModeRibuan();

  const th = 'whitespace-nowrap px-1.5 py-1 text-right text-[10px] font-semibold uppercase tracking-tight text-slate-500';
  const semua = isi?.kelompok ?? [];
  const total = (kol) => semua.reduce((t, k) => t + jumlahHari(k.hari, kol), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onTutup}>
      <div
        className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold">Rincian per kelompok · {judul}</h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Angka sistem (Rekap 2) sebulan, per kelompok. Klik nama kelompok untuk melihat per tanggal.
        </p>

        {!isi ? (
          <p className="mt-2 text-sm text-slate-500">Memuat…</p>
        ) : semua.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Kantor ini tidak punya kelompok.</p>
        ) : (
          <table className="mt-2 w-full text-[11px]">
            <thead className="bg-slate-100">
              <tr>
                <th className={`${th} text-left`}>Kelompok</th>
                {KOLOM.map(([, j]) => (
                  <th key={j} className={th}>{j}</th>
                ))}
                <th className={`${th} text-center`} title="Hari yang sudah di-TTD kasir">Kasir</th>
                <th className={`${th} text-center`} title="Hari yang sudah di-ACC kepala mantri">KM</th>
              </tr>
            </thead>
            <tbody>
              {semua.map((k) => (
                <BlokKelompok key={k.kelompok} k={k} sorot={sorot} />
              ))}
            </tbody>
            <tfoot className="border-t-2 bg-slate-100 font-semibold">
              <tr>
                <td className="px-1.5 py-1">Jumlah kantor</td>
                {KOLOM.map(([kol]) => (
                  <td key={kol} className="whitespace-nowrap px-1.5 py-1 text-right tabular-nums">
                    {angka(total(kol))}
                  </td>
                ))}
                <td className="px-1.5 py-1" />
                <td className="px-1.5 py-1" />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
