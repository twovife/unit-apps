import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import Action from './Action';
import { Badge } from '@/shadcn/ui/badge';

const Angsuran = ({ datas }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);

  const calculateInstalment = (data, keyToSum) => {
    const result = data.reduce(
      (acc, item) => acc + parseInt(item.instalment[keyToSum] ?? 0),
      0
    );
    return result;
  };

  const calculateTotals = (data, keyToSum) => {
    const result = data.reduce(
      (acc, item) => acc + parseInt(item[keyToSum] ?? 0),
      0
    );
    return result;
  };

  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const onCreateShowOpen = (id) => {
    setTriggeredId(id);
    setShow(true);
  };

  const onClosedShowOpen = () => {
    setShow(false);
    setTriggeredId(null);
  };

  return (
    <div className="relative overflow-auto h-[70vh] lg:h-[85vh]">
      <Table className="text-xs rounded-lg">
        <TableHeader className="sticky top-0 left-0 z-10">
          <TableRow className="bg-gray-200">
            <TableHead className="text-center">Tanggal</TableHead>
            <TableHead className="text-center">Nama Nasabah</TableHead>
            <TableHead className="text-center">Note</TableHead>
            <TableHead className="text-center border-x border-x-black">
              Pinjaman
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data ? (
            data.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow>
                  <TableCell colSpan={16}>{row.month}</TableCell>
                </TableRow>
                {row.data.map((subrow, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center justify-between gap-2">
                        <div>{dayjs(subrow.tanggal_drop).format('DD-MM')}</div>
                        <div>
                          <Button
                            size="xs"
                            onClick={() => onCreateShowOpen(subrow.id)}
                          >
                            Pay
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{subrow.nama}</div>
                      <div>{subrow.nik}</div>
                      <div>{subrow.alamat}</div>
                    </TableCell>
                    <TableCell className="flex flex-row items-center justify-center text-center">
                      {subrow.lunas ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded">
                          Lunas
                        </span>
                      ) : (
                        ''
                      )}
                      {subrow.status_pinjaman == 'normal' ? (
                        <span className="px-2 py-1 mr-1 text-xs border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : subrow.status_pinjaman == 'cm' ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : subrow.status_pinjaman == 'mb' ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : subrow.status_pinjaman == 'ml' ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-black border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : (
                        <div>{subrow.status_pinjaman}</div>
                      )}
                      {subrow.notes !== null ? (
                        <Badge>{subrow.notes}</Badge>
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell className="border-x border-x-black">
                      <div className="flex justify-between gap-6">
                        <div>P</div>
                        <FormatNumbering value={subrow.pinjaman} />
                      </div>
                      <div className="flex justify-between gap-6">
                        <div>A</div>
                        <FormatNumbering value={subrow.angsuran} />
                      </div>
                      <div className="flex justify-between gap-6">
                        <div>S</div>
                        <FormatNumbering value={subrow.saldo} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100">
                  <TableCell className="py-3" colSpan={3}>
                    <b>Total</b>
                  </TableCell>
                  <TableCell className="border-x border-x-black">
                    <div className="flex justify-between gap-6">
                      <div>P</div>
                      <FormatNumbering
                        value={calculateTotals(row.data, 'pinjaman')}
                      />
                    </div>
                    <div className="flex justify-between gap-6">
                      <div>A</div>
                      <FormatNumbering
                        value={calculateTotals(row.data, 'angsuran')}
                      />
                    </div>
                    <div className="flex justify-between gap-6">
                      <div>S</div>
                      <FormatNumbering
                        value={calculateTotals(row.data, 'saldo')}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell>a</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Action
        datas={data}
        show={show}
        onClosed={onClosedShowOpen}
        triggeredId={triggeredId}
      />
    </div>
  );
};

export default Angsuran;
