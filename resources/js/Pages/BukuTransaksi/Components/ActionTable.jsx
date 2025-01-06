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
import BargeStatus from '@/Components/shadcn/BargeStatus';
import BadgeStatus from '@/Components/shadcn/BadgeStatus';
import { useIsMobile } from '@/Hooks/use-mobile';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/shadcn/ui/sonner';

const ActionTable = ({ datas }) => {
  const isMobile = useIsMobile();
  const [data, setData] = useState({});
  useEffect(() => {
    setData(datas || {}); // Ensure default to empty array
  }, [datas]);

  return (
    <div>
      <Toaster />
      {isMobile ? <MobileCardList data={data} /> : <WebTable data={data} />}
    </div>
  );
};

export default ActionTable;

const WebTable = ({ data }) => {
  const sooners = (value) => {
    toast('Nik Telah Dicopy');
    navigator.clipboard.writeText(value);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Tanggal Pengajuan</TableHead>
          <TableHead className="text-center">Nomor Pengajuan</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Nama Nasabah</TableHead>
          <TableHead className="text-center">NIK</TableHead>
          <TableHead className="text-center">Alamat</TableHead>
          <TableHead className="text-center">Unit</TableHead>
          <TableHead className="text-center">Pengajuan</TableHead>
          <TableHead className="text-center">Tgl Drop</TableHead>
          <TableHead className="text-center">Kelompok</TableHead>
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
              <BadgeStatus value={data.status} />
            </TableCell>
            <TableCell>{data.nama}</TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-3">
                <p className="text-sm text-gray-500">NIK: {data.nik}</p>
                <div
                  className="text-blue-500 hover:cursor-pointer"
                  onClick={() => sooners(data.nik)}
                >
                  <Copy className="h-4" />
                </div>
              </div>
            </TableCell>
            <TableCell>{data.alamat}</TableCell>
            <TableCell>{data.unit}</TableCell>
            <TableCell>
              <FormatNumbering value={data.request} />
            </TableCell>
            <TableCell>{dayjs(data.tanggal_drop).format('DD/MM')}</TableCell>
            <TableCell>{data.kelompok}</TableCell>
            <TableCell>{data.pinjaman_ke}</TableCell>
            <TableCell>
              <FormatNumbering value={data.acc} />
            </TableCell>
            <TableCell>
              <FormatNumbering value={data.drop_jadi} />
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
};

const MobileCardList = ({ data }) => {
  const sooners = (value) => {
    toast('Nik Telah Dicopy');
    navigator.clipboard.writeText(value);
  };
  if (!data || data.length === 0) {
    return <p className="text-center text-muted">Data tidak tersedia.</p>;
  }

  return (
    <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="p-6 space-y-4">
        <div className="pb-4 border-b">
          <h3 className="text-lg font-semibold text-red-500">{data.nama}</h3>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm text-gray-500">NIK: {data.nik}</p>
            <div className="text-blue-500" onClick={() => sooners(data.nik)}>
              <Copy className="h-4" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Nomor Pengajuan:</span>
            <span className="text-gray-800">{data.nomor_pengajuan}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Status:</span>
            <BadgeStatus value={data.status} />
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Alamat:</span>
            <span className="text-gray-800 text-end">{data.alamat}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Unit:</span>
            <span className="text-gray-800">{data.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Kelompok:</span>
            <span className="text-gray-800">{data.kelompok}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">
              Jumlah Permintaan:
            </span>
            <span className="text-gray-800">
              <FormatNumbering className="text-center" value={data.request} />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Tanggal Drop:</span>
            <span className="text-gray-800">
              {dayjs(data.tanggal_drop).format('DD-MM-YYYY')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Pinjaman ke:</span>
            <span className="text-gray-800">{data.pinjaman_ke}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">ACC:</span>
            <span
              className={`font-bold ${
                data.acc === 'Ya' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <FormatNumbering className="text-center" value={data.acc} />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Drop Jadi:</span>
            <span
              className={`font-bold ${
                data.drop_jadi === 'Ya' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <FormatNumbering className="text-center" value={data.drop_jadi} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
