import React, { useEffect, useState } from 'react';
import BadgeKoreksiBeku from '@/Components/BadgeKoreksiBeku';
import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import { CheckCircle, ChevronDown, ChevronRight, Wallet, XCircle } from 'lucide-react';
import DrawerBukuStorting from '@/Pages/NewAngsuran/Components/DrawerBukuStorting';
import { Link } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

import TabelHarian, { ribu } from './TabelHarian';
import { WARNA } from './TableRekapKasir';
import { useModeRibuan } from '@/lib/modeAngka';
import SatuanAngka from '@/Components/SatuanAngka';

// Warna blok kolom Rekap 2, seragam dengan Rekap 1: drop biru, storting kuning,
// sirkulasi hijau, CM biru, MB kuning, ML merah.
export const WARNA_HARIAN = {
  drop: WARNA.biru, total_drop: WARNA.biru,
  storting: WARNA.kuning, total_storting: WARNA.kuning,
  sirkulasi: WARNA.hijau,
  angsuran_cm: WARNA.biru, total_angsuran_cm: WARNA.biru, saldo_cm: WARNA.biru,
  angsuran_mb: WARNA.kuning, total_angsuran_mb: WARNA.kuning, saldo_mb: WARNA.kuning,
  angsuran_ml: WARNA.merah, total_angsuran_ml: WARNA.merah, saldo_ml: WARNA.merah,
  persen_cm: WARNA.biru, persen_mb: WARNA.kuning, persen_ml: WARNA.merah,
};

// [kunci, label, kelas tambahan]. Saldo ditebalkan - angka yang dicocokkan.
export const KOLOM_HARIAN = [
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

// Kolom persen: [pembilang, penyebut]. CM & MB dibagi jumlah drop bulan
// rujukannya (T-3 / T-4) APA ADANYA tanpa pengali, ML dibagi sirkulasi hari
// itu. Sama persis dengan Rekap Sirkulasi Wilayah — penyebutnya pun dari
// sumber yang sama (AngkaRekapWilayah::dropKelompok), supaya persen di dua
// menu tidak pernah bertengkar.
/** Pecahan; null kalau penyebut 0 supaya ditulis '-', bukan 0%. */
const persen = (atas, bawah) => (bawah ? atas / bawah : null);
const persenTeks = (p) => (p === null ? '-' : (p * 100).toFixed(2).replace('.', ',') + '%');

export const PECAHAN_HARIAN = {
  persen_cm: ['saldo_cm', 'drop_cm'],
  persen_mb: ['saldo_mb', 'drop_mb'],
  persen_ml: ['saldo_ml', 'sirkulasi'],
};

// Rekap 2 saja. Rekap per Mantri tetap memakai KOLOM_HARIAN polos: datanya
// dari sumber lain (getRekapPermantriData) yang belum mengirim drop_cm/drop_mb.
const SESUDAH = { saldo_cm: ['persen_cm', '% CM'], saldo_mb: ['persen_mb', '% MB'], saldo_ml: ['persen_ml', '% ML'] };

export const KOLOM_HARIAN_PERSEN = KOLOM_HARIAN.flatMap((k) =>
  SESUDAH[k[0]] ? [k, SESUDAH[k[0]]] : [k],
);

// Belum dicek: silang + tombol ke tempat ngeceknya (href = pindah halaman,
// onClick = drawer).
// otomatis: ACC KM dijalankan sistem saat kunci / TTD kasir, KM belum
// mengecek -> tetap tampil silang (mas 2026-10-13); alurnya tidak berubah.
export const Cek = ({ ok, href, onClick, otomatis = false }) => (
  <div className="flex items-center justify-center gap-1.5">
    {ok && !otomatis ? (
      // Sudah dicek tetap bisa diklik (buka form ACC lagi / koreksi).
      onClick ? (
        <button type="button" onClick={onClick} title="Sudah dicek. Klik untuk buka lagi." className="rounded-full hover:ring-2 hover:ring-green-300">
          <CheckCircle className="w-4 h-4 text-green-500" aria-label="Sudah dicek" />
        </button>
      ) : href ? (
        <Link href={href} title="Sudah dicek. Klik untuk buka lagi." className="rounded-full hover:ring-2 hover:ring-green-300">
          <CheckCircle className="w-4 h-4 text-green-500" aria-label="Sudah dicek" />
        </Link>
      ) : (
        <CheckCircle className="w-4 h-4 text-green-500" aria-label="Sudah dicek" />
      )
    ) : (
      <>
        <XCircle
          className="w-4 h-4 text-red-500"
          aria-label={otomatis ? 'Belum dicek KM (ACC otomatis saat kunci / TTD kasir)' : 'Belum dicek'}
        />
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md text-sky-700 ring-1 ring-sky-300 bg-white hover:bg-sky-50 whitespace-nowrap"
          >
            Cek
          </button>
        ) : href ? (
          <Link
            href={href}
            className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md text-sky-700 ring-1 ring-sky-300 bg-white hover:bg-sky-50 whitespace-nowrap"
          >
            Cek
          </Link>
        ) : null}
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
  onAcc = null,
}) => {
  useModeRibuan();
  const [data, setData] = useState([]);
  const [sirkulasiAwal, setSirkulasiAwal] = useState([]);
  // Baris saldo awal yang daftar pemutihannya sedang dibuka.
  const [pemutihan, setPemutihan] = useState(null);
  // Sirkulasi per hari tagih (expand) & buku storting bulan lalu yang menghasilkannya.
  const [buka, setBuka] = useState({});
  const [buku, setBuku] = useState(null);
  const sf = usePage().props.server_filter ?? {};
  const bulanLalu = dayjs(`${sf.month}-01`).subtract(1, 'month');

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
            <span className="ml-3">
              <BadgeKoreksiBeku jumlah={usePage().props.server_filter?.koreksi_beku} />
            </span>
            <span className="ml-auto mr-2 text-xs font-normal text-slate-500"><SatuanAngka pendek /></span>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs tabular-nums">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 font-medium text-left">Kelompok</th>
                    <th className="px-3 py-2 font-medium text-right">Sirkulasi</th>
                    {sf.pakai_persen && <th className="px-3 py-2 font-medium text-right whitespace-nowrap">Drop CM</th>}
                    <th className="px-3 py-2 font-medium text-right">Saldo CM</th>
                    {sf.pakai_persen && <th className="px-3 py-2 font-medium text-right">% CM</th>}
                    {sf.pakai_persen && <th className="px-3 py-2 font-medium text-right whitespace-nowrap">Drop MB</th>}
                    <th className="px-3 py-2 font-medium text-right">Saldo MB</th>
                    {sf.pakai_persen && <th className="px-3 py-2 font-medium text-right">% MB</th>}
                    <th className="px-3 py-2 font-medium text-right">Saldo ML</th>
                    {sf.pakai_persen && <th className="px-3 py-2 font-medium text-right">% ML</th>}
                  </tr>
                </thead>
                <tbody>
                  {(sirkulasiAwal ?? []).map((item, key) => (
                    <React.Fragment key={key}>
                    <tr className="border-t even:bg-slate-50 hover:bg-sky-50">
                      <td className="px-3 py-1.5 font-medium">{item.kelompok}</td>
                      <td className="px-3 py-1.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.per_hari?.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setBuka((b) => ({ ...b, [item.kelompok]: !b[item.kelompok] }))}
                              title="Rincian per hari tagih"
                              className="inline-flex items-center text-sky-600 hover:text-sky-800"
                            >
                              {buka[item.kelompok] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          )}
                          {item.pemutihan > 0 && (
                            // Pemutihan bulan lalu keluar di saldo awal ini.
                            <button
                              type="button"
                              onClick={() => setPemutihan(item)}
                              title="Pemutihan bulan lalu - klik untuk lihat nasabahnya"
                              className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-white text-red-600 border border-red-500 hover:bg-red-50"
                            >
                              MD {ribu(item.pemutihan)}
                            </button>
                          )}
                          {ribu(item.sirkulasi)}
                        </div>
                      </td>
                      {sf.pakai_persen && <td className="px-3 py-1.5 text-right text-slate-500">{ribu(item.drop_cm)}</td>}
                      <td className="px-3 py-1.5 text-right">{ribu(item.sirkulasiCm)}</td>
                      {sf.pakai_persen && (
                        <td className="px-3 py-1.5 text-right">{persenTeks(persen(item.sirkulasiCm, item.drop_cm))}</td>
                      )}
                      {sf.pakai_persen && <td className="px-3 py-1.5 text-right text-slate-500">{ribu(item.drop_mb)}</td>}
                      <td className="px-3 py-1.5 text-right">{ribu(item.sirkulasiMb)}</td>
                      {sf.pakai_persen && (
                        <td className="px-3 py-1.5 text-right">{persenTeks(persen(item.sirkulasiMb, item.drop_mb))}</td>
                      )}
                      <td className="px-3 py-1.5 text-right">{ribu(item.sirkulasiMl)}</td>
                      {sf.pakai_persen && (
                        <td className="px-3 py-1.5 text-right">{persenTeks(persen(item.sirkulasiMl, item.sirkulasi))}</td>
                      )}
                    </tr>
                    {/* Per hari: klik -> buku storting bulan lalu (saldo akhirnya = saldo awal ini). */}
                    {buka[item.kelompok] &&
                      item.per_hari.map((h) => (
                        <tr
                          key={h.hari}
                          onClick={() =>
                            setBuku({
                              kelompok: item.kelompok,
                              hari: h.hari,
                              tanggal: bulanLalu.format('YYYY-MM-DD'),
                              branch_id: sf.branch_id,
                              wilayah: sf.wilayah,
                            })
                          }
                          title={`Buka buku storting ${bulanLalu.format('MMMM YYYY')}`}
                          className="cursor-pointer bg-sky-50/60 text-sky-900 hover:bg-sky-100"
                        >
                          <td className="py-1 pl-8 pr-3 capitalize">{h.hari}</td>
                          <td className="px-3 py-1 text-right underline decoration-dotted">{ribu(h.sirkulasi)}</td>
                          {/* Drop bulan rujukan tidak dipecah per hari tagih, jadi persennya pun tidak. */}
                          {sf.pakai_persen && <td />}
                          <td className="px-3 py-1 text-right">{ribu(h.cm)}</td>
                          {sf.pakai_persen && <td />}
                          {sf.pakai_persen && <td />}
                          <td className="px-3 py-1 text-right">{ribu(h.mb)}</td>
                          {sf.pakai_persen && <td />}
                          <td className="px-3 py-1 text-right">{ribu(h.ml)}</td>
                          {sf.pakai_persen && (
                            <td className="px-3 py-1 text-right">{persenTeks(persen(h.ml, h.sirkulasi))}</td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
                {(sirkulasiAwal ?? []).length > 0 && (
                  <tfoot className="font-bold border-t-2 bg-slate-100 text-slate-900">
                    <tr>
                      <td className="px-3 py-2">Total</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {calculateTotals(sirkulasiAwal, 'pemutihan') > 0 && (
                            <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-white text-red-600 border border-red-500">
                              MD {ribu(calculateTotals(sirkulasiAwal, 'pemutihan'))}
                            </span>
                          )}
                          {ribu(calculateTotals(sirkulasiAwal, 'sirkulasi'))}
                        </div>
                      </td>
                      {sf.pakai_persen && (
                        <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'drop_cm'))}</td>
                      )}
                      <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'sirkulasiCm'))}</td>
                      {/* Persen total: jumlah pembilang / jumlah penyebut, bukan rata-rata persen kelompok. */}
                      {sf.pakai_persen && (
                        <td className="px-3 py-2 text-right">
                          {persenTeks(persen(calculateTotals(sirkulasiAwal, 'sirkulasiCm'), calculateTotals(sirkulasiAwal, 'drop_cm')))}
                        </td>
                      )}
                      {sf.pakai_persen && (
                        <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'drop_mb'))}</td>
                      )}
                      <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'sirkulasiMb'))}</td>
                      {sf.pakai_persen && (
                        <td className="px-3 py-2 text-right">
                          {persenTeks(persen(calculateTotals(sirkulasiAwal, 'sirkulasiMb'), calculateTotals(sirkulasiAwal, 'drop_mb')))}
                        </td>
                      )}
                      <td className="px-3 py-2 text-right">{ribu(calculateTotals(sirkulasiAwal, 'sirkulasiMl'))}</td>
                      {sf.pakai_persen && (
                        <td className="px-3 py-2 text-right">
                          {persenTeks(persen(calculateTotals(sirkulasiAwal, 'sirkulasiMl'), calculateTotals(sirkulasiAwal, 'sirkulasi')))}
                        </td>
                      )}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <DrawerBukuStorting target={buku} onClosed={() => setBuku(null)} />

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
        // Kolom persen baru muncul mulai Desember 2026; server yang
        // memutuskan lewat server_filter.pakai_persen, bukan layar yang
        // membandingkan tanggal sendiri.
        kolom={sf.pakai_persen ? KOLOM_HARIAN_PERSEN : KOLOM_HARIAN}
        warna={WARNA_HARIAN}
        pecahan={sf.pakai_persen ? PECAHAN_HARIAN : {}}
        klik={{ storting: onKlikStorting, drop: onKlikDrop }}
        // Tanggal yang belum tiba = kosongan.
        batasIsi={dayjs().format('YYYY-MM-DD')}
        ekstra={{
          kepala: ['Cek Staff', 'Cek Target'],
          sel: (r, tanggal, kosong) => [
            // Cek Staff = kunci kasir di Rekap 1.
            <td key="staf" className="px-3 py-1">
              {!kosong && <Cek ok={r.status_approve_kasir} href={route('kasir.rekap.rekap_satu', { date: tanggal })} />}
            </td>,
            // Cek Target = drawer ACC KM (kelompok x hari x bulan tanggal ini).
            <td key="target" className="px-3 py-1">
              {!kosong && <Cek ok={r.status_approve_kepala} otomatis={r.kepala_otomatis} onClick={() => onAcc?.({ ...r, tanggal })} />}
            </td>,
          ],
        }}
      />
    </div>
  );
};

export default TableRekap;
