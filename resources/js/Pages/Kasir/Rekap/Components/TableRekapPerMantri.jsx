import React from 'react';
import dayjs from 'dayjs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion';
import { Wallet } from 'lucide-react';
import { ribu } from './TabelHarian';
import { Cek, KOLOM_HARIAN, WARNA_HARIAN } from './TableRekap';
import { WARNA } from './TableRekapKasir';

const jumlah = (rows, k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
// Kolom "Jml"/saldo itu angka berjalan - totalnya = baris terakhir, bukan jumlah.
const BERJALAN = new Set(['total_drop', 'total_storting', 'sirkulasi', 'total_angsuran_cm', 'saldo_cm', 'total_angsuran_mb', 'saldo_mb', 'total_angsuran_ml', 'saldo_ml']);

/**
 * Rekap Mantri: satu kelompok sebulan, satu baris per tanggal. Tampilan
 * seragam dengan Rekap 2 (kolom KOLOM_HARIAN, ribuan, Cek Staff / Cek Target).
 * Klik Storting -> buku angsuran hari itu, Drop -> buku drop, Cek Target ->
 * drawer ACC KM (hanya kalau onAcc diberikan). Cek Staff hanya status: mantri
 * tidak punya akses ke Rekap 1.
 */
const TableRekapPerMantri = ({ saldoAwalBulan = [], datas = [], onKlikStorting, onKlikDrop, onAcc }) => {
  const klik = { storting: onKlikStorting, drop: onKlikDrop };
  const akhir = datas[datas.length - 1] ?? {};

  return (
    <div>
      <Accordion type="single" collapsible className="mb-3 overflow-hidden bg-white border rounded-lg">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100 hover:no-underline data-[state=open]:border-b">
            <span className="flex items-center gap-3 font-semibold text-slate-900">
              <Wallet className="w-5 h-5 text-sky-600 shrink-0" aria-hidden="true" />
              Saldo Awal Bulan
            </span>
            <span className="ml-auto mr-2 text-xs font-normal text-slate-500">ribuan</span>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs tabular-nums">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 font-medium text-left">Hari</th>
                    <th className="px-3 py-2 font-medium text-right">Sirkulasi</th>
                    <th className="px-3 py-2 font-medium text-right">Saldo CM</th>
                    <th className="px-3 py-2 font-medium text-right">Saldo MB</th>
                    <th className="px-3 py-2 font-medium text-right">Saldo ML</th>
                  </tr>
                </thead>
                <tbody>
                  {saldoAwalBulan.map((s, i) => (
                    <tr key={i} className="border-t even:bg-slate-50 hover:bg-sky-50">
                      <td className="px-3 py-1.5 font-medium capitalize">{s.hari}</td>
                      <td className="px-3 py-1.5 text-right">{ribu(s.sirkulasi)}</td>
                      <td className="px-3 py-1.5 text-right">{ribu(s.sirkulasiCm)}</td>
                      <td className="px-3 py-1.5 text-right">{ribu(s.sirkulasiMb)}</td>
                      <td className="px-3 py-1.5 text-right">{ribu(s.sirkulasiMl)}</td>
                    </tr>
                  ))}
                </tbody>
                {saldoAwalBulan.length > 0 && (
                  <tfoot className="font-bold border-t-2 bg-slate-100 text-slate-900">
                    <tr>
                      <td className="px-3 py-2">Total</td>
                      {['sirkulasi', 'sirkulasiCm', 'sirkulasiMb', 'sirkulasiMl'].map((k) => (
                        <td key={k} className="px-3 py-2 text-right">
                          {ribu(jumlah(saldoAwalBulan, k))}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="max-h-[65vh] bg-white border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <table className="w-full text-xs tabular-nums">
          <thead className="sticky top-0 z-20 bg-slate-100 text-slate-700">
            <tr>
              <th className={`sticky left-0 z-20 px-3 py-2 font-medium text-left ${WARNA.biru.kepala}`}>Tanggal</th>
              {KOLOM_HARIAN.map(([k, label]) => (
                <th key={k} className={`px-3 py-2 font-medium text-right whitespace-nowrap ${WARNA_HARIAN[k]?.kepala ?? ''}`}>
                  {label}
                </th>
              ))}
              <th className="px-3 py-2 font-medium text-center whitespace-nowrap">Cek Staff</th>
              <th className="px-3 py-2 font-medium text-center whitespace-nowrap">Cek Target</th>
            </tr>
          </thead>
          <tbody>
            {datas.length === 0 && (
              <tr>
                <td colSpan={KOLOM_HARIAN.length + 3} className="py-6 text-center text-slate-500">
                  Belum ada data.
                </td>
              </tr>
            )}
            {datas.map((r) => (
              <tr
                key={r.tanggal}
                // Latar padat (bukan transparan): kolom Tanggal yang beku mewarisinya.
                // group: warna blok kolom (sama dengan Rekap 2) ikut selang-seling & hover.
                className={`group border-t hover:bg-sky-50 ${dayjs(r.tanggal).day() === 1 ? 'bg-rose-50' : 'bg-white even:bg-slate-50'}`}
              >
                <td
                  className={`sticky left-0 px-3 py-1 font-medium whitespace-nowrap ${
                    dayjs(r.tanggal).day() === 1 ? 'bg-rose-200' : WARNA.biru.sel
                  }`}
                >
                  {dayjs(r.tanggal).format('ddd, DD-MM')}
                </td>
                {KOLOM_HARIAN.map(([k, , kelas]) => (
                  <td key={k} className={`px-3 py-1 text-right ${WARNA_HARIAN[k]?.sel ?? ''} ${kelas ?? ''}`}>
                    {klik[k] ? (
                      <button
                        type="button"
                        onClick={() => klik[k](r)}
                        className="text-sky-700 underline decoration-dotted hover:text-sky-900"
                      >
                        {ribu(r[k])}
                      </button>
                    ) : (
                      ribu(r[k])
                    )}
                  </td>
                ))}
                <td className="px-3 py-1">
                  <Cek ok={r.status_approve_kasir} />
                </td>
                <td className="px-3 py-1">
                  <Cek ok={r.status_approve_kepala} otomatis={r.kepala_otomatis} onClick={onAcc && (() => onAcc(r))} />
                </td>
              </tr>
            ))}
          </tbody>
          {datas.length > 0 && (
            <tfoot className="sticky bottom-0 font-bold border-t-2 bg-emerald-50 text-slate-900">
              <tr>
                <td className={`sticky left-0 px-3 py-2 ${WARNA.biru.total}`}>Total</td>
                {KOLOM_HARIAN.map(([k, , kelas]) => (
                  <td key={k} className={`px-3 py-2 text-right ${WARNA_HARIAN[k]?.total ?? ''} ${kelas ?? ''}`}>
                    {ribu(BERJALAN.has(k) ? akhir[k] : jumlah(datas, k))}
                  </td>
                ))}
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default TableRekapPerMantri;
