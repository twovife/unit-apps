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

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/shadcn/ui/button';
import { Play } from 'lucide-react';
import DetailRiwayat from './DetailRiwayat';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import { Badge } from '@/shadcn/ui/badge';
import Action from './Action';
import BargeStatus from '@/Components/shadcn/BargeStatus';
import BadgeStatus from '@/Components/shadcn/BadgeStatus';

const Rencana = ({ datas }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(datas);
  }, [datas]);

  console.log(data);

  const columns = useMemo(
    () => [
      {
        header: 'Tgl Drop',
        accessorKey: 'tanggal',
        cell: ({ getValue, cell }) => (
          <div className="flex items-center justify-center gap-3">
            <div>{dayjs(getValue()).format('DD-MM-YY')}</div>
            <BadgeStatus value={cell.row.original.drop_langsung} />
          </div>
        ),
      },
      {
        header: 'Status',
        type: 'show',
        accessorKey: 'status',
        cell: ({ getValue }) => getValue(),
      },
      {
        header: 'Nama',
        accessorKey: 'nama',
        cell: ({ getValue }) => getValue(),
      },
      {
        header: 'Alamat',
        accessorKey: 'alamat',
        cell: ({ getValue }) => getValue(),
      },
      {
        header: 'No Angt',
        accessorKey: 'nomor_anggota',
        cell: ({ getValue }) => getValue(),
      },
      {
        header: 'Pinj ke',
        accessorKey: 'pinjaman_ke',
        cell: ({ getValue }) => getValue(),
      },

      {
        header: 'Drop',
        accessorKey: 'drop',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
      },
      {
        header: 'Pengajuan',
        accessorKey: 'request',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
      },
      {
        header: 'Acc',
        accessorKey: 'acc',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
      },
      {
        header: 'Drop Jadi',
        accessorKey: 'drop_jadi',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  // Declare a state variable to track the visibility of the "onCreateShow" component
  const [onCreateShow, setOnCreateShow] = useState(false);
  const [actionData, setActionData] = useState();

  // Event handler function to set the "onCreateShow" state variable to true
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
    setActionData(e);
  };

  // Event handler function to set the "onCreateShow" state variable to false
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
    setActionData();
  };

  return (
    <>
      <Action
        show={onCreateShow}
        onClosed={handleOnCreateShowClosed}
        triggeredData={actionData}
      />

      <Table className="w-full table-auto">
        <TableHeader className="sticky top-0 z-10 bg-gray-100">
          <TableRow>
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
          <TableRow className={`text-center`}>
            <TableCell>{dayjs(data.tanggal).format('DD-MM-YYYY')}</TableCell>
            <TableCell>
              <FormatNumbering value={data.kasbon} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.target} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.masuk} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.keluar} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.storting} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.drop} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.baru} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.lama} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.rencana} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default Rencana;
