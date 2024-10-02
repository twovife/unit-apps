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
import Action from './Action';
import { Button } from '@/shadcn/ui/button';
import { Link } from '@inertiajs/react';
import BargeStatus from '@/Components/shadcn/BargeStatus';
import Approval from './Approval';
import { AlertCircle } from 'lucide-react';

const Rencana = ({ datas, dataTransaksi }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(datas);
  }, [datas]);

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
        staticData={dataTransaksi}
        triggeredData={actionData}
      />
      <Table className="w-full table-auto">
        <TableHeader className="sticky top-0 z-10 bg-gray-100">
          <TableRow>
            <TableHead className="text-center">Action</TableHead>
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
              <TableCell>
                <BargeStatus
                  value={item.button_color}
                  onClick={() => handleOnApproveShowOpen(item)}
                  size="xs"
                >
                  {item.button_color == 'baru'
                    ? 'Pending'
                    : item.button_color == 'open'
                    ? `${item.is_generated ? '!' : ''} open`
                    : 'closed'}
                </BargeStatus>
              </TableCell>
              <TableCell>{dayjs(item.tanggal).format('DD-MM-YYYY')}</TableCell>
              <TableCell>
                <FormatNumbering value={item.kasbon} />
              </TableCell>
              <TableCell>
                <FormatNumbering value={item.target} />
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
