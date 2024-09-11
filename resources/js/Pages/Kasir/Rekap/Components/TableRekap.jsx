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
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import { Badge } from '@/shadcn/ui/badge';
import BargeStatus from '@/Components/shadcn/BargeStatus';
import BadgeStatus from '@/Components/shadcn/BadgeStatus';

const TableRekap = ({ datas }) => {
  console.log(datas);

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(datas);
  }, [datas]);

  const calculateTotals = (data) => {
    return data.reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        acc[key] = (acc[key] || 0) + (item[key] || 0);
      });
      return acc;
    }, {});
  };

  const totals = calculateTotals(data);

  const columns = useMemo(
    () => [
      {
        header: 'Kelompok',
        // type: 'show',
        accessorKey: 'kelompok',
        cell: ({ getValue, cell }) => (
          <div className="flex items-center justify-center gap-3">
            <div>{getValue()}</div>
            <BadgeStatus value={cell.row.original.status_dayly_approval}>
              {cell.row.original.status_dayly_approval ? 'Approved' : 'Open'}
            </BadgeStatus>
          </div>
        ),
      },
      {
        header: 'Drop',
        accessorKey: 'total_drop',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.total_drop} />,
      },
      {
        header: 'Jumlah Drop',
        accessorKey: 'total_drop',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.total_drop} />,
      },
      {
        header: 'Storting',
        accessorKey: 'storting',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.storting} />,
      },
      {
        header: 'Jumlah Storting',
        accessorKey: 'total_storting',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.total_storting} />,
      },
      {
        header: 'Sirkulasi',
        accessorKey: 'sirkulasi',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.sirkulasi} />,
      },
      {
        header: 'Angsuran CM',
        accessorKey: 'angsuran_cm',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.angsuran_cm} />,
      },
      {
        header: 'Jumlah CM',
        accessorKey: 'total_angsuran_cm',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.total_angsuran_cm} />,
      },
      {
        header: 'Saldo CM',
        accessorKey: 'saldo_cm',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.saldo_cm} />,
      },
      {
        header: 'Angsuran MB',
        accessorKey: 'angsuran_mb',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.angsuran_mb} />,
      },
      {
        header: 'Jumlah MB',
        accessorKey: 'total_angsuran_mb',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.total_angsuran_mb} />,
      },
      {
        header: 'Saldo MB',
        accessorKey: 'saldo_mb',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.saldo_mb} />,
      },
      {
        header: 'Angsuran ML',
        accessorKey: 'angsuran_ml',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.angsuran_ml} />,
      },
      {
        header: 'Jumlah ML',
        accessorKey: 'total_angsuran_ml',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.total_angsuran_ml} />,
      },
      {
        header: 'Saldo ML',
        accessorKey: 'saldo_ml',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.saldo_ml} />,
      },
      {
        header: 'Kasir',
        accessorKey: 'status_approve_kasir',
        cell: ({ getValue, cell }) => (
          <div className="flex items-center justify-center gap-3">
            <div>{getValue() ? dayjs(getValue()).format('DD-MM-YY') : ''}</div>
            {/* <BadgeStatus value={cell.row.original.drop_langsung} /> */}
          </div>
        ),
      },
      {
        header: 'Pimp',
        accessorKey: 'status_approve_kepala',
        cell: ({ getValue, cell }) => (
          <div className="flex items-center justify-center gap-3">
            <div>{getValue() ? dayjs(getValue()).format('DD-MM-YY') : ''}</div>
            {/* <BadgeStatus value={cell.row.original.drop_langsung} /> */}
          </div>
        ),
      },
    ],
    [totals]
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
      {/* <Action
        show={onCreateShow}
        onClosed={handleOnCreateShowClosed}
        triggeredData={actionData}
      /> */}

      <Table className="w-full mb-3 table-auto">
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
                <TableRow className={`text-center`} key={key}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${cell.column.columnDef.className}`}
                    >
                      {cell.column.columnDef.type == 'show' ? (
                        <div className="flex items-center justify-center gap-2">
                          <BargeStatus
                            value={cell.row.original.status}
                            onClick={() =>
                              handleOnCreateShowOpen(cell.row.original)
                            }
                          />
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
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4">Belum Ada Catatan Pinjaman</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-center text-black bg-gray-100"
                  >
                    {flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
    </>
  );
};

export default TableRekap;
