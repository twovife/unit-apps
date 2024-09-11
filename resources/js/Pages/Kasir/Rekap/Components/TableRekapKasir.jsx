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

const TableRekapKasir = ({ datas }) => {
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
        header: 'Kasbon',
        accessorKey: 'kasbon',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.kasbon} />,
      },
      {
        header: 'Storting',
        accessorKey: 'storting',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.storting} />,
      },
      {
        header: 'DO11%',
        accessorKey: 'do11',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.do11} />,
      },
      {
        header: 'Deb',
        accessorKey: 'debit',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.debit} />,
      },
      {
        header: 'Drop',
        accessorKey: 'drop',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.drop} />,
      },
      {
        header: 'Transport',
        accessorKey: 'transport',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.transport} />,
      },
      {
        header: 'Kre',
        accessorKey: 'kredit',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.kredit} />,
      },
      {
        header: 'Tunai',
        accessorKey: 'tunai',
        cell: ({ getValue }) => <FormatNumbering value={getValue()} />,
        footer: (info) => <FormatNumbering value={totals.tunai} />,
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

export default TableRekapKasir;
