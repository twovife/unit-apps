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
import { usePage } from '@inertiajs/react';

const TableRekapKasir = ({
  setOnShowModal,
  setTriggeredData,
  setTriggeredType,
  datas,
}) => {
  const [data, setData] = useState([]);
  const { auth } = usePage().props;

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

  const getLastValue = (info, accessorKey) => {
    const rows = info.table.getRowModel().rows;
    return rows[rows.length - 1]?.getValue(accessorKey);
  };

  const onClickStatusHandler = (triggeredData, type) => {
    setOnShowModal(true);
    setTriggeredData(triggeredData);
    setTriggeredType(type);
  };

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'kelompok',
        cell: ({ getValue, cell }) => (
          <div className="flex items-center justify-center gap-3">
            <div>
              {cell.row.original.type == 'daily'
                ? getValue()
                : dayjs(cell.row.original.tanggal).format('DD-MM')}
            </div>
            {/* Kasir (can-approve): input kasbon/transport, lalu cek & kunci. */}
            {auth.permissions.includes('can-approve') && (
              <>
                <BargeStatus
                  onClick={() => onClickStatusHandler(cell.row.original, 1)}
                >
                  Input
                </BargeStatus>
                <BargeStatus
                  onClick={() => onClickStatusHandler(cell.row.original, 2)}
                  value={cell.row.original.status_approve_kasir}
                >
                  {cell.row.original.status_approve_kasir ? '🔒 Terkunci' : 'Kunci'}
                </BargeStatus>
              </>
            )}
          </div>
        ),
      },
      {
        header: 'Kasbon',
        accessorKey: 'kasbon',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.kasbon} />,
      },
      {
        header: 'Storting',
        accessorKey: 'storting',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.storting} />,
      },
      {
        header: 'DO11%',
        accessorKey: 'do11',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.do11} />,
      },
      {
        header: 'Deb',
        accessorKey: 'debit',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.debit} />,
      },
      {
        header: 'Drop',
        accessorKey: 'drop',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.drop} />,
      },
      {
        header: 'Transport',
        accessorKey: 'transport',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.transport} />,
      },
      {
        header: 'Kre',
        accessorKey: 'kredit',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.kredit} />,
      },
      {
        header: 'Tunai',
        accessorKey: 'tunai',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.tunai} />,
      },
      {
        header: 'Titipan 9%',
        accessorKey: 'titipan9',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.titipan9} />,
      },
      {
        header: 'Cash',
        accessorKey: 'storting_cash',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.storting_cash} />,
      },
      {
        header: 'Transfer',
        accessorKey: 'storting_transfer',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.storting_transfer} />,
      },
      {
        header: 'Katrol',
        accessorKey: 'storting_katrol',
        cell: ({ getValue }) => <FormatNumbering ribuan value={getValue()} />,
        footer: (info) => <FormatNumbering ribuan value={totals.storting_katrol} />,
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
          {/* Grup kolom: Kasbon s/d Tunai = TUNAI 1 (8 kolom). */}
          <TableRow>
            <TableHead />
            <TableHead colSpan={8} className="font-bold text-center border-b border-x text-slate-900">
              TUNAI 1
            </TableHead>
            <TableHead />
            <TableHead colSpan={3} className="font-bold text-center border-b border-x text-slate-900">
              STORTING
            </TableHead>
          </TableRow>
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
