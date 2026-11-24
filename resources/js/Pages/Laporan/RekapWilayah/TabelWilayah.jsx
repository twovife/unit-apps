import { useState } from 'react';
import { angka as angkaMode, useModeRibuan } from '@/lib/modeAngka';
import { BLOK, KOLOM_TURUNAN, PECAHAN, SEMUA_KOLOM, nilai, persen, persenTeks, tandaSelisih, turunan } from './kolom';

const awalBlok = new Set(BLOK.map((b) => b.kolom[0].k));
const judulBlok = Object.fromEntries(BLOK.flatMap((b) => b.kolom.map((k) => [k.k, `${b.judul} · ${k.j}`])));

/**
 * Kotak isian satu sel. Dicontek dari IsianSel di Rekap 1
 * (resources/js/Pages/Kasir/Rekap/Components/TableRekapKasir.jsx): diketik
 * dalam RIBUAN (200 = 200.000), akhiran ".000" tampil saat sedang diisi,
 * Enter pindah, Escape membatalkan.
 */
function IsianSel({ baris, kolom, tersimpan, onUbah, onEnter }) {
  const penuh = !useModeRibuan();
  const awal = tersimpan == null ? '' : Number(tersimpan) / 1000;
  const [teks, setTeks] = useState(awal);
  const [diketik, setDiketik] = useState(false);

  // Belum pernah disimpan -> angka sistem, ditulis miring supaya kelihatan
  // belum dikonfirmasi kasir.
  const bawaan = !diketik && tersimpan == null;

  return (
    <div className="relative">
      <input
        data-sel={`${baris.branch_id}|${kolom}`}
        title={judulBlok[kolom] + (bawaan ? ' — angka sistem, belum dikonfirmasi kasir' : '')}
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        placeholder="0"
        value={teks}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          setTeks(e.target.value);
          setDiketik(true);
          onUbah(e.target.value === '' ? null : Math.round(Number(e.target.value) * 1000));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnter();
          }
          if (e.key === 'Escape') {
            setTeks(awal);
            setDiketik(false);
            onUbah(tersimpan);
          }
        }}
        className={`peer block w-full min-w-[4.5rem] rounded-none border-0 bg-sky-50/60 py-0.5 pl-1 text-right text-[11px] tabular-nums outline-none [appearance:textfield] focus:bg-white focus:ring-2 focus:ring-inset focus:ring-sky-500 [&::-webkit-inner-spin-button]:appearance-none ${penuh ? 'pr-7' : 'pr-1'} focus:pr-7 ${bawaan ? 'italic text-slate-400' : ''}`}
      />
      <span className={`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 peer-focus:block ${penuh ? 'block' : 'hidden'}`}>
        .000
      </span>
    </div>
  );
}

/**
 * Penanda TTD kasir / ACC KM: berapa kelompok dari seluruh kelompok kantor itu.
 * Lengkap -> hijau, sebagian -> kuning, belum ada -> kelabu.
 */
function Penanda({ nilai = 0, dari = 0, kiri = false }) {
  const warna = dari && nilai >= dari ? 'text-emerald-700' : nilai > 0 ? 'text-amber-600' : 'text-slate-300';

  return (
    <td className={`whitespace-nowrap border-b px-1.5 py-0.5 text-center text-[10px] tabular-nums group-hover:bg-slate-50 ${kiri ? 'border-l' : ''}`}>
      <span className={warna}>{nilai}/{dari}</span>
    </td>
  );
}

/**
 * Tabel Rekap Sirkulasi Wilayah: satu baris per kantor, lalu baris total.
 *
 * Yang diketik hanya mutasi hari itu (Drop, Storting, Angs CM/MB/ML).
 * Kumulatif dan saldo dihitung server dari mutasi sebulan, jadi di sini cuma
 * ditampilkan. Baris yang masih ada isian belum tersimpan ditandai, karena
 * kolom turunannya belum ikut berubah.
 */
export default function TabelWilayah({ baris, bolehUbah, onUbah, belumSimpan, onCek, onBuka, onLog, bulanCm, bulanMb }) {
  useModeRibuan(); // ikut berganti saat saklar ribuan di header diubah

  // Persen baris total dari jumlah pembilang / jumlah penyebut, BUKAN
  // rata-rata persen tiap kantor (rancangan §2).
  const jumlah = (k) => baris.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);
  const selTotal = (k) => {
    const p = PECAHAN[k];
    return p ? persenTeks(persen(jumlah(p[0]), jumlah(p[1]))) : angkaMode(jumlah(k));
  };

  // Enter: pindah ke kantor berikutnya pada kolom yang sama. data-sel dipakai
  // supaya tidak perlu memasang ref untuk 32 x 5 isian.
  const keBawah = (indeks, k) => {
    const berikut = baris[indeks + 1];
    if (berikut) document.querySelector(`[data-sel="${berikut.branch_id}|${k}"]`)?.focus();
  };

  // Saldo lama berasal dari drop bulan T-3 / T-4; bulannya ditulis di
  // keterangan sel supaya angkanya bisa ditelusuri.
  const ket = {
    persen_cm: `Saldo CM dibagi jumlah drop ${bulanCm ?? 'bulan CM'}`,
    persen_mb: `Saldo MB dibagi jumlah drop ${bulanMb ?? 'bulan MB'}`,
    persen_ml: 'Saldo ML dibagi sirkulasi hari ini',
  };

  const th = 'sticky z-20 whitespace-nowrap border-b bg-slate-100 px-1.5 py-1 text-[10px] font-semibold uppercase tracking-tight text-slate-500';

  return (
    <div className="max-h-[75vh] overflow-auto rounded-lg border bg-white shadow-sm">
      <table className="w-full border-separate border-spacing-0 text-[11px]">
        <thead>
          <tr>
            <th rowSpan={2} className={`${th} left-0 top-0 z-30 text-left`}>Kantor</th>
            {BLOK.map((b) => (
              <th key={b.judul} colSpan={b.kolom.length} className={`${th} top-0 border-l text-center`}>
                {b.judul}
              </th>
            ))}
            <th rowSpan={2} className={`${th} top-0 border-l text-center`} title="Berapa kelompok yang sudah di-TTD kasir">
              Kasir
            </th>
            <th rowSpan={2} className={`${th} top-0 text-center`} title="Berapa kelompok yang sudah di-ACC kepala mantri">
              KM
            </th>
            <th rowSpan={2} className={`${th} top-0 border-l text-center`}>Staf Kontrol</th>
          </tr>
          <tr>
            {SEMUA_KOLOM.map((k) => (
              <th key={k.k} className={`${th} top-[25px] text-right ${awalBlok.has(k.k) ? 'border-l' : ''}`}>
                {k.j}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {baris.map((b, i) => {
            const tertunda = belumSimpan?.has(b.branch_id);

            return (
              <tr key={b.branch_id} className="group">
                <td className="sticky left-0 z-10 whitespace-nowrap border-b bg-white px-1.5 py-0 font-medium group-hover:bg-slate-50">
                  {b.unit}
                </td>
                {SEMUA_KOLOM.map((k) => {
                  const tanda = k.hitung ? null : tandaSelisih(b, k.k);
                  const bisaKetik = bolehUbah && k.ketik && !b.terkunci;
                  // Turunan belum dihitung ulang selama isian belum disimpan.
                  const basi = tertunda && KOLOM_TURUNAN.has(k.k);

                  return (
                    <td
                      key={k.k}
                      title={basi ? 'Dihitung ulang setelah disimpan' : (ket[k.k] ?? tanda ?? undefined)}
                      className={`whitespace-nowrap border-b p-0 text-right tabular-nums group-hover:bg-slate-50 ${awalBlok.has(k.k) ? 'border-l' : ''} ${tanda ? 'bg-amber-100' : ''}`}
                    >
                      {bisaKetik ? (
                        <IsianSel
                          baris={b}
                          kolom={k.k}
                          tersimpan={b.diketik?.[k.k] ?? b.sistem?.[k.k] ?? null}
                          onUbah={(v) => onUbah(b.branch_id, k.k, v)}
                          onEnter={() => keBawah(i, k.k)}
                        />
                      ) : (
                        <span className={`block px-1.5 py-0.5 ${k.tebal ? 'font-semibold' : ''} ${basi ? 'text-slate-300' : ''}`}>
                          {k.hitung ? persenTeks(turunan(b, k.k)) : angkaMode(nilai(b, k.k))}
                        </span>
                      )}
                    </td>
                  );
                })}
                <Penanda nilai={b.ttd?.kasir} dari={b.ttd?.kelompok} kiri />
                <Penanda nilai={b.ttd?.km} dari={b.ttd?.kelompok} />
                <td className="whitespace-nowrap border-b border-l px-1.5 py-0.5 text-center text-[10px] text-slate-500 group-hover:bg-slate-50">
                  {b.terkunci ? (
                    <span className="inline-flex items-center gap-1">
                      <button type="button" onClick={() => onLog?.(b)} title={`${b.dicek_oleh ?? '-'} · ${b.dicek_pada ?? '-'}`} className="text-emerald-700 underline decoration-dotted">
                        ✓ {b.dicek_oleh ?? '-'}
                      </button>
                      {bolehUbah && (
                        <button type="button" onClick={() => onBuka?.(b)} className="text-sky-600 underline">
                          buka
                        </button>
                      )}
                    </span>
                  ) : bolehUbah ? (
                    <button type="button" onClick={() => onCek?.(b)} className="rounded border px-1.5 py-0.5 hover:bg-slate-100">
                      Cek
                    </button>
                  ) : (
                    <span className="text-slate-300">belum</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="sticky bottom-0 left-0 z-20 border-t-2 bg-slate-100 px-1.5 py-1">Total Wilayah</td>
            {SEMUA_KOLOM.map((k) => (
              <td key={k.k} className={`sticky bottom-0 whitespace-nowrap border-t-2 bg-slate-100 px-1.5 py-1 text-right tabular-nums ${awalBlok.has(k.k) ? 'border-l' : ''}`}>
                {selTotal(k.k)}
              </td>
            ))}
            <td className="sticky bottom-0 border-l border-t-2 bg-slate-100 px-1.5 py-1" />
            <td className="sticky bottom-0 border-t-2 bg-slate-100 px-1.5 py-1" />
            <td className="sticky bottom-0 border-l border-t-2 bg-slate-100 px-1.5 py-1" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
