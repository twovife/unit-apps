import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import { CheckCircle, Wallet, XCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

import TabelHarian, { ribu } from './TabelHarian';

// [kunci, label, kelas tambahan]. Saldo ditebalkan - angka yang dicocokkan.
const KOLOM_HARIAN = [
  ['drop', 'Drop'],
  ['total_drop', 'Jml Drop'],
  ['storting', 'Storting'],
  ['total_storting', 'Jml Storting'],
  ['sirkulasi', 'Sirkulasi', 'font-semibold'],
  ['angsuran_cm', 'Angs CM'],
  ['total_angsuran_cm', 'Jml CM'],
  ['saldo_cm', 'Saldo CM', 'font-semibold'],
  ['angsuran_mb', 'Angs MB'],
  ['total_angsuran_mb', 'Jml MB'],
  ['saldo_mb', 'Saldo MB', 'font-semibold'],
  ['angsuran_ml', 'Angs ML'],
  ['total_angsuran_ml', 'Jml ML'],
  ['saldo_ml', 'Saldo ML', 'font-semibold'],
];

// Belum dicek: silang + tombol ke tempat ngeceknya.
const Cek = ({ ok, href }) => (
  <div className="flex items-center justify-center gap-1.5">
    {ok ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <>
        <XCircle className="w-4 h-4 text-red-500" />
        <Link
          href={href}
          className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md text-sky-700 ring-1 ring-sky-300 bg-white hover:bg-sky-50 whitespace-nowrap"
        >
          Cek
        </Link>
      </>
    )}
  </div>
);

const TableRekap = ({
  setOnShowModal,
  saldoAwalBulan,
  setTriggeredData,
  datas,
  onKlikStorting = null,
  onKlikDrop = null,
}) => {
  const [data, setData] = useState([]);
  const [sirkulasiAwal, setSirkulasiAwal] = useState([]);
  // Baris saldo awal yang daftar pemutihannya sedang dibuka.
  const [pemutihan, setPemutihan] = useState(null);

  useEffect(() => {
    setData(datas);
    setSirkulasiAwal(saldoAwalBulan);
  }, [datas, saldoAwalBulan]);

  const calculateTotals = (data, keyToSum) => {
    const result = data.reduce(
      (acc, item) => acc + parseInt(item[keyToSum] ?? 0),
      0
    );
    return result;
  };

  return (
    <div>
      {/* Kartu lipat: berbingkai + ikon supaya jelas bisa diklik. */}
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
                    <th className="px-3 py-2 font-medium text-left">Kelompok</th>
                    <th className="px-3 py-2 font-medium text-right">Sirkulasi</th>
                    <th className="px-3 py-2 font-medium text-right">Saldo CM</th>
                    <th className="px-3 py-2 font-medium text-right">Saldo MB</th>
                    <th className="px-3 py-2 font-medium text-right">Saldo ML</th>
                  </tr>
                </thead>
                <tbody>
                  {(sirkulasiAwal ?? []).map((item, key) => (
                    <tr key={key} className="border-t even:bg-slate-50 hover:bg-sky-50">
                      <td className="px-3 py-1.5 font-medium">{item.kelompok}</td>
                      <td className="px-3 py-1.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.pemutihan > 0 && (
                            // Pemutihan bulan lalu keluar di saldo awal ini.
                            <button
                              type="button"
                              onClick={() => setPemutihan(item)}
                              title="Pemutihan bulan lalu - klik untuk lihat nasabahnya"
                              className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-amber-100 text-amber-800 ring-1 ring-amber-300 hover:bg-amber-200"
                            >
                              PMT {ribu(item.pemutihan)}
                            </button>
                          )}
                          {ribu(item.sirkulasi)}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-right">{ribu(item.sirkulasiCm)}</td>
                      <td className="px-3 py-1.5 text-right">{ribu(item.sirkulasiMb)}</td>
                      <td className="px-3 py-1.5 text-right">{ribu(item.sirkulasiMl)}</td>
                    </tr>
                  ))}
                </tbody>
                {(sirkulasiAwal ?? []).length > 0 && (
                  <tfoot className="font-bold border-t-2 bg-slate-100 text-slate-900">
                    <tr>
                      <td className="px-3 py-2">Total</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {calculateTotals(sirkulasiAwal, 'pemutihan') > 0 && (
                            <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-amber-100 text-amber-800 ring-1 ring-amber-300">
                              PMT {ribu(calculateTotals(sirkulasiAwal, 'pemutihan'))}
                            </span>
                          )}
                          {ribu(calculateTotals(sirkulasiAwal, 'sirkulasi'))}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'sirkulasiCm'))}</td>
                      <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'sirkulasiMb'))}</td>
                      <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'sirkulasiMl'))}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Dialog open={!!pemutihan} onOpenChange={(o) => !o && setPemutihan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pemutihan bulan lalu — Kelompok {pemutihan?.kelompok}</DialogTitle>
            <DialogDescription>
              Sudah keluar dari sirkulasi di saldo awal bulan ini. Total {ribu(pemutihan?.pemutihan)}.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-xs tabular-nums">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-medium text-left">Tgl Putih</th>
                  <th className="px-3 py-2 font-medium text-left">Nama</th>
                  <th className="px-3 py-2 font-medium text-left">Hari</th>
                  <th className="px-3 py-2 font-medium text-left">Drop</th>
                  <th className="px-3 py-2 font-medium text-right">Pinjaman</th>
                  <th className="px-3 py-2 font-medium text-right">Diputihkan</th>
                </tr>
              </thead>
              <tbody>
                {(pemutihan?.pemutihan_daftar ?? []).map((w, i) => (
                  <tr key={i} className="border-t even:bg-slate-50">
                    <td className="px-3 py-1.5 whitespace-nowrap">{dayjs(w.tanggal).format('DD-MM-YY')}</td>
                    <td className="px-3 py-1.5">{w.nama ?? '—'}</td>
                    <td className="px-3 py-1.5 capitalize">{w.hari ?? '—'}</td>
                    <td className="px-3 py-1.5 whitespace-nowrap">{w.drop_date ? dayjs(w.drop_date).format('DD-MM-YY') : '—'}</td>
                    <td className="px-3 py-1.5 text-right">{ribu(w.pinjaman)}</td>
                    <td className="px-3 py-1.5 font-semibold text-right">{ribu(w.nominal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <TabelHarian
        data={data ?? []}
        kolom={KOLOM_HARIAN}
        klik={{ storting: onKlikStorting, drop: onKlikDrop }}
        nolkanMasaDepan
        ekstra={{
          kepala: ['Cek Staff', 'Cek Target'],
          sel: (r, tanggal, kosong) => [
            // Cek Staff = kunci kasir di Rekap 1.
            <td key="staf" className="px-3 py-1">
              {!kosong && <Cek ok={r.status_approve_kasir} href={route('kasir.rekap.rekap_satu', { date: tanggal })} />}
            </td>,
            // Cek Target = drawer ACC KM di Buku Transaksi (tanggal -> hari & bulan).
            <td key="target" className="px-3 py-1">
              {!kosong && (
                <Cek
                  ok={r.status_approve_kepala}
                  href={route('transaction.index_buku_transaksi', { kelompok: r.kelompok, date: tanggal, acc: 1 })}
                />
              )}
            </td>,
          ],
        }}
      />
    </div>
  );
};

export default TableRekap;
