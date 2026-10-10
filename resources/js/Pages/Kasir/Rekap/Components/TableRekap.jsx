import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import { CheckCircle, Wallet, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

// Angka saldo awal dipangkas ribuannya (1.300.000 -> 1.300).
const ribu = (n) => new Intl.NumberFormat('id-ID').format(Math.round((Number(n) || 0) / 1000));

const TableRekap = ({
  setOnShowModal,
  saldoAwalBulan,
  setTriggeredData,
  datas,
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

      <div className="max-h-[65vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <Table className="w-full mb-3 table-auto">
          <TableHeader className="sticky top-0 z-10 bg-gray-100">
            <TableRow>
              <TableHead className="text-center">Tanggal</TableHead>
              <TableHead className="text-center">Kelompok</TableHead>
              <TableHead className="text-center">Drop</TableHead>
              <TableHead className="text-center">Jumlah Drop</TableHead>
              <TableHead className="text-center">Storting</TableHead>
              <TableHead className="text-center">Jumlah Storting</TableHead>
              <TableHead className="text-center">Sirkulasi</TableHead>
              <TableHead className="text-center">Angsuran CM</TableHead>
              <TableHead className="text-center">Jumlah CM</TableHead>
              <TableHead className="text-center">Saldo CM</TableHead>
              <TableHead className="text-center">Angsuran MB</TableHead>
              <TableHead className="text-center">Jumlah MB</TableHead>
              <TableHead className="text-center">Saldo MB</TableHead>
              <TableHead className="text-center">Angsuran ML</TableHead>
              <TableHead className="text-center">Jumlah ML</TableHead>
              <TableHead className="text-center">Saldo ML</TableHead>
              <TableHead className="text-center">Cek Staff</TableHead>
              <TableHead className="text-center">Cek Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((item, key) => (
                <>
                  <TableRow
                    key={key}
                    className={`${
                      dayjs(item.tanggal).format('dddd') == 'Senin'
                        ? 'bg-red-300 hover:bg-red-400'
                        : ''
                    }`}
                  >
                    <TableCell className="whitespace-nowrap" colSpan="18">
                      {dayjs(item.tanggal).format('dddd')},
                      {dayjs(item.tanggal).format('DD-MM-YYYY')}
                    </TableCell>
                  </TableRow>

                  {item.data.map((subitem, subkey) => (
                    <TableRow key={subkey}>
                      <TableCell></TableCell>
                      <TableCell>{subitem.kelompok}</TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.drop} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.total_drop} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.storting} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.total_storting} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.sirkulasi} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.angsuran_cm} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.total_angsuran_cm} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.saldo_cm} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.angsuran_mb} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.total_angsuran_mb} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.saldo_mb} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.angsuran_ml} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.total_angsuran_ml} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={subitem.saldo_ml} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {subitem.status_approve_kasir ? (
                            <CheckCircle className="text-green-500" />
                          ) : (
                            <XCircle className="text-red-500" />
                          )}
                        </div>
                        {/* {subitem.status_approve_kasir
                          ? dayjs(subitem.status_approve_kasir).format('DD-MM')
                          : ''} */}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center ">
                          {subitem.status_approve_kepala ? (
                            <CheckCircle className="text-green-500" />
                          ) : (
                            <XCircle className="text-red-500" />
                          )}
                        </div>
                        {/* {subitem.status_approve_kepala
                          ? dayjs(subitem.status_approve_kepala).format('DD-MM')
                          : ''} */}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow className="bg-gray-100">
                    <TableCell></TableCell>
                    <TableCell className="font-semibold">TOTAL</TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'drop')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'total_drop')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'storting')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'total_storting')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'sirkulasi')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'angsuran_cm')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'total_angsuran_cm')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'saldo_cm')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'angsuran_mb')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'total_angsuran_mb')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'saldo_mb')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'angsuran_ml')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'total_angsuran_ml')}
                      />
                    </TableCell>
                    <TableCell>
                      <FormatNumbering
                        value={calculateTotals(item.data, 'saldo_ml')}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default TableRekap;
