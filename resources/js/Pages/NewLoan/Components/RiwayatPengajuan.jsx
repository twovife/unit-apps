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
import BargeStatus from '@/Components/shadcn/BargeStatus';
import axios from 'axios';
import Loading from '@/Components/Loading';
import ModalShowAngsuran from './ModalShowAngsuran';

const RiwayatPengajuan = ({ data }) => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    setCustomerData(data ?? []);
  }, [data]);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [triggeredData, setTriggeredData] = useState(null);

  const handleExpandedTogled = async (id) => {
    setLoading(true);
    setShowModal(false);

    try {
      const response = await axios.post(
        route('transaction.get_instalment_nasabah', id)
      );
      setTriggeredData(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onClosedModal = () => {
    setShowModal(false);
    setTriggeredData(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'kelompok',
        header: 'Kelompok',
        cell: ({ row, getValue }) => (
          <div className="text-start">
            <div>{row.original.unit}</div>
            <div>Kel {getValue()}</div>
          </div>
        ),
      },
      {
        accessorKey: 'drop_date',
        header: 'Tgl Drop',
        cell: ({ row, getValue }) => (
          <div className="text-start">
            <div>{row.original.hari}</div>
            <div>{dayjs(getValue()).format('DD-MM-YY')}</div>
          </div>
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
        cell: ({ row, getValue }) => (
          <BargeStatus
            onClick={(e) => handleExpandedTogled(row.original.id)}
            value={getValue()}
          />
        ),
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
      <Loading show={loading} />
      <ModalShowAngsuran
        show={showModal}
        triggeredData={triggeredData}
        onClosed={onClosedModal}
      />
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
                  className={`text-center ${
                    row.original.lunas ? 'bg-green-100 hover:bg-green-50' : ''
                  }`}
                  key={key}
                >
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
            <TableCell colSpan="5">Belum Ada Catatan Pinjaman</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RiwayatPengajuan;
