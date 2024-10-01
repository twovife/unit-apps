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
import Acc from './Acc';
import Tolak from './Tolak';
import DropJadi from './DropJadi';
import Gagal from './Gagal';
import DetailTableOnAction from './detailTableOnAction';
import RemoveLoan from './RemoveLoan';
import ReStatus from './ReStatus';
import ChangeDetail from './ChangeDetail';
import { Badge } from '@/shadcn/ui/badge';
import { usePage } from '@inertiajs/react';

const Action = ({ show = false, onClosed, triggeredData }) => {
  const { auth } = usePage().props;
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
        <DialogContent className="w-[90vw] h-[90vh] lg:h-auto overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin p-2">
          {erorAxios && <div>terjadi kesalahan saat memuat data</div>}
          {loading ? (
            <div>Data Sedang Dimuat</div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Check Transaksi Mantri</DialogTitle>
              </DialogHeader>
              <Card>
                <CardHeader>
                  <CardTitle>Detail Pengajuan</CardTitle>
                </CardHeader>
                <CardContent className="p-1 space-y-2">
                  <div className="overflow-auto border rounded-lg scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
                    <DetailTableOnAction datas={data} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3 mt-3 lg:flex-row">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>ACC / DROP</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-end justify-center gap-2 mx-auto mb-3">
                      {data?.status !== 'open' && (
                        <Badge size={'lg'} variant={'green'}>
                          Status Pengajuan = {data?.status}, Pada Tanggal
                          {data?.check_date}
                        </Badge>
                      )}
                    </div>
                    {data?.status !== 'open' && (
                      <div className="flex items-end justify-center gap-2 mx-auto">
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
                          <Badge size={'lg'} variant={'green'}>
                            Status Pengajuan = {data?.status}, Tanggal{' '}
                            {data?.check_date}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                {auth.permissions.includes('unit pimpinan') && (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Admin Edit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <div className="w-full mb-3 text-start">
                          <p className="font-semibold">Hapus Pengajuan</p>
                          <p className="mb-1 text-xs italic font-light text-gray-500">
                            Jika Pengajuan Sudah Memiliki Angsuran maka akan
                            terhapus semua
                          </p>
                          <RemoveLoan
                            triggeredId={data?.nomor_pengajuan}
                            onClosed={onClosed}
                          />
                        </div>
                        {data?.drop_langsung == 'lama' && (
                          <div className="w-full mb-3 text-start">
                            <p className="font-semibold ">Restatus</p>
                            <p className="mb-1 text-xs italic font-light text-gray-500">
                              Jika Pengajuan Sudah Memiliki Angsuran maka akan
                              terhapus semua
                            </p>
                            <ReStatus
                              triggeredId={data?.nomor_pengajuan}
                              onClosed={onClosed}
                            />
                          </div>
                        )}
                        {data && (
                          <ChangeDetail
                            onClosed={onClosed}
                            triggeredData={triggeredData}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Action;
