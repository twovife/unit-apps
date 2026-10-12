import React, { useEffect, useMemo, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import BargeStatus from '@/Components/shadcn/BargeStatus';
import Approval from './Components/Approval';
import { usePage } from '@inertiajs/react';
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

// Urutan tanggal ACC KM diingat per browser; storage bisa tidak tersedia.
const KUNCI_URUT = 'acc_km_urut';
const bacaUrut = () => {
  try {
    return window.localStorage.getItem(KUNCI_URUT) === 'desc' ? 'desc' : 'asc';
  } catch {
    return 'asc';
  }
};

// sorot: 'YYYY-MM-DD' - baris tanggal itu disorot kuning & digulir ke pandangan.
const Rencana = ({ datas, dataTransaksi, onStorting, onAccSelesai = null, sorot = null }) => {
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  // Kolom ACC KM membuka dialog approval kepala (ceklist_kepala) -> can-approve
  const isUnit = usePage().props.auth?.permissions?.includes('can-approve');
  const { server_filter } = usePage().props;

  useEffect(() => {
    setData(datas);
    setCustomerData(dataTransaksi);
  }, [datas, dataTransaksi]);

  // asc = terlama ke terbaru, desc = terbaru ke terlama.
  const [urut, setUrut] = useState(bacaUrut);
  const gantiUrut = () => {
    const baru = urut === 'asc' ? 'desc' : 'asc';
    setUrut(baru);
    try {
      window.localStorage.setItem(KUNCI_URUT, baru);
    } catch {
      /* tanpa storage: berlaku sampai halaman dimuat ulang */
    }
  };
  const tampil = useMemo(() => {
    const t = (x) => dayjs(x.tanggal).valueOf();
    return [...(data ?? [])].sort((a, b) => (urut === 'asc' ? t(a) - t(b) : t(b) - t(a)));
  }, [data, urut]);

  // Declare a state variable to track the visibility of the "onApproveShow" component
  const [onApproveShow, setOnApproveShow] = useState(false);
  const [actionData, setActionData] = useState();

  // Event handler function to set the "onApproveShow" state variable to true
  const handleOnApproveShowOpen = (e) => {
    setOnApproveShow(true);
    setActionData(e);
  };

  // Event handler function to set the "onApproveShow" state variable to false
  const handleOnApproveShowClosed = (e) => {
    setOnApproveShow(false);
    setActionData();
  };

  return (
    <>
      <Approval
        show={onApproveShow}
        onClosed={handleOnApproveShowClosed}
        staticData={customerData}
        triggeredDate={actionData}
        datas={data}
        onSukses={onAccSelesai}
      />
      <Table className="w-full table-auto">
        <TableHeader className="sticky top-0 z-10 bg-gray-100">
          <TableRow>
            {isUnit && <TableHead className="text-center">ACC KM</TableHead>}
            <TableHead className="text-center">
              <button
                type="button"
                onClick={gantiUrut}
                title={urut === 'asc' ? 'Terlama ke terbaru — klik untuk terbaru dulu' : 'Terbaru ke terlama — klik untuk terlama dulu'}
                className="inline-flex items-center gap-1 font-medium hover:text-slate-900"
              >
                Tanggal
                {urut === 'asc' ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />}
              </button>
            </TableHead>
            <TableHead className="text-center">Kasbon</TableHead>
            <TableHead className="text-center">Target</TableHead>
            <TableHead className="text-center">Masuk</TableHead>
            <TableHead className="text-center">Keluar</TableHead>
            <TableHead className="text-center">Storting</TableHead>
            <TableHead className="text-center">Drop</TableHead>
            <TableHead className="text-center">Baru</TableHead>
            <TableHead className="text-center">Lama</TableHead>
            <TableHead className="text-center">Rencana</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tampil.map((item, index) => (
            <TableRow
              key={item.tanggal ?? index}
              data-sorot={sorot && dayjs(item.tanggal).format('YYYY-MM-DD') === sorot ? '' : undefined}
              className={`text-center ${
                sorot && dayjs(item.tanggal).format('YYYY-MM-DD') === sorot ? 'bg-amber-100 hover:bg-amber-100 ring-2 ring-inset ring-amber-400' : ''
              }`}
            >
              {isUnit && (
                <TableCell>
                  {item.is_generated && (
                    <div className="flex flex-col items-center gap-1">
                      {/* Belum harinya -> belum bisa di-Ceklist Kepala. */}
                      {item.tanggal <= dayjs().format('YYYY-MM-DD') && (
                        <BargeStatus
                          value={item.is_closed}
                          onClick={() => handleOnApproveShowOpen(item.tanggal)}
                          size="xs"
                        >
                          {server_filter?.migrasi && item.is_kasir ? '🔒 ACC' : 'ACC'}
                        </BargeStatus>
                      )}
                      {item.dibuka_at && (
                        <span
                          title={item.dibuka_alasan ?? ''}
                          className="rounded bg-amber-100 px-1 text-[10px] font-medium text-amber-800"
                        >
                          dibuka ulang {dayjs(item.dibuka_at).format('DD MMM YYYY')}
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
              )}
              <TableCell>{dayjs(item.tanggal).format('DD-MM-YYYY')}</TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.kasbon} />
              </TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.target} />
                {item.target_source === 'auto' && (
                  <span
                    className="ml-1 inline-block rounded px-1 text-[10px] font-semibold bg-amber-100 text-amber-700"
                    title="Target otomatis — minggu lalu belum dicek KM"
                  >
                    auto
                  </span>
                )}
                {item.target_source === 'koreksi' && (
                  <span
                    className="ml-1 inline-block rounded px-1 text-[10px] font-semibold bg-violet-100 text-violet-700"
                    title="Target dikoreksi tangan saat ACC — rantai dimulai ulang dari sini"
                  >
                    koreksi
                  </span>
                )}
                {item.target_source === 'manual' && (
                  <span
                    className="ml-1 text-green-600"
                    title="Target dari cek KM"
                  >
                    ✓
                  </span>
                )}
              </TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.masuk} />
              </TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.keluar} />
              </TableCell>
              <TableCell className="text-blue-600 cursor-pointer hover:bg-blue-100" onClick={() => onStorting?.(item)}>
                {/* Buka buku angsuran hari itu di drawer (edit cepat). */}
                <FormatNumbering ribuan value={item.storting} />
              </TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.drop} />
              </TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.baru} />
              </TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.lama} />
              </TableCell>
              <TableCell>
                <FormatNumbering ribuan value={item.rencana} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Rencana;
