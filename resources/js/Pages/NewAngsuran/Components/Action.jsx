import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import React, { useEffect, useState } from 'react';
import BargeStatus from '@/Components/shadcn/BargeStatus';
import WhiteOff from './WhiteOff';
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
import { useFilterAngsuran } from '../FilterAngsuran';
import NoEditOverlay from '@/Components/NoEditOverlay';
import { toast } from 'sonner';
import { Toaster } from '@/shadcn/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Copy, CircleX } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import Pengajuan from './Pengajuan';
import Loading from '@/Components/Loading';
import '../../../../css/loader.css';

const Action = ({ datas, show = false, onClosed, triggeredId }) => {
  const { auth } = usePage().props;
  const { closed_transaction, tanggal: tanggalTerpilih } = useFilterAngsuran();
  const hasPermission = auth?.permissions?.includes('can-edit');

  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);
  // 'can create' (spasi) tidak ada di tabel permissions; server memakai 'can-create'
  const isCreator = auth?.permissions?.includes('can-create');
  const [customerData, setCustomerData] = useState({});
  const [pemutihan, setPemutihan] = useState([]);
  const [koreksi, setKoreksi] = useState([]);

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
        setKoreksi(data.koreksi);
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
    setPemutihan([]);
    setKoreksi([]);
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
   * Pinjaman yang sudah punya pengajuan pelunasan (top-up, `previous_loan_id`)
   * yang masih open/acc: angsurannya diselesaikan lewat drop pelunasan. Form
   * tetap tampil, tapi begitu nominal/Simpan disentuh muncul peringatan (lihat
   * BayarAngsuran) - server juga menolak.
   */
  const pelunasanTertunda = !!customerData.pengajuan_pengganti;
  const angsuranGateValue = gateValue;

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : modalIsClosed())}>
      {/* Layar penuh di HP; di layar lebar tetap kotak besar di tengah. */}
      <DialogContent className="flex flex-col gap-2 w-screen max-w-none h-[100dvh] p-2 rounded-none sm:rounded-none lg:max-w-4xl lg:h-[90vh] lg:p-6 lg:rounded-lg"
        closeClassName="right-2 top-2 rounded-full opacity-100 data-[state=open]:bg-transparent data-[state=open]:text-red-600 data-[state=open]:hover:bg-red-50"
        closeIcon={<CircleX className="w-8 h-8" strokeWidth={1.75} />}
      >
        <DialogHeader className={'max-h-10'}>
          <DialogTitle className="flex items-center justify-center min-w-0 gap-2 px-11 py-2 text-center">
            <span className="truncate">{customerData.nama || 'Isi Angsuran'}</span>
            {customerData.tanggal_drop && (
              <BargeStatus value={kategoriEmber(customerData.tanggal_drop, tanggalTerpilih)}>
                {kategoriEmber(customerData.tanggal_drop, tanggalTerpilih).toUpperCase()}
              </BargeStatus>
            )}
          </DialogTitle>
          {/* <Button type="button" /> */}
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
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
                  <TabsTrigger value="input" className="text-xs">
                    Input Angs
                  </TabsTrigger>
                  <TabsTrigger value="detail" className="text-xs">
                    Detail Pinj
                  </TabsTrigger>
                  <TabsTrigger value="pemutihan" className="text-xs">
                    Pemutihan
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="input" className="mt-3 space-y-3">
                  <div className="relative">
                  {customerData.lunas ? (
                    // Sudah lunas: tidak ada lagi yang diinput, form diganti kartu.
                    <div className="flex flex-col items-center gap-1 px-4 py-6 text-center border border-green-200 rounded-lg bg-green-50">
                      <div className="text-base font-semibold text-green-800">Angsuran sudah lunas</div>
                      {customerData.pay_off_date && (
                        <div className="text-xs text-green-700">
                          Lunas pada{' '}
                          {new Date(`${customerData.pay_off_date}T00:00:00`).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    angsuranGateValue && <NoEditOverlay value={angsuranGateValue} />
                  )}
                  {/* Form TIDAK dibongkar saat data dimuat ulang (habis kirim, gagal
                      maupun sukses) - kalau dibongkar, isian & pesan error hilang. */}
                  {!customerData.id ? (
                    loading && <div className="text-xs text-muted-foreground">Memuat…</div>
                  ) : customerData.lunas ? null : (
                    <BayarAngsuran
                      triggeredId={customerData.id}
                      triggeredPinjaman={customerData}
                      instalment={instalment}
                      pelunasanTertunda={pelunasanTertunda}
                    />
                  )}
                  </div>
                  {customerData.id && !customerData.lunas && (
                    <Pengajuan triggeredId={customerData.id} triggeredPinjaman={customerData} terkunci={gateValue} />
                  )}
                </TabsContent>
                <TabsContent value="detail" className="mt-3">
                  <LoanDetail customerData={customerData} />
                </TabsContent>
                <TabsContent value="pemutihan" className="relative mt-3">
                  {gateValue && <NoEditOverlay value={gateValue} />}
                  {customerData.id && (
                    <WhiteOff
                      triggeredId={customerData.id}
                      nominalWhiteOff={Math.max(Number(customerData.saldo) || 0, 0)}
                      hari={customerData.hari}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <div className="w-full mt-3">
            <Card className="w-full">
              <CardHeader className="px-3 py-2.5 lg:px-5">
                <CardTitle className="text-sm">Rincian Angsuran</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-3 lg:px-5">
                {pemutihan.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 mb-2 text-xs text-red-800 border border-red-200 rounded-md bg-red-50">
                    <span>Pemutihan {dayjs(p.transaction_date).format('DD-MM-YYYY')}</span>
                    <FormatNumbering value={p.nominal} className="inline font-semibold" />
                  </div>
                ))}

                {/* table-fixed + lebar kolom: muat di modal HP tanpa geser
                    horizontal; Mantri mengambil sisa ruang dan dipotong. */}
                <Table className="text-xs table-fixed">
                  <colgroup>
                    <col className="w-[3.4rem]" />
                    <col className="w-[2.9rem]" />
                    <col className="w-[4.8rem]" />
                    <col />
                  </colgroup>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {['', 'Tgl', 'Angsuran', 'Mantri'].map((judul) => (
                        <TableHead
                          key={judul}
                          className={`h-8 px-1 text-[10px] font-semibold tracking-wide uppercase ${judul === 'Angsuran' ? 'text-right' : 'text-left'}`}
                        >
                          {judul}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(customerData).length !== 0 ? (
                      rincianPerBulan(instalment, customerData.pinjaman, koreksi, customerData.tanggal_drop).map(
                        (bulan, i, arr) => (
                          <React.Fragment key={bulan.kunci}>
                            {bulan.rows.map((item) => (
                              <TableRow key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <TableCell className="px-1 py-1.5">
                                  {item.pelunasan ? (
                                    <span className="text-[10px] font-semibold text-muted-foreground">Pelunasan</span>
                                  ) : (
                                    (!closed_transaction || closed_transaction <= item.transaction_date) && (
                                      <DeleteAngsuran id={item.id} />
                                    )
                                  )}
                                </TableCell>
                                <TableCell className="px-1 py-1.5 text-muted-foreground whitespace-nowrap">
                                  {dayjs(item.transaction_date).format('DD-MM')}
                                </TableCell>
                                <TableCell
                                  className={`px-1 py-1.5 text-right font-medium tabular-nums whitespace-nowrap ${
                                    item.danatitipan == 1 ? 'text-red-600 font-semibold' : ''
                                  }`}
                                >
                                  {item.is_transfer && (
                                    <span className="mr-1 text-[9px] font-bold text-violet-600">TF</span>
                                  )}
                                  <FormatNumbering value={item.nominal} className="inline" />
                                </TableCell>
                                <TableCell className="px-1 py-1.5 truncate text-muted-foreground">{item.mantri}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className={`border-0 font-semibold ${WARNA_EMBER[bulan.kategori]}`}>
                              <TableCell colSpan={2} className="px-1 py-2">
                                <div className="truncate">
                                  {bulan.nama}
                                  <span className="font-normal opacity-70"> · {bulan.kategori.toUpperCase()}</span>
                                </div>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-right tabular-nums whitespace-nowrap">
                                <FormatNumbering value={bulan.total} className="inline" />
                              </TableCell>
                              <TableCell className="px-1 py-2 text-right tabular-nums whitespace-nowrap">
                                <span className="font-normal opacity-70">Sisa </span>
                                <FormatNumbering value={bulan.saldo} className="inline" />
                              </TableCell>
                            </TableRow>
                            {i < arr.length - 1 && (
                              <TableRow className="border-0 hover:bg-transparent">
                                <TableCell colSpan={4} className="h-3 p-0" />
                              </TableRow>
                            )}
                          </React.Fragment>
                        ),
                      )
                    ) : erorAxios ? (
                      <TableRow>
                        <TableCell colSpan={4} className="font-semibold text-red-500">
                          TERJADI KESALAHAN SAAT PENGAMBILAN DATA, MOHON REFRESH BROWSER
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-muted-foreground">
                          Menunggu data . . .
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="relative grid w-full grid-cols-1 gap-3 mt-3">
            {gateValue && <NoEditOverlay value={gateValue} />}
            {loading ? (
              <div>Loading</div>
            ) : (
              <div className="min-w-0">
                <JenisNasabah loan={customerData} />
              </div>
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

/**
 * Rincian angsuran dikelompokkan per bulan (terbaru di atas, sama dengan urutan
 * server); ringkasan bulan di bawah grupnya, antar bulan diberi jarak. Saldo
 * cukup satu per bulan = sisa di akhir bulan itu, rumus F8 (sama dengan server):
 * pinjaman − angsuran s/d akhir bulan + efek koreksi s/d akhir bulan
 * (pemutihan bernilai minus, penyesuaian sesuai arahnya).
 */
const rincianPerBulan = (instalment, pinjaman, koreksi, tanggalDrop) => {
  const grup = {};
  instalment.forEach((i) => {
    const kunci = String(i.transaction_date).slice(0, 7);
    (grup[kunci] ??= []).push(i);
  });

  let kumulatif = 0;
  const naik = Object.keys(grup)
    .sort()
    .map((kunci) => {
      const total = grup[kunci].reduce((t, i) => t + (Number(i.nominal) || 0), 0);
      kumulatif += total;
      const akhirBulan = dayjs(`${kunci}-01`).endOf('month').format('YYYY-MM-DD');
      const efek = koreksi.reduce((t, k) => (String(k.tanggal) <= akhirBulan ? t + (Number(k.efek) || 0) : t), 0);
      return {
        kunci,
        nama: new Date(`${kunci}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        rows: grup[kunci],
        kategori: kategoriEmber(tanggalDrop, `${kunci}-01`),
        total,
        saldo: (Number(pinjaman) || 0) - kumulatif + efek,
      };
    });

  return naik.reverse();
};

/**
 * Kategori ember pinjaman pada tanggal yang dibuka (aturan Ember::dari):
 * selisih bulan kalender drop -> tanggal < 3 normal, 3 cm, 4 mb, >= 5 ml.
 */
const kategoriEmber = (tanggalDrop, tanggal) => {
  const [y1, m1] = String(tanggalDrop).split('-').map(Number);
  const [y2, m2] = String(tanggal || dayjs().format('YYYY-MM-DD')).split('-').map(Number);
  const selisih = y2 * 12 + m2 - (y1 * 12 + m1);
  return selisih >= 5 ? 'ml' : selisih === 4 ? 'mb' : selisih === 3 ? 'cm' : 'normal';
};

/** Latar baris Total bulan menurut ember (warna sama dengan badge status). */
const WARNA_EMBER = {
  normal: 'bg-green-50 text-green-900 hover:bg-green-50',
  cm: 'bg-amber-50 text-amber-900 hover:bg-amber-50',
  mb: 'bg-red-50 text-red-900 hover:bg-red-50',
  ml: 'bg-gray-200 text-gray-900 hover:bg-gray-200',
};

