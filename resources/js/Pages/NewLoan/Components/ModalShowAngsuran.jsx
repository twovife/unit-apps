import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import dayjs from 'dayjs';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import BargeStatus from '@/Components/shadcn/BargeStatus';

const ModalShowAngsuran = ({ show = false, triggeredData, onClosed }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (triggeredData) {
      setData(triggeredData);
    } else {
      setData([]);
    }
  }, [triggeredData]);

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : onClosed())}>
      <DialogContent className="w-[90vw] h-[80vh] lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <DialogHeader className={'max-h-10'}>
          <DialogTitle>Pengajuan Pinjaman Baru</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="overflow-auto max-h-[70vh] scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No</TableHead>
                  <TableHead className="text-center">Tanggal</TableHead>
                  <TableHead className="text-center">Angsuran</TableHead>
                  <TableHead className="text-center">Saldo</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((item, key) => (
                    <TableRow>
                      <TableCell className="text-center">{key + 1}</TableCell>
                      <TableCell className="text-center">
                        {dayjs(item.transaction_date).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell
                        className={item.dana_titipan ? 'text-red-500' : ''}
                      >
                        <FormatNumbering value={item.nominal} />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={item.saldo} />
                      </TableCell>
                      <TableCell className="text-center">
                        <BargeStatus value={item.status} />
                      </TableCell>
                    </TableRow>
                  ))}

                {data.length < 1 && (
                  <TableRow>
                    <TableCell className="text-center" colspan="5">
                      Belum Ada Angsuran
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ModalShowAngsuran;
