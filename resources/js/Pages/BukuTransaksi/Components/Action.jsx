import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import React, { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import axios from 'axios';
import RiwayatPengajuan from './RiwayatPengajuan';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import { Badge } from '@/shadcn/ui/badge';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import Acc from './Acc';
import Tolak from './Tolak';
import DropJadi from './DropJadi';
import Gagal from './Gagal';

const Action = ({ show = false, onClosed, triggeredData }) => {
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [acc, setAcc] = useState();
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);

  useEffect(() => {
    setData(triggeredData);
    setAcc(triggeredData?.request);
  }, [triggeredData]);

  const onNikSubmit = async (e) => {
    setLoading(true);
    setErorAxios();
    await axios({
      method: 'post',
      url: route('transaction.nasabah_buku_transaksi'),
      data: {
        nik: triggeredData.nik,
      },
    })
      .then(function ({ data }) {
        setLoading(false);
        if (data.falidate_nik) {
          setCustomerData(data.data);
        } else {
          setCustomerData([]);
        }
      })
      .catch(function ({ response }) {
        setErorAxios(response.data.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (triggeredData?.nik) {
      onNikSubmit();
    }
  }, [triggeredData]);

  return (
    <>
      <Dialog open={show} onOpenChange={(open) => (open ? '' : onClosed())}>
        <DialogContent className="w-[90vw] h-[90vh] lg:h-auto overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
          {erorAxios && <div>terjadi kesalahan saat memuat data</div>}
          {loading ? (
            <div>Data Sedang Dimuat</div>
          ) : (
            <DialogHeader>
              <DialogTitle>Check Transaksi Mantri</DialogTitle>
              <DialogDescription>
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">Action</TabsTrigger>
                    <TabsTrigger value="history">Riwayat</TabsTrigger>
                    <TabsTrigger value="detail">Detail Angsuran</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle>Detail Pengajuan</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="overflow-auto border rounded-lg scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
                          {detailTable(data)}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex flex-col gap-3 mt-3 lg:flex-row">
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle>Acc</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-end justify-center gap-2 mx-auto lg:w-1/2">
                            {data?.status === 'open' ? (
                              <>
                                <Acc
                                  id={data?.nomor_pengajuan}
                                  acc={data?.acc ?? data?.request}
                                  onClosed={onClosed}
                                />
                                <Tolak
                                  id={data?.nomor_pengajuan}
                                  onClosed={onClosed}
                                />
                              </>
                            ) : (
                              <div>
                                Status Pengajuan = {data?.status}, Tanggal{' '}
                                {data?.check_date}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      {data?.status !== 'open' && (
                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle>Drop Jadi</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-end justify-center gap-2 mx-auto lg:w-1/2">
                              {data?.status === 'acc' ? (
                                <>
                                  <DropJadi
                                    id={data?.nomor_pengajuan}
                                    drop_jadi={data?.acc}
                                    onClosed={onClosed}
                                  />
                                  <Gagal
                                    id={data?.nomor_pengajuan}
                                    onClosed={onClosed}
                                  />
                                </>
                              ) : (
                                <div>
                                  Status Pengajuan = {data?.status}, Tanggal{' '}
                                  {data?.check_date}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="history">
                    <Card>
                      <CardHeader>
                        <CardTitle>Riwayat Pengajuan</CardTitle>
                        <CardDescription>
                          Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang
                          tertera dari semua cabang
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
                          <RiwayatPengajuan data={customerData} />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </DialogDescription>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Action;
function detailTable(data) {
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
          <TableHead className="text-center">Kelompok</TableHead>
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
            <TableCell>{data.tanggal_pengajuan}</TableCell>
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
            <TableCell>{data.nama}</TableCell>
            <TableCell>{data.nik}</TableCell>
            <TableCell>{data.alamat}</TableCell>
            <TableCell>{data.unit}</TableCell>
            <TableCell>{data.kelompok}</TableCell>
            <TableCell>
              <FormatNumbering value={data.request} />
            </TableCell>
            <TableCell>{dayjs(data.tanggal_drop).format('DD/MM')}</TableCell>
            <TableCell>{data.kelompok}</TableCell>
            <TableCell>{data.pinjaman_ke}</TableCell>
            <TableCell>{data.acc}</TableCell>
            <TableCell>{data.drop_jadi}</TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
}
