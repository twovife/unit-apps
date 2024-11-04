import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import axios from 'axios';
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
import StatusPinjaman from '@/Components/shadcn/StatusPinjaman';
import BayarAngsuran from './BayarAngsuran';
import JenisNasabah from './JenisNasabah';
import DeleteAngsuran from './DeleteAngsuran';
import DeleteLoan from './DeleteLoan';
import { usePage } from '@inertiajs/react';

const Action = ({ datas, show = false, onClosed, triggeredId }) => {
  const {
    server_filter: { closed_transaction },
    auth,
  } = usePage().props;

  const unitAkses = auth.permissions.includes('can create');

  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);

  const [customerData, setCustomerData] = useState({});

  const [instalment, setInstalment] = useState([]);

  const onNikSubmit = async (triggeredId) => {
    setLoading(true);
    setErorAxios();
    await axios({
      method: 'get',
      url: route('pinjaman.get_loan_pinjaman', triggeredId),
    })
      .then(function ({ data }) {
        setLoading(false);
        setCustomerData(data.pinjaman);
        setInstalment(data.instalment);
      })
      .catch(function ({ response }) {
        setErorAxios();
      });
  };

  useEffect(() => {
    if (triggeredId) {
      onNikSubmit(triggeredId);
    }
  }, [triggeredId, datas]);

  const modalIsClosed = () => {
    onClosed();
    setCustomerData({});
    setInstalment([]);
  };

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : modalIsClosed())}>
      {/* <Loading show={loading || processing} /> */}
      <DialogContent
        className={`w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin p-1 lg:p-6`}
      >
        <DialogHeader className={'max-h-10'}>
          <DialogTitle className="p-2">Isi Angsuran</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Rincian Pinjaman</CardTitle>
          </CardHeader>
          <CardContent className="p-1 lg:p-5">
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="text-center">Nomor</TableHead>
                    <TableHead className="text-center">Nasabah</TableHead>
                    <TableHead className="text-center">NIK</TableHead>
                    <TableHead className="text-center">Alamat</TableHead>
                    <TableHead className="text-center">Unit</TableHead>
                    <TableHead className="text-center">Kelompok</TableHead>
                    <TableHead className="text-center">Hari</TableHead>
                    <TableHead className="text-center">Tanggal Drop</TableHead>
                    <TableHead className="text-center">Pinjaman</TableHead>
                    <TableHead className="text-center">Nama Mantri</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ket</TableHead>
                    <TableHead className="text-center">Lunas</TableHead>
                  </TableRow>
                </TableHeader>
                {/*  */}
                <TableBody>
                  {Object.keys(customerData).length !== 0 ? (
                    <TableRow className="text-center">
                      <TableCell>{customerData.id}</TableCell>
                      <TableCell>{customerData.nama}</TableCell>
                      <TableCell>{customerData.nik}</TableCell>
                      <TableCell>{customerData.alamat}</TableCell>
                      <TableCell>{customerData.branch}</TableCell>
                      <TableCell>{customerData.kelompok}</TableCell>
                      <TableCell>{customerData.hari}</TableCell>
                      <TableCell>
                        {dayjs(customerData.tanggal_drop).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell>
                        <FormatNumbering value={customerData.pinjaman} />
                      </TableCell>
                      <TableCell>{customerData.mantri}</TableCell>
                      <TableCell>
                        <StatusPinjaman value={customerData.status_pinjaman} />
                      </TableCell>
                      <TableCell>{customerData.notes}</TableCell>
                      <TableCell>
                        <StatusPinjaman
                          value={customerData.lunas ? 'Lunas' : 'Belum'}
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell>Menunggu data . . .</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col w-full gap-3 mt-3 lg:flex-row">
          <Card className="flex-[5]">
            <CardHeader>
              <CardTitle>Rincian Angsuran</CardTitle>
            </CardHeader>
            <CardContent className="p-1 lg:p-5">
              <div className="w-full overflow-auto">
                <Table className="text-xs">
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className="text-center">Action</TableHead>
                      <TableHead className="text-center">Tanggal</TableHead>
                      <TableHead className="text-center">Jumlah</TableHead>
                      <TableHead className="text-center">Saldo</TableHead>
                      <TableHead className="hidden text-center lg:table-cell">
                        Dana Titipan
                      </TableHead>
                      <TableHead className="hidden text-center lg:table-cell">
                        Mantri
                      </TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(customerData).length !== 0 ? (
                      instalment.map((item) => (
                        <TableRow className="text-center">
                          <TableCell>
                            {(!closed_transaction ||
                              closed_transaction < item.transaction_date) && (
                              <DeleteAngsuran id={item.id} />
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {dayjs(item.transaction_date).format('DD-MM-YY')}
                          </TableCell>
                          <TableCell>
                            <FormatNumbering value={item.nominal} />
                          </TableCell>
                          <TableCell>{item.saldo}</TableCell>
                          <TableCell className="hidden lg:block">
                            {item.danatitipan == 'true' ? 'Yes' : ''}
                          </TableCell>
                          <TableCell className="hidden lg:block">
                            {item.mantri}
                          </TableCell>
                          <TableCell>
                            {' '}
                            <StatusPinjaman value={item.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>Menunggu data . . .</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {unitAkses && (
            <div className="flex-[2]">
              <BayarAngsuran
                triggeredId={customerData.id}
                triggeredPinjaman={customerData.pinjaman}
                instalment={instalment}
              />
              <JenisNasabah loan={customerData} />
              <div className="flex items-center justify-end gap-3 p-3">
                <div className="font-semibold">Hapus Pinjaman</div>
                <DeleteLoan id={customerData.id} onClosed={modalIsClosed} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Action;
