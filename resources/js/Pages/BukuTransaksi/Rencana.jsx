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
import KunciKasir from './Components/KunciKasir';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';

const Rencana = ({ datas, dataTransaksi }) => {
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  // Kolom ACC KM membuka dialog approval kepala (ceklist_kepala) -> can-approve
  const isUnit = usePage().props.auth?.permissions?.includes('can-approve');
  const { server_filter, auth } = usePage().props;
  const isSuperuser = auth?.roles?.includes('superuser');
  const [generating, setGenerating] = useState(false);

  // Superuser: paksa materialisasi target auto untuk buku ini (kelompok+hari
  // cabang aktif) tanpa nunggu cron. Endpoint memanggil service yang sama.
  const generateTargetAuto = () => {
    if (generating) return;
    setGenerating(true);
    router.post(
      route('transaction.generate_target_auto'),
      { kelompok: server_filter?.kelompok, hari: server_filter?.hari },
      {
        preserveScroll: true,
        onFinish: () => setGenerating(false),
      },
    );
  };

  useEffect(() => {
    setData(datas);
    setCustomerData(dataTransaksi);
  }, [datas, dataTransaksi]);

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

  // Cek #2 kasir: dialog kunci per baris (alur baru).
  const [onKunciShow, setOnKunciShow] = useState(false);
  const [kunciRow, setKunciRow] = useState(null);
  const openKunci = (row) => {
    setKunciRow(row);
    setOnKunciShow(true);
  };
  const closeKunci = () => {
    setOnKunciShow(false);
    setKunciRow(null);
  };

  return (
    <>
      <Approval
        show={onApproveShow}
        onClosed={handleOnApproveShowClosed}
        staticData={customerData}
        triggeredDate={actionData}
        datas={data}
      />
      <KunciKasir show={onKunciShow} onClosed={closeKunci} row={kunciRow} />
      {isSuperuser && (
        <div className="flex items-center justify-end gap-2 mb-2">
          <span className="text-xs text-muted-foreground">
            Superuser: buku {server_filter?.kelompok} · {server_filter?.hari}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateTargetAuto}
            disabled={generating}
          >
            {generating ? 'Memproses…' : 'Generate target otomatis (buku ini)'}
          </Button>
        </div>
      )}
      <Table className="w-full table-auto">
        <TableHeader className="sticky top-0 z-10 bg-gray-100">
          <TableRow>
            {isUnit && <TableHead className="text-center">ACC KM</TableHead>}
            <TableHead className="text-center">Tanggal</TableHead>
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
          {data.map((item, index) => (
            <TableRow key={index} className={`text-center`}>
              {isUnit && (
                <TableCell>
                  {item.is_generated && (
                    <div className="flex flex-col items-center gap-1">
                      <BargeStatus
                        value={item.is_closed}
                        onClick={() => handleOnApproveShowOpen(item.tanggal)}
                        size="xs"
                      >
                        ACC KM
                      </BargeStatus>
                      {/* Cek #2 kasir - alur baru saja */}
                      {server_filter?.migrasi && item.is_kasir && (
                        <span className="text-[10px] font-semibold text-green-700">
                          🔒 Terkunci
                        </span>
                      )}
                      {server_filter?.migrasi &&
                        item.is_approved &&
                        !item.is_kasir &&
                        item.closing_id && (
                          <button
                            type="button"
                            onClick={() => openKunci(item)}
                            className="text-[10px] font-semibold text-blue-600 underline"
                          >
                            Kunci kasir
                          </button>
                        )}
                    </div>
                  )}
                </TableCell>
              )}
              <TableCell>{dayjs(item.tanggal).format('DD-MM-YYYY')}</TableCell>
              <TableCell>
                <FormatNumbering value={item.kasbon} />
              </TableCell>
              <TableCell>
                <FormatNumbering value={item.target} />
                {item.target_source === 'auto' && (
                  <span
                    className="ml-1 inline-block rounded px-1 text-[10px] font-semibold bg-amber-100 text-amber-700"
                    title="Target otomatis — minggu lalu belum dicek KM"
                  >
                    auto
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
                <FormatNumbering value={item.masuk} />
              </TableCell>
              <TableCell>
                <FormatNumbering value={item.keluar} />
              </TableCell>
              <TableCell className="text-blue-600 hover:bg-blue-100">
                <a
                  target="_blank"
                  href={route('pinjaman.index_pinjaman', {
                    date: item.tanggal,
                    kelompok: item.kelompok,
                  })}
                >
                  <FormatNumbering value={item.storting} />
                </a>
              </TableCell>
              <TableCell>
                <FormatNumbering value={item.drop} />
              </TableCell>
              <TableCell>
                <FormatNumbering value={item.baru} />
              </TableCell>
              <TableCell>
                <FormatNumbering value={item.lama} />
              </TableCell>
              <TableCell>
                <FormatNumbering value={item.rencana} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Rencana;
