import { useState } from 'react';
import { angka, useModeRibuan } from '@/lib/modeAngka';

// Susunan kolom mengikuti tabel wilayah: mutasi lalu kumulatif/saldo, dipisah
// per blok. Bedanya di sini barisnya kelompok, bukan kantor.
const BLOK = [
  {
    judul: 'Sirkulasi',
    kolom: [
      ['drop', 'Drop'],
      ['total_drop', 'Jml Drop'],
      ['storting', 'Storting'],
      ['total_storting', 'Jml Storting'],
      ['sirkulasi', 'Saldo', true],
    ],
  },
  { judul: 'Calon Macet', kolom: [['angsuran_cm', 'Angs'], ['saldo_cm', 'Saldo', true]] },
  { judul: 'Macet Baru', kolom: [['angsuran_mb', 'Angs'], ['saldo_mb', 'Saldo', true]] },
  { judul: 'Macet Lama', kolom: [['angsuran_ml', 'Angs'], ['saldo_ml', 'Saldo', true]] },
];

const KOLOM = BLOK.flatMap((b) => b.kolom);
const AWAL_BLOK = new Set(BLOK.map((b) => b.kolom[0][0]));

// Yang dijumlah sebulan. Kumulatif & saldo TIDAK dijumlah: yang berlaku angka
// hari terakhir, karena sudah kumulatif sejak awal bulan.
const DIJUMLAH = new Set(['drop', 'storting', 'angsuran_cm', 'angsuran_mb', 'angsuran_ml']);

const tgl = (t) => new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

const ringkas = (hari, k) =>
  DIJUMLAH.has(k) ? hari.reduce((t, h) => t + h[k], 0) : (hari[hari.length - 1]?.[k] ?? 0);

/** Satu kelompok: tertutup menampilkan sebulan, dibuka per tanggal. */
function BlokKelompok({ k, sorot }) {
  const [buka, setBuka] = useState(false);

  return (
    <>
      <tr className="border-t bg-slate-50">
        <td className="sticky left-0 z-10 whitespace-nowrap bg-slate-50 px-1.5 py-1">
          <button type="button" onClick={() => setBuka((b) => !b)} className="font-medium hover:text-sky-700">
            {buka ? '▾' : '▸'} Kelompok {k.kelompok}
          </button>
        </td>
        {KOLOM.map(([kol, , tebal]) => (
          <td
            key={kol}
            className={`whitespace-nowrap px-1.5 py-1 text-right tabular-nums ${tebal ? 'font-semibold' : 'font-medium'} ${AWAL_BLOK.has(kol) ? 'border-l' : ''}`}
          >
            {angka(ringkas(k.hari, kol))}
          </td>
        ))}
        <td className="border-l px-1.5 py-1 text-center text-[10px] text-slate-500">
          {k.hari.filter((h) => h.kasir).length}/{k.hari.length}
        </td>
        <td className="px-1.5 py-1 text-center text-[10px] text-slate-500">
          {k.hari.filter((h) => h.km).length}/{k.hari.length}
        </td>
      </tr>

      {buka && (
        <tr className="border-t bg-white text-[10px] text-slate-500">
          <td className="sticky left-0 z-10 whitespace-nowrap bg-white py-0.5 pl-6 pr-1.5">Awal bulan</td>
          {KOLOM.map(([kol]) => (
            <td key={kol} className={`whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums ${AWAL_BLOK.has(kol) ? 'border-l' : ''}`}>
              {{ sirkulasi: k.awal_sirkulasi, saldo_cm: k.awal_cm, saldo_mb: k.awal_mb, saldo_ml: k.awal_ml }[kol] !== undefined
                ? angka({ sirkulasi: k.awal_sirkulasi, saldo_cm: k.awal_cm, saldo_mb: k.awal_mb, saldo_ml: k.awal_ml }[kol])
                : ''}
            </td>
          ))}
          <td className="border-l" />
          <td />
        </tr>
      )}

      {buka &&
        k.hari.map((h) => (
          <tr key={h.tanggal} className={h.tanggal === sorot ? 'bg-sky-50' : ''}>
            <td className={`sticky left-0 z-10 whitespace-nowrap py-0.5 pl-6 pr-1.5 text-slate-500 ${h.tanggal === sorot ? 'bg-sky-50' : 'bg-white'}`}>
              {tgl(h.tanggal)}
            </td>
            {KOLOM.map(([kol, , tebal]) => (
              <td
                key={kol}
                className={`whitespace-nowrap px-1.5 py-0.5 text-right tabular-nums ${tebal ? 'font-semibold' : ''} ${AWAL_BLOK.has(kol) ? 'border-l' : ''}`}
              >
                {angka(h[kol])}
              </td>
            ))}
            <td className={`border-l px-1.5 py-0.5 text-center ${h.kasir ? 'text-emerald-700' : 'text-slate-300'}`}>
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
 * Rekap 2 satu kantor, dibuka dari nama kantor di tabel wilayah.
 *
 * Isinya sebulan penuh per kelompok: mutasi, kumulatif, dan saldo berjalan —
 * susunan kolom yang sama dengan tabel wilayah, cuma barisnya kelompok.
 * Kelompok tertutup menampilkan sebulan; dibuka menampilkan saldo awal lalu
 * tiap tanggal, dengan tanggal yang tadi diklik disorot.
 *
 * Angkanya dari sumber yang sama dengan baris kantornya (AngkaRekapWilayah),
 * jadi baris "Jumlah kantor" selalu cocok dengan tabel di belakang drawer —
 * .agents/uji/uji_kelompok_bulan.php menjaganya.
 */
export default function DrawerKelompok({ judul, sorot, isi, onTutup }) {
  useModeRibuan();

  const th = 'whitespace-nowrap bg-slate-100 px-1.5 py-1 text-right text-[10px] font-semibold uppercase tracking-tight text-slate-500';
  const semua = isi?.kelompok ?? [];

  const total = (kol) =>
    DIJUMLAH.has(kol)
      ? semua.reduce((t, k) => t + ringkas(k.hari, kol), 0)
      : semua.reduce((t, k) => t + (k.hari[k.hari.length - 1]?.[kol] ?? 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onTutup}>
      <div
        className="max-h-[85vh] w-full max-w-5xl overflow-auto rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold">Rekap 2 · {judul}</h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Sebulan penuh per kelompok. Klik nama kelompok untuk melihat saldo awal dan tiap tanggalnya. Kumulatif dan
          saldo tidak dijumlah — yang berlaku angka hari terakhir.
        </p>

        {!isi ? (
          <p className="mt-2 text-sm text-slate-500">Memuat…</p>
        ) : semua.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Kantor ini tidak punya kelompok.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-[11px]">
              <thead>
                <tr>
                  <th rowSpan={2} className={`${th} sticky left-0 z-20 text-left`}>Kelompok</th>
                  {BLOK.map((b) => (
                    <th key={b.judul} colSpan={b.kolom.length} className={`${th} border-l text-center`}>
                      {b.judul}
                    </th>
                  ))}
                  <th rowSpan={2} className={`${th} border-l text-center`} title="Hari yang sudah di-TTD kasir">Kasir</th>
                  <th rowSpan={2} className={`${th} text-center`} title="Hari yang sudah di-ACC kepala mantri">KM</th>
                </tr>
                <tr>
                  {KOLOM.map(([kol, j]) => (
                    <th key={kol} className={`${th} ${AWAL_BLOK.has(kol) ? 'border-l' : ''}`}>{j}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semua.map((k) => (
                  <BlokKelompok key={k.kelompok} k={k} sorot={sorot} />
                ))}
              </tbody>
              <tfoot className="font-semibold">
                <tr>
                  <td className="sticky left-0 z-10 whitespace-nowrap border-t-2 bg-slate-100 px-1.5 py-1">Jumlah kantor</td>
                  {KOLOM.map(([kol]) => (
                    <td
                      key={kol}
                      className={`whitespace-nowrap border-t-2 bg-slate-100 px-1.5 py-1 text-right tabular-nums ${AWAL_BLOK.has(kol) ? 'border-l' : ''}`}
                    >
                      {angka(total(kol))}
                    </td>
                  ))}
                  <td className="border-l border-t-2 bg-slate-100" />
                  <td className="border-t-2 bg-slate-100" />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
