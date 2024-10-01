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
import DetailRiwayat from './DetailRiwayat';

const RiwayatPengajuan = ({ data }) => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    setCustomerData(data);
  }, [data]);

  const [expanded, setExpanded] = useState();
  const handleExpandedTogled = (value) => {
    setExpanded((prevId) => (prevId === value ? null : value));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'unit',
        header: 'unit',
        type: 'show',
        cell: ({ row, getValue }) => getValue(),
      },
      {
        accessorKey: 'kelompok',
        header: 'Kelompok',
        cell: ({ row, getValue }) => getValue(),
      },
      {
        accessorKey: 'jumlah_pengajuan',
        header: 'TTL Pengajuan',
        cell: ({ row, getValue }) => getValue(),
      },
      {
        accessorKey: 'jumlah_pinjaman',
        header: 'TTL Pinjaman',
        cell: ({ row, getValue }) => getValue(),
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
                <TableRow
                  className={`${
                    expanded == row.original.id ? 'border-b-0' : ''
                  } text-center`}
                  key={key}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${cell.column.columnDef.className}`}
                    >
                      {cell.column.columnDef.type == 'show' ? (
                        <div className="flex items-center justify-start gap-2">
                          <Button
                            onClick={() =>
                              handleExpandedTogled(cell.row.original.id)
                            }
                            type="button"
                            size="icon"
                            variant="ghost"
                            className={`${
                              expanded == row.original.id
                                ? 'rotate-90 text-green-700 bg-gradient-to-br from-green-50 to-green-100'
                                : ''
                            }`}
                          >
                            <Play
                              className={`h-4 w-auto transition-all duration-150`}
                            />
                          </Button>
                          <div>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </div>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {expanded == row.original.id && (
                  <TableRow
                    key={`newrow${key}`}
                    className="p-0 hover:bg-transparent"
                  >
                    <TableCell colSpan="4" className="p-0 border-0">
                      <DetailRiwayat detailData={row.original.pinjaman} />
                    </TableCell>
                  </TableRow>
                )}
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
