import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import { Badge } from '@/shadcn/ui/badge';
import dayjs from 'dayjs';

const DetailTableOnAction = ({ datas }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(datas);
  }, [datas]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Tanggal Pengajuan</TableHead>
            <TableHead className="text-center">Nomor Pengajuan</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Nama Nasabah</TableHead>
            <TableHead className="text-center">Unit</TableHead>
            <TableHead className="text-center">Kelompok</TableHead>
            <TableHead className="text-center">Pengajuan</TableHead>
            <TableHead className="text-center">Tgl Drop</TableHead>
            <TableHead className="text-center">Pinj Ke</TableHead>
            <TableHead className="text-center">Acc</TableHead>
            <TableHead className="text-center">Drop Jadi</TableHead>
          </TableRow>
        </TableHeader>
        {data && (
          <TableBody>
            <TableRow className="text-center">
              <TableCell>{dayjs(data.request_date).format('DD/MM')}</TableCell>
              <TableCell>{data.nomor_pengajuan}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    data.status == 'open'
                      ? 'green'
                      : data.status == 'acc'
                      ? 'yellow'
                      : data.status == 'success'
                      ? 'default'
                      : 'destructive'
                  }
                >
                  {data.status}
                </Badge>
              </TableCell>
              <TableCell className="text-left">
                <div>{data.nama}</div>
                <div>{data.nik}</div>
                <div className="text-gray-400">{data.alamat}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{data.unit}</TableCell>
              <TableCell>{data.kelompok}</TableCell>
              <TableCell>
                <FormatNumbering value={data.request} />
              </TableCell>
              <TableCell>{dayjs(data.tanggal_drop).format('DD/MM')}</TableCell>
              <TableCell>{data.pinjaman_ke}</TableCell>
              <TableCell>
                <FormatNumbering value={data.acc} />
              </TableCell>
              <TableCell>
                {' '}
                <FormatNumbering value={data.acc} />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default DetailTableOnAction;
