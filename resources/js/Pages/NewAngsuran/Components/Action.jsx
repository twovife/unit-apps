import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import React, { useContext, useEffect, useState } from 'react';
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
import { Link, router, usePage } from '@inertiajs/react';
import { useFilterAngsuran } from '../FilterAngsuran';
import NoEditOverlay from '@/Components/NoEditOverlay';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Copy, CircleX, Lock, Pencil } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import Pengajuan from './Pengajuan';
import HapusPemutihan from './HapusPemutihan';
import HapusPinjamanKoreksi from './HapusPinjamanKoreksi';
import Loading from '@/Components/Loading';
import DialogKoreksi, { KoreksiBekuContext } from '@/Pages/Migrasi/Components/DialogKoreksi';
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
  const [penyesuaian, setPenyesuaian] = useState([]);

  const [instalment, setInstalment] = useState([]);
  // Buku Angsuran Beku (superuser): data sebelum migrasi dikoreksi lewat Koreksi Beku.
  const kb = useContext(KoreksiBekuContext);
  const [koreksiBuka, setKoreksiBuka] = useState(null);
  const [tglTambah, setTglTambah] = useState('');

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
        setPenyesuaian(data.penyesuaian ?? []);
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
    setPenyesuaian([]);
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
                  {/* Sudah diputihkan: tab hilang - hapus pemutihannya dulu (kartu di Rincian) kalau perlu diulang. */}
                  {pemutihan.length === 0 && (
                    <TabsTrigger value="pemutihan" className="text-xs">
                      Pemutihan
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="input" className="mt-3 space-y-3">
                  {kb && customerData.id && customerData.tanggal_drop < kb.mulai && (
                    <div className="flex flex-wrap items-center gap-2 p-2 text-xs border rounded-md border-sky-300 bg-sky-50 text-sky-900">
                      <span className="font-medium">Tambah angsuran sebelum migrasi</span>
                      <input
                        type="date"
                        className="h-8 px-2 border rounded-md border-input bg-background"
                        min={String(customerData.tanggal_drop).slice(0, 10)}
                        max={dayjs(kb.mulai).subtract(1, 'day').format('YYYY-MM-DD')}
                        value={tglTambah}
                        onChange={(e) => setTglTambah(e.target.value)}
                      />
                      <Button size="sm" className="h-8" disabled={!tglTambah} onClick={() => setKoreksiBuka({ aksi: 'tambah', tanggal: tglTambah })}>
                        Koreksi beku…
                      </Button>
                    </div>
                  )}
                  <div className="relative">
                  {customerData.pecahan_ml ? (
                    // Pecahan MACET LAMA: tanpa tanda lunas, setoran berikutnya lewat Input ML.
                    <div className="px-4 py-6 space-y-3 text-sm text-center border rounded-lg text-slate-600 bg-slate-50">
                      <div>
                        Setoran ML (pecahan MACET LAMA). Setoran berikutnya nasabah ini lewat tombol <b>Input ML</b> di Pinjaman Macet.
                      </div>
                      {customerData.hapus_input_ml && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200"
                          onClick={() =>
                            window.confirm(`Hapus Input ML ${customerData.nama}? Saldonya kembali ke MACET LAMA.`) &&
                            router.delete(route('input_ml.hapus', customerData.id), { preserveScroll: true, onSuccess: modalIsClosed })
                          }
                        >
                          Hapus Input ML (salah input)
                        </Button>
                      )}
                    </div>
                  ) : customerData.lunas ? (
                    // Sudah lunas: tidak ada lagi yang diinput, form diganti kartu.
                    <div className="flex flex-col items-center gap-1 px-4 py-6 text-center border border-green-200 rounded-lg bg-green-50">
                      <div className="text-base font-semibold text-green-800">Angsuran sudah lunas</div>
                      {customerData.pelunasan_oleh && (
                        <div className="w-full p-2 mt-2 text-xs font-semibold text-red-700 border border-red-200 rounded-md bg-red-50">
                          NASABAH PELUNASAN — HAPUS DROP PELUNASAN UNTUK MENGHAPUS ANGSURAN PELUNASAN.
                          <div className="mt-1">
                            <Link
                              href={route('transaction.index_buku_transaksi', {
                                kelompok: customerData.pelunasan_oleh.kelompok,
                                hari: customerData.pelunasan_oleh.hari,
                                month: String(customerData.pelunasan_oleh.drop_date ?? '').slice(0, 7) || undefined,
                              })}
                              className="font-medium text-blue-600 underline"
                            >
                              Ke Buku Transaksi (drop {customerData.pelunasan_oleh.drop_date})
                            </Link>
                          </div>
                        </div>
                      )}
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
                  ) : customerData.lunas || customerData.pecahan_ml ? null : (
                    <BayarAngsuran
                      triggeredId={customerData.id}
                      triggeredPinjaman={customerData}
                      instalment={instalment}
                      pelunasanTertunda={pelunasanTertunda}
                    />
                  )}
                  </div>
                  {customerData.id && !customerData.lunas && !customerData.pecahan_ml && (
                    <Pengajuan triggeredId={customerData.id} triggeredPinjaman={customerData} terkunci={gateValue} />
                  )}
                </TabsContent>
                <TabsContent value="detail" className="mt-3">
                  <LoanDetail customerData={customerData} />
                  {/* Khusus can-edit / superuser (server mengisi hapus_pinjaman hanya untuk mereka). */}
                  {kb && customerData.drop_beku ? (
                    <div className="flex items-center justify-between gap-2 p-3 mt-3 border border-red-200 rounded-lg bg-red-50/50">
                      <div className="text-sm text-red-700">
                        <div className="font-semibold">Hapus Pinjaman (koreksi beku)</div>
                        <div className="text-xs text-slate-700">Drop sebelum migrasi: pinjaman & angsurannya dihapus lewat Koreksi Beku.</div>
                      </div>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => setKoreksiBuka({ aksi: 'hapus_pinjaman' })}>
                        Hapus…
                      </Button>
                    </div>
                  ) : (
                    <HapusPinjamanKoreksi data={customerData.hapus_pinjaman} id={customerData.id} onClosed={modalIsClosed} />
                  )}
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
                {pemutihan.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 px-3 py-2 mb-2 text-xs text-red-800 border border-red-200 rounded-md bg-red-50">
                    <span>
                      Pemutihan (MD) {dayjs(p.transaction_date).format('DD-MM-YYYY')} ·{' '}
                      <FormatNumbering value={p.nominal} className="inline font-semibold" />
                    </span>
                    {kb && p.beku ? (
                      <Button
                        size="xs"
                        variant="outline"
                        className="text-red-600 border-red-300"
                        onClick={() => setKoreksiBuka({ aksi: 'hapus_pemutihan', pemutihan: { id: p.id, tanggal: p.transaction_date, nominal: Number(p.nominal) } })}
                      >
                        Hapus (koreksi beku)
                      </Button>
                    ) : p.terkunci ? (
                      <span title="Tanggal pemutihan sudah dikunci" className="inline-flex text-slate-400">
                        <Lock className="w-3.5 h-3.5" aria-label="terkunci" />
                      </span>
                    ) : (
                      <HapusPemutihan p={p} />
                    )}
                  </div>
                ))}

                {/* Buku Angsuran Beku: penyesuaian saldo ditampilkan (ke mana saldonya pergi). */}
                {kb &&
                  penyesuaian.map((a) => (
                    <div
                      key={a.id}
                      className="px-3 py-2 mb-2 text-xs border rounded-md border-violet-200 bg-violet-50 text-violet-900"
                    >
                      Penyesuaian <b>{a.jenis.replace('_', ' ')}</b> {a.efek < 0 ? '−' : '+'}
                      <FormatNumbering value={a.nominal} className="inline font-semibold" /> · berlaku{' '}
                      {dayjs(a.berlaku).format('MMM YYYY')} (mengubah saldo per {dayjs(a.berlaku).subtract(1, 'day').format('DD-MM-YYYY')})
                      <div className="text-[11px] text-violet-700">
                        Dibuat {a.dibuat ? dayjs(a.dibuat).format('DD-MM-YYYY HH:mm') : '—'}
                        {a.oleh ? ` oleh ${a.oleh}` : ''}
                        {a.catatan ? ` · ${a.catatan}` : ''}
                      </div>
                    </div>
                  ))}

                {/* Tabel rincian: per bulan (terbaru di atas), baris ringkasan
                    bulan di bawahnya - Sisa sejajar kolom Mantri. table-fixed,
                    nama dipotong, lengkapnya di title. */}
                {customerData.pengajuan_pengganti && (
                  <div className="p-2 mb-2 text-xs border rounded-md border-amber-300 bg-amber-50 text-amber-900">
                    Nasabah ini sudah diajukan pinjaman baru - angsuran tidak bisa dihapus. Batalkan pengajuannya dulu di
                    bagian Pengajuan.
                  </div>
                )}
                <div className="overflow-hidden border rounded-md border-slate-200">
                <Table className="text-xs table-fixed">
                  {/* Lebar proporsional: tidak menumpuk di kiri saat modal lebar,
                      batas bawah supaya tetap muat di HP. */}
                  <colgroup>
                    <col className="w-[14%] min-w-[3.4rem]" />
                    <col className="w-[13%] min-w-[2.9rem]" />
                    <col className="w-[19%] min-w-[5rem]" />
                    <col className="w-[27%]" />
                    <col className="w-[27%]" />
                  </colgroup>
                  <TableHeader className="bg-slate-100">
                    <TableRow className="hover:bg-slate-100">
                      {['', 'Tgl', 'Angsuran', 'Mantri', 'Input'].map((judul) => (
                        <TableHead
                          key={judul}
                          className={`h-8 px-1.5 text-[10px] font-semibold tracking-wide uppercase text-slate-600 ${judul === 'Angsuran' ? 'text-right' : 'text-left'}`}
                        >
                          {judul}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(customerData).length !== 0 ? (
                      rincianPerBulan(instalment, customerData.pinjaman, koreksi, customerData.tanggal_drop).map(
                        (bulan) => (
                          <React.Fragment key={bulan.kunci}>
                            {bulan.rows.map((item) => (
                              <TableRow key={item.id} className="border-b border-slate-100 even:bg-slate-50/60 hover:bg-sky-50">
                                <TableCell className="px-1.5 py-1.5">
                                  {item.pelunasan ? (
                                    <span className="text-[10px] font-semibold text-muted-foreground">Pelunasan</span>
                                  ) : kb && item.beku ? (
                                    <button
                                      type="button"
                                      title="Koreksi beku: ubah / hapus angsuran ini"
                                      className="inline-flex text-sky-600 hover:text-sky-800"
                                      onClick={() =>
                                        setKoreksiBuka({
                                          aksi: 'ubah',
                                          angsuran: { id: item.id, nominal: Number(item.nominal), tanggal: item.transaction_date },
                                        })
                                      }
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    (!closed_transaction || closed_transaction <= item.transaction_date) &&
                                    (item.terkunci ? (
                                      // Tanggal terkunci kasir / beku: tidak bisa dihapus.
                                      <span title="Tanggal ini sudah dikunci" className="inline-flex text-slate-400">
                                        <Lock className="w-3.5 h-3.5" aria-label="terkunci" />
                                      </span>
                                    ) : customerData.pengajuan_pengganti ? (
                                      // Sudah diajukan pinjaman baru: batalkan pengajuannya dulu.
                                      <span
                                        title="Nasabah sudah diajukan. Batalkan pengajuan dulu (menu Pengajuan) untuk menghapus angsuran."
                                        className="inline-flex text-amber-500"
                                      >
                                        <Lock className="w-3.5 h-3.5" aria-label="ada pengajuan" />
                                      </span>
                                    ) : (
                                      <DeleteAngsuran id={item.id} tanggal={item.transaction_date} nominal={item.nominal} />
                                    ))
                                  )}
                                </TableCell>
                                <TableCell className="px-1.5 py-1.5 tabular-nums text-slate-600 whitespace-nowrap">
                                  {dayjs(item.transaction_date).format('DD-MM')}
                                </TableCell>
                                <TableCell
                                  className={`px-1.5 py-1.5 text-right font-medium tabular-nums whitespace-nowrap ${
                                    item.danatitipan == 1 ? 'text-red-600 font-semibold' : ''
                                  }`}
                                >
                                  {item.is_transfer && (
                                    <span className="mr-1 text-[9px] font-bold text-violet-600">TF</span>
                                  )}
                                  <FormatNumbering value={item.nominal} className="inline" />
                                </TableCell>
                                <TableCell className="px-1.5 py-1.5 truncate text-slate-700" title={item.mantri ?? ''}>
                                  {namaPendek(item.mantri) || '–'}
                                </TableCell>
                                <TableCell className="px-1.5 py-1.5 truncate text-slate-500" title={item.user_input ?? ''}>
                                  {namaPendek(item.user_input) || '–'}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className={`border-b-2 border-slate-300 font-semibold ${WARNA_EMBER[bulan.kategori]}`}>
                              <TableCell colSpan={2} className="px-1.5 py-2">
                                <div className="truncate">
                                  {bulan.nama}
                                  <span className="font-normal opacity-70"> · {bulan.kategori.toUpperCase()}</span>
                                </div>
                              </TableCell>
                              <TableCell className="px-1.5 py-2 text-right tabular-nums whitespace-nowrap">
                                <FormatNumbering value={bulan.total} className="inline" />
                              </TableCell>
                              {/* Sisa di bawah kolom Mantri. */}
                              <TableCell className="py-2 pl-4 pr-1.5 tabular-nums whitespace-nowrap">
                                {/* "Sisa" kiri, nominal kanan. */}
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-normal opacity-70">Sisa</span>
                                  <FormatNumbering value={bulan.saldo} className="inline" />
                                </div>
                              </TableCell>
                              <TableCell className="px-1.5 py-2" />
                            </TableRow>
                          </React.Fragment>
                        ),
                      )
                    ) : erorAxios ? (
                      <TableRow>
                        <TableCell colSpan={5} className="font-semibold text-red-500">
                          TERJADI KESALAHAN SAAT PENGAMBILAN DATA, MOHON REFRESH BROWSER
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground">
                          Menunggu data . . .
                        </TableCell>
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
              <div className="min-w-0">
                <JenisNasabah loan={customerData} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      {kb && (
        <DialogKoreksi
          buka={koreksiBuka}
          onClosed={() => setKoreksiBuka(null)}
          pinjaman={{
            id: customerData.id,
            nama: customerData.nama,
            drop_date: customerData.tanggal_drop,
            angsuran: { semua: instalment.map((i) => ({ nominal: Number(i.nominal) || 0 })) },
          }}
          filter={kb.filter}
          mulai={kb.mulai}
          onSaved={(aksi) => (aksi === 'hapus_pinjaman' ? modalIsClosed() : onNikSubmit(customerData.id))}
        />
      )}
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

      {/* Tingkat 2 - nominal pinjaman, jangkar utama mata. Pecahan MACET LAMA (Input ML):
          besar pinjaman tidak diketahui -> tidak ditampilkan (mas 2026-10-26). */}
      <div className="px-3 py-3 border-b">
        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Pinjaman
        </div>
        {customerData.pecahan_ml ? (
          <div className="text-sm font-semibold text-slate-600">Setoran ML (pecahan MACET LAMA)</div>
        ) : (
          <FormatNumbering
            value={customerData.pinjaman}
            className="text-base font-bold leading-tight text-start tabular-nums text-foreground"
          />
        )}
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

/** Nama karyawan dipendekkan ke 2 kata pertama (lengkapnya di title sel). */
const namaPendek = (nama) => String(nama ?? '').trim().split(/\s+/).slice(0, 2).join(' ');

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

