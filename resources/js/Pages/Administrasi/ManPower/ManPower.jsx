import BadgeStatus from '@/Components/shadcn/BadgeStatus';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import React from 'react';

const ManPower = ({ datas, title }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div className="flex-none shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-semibold tracking-tight ">
            Data Karyawan
          </h1>
        </div>
      </div>
      <div className="max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor</TableHead>
              <TableHead>Nama Karaywan</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Tanggal Masuk</TableHead>
              <TableHead>Date Resign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas &&
              datas.map((data, key) => (
                <TableRow key={key}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-1">{key + 1}</div>
                      <div className="flex-1">
                        <BadgeStatus value={data.isActive}>
                          {data.isActive ? 'Active' : 'Non Active'}
                        </BadgeStatus>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{data.employee_name}</TableCell>
                  <TableCell>{data.identity_id}</TableCell>
                  <TableCell>{data.address}</TableCell>
                  <TableCell>{data.employment}</TableCell>
                  <TableCell>{data.hire_date}</TableCell>
                  <TableCell>{data.resign_date}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ManPower;
