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
import { usePage } from '@inertiajs/react';
import NoEditOverlay from '@/Components/NoEditOverlay';
import { toast } from 'sonner';
import { Toaster } from '@/shadcn/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Copy } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import Pengajuan from './Pengajuan';
import Loading from '@/Components/Loading';
import { getLastDateForHari } from '@/lib/utils';
import '../../../../css/loader.css';

const Action = ({ datas, show = false, onClosed, triggeredId }) => {
  const {
    auth,
    server_filter: { closed_transaction },
  } = usePage().props;
  const hasPermission = auth?.permissions?.includes('can-edit');

  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);
  // 'can create' (spasi) tidak ada di tabel permissions; server memakai 'can-create'
  const isCreator = auth?.permissions?.includes('can-create');
  const [customerData, setCustomerData] = useState({});
  const [pemutihan, setPemutihan] = useState(null);

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
        setPemutihan(data.pemutihan);
      })
      .catch(function ({ response }) {
        setErorAxios(true);
      });
  };
  // check is pengajuan exist

  useEffect(() => {
    if (triggeredId) {
      onNikSubmit(triggeredId);
    }
  }, [triggeredId, datas]);

  const modalIsClosed = () => {
    onClosed();
    setCustomerData({});
    setInstalment([]);
    setPemutihan(null);
  };

  /**
   * Gerbang edit yang sama dipakai di DUA tempat sejak form "Isi Angsuran"
   * dipindah ke paling atas (terpisah dari blok aksi di bawah). Nilai null
   * berarti boleh mengedit.
   */
  const gateValue =
    customerData.lunas == true
      ? 'Pinjaman Sudah Lunas'
      : !isCreator
        ? 'User Tidak Dapat Digunakan Untuk Mengedit'
        : null;

  /**
   * Gerbang KHUSUS tab "Input Angsuran" - lebih ketat dari `gateValue`.
   * Kalau pinjaman ini sedang menunggu hasil pengajuan pengganti (top-up,
   * `previous_loan_id`) yang tanggal drop-nya PAS sama dengan tanggal
   * koleksi hari ini, input manual dikunci - mencegah bentrok dengan
   * auto-pelunasan `TransactionLoan::boot()` kalau pengajuan itu tiba-tiba
   * sukses di-drop hari yang sama. Begitu pengajuan penggantinya gagal
   * (termasuk lewat Tundaan, yang memindahkan tanggal), kuncinya lepas
   * sendiri karena server cuma menghitung status open/acc sebagai pending.
   * TIDAK memengaruhi tab "Detail Pinjaman" atau kartu Pengajuan/Jenis
   * Nasabah di bawah - keduanya sudah punya gerbangnya sendiri.
   */
  const pengganti = customerData.pengajuan_pengganti;
  const tanggalKoleksiHariIni = getLastDateForHari(customerData.hari);
  const menungguDropPengganti =
    pengganti && pengganti.drop_date === tanggalKoleksiHariIni;

  const angsuranGateValue =
    gateValue ??
    (menungguDropPengganti
      ? `Menunggu hasil drop pengajuan pengganti (tanggal ${dayjs(pengganti.drop_date).format('DD-MM-YYYY')}) - input manual dikunci sementara supaya tidak bentrok dengan pelunasan otomatis.`
      : null);

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : modalIsClosed())}>
      <DialogContent className={`w-[95vw] p-1 lg:p-6`}>
        <DialogHeader className={'max-h-10'}>
          <DialogTitle className="p-2">Isi Angsurans</DialogTitle>
          {/* <Button type="button" /> */}
        </DialogHeader>
        <div className="h-[80vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
          <Toaster />
          {/* Input Angsuran (aksi utama saat modal dibuka lewat tombol
              "Bayar") dan Detail Pinjaman digabung jadi tab, ditaruh paling
              atas supaya tidak perlu digulir dulu. Detail Pinjaman sekarang
              SELALU kartu label/nilai - tabel 14 kolom dibuang total, bukan
              cuma disembunyikan di layar sempit. */}
          <Card className="w-full">
            <CardContent className="p-1 pt-4 lg:p-5">
              <Tabs defaultValue="input" className="w-full">
                <TabsList>
                  <TabsTrigger value="input">Input Angsuran</TabsTrigger>
                  <TabsTrigger value="detail">Detail Pinjaman</TabsTrigger>
                </TabsList>
                <TabsContent value="input" className="relative mt-3">
                  {angsuranGateValue && <NoEditOverlay value={angsuranGateValue} />}
                  {loading ? (
                    <div>Loading</div>
                  ) : (
                    <BayarAngsuran
                      triggeredId={customerData.id}
                      triggeredPinjaman={customerData}
                      instalment={instalment}
                    />
                  )}
                </TabsContent>
                <TabsContent value="detail" className="mt-3">
                  <LoanDetail customerData={customerData} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <div className="w-full mt-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Rincian Angsuran</CardTitle>
              </CardHeader>
              <CardContent className="p-1 lg:p-5">
                {pemutihan && (
                  <div className="w-full">
                    <Table className="text-xs">
                      <TableHeader className="bg-gray-200">
                        <TableRow>
                          <TableHead className="text-center">
                            Tanggal Pemutihan
                          </TableHead>
                          <TableHead className="text-center">
                            Nominal Pemutihan
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="text-center">
                          <TableCell>
                            {dayjs(pemutihan.transaction_date).format(
                              'DD-MM-YYYY',
                            )}
                          </TableCell>
                          <TableCell>
                            <FormatNumbering
                              className="text-center"
                              value={pemutihan.nominal}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="w-full overflow-auto">
                  <Table className="text-xs">
                    <TableHeader className="bg-gray-200">
                      <TableRow>
                        <TableHead className="text-center">Action</TableHead>
                        <TableHead className="text-center">Tanggal</TableHead>
                        <TableHead className="text-center">Jumlah</TableHead>
                        <TableHead className="text-center">Saldo</TableHead>
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
                                closed_transaction <=
                                  item.transaction_date) && (
                                <DeleteAngsuran id={item.id} />
                              )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {dayjs(item.transaction_date).format('DD-MM-YY')}
                            </TableCell>

                            <TableCell
                              className={`${
                                item.danatitipan == 1
                                  ? 'text-red-500 font-semibold'
                                  : ''
                              }`}
                            >
                              <FormatNumbering value={item.nominal} />
                            </TableCell>
                            <TableCell>
                              <FormatNumbering value={item.saldo} />
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
                      ) : erorAxios ? (
                        <TableRow>
                          <TableCell className="font-semibold text-red-500">
                            TERJADI KESALAHAN SAAT PENGAMBILAN DATA, MOHON
                            REFRESH BROWSER
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
          </div>

          <div className="relative grid w-full grid-cols-1 gap-3 mt-3">
            {gateValue && <NoEditOverlay value={gateValue} />}
            {loading ? (
              <div>Loading</div>
            ) : (
              <>
                <div className="min-w-0">
                  <Pengajuan
                    triggeredId={customerData.id}
                    triggeredPinjaman={customerData}
                    instalment={instalment}
                  />
                </div>
                <div className="min-w-0">
                  <JenisNasabah loan={customerData} />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Action;

/** Satu pasang label/nilai - pola yang sama dipakai `BukuTransaksi/Components/ActionTable.jsx`. */
const Field = ({ label, children }) => (
  <div className="min-w-0">
    <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-sm leading-tight break-words text-foreground">
      {children || <span className="text-muted-foreground">&mdash;</span>}
    </div>
  </div>
);

const tanggal = (value, format = 'DD MMM YYYY') =>
  value ? dayjs(value).format(format) : null;

/**
 * Tab "Detail Pinjaman" (dulu dinamai "Detail Nasabah" - keliru, isinya
 * bukan cuma identitas nasabah tapi seluruh riwayat pinjaman: pengajuan,
 * ACC, drop, siapa mengerjakan tiap tahap). Dipakai di SEMUA lebar layar
 * (bukan lagi cabang khusus mobile; tabel 14 kolom `PinjamanWebTable` sudah
 * dibuang).
 *
 * Disamakan dengan pola menu Drop (`BukuTransaksi/Components/ActionTable.jsx`):
 * blok identitas menonjol di atas, lalu nominal pinjaman sebagai jangkar mata,
 * lalu detail pendukung sebagai grid label/nilai.
 */
const LoanDetail = ({ customerData }) => {
  const sooners = (value) => {
    toast('Nik Telah Dicopy');
    navigator.clipboard.writeText(value);
  };

  if (!customerData || Object.keys(customerData).length === 0) {
    return (
      <p className="py-4 text-sm text-center text-muted-foreground">
        Menunggu data . . .
      </p>
    );
  }

  return (
    <div>
      {/* Tingkat 1 - identitas nasabah, paling menonjol */}
      <div className="px-3 py-3 border-b bg-muted/40">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight text-foreground">
            {customerData.nama || (
              <span className="text-muted-foreground">&mdash;</span>
            )}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <StatusPinjaman value={customerData.status_pinjaman} />
            <StatusPinjaman value={customerData.lunas ? 'Lunas' : 'Belum'} />
          </div>
        </div>
        <div className="mt-1 text-sm text-foreground">
          {customerData.alamat || (
            <span className="text-muted-foreground">&mdash;</span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs tabular-nums text-muted-foreground">
          <span>NIK {customerData.nik || '—'}</span>
          {customerData.nik && (
            <button
              type="button"
              className="text-blue-500"
              onClick={() => sooners(customerData.nik)}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tingkat 2 - nominal pinjaman, jangkar utama mata */}
      <div className="px-3 py-3 border-b">
        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Pinjaman
        </div>
        <FormatNumbering
          value={customerData.pinjaman}
          className="text-base font-bold leading-tight text-start tabular-nums text-foreground"
        />
      </div>

      {/* Tingkat 3 - identitas & lokasi pinjaman */}
      <div className="grid grid-cols-2 px-3 py-3 border-b gap-x-4 gap-y-3">
        <Field label="Nomor">{customerData.id}</Field>
        <Field label="Pinjaman Ke">{customerData.pinjaman_ke}</Field>
        <Field label="Unit">{customerData.branch}</Field>
        <Field label="Kelompok">{customerData.kelompok}</Field>
        <Field label="Hari">
          <span className="capitalize">{customerData.hari}</span>
        </Field>
        <Field label="Mantri">{customerData.mantri}</Field>
      </div>

      {/* Tingkat 4 - riwayat proses: tanggal + siapa mengerjakan tiap tahap */}
      <div className="grid grid-cols-2 px-3 py-3 border-b gap-x-4 gap-y-3">
        <Field label="Tanggal Pengajuan">
          {tanggal(customerData.tanggal_pengajuan)}
        </Field>
        <Field label="Diinput Oleh">{customerData.diinput_oleh}</Field>
        <Field label="Tanggal ACC">{tanggal(customerData.tanggal_acc)}</Field>
        <Field label="ACC Oleh">{customerData.acc_oleh}</Field>
        <Field label="Tanggal Drop">{tanggal(customerData.tanggal_drop)}</Field>
        <Field label="Drop Oleh">{customerData.drop_oleh}</Field>
      </div>

      {/* Tingkat 5 - keterangan tambahan */}
      <div className="grid grid-cols-2 px-3 py-3 gap-x-4 gap-y-3">
        <Field label="Ket">{customerData.notes}</Field>
        <Field label="Keluar Target">
          {tanggal(customerData.out_date, 'DD/MM')}
        </Field>
      </div>
    </div>
  );
};
