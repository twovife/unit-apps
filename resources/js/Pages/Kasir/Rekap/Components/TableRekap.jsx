import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import { CheckCircle, Wallet, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

// Angka dipangkas ribuannya (1.300.000 -> 1.300).
const ribu = (n) => new Intl.NumberFormat('id-ID').format(Math.round((Number(n) || 0) / 1000));

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

const Cek = ({ ok }) => (
  <div className="flex justify-center">
    {ok ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
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
  // Angka yang bisa diklik -> drawer buku-nya, tanggal ini disorot.
  const KLIK = { storting: onKlikStorting, drop: onKlikDrop };
  const [data, setData] = useState([]);
  const [sirkulasiAwal, setSirkulasiAwal] = useState([]);
  // Baris saldo awal yang daftar pemutihannya sedang dibuka.
  const [pemutihan, setPemutihan] = useState(null);

  // Loncat tanggal: chip di atas tabel menggulir kotak tabel ke pita tanggal
  // itu; saat data datang, otomatis ke hari ini (atau hari kerja terakhir
  // sebelumnya). Pita tanggal menempel tepat di bawah header.
  const kotak = useRef(null);
  const kepala = useRef(null);
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
  useEffect(() => {
    setTinggiKepala(kepala.current?.offsetHeight ?? 0);
    // Sesudah `data` (state) dirender, supaya pita tanggalnya sudah ada di DOM.
    const sampaiHariIni = (data ?? []).filter((d) => d.tanggal <= hariIni);
    if (sampaiHariIni.length) loncat(sampaiHariIni[sampaiHariIni.length - 1].tanggal, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
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
              Sudah keluar dari sirkulasi di saldo awal bulan ini. Total {ribu(pemutihan?.pemutihan)}. Angka dalam ribuan.
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

      {/* Tabel harian: satu pita per tanggal, baris per kelompok, subtotal. */}
      <div className="flex flex-wrap items-center gap-1 mb-2">
        {(data ?? []).map((d) => {
          const lewat = d.tanggal > hariIni;
          return (
            <button
              key={d.tanggal}
              type="button"
              onClick={() => loncat(d.tanggal)}
              title={dayjs(d.tanggal).format('dddd, DD MMMM YYYY')}
              className={`min-w-7 h-7 px-1.5 text-xs rounded-md border tabular-nums transition-colors ${
                aktif === d.tanggal
                  ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                  : d.tanggal === hariIni
                    ? 'border-sky-500 text-sky-700 font-semibold bg-white hover:bg-sky-50'
                    : lewat
                      ? 'border-slate-200 text-slate-300 bg-white hover:bg-slate-50'
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
              }`}
            >
              {dayjs(d.tanggal).date()}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-slate-500">Angka dalam ribuan.</span>
      </div>
      <div ref={kotak} className="max-h-[65vh] bg-white border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <table className="w-full text-xs tabular-nums">
          <thead ref={kepala} className="sticky top-0 z-20 bg-slate-100 text-slate-700">
            <tr>
              <th className="sticky left-0 z-20 px-3 py-2 font-medium text-left bg-slate-100">Kelompok</th>
              {KOLOM_HARIAN.map(([k, label]) => (
                <th key={k} className="px-3 py-2 font-medium text-right whitespace-nowrap">
                  {label}
                </th>
              ))}
              <th className="px-3 py-2 font-medium text-center whitespace-nowrap">Cek Staff</th>
              <th className="px-3 py-2 font-medium text-center whitespace-nowrap">Cek Target</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((item) => {
              // Tanggal yang belum tiba: tabel kosongan (semua 0), bukan
              // angka berjalan yang terbawa dari hari terakhir.
              const kosong = dayjs(item.tanggal).isAfter(dayjs(), 'day');
              const nilai = (r, k) => (kosong ? 0 : r[k]);
              return (
              <React.Fragment key={item.tanggal}>
                <tr data-tanggal={item.tanggal}>
                  <td
                    colSpan={KOLOM_HARIAN.length + 3}
                    style={{ top: tinggiKepala }}
                    className={`sticky z-10 px-3 py-1.5 font-semibold text-slate-800 ${
                      dayjs(item.tanggal).day() === 1 ? 'bg-rose-100' : 'bg-slate-200'
                    }`}
                  >
                    {dayjs(item.tanggal).format('dddd, DD-MM-YYYY')}
                  </td>
                </tr>
                {item.data.map((r) => (
                  <tr key={r.id} className={`border-t even:bg-slate-50 hover:bg-sky-50 ${kosong ? 'text-slate-400' : ''}`}>
                    <td className="sticky left-0 px-3 py-1 font-medium bg-inherit">{r.kelompok}</td>
                    {KOLOM_HARIAN.map(([k, , kelas]) => (
                      <td key={k} className={`px-3 py-1 text-right ${kelas ?? ''}`}>
                        {KLIK[k] && Number(nilai(r, k)) ? (
                          <button
                            type="button"
                            onClick={() => KLIK[k]({ ...r, tanggal: item.tanggal })}
                            className="text-sky-700 underline decoration-dotted hover:text-sky-900"
                            title={k === 'drop' ? 'Buka buku drop, tanggal ini disorot' : 'Buka buku angsuran, tanggal ini disorot'}
                          >
                            {ribu(r[k])}
                          </button>
                        ) : (
                          ribu(nilai(r, k))
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-1">{!kosong && <Cek ok={r.status_approve_kasir} />}</td>
                    <td className="px-3 py-1">{!kosong && <Cek ok={r.status_approve_kepala} />}</td>
                  </tr>
                ))}
                <tr className="font-bold border-t bg-emerald-50 text-slate-900">
                  <td className="sticky left-0 px-3 py-1.5 bg-emerald-50">Total</td>
                  {KOLOM_HARIAN.map(([k, , kelas]) => (
                    <td key={k} className={`px-3 py-1.5 text-right ${kelas ?? ''}`}>
                      {ribu(kosong ? 0 : calculateTotals(item.data, k))}
                    </td>
                  ))}
                  <td colSpan={2} />
                </tr>
              </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableRekap;
