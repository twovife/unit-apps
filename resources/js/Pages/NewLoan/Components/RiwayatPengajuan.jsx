import React, { useEffect, useMemo, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
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
import DetailRiwayat from '../../BukuTransaksi/Components/DetailRiwayat';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import BadgeStatus from '@/Components/shadcn/BadgeStatus';

const RiwayatPengajuan = ({ data }) => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    setCustomerData(data ?? []);
  }, [data]);

  const [expanded, setExpanded] = useState();
  const handleExpandedTogled = (value) => {
    setExpanded((prevId) => (prevId === value ? null : value));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'kelompok',
        header: 'Kelompok',
        cell: ({ row, getValue }) => getValue(),
      },
      {
        accessorKey: 'drop_date',
        header: 'Tanggal Drop',
        cell: ({ row, getValue }) => (
          <div>{dayjs(getValue()).format('DD-MM-YYYY')}</div>
        ),
      },
      {
        accessorKey: 'pinjaman',
        header: 'Pinjaman',
        cell: ({ row, getValue }) => <FormatNumbering value={getValue()} />,
      },
      {
        accessorKey: 'lunas',
        header: 'Lunas',
        cell: ({ row, getValue }) => (
          <div>{getValue() ? 'Lunas' : 'Belum'}</div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'status',
        cell: ({ row, getValue }) => <BadgeStatus value={getValue()} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: customerData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <Table className="w-full table-auto">
      <TableHeader className="sticky top-0 z-10 bg-gray-100">
        {table.getHeaderGroups().map((headerGroup, key) => (
          <TableRow key={key}>
            {headerGroup.headers.map((header, key) => (
              <TableHead className="text-center" key={key}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row, key) => (
            <React.Fragment key={key}>
              <>
                <TableRow className={`text-center`} key={key}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${cell.column.columnDef.className}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </>
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan="4">Belum Ada Catatan Pinjaman</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RiwayatPengajuan;
