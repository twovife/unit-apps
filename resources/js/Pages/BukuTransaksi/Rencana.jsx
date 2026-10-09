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

const Rencana = ({ datas, dataTransaksi }) => {
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  // Kolom ACC KM membuka dialog approval kepala (ceklist_kepala) -> can-approve
  const isUnit = usePage().props.auth?.permissions?.includes('can-approve');
  const { server_filter } = usePage().props;

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

  return (
    <>
      <Approval
        show={onApproveShow}
        onClosed={handleOnApproveShowClosed}
        staticData={customerData}
        triggeredDate={actionData}
        datas={data}
      />
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
              <TableCell className="text-blue-600 hover:bg-blue-100">
                <a
                  target="_blank"
                  href={route('pinjaman.index_pinjaman', {
                    date: item.tanggal,
                    kelompok: item.kelompok,
                  })}
                >
                  <FormatNumbering ribuan value={item.storting} />
                </a>
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
