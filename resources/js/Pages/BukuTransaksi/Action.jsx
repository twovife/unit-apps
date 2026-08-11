import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
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
import RiwayatPengajuan from '../NewLoan/Components/RiwayatPengajuan';

import Acc from './Components/Acc';

import DetailTableOnAction from './Components/ActionTable';
import StatusPengajuan from './Components/StatusPengajuan';
import RemoveLoan from './Components/RemoveLoan';
import ReStatus from './Components/ReStatus';
import ChangeDetail from './Components/ChangeDetail';
import { usePage } from '@inertiajs/react';

const Action = ({ show = false, onClosed, triggeredData }) => {
  const [data, setData] = useState([]);

  // CATATAN: kartu Admin Edit & Remove Loan dulu ditutup <NoEditOverlay>
  // berdasarkan `can-edit`. Itu salah gerbang - `can-edit` cuma dimiliki
  // superuser (permission bongkar-pasang untuk maintenance), sehingga pengawas
  // yang berhak Reset Pinjaman ikut tertutup. Overlay juga menutup SELURUH
  // kartu, jadi elemen lain di dalamnya ikut mati.
  // Sekarang tiap kontrol menggerbangi dirinya sendiri (disabled + keterangan),
  // elemennya tetap tampil supaya user tahu fitur itu ada.

  const [customerData, setCustomerData] = useState([]);
  const [acc, setAcc] = useState();
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);

  useEffect(() => {
    setData(triggeredData);
    setAcc(triggeredData?.request);
  }, [triggeredData]);

  const onNikSubmit = async (signal) => {
    setLoading(true);
    setErorAxios();

    try {
      const { data } = await axios.post(
        route('transaction.nasabah_buku_transaksi'),
        { nik: triggeredData.nik },
        { signal }, // 👈 inject signal buat cancel
      );

      setCustomerData(data.data ?? []);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request dibatalkan');
      } else {
        setErorAxios(error.response?.data?.message || 'Terjadi kesalahan');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!triggeredData?.nik) return;

    const controller = new AbortController();
    onNikSubmit(controller.signal);

    return () => {
      controller.abort(); // ❌ cancel request saat komponen unmount / modal close
    };
  }, [triggeredData]);

  return (
    <>
      <Dialog open={show} onOpenChange={(open) => (open ? '' : onClosed())}>
        {/* p-0 + flex kolom + max-h: header tetap di tempat, hanya badan tab
            yang menggulir. Tanpa max-h, dialog yang lebih tinggi dari layar
            akan terpotong di atas & bawah karena posisinya -translate-y-1/2. */}
        <DialogContent className="flex w-[96vw] max-w-3xl flex-col gap-0 p-0 max-h-[90svh]">
          <DialogHeader className="px-4 py-3 text-left border-b shrink-0">
            <DialogTitle className="pr-8 text-base">
              Detail Pengajuan
            </DialogTitle>
            {/* DialogDescription = <p>. Hanya boleh berisi teks - seluruh isi
                dialog dulu ditaruh di sini sehingga browser memaksa menutup
                <p> lebih awal dan tata letaknya berantakan (plus hydration
                mismatch karena aplikasi ini merender SSR). */}
            <DialogDescription className="text-xs">
              {data?.nama ? `${data.nama} · ` : ''}
              Kelompok {data?.kelompok ?? '-'} · {data?.unit ?? '-'}
            </DialogDescription>
          </DialogHeader>

          {erorAxios && (
            <div className="px-4 py-2 text-xs border-b text-destructive bg-destructive/10 shrink-0">
              {erorAxios}
            </div>
          )}

          <Tabs
            defaultValue="account"
            className="flex flex-col flex-1 min-h-0 gap-0"
          >
            <TabsList className="grid w-full h-auto grid-cols-4 rounded-none shrink-0">
              <TabsTrigger className="text-[11px]" value="account">
                Action
              </TabsTrigger>
              <TabsTrigger
                className="text-[11px]"
                disabled={loading}
                value="history"
              >
                {loading ? '...' : 'Crash Kantor'}
              </TabsTrigger>
              <TabsTrigger
                className="text-[11px]"
                disabled={loading}
                value="crashubmml"
              >
                {loading ? '...' : 'Crash (NT)'}
              </TabsTrigger>
              <TabsTrigger
                className="text-[11px]"
                disabled={loading}
                value="crashubm"
              >
                {loading ? '...' : 'Crash (T)'}
              </TabsTrigger>
            </TabsList>
            {/* min-h-0 wajib: tanpa itu anak flex menolak menyusut dan
                overflow-y-auto tidak pernah aktif. */}
            <TabsContent
              value="account"
              className="flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto"
            >
              {/* 1. AKSI - satu-satunya blok yang bisa diklik, sengaja
                     dipisah dari riwayat supaya tombol ACC/Tolak/Drop/Gagal
                     langsung terlihat tanpa perlu melewati timeline. */}
              <Card className="relative mb-3">
                <CardHeader>
                  <CardTitle>ACC / Drop Jadi</CardTitle>
                </CardHeader>
                <CardContent>
                  <Acc
                    id={data?.nomor_pengajuan}
                    triggeredData={data}
                    onClosed={onClosed}
                  />
                </CardContent>
              </Card>

              {/* 2. Detail nasabah: identitas paling menonjol, baru rincian
                     lainnya. Tidak dibungkus Card agar blok identitas bisa
                     memenuhi lebar penuh. */}
              <div className="mb-3 overflow-hidden border rounded-lg">
                <DetailTableOnAction datas={data} />
              </div>

              {/* 3. Riwayat - hanya bacaan, siapa & kapan di tiap tahap. */}
              <Card className="relative mb-3">
                <CardHeader>
                  <CardTitle>Riwayat</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusPengajuan data={data} />
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="w-full">
                  <Card className="relative mb-3">
                    <CardHeader>
                      <CardTitle>Admin Edit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        {data && (
                          <ChangeDetail
                            onClosed={onClosed}
                            triggeredData={triggeredData}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="relative w-full">
                  <CardHeader>
                    <CardTitle>Remove Loan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="w-full mb-3 text-start">
                      <p className="text-lg font-semibold text-red-500">
                        Hapus Pinjaman
                      </p>
                      <p className="mb-1 text-xs italic font-light text-red-500">
                        Perhatian !!!, Jika pengajuan berstatus sukses, maka
                        pengajuan sudah masuk dalam daftar angsuran, jika tetap
                        dihapus akan mempengaruhi data pada angsuran, dan
                        angsuran akan ikut terhapus.
                        <br /> ( Penghapusan hanya bisa dilakukan 2hari dari
                        tanggal drop (Mantri) dan 2bulan (Admin & Kepala))
                      </p>
                      <div className="text-right">
                        <RemoveLoan
                          triggeredId={data?.nomor_pengajuan}
                          triggeredData={data}
                          onClosed={onClosed}
                        />
                      </div>
                    </div>
                    <Accordion className="mb-3" type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Tambahan</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm">
                            <ul className="list-disc list-outside">
                              <li>
                                1. Jika ada kesalahan pada angsuran baru (
                                angsuran hari ini ) utamakan menghapus, dan buat
                                angsuran lagi.
                              </li>
                              <li>
                                2. Jika terjadi kesalahan Status * Tanggal,
                                usahakan untuk ganti tanggal ( tanggal drop /
                                tanggal request ) dan dan reset status setelah
                                itu
                              </li>
                              <li>
                                3. Setelah mengganti Detail pada angsuran,
                                dimohon untuk cek ulang, storting & dan
                                transaksi lagi, dikarenakan perubahan pada
                                detail, akan mempengaruhi laporan lainnya
                              </li>
                              <li className="text-red-500">
                                4. Reset Status Hanya Tersedia jika pinjaman
                                adalah drop lama / pengajuan
                              </li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="history"
              className="flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto"
            >
              <div className="mb-1 text-sm font-medium">
                Crash Antar Kelompok Dalam 1 Kantor
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <RiwayatPengajuan data={customerData.history_branch} />
              </div>
            </TabsContent>

            <TabsContent
              value="crashubmml"
              className="flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto"
            >
              <div className="mb-1 text-sm font-medium">
                Crash Kantor Lain Dalam UBM (Macet)
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <RiwayatPengajuan data={customerData.history_macet_lain} />
              </div>
            </TabsContent>

            <TabsContent
              value="crashubm"
              className="flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto"
            >
              <div className="mb-1 text-sm font-medium">
                Crash Kantor Lain Dalam UBM (Target)
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <RiwayatPengajuan data={customerData.history_target} />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Action;
