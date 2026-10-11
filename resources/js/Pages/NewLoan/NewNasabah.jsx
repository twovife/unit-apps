import InputError from '@/Components/InputError';
import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import useOptionGenerator from '@/Hooks/useOptionGenerator';
import SelectComponent from '@/Components/shadcn/SelectComponent';
import RiwayatPengajuan from './Components/RiwayatPengajuan';
import CrashAlert from './Components/CrashAlert';
import dayjs from 'dayjs';
import Checkbox from '@/Components/Checkbox';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import NoEditOverlay from '@/Components/NoEditOverlay';
import TanggalKerja from '@/Components/shadcn/TanggalKerja';
import useHariLibur from '@/Hooks/useHariLibur';
import RiwayatPengajuanLain from './Components/RiwayatPengajuanLain';
import RiwayatPengajuanNonBranch from '@/Pages/NewLoan/Components/RiwayatPengajuanNonBranch';

const NewNasabah = ({
  onClosed,
  generateAngsuran = false,
  submitUrl,
  typeInput = 'number',
  // Mobile create: batasi tanggal pengajuan (maks hari ini, maks 7 hari lalu)
  // dan matikan tanggal drop sampai pengajuan dipilih.
  batasiPengajuan = false,
  // Popup bukutransaksi / fastcreate: bebaskan tanggal sepenuhnya (sementara).
  bebasTanggal = false,
  // Pengajuan biasa (popup Buku Transaksi & mobile): tanggal drop tidak dipilih
  // bebas - hanya hari tagih kerja berikutnya, atau drop langsung. Server
  // (store_buku_transaksi) menegakkan aturan yang sama.
  aturanDrop = false,
}) => {
  // getLink after generate
  const { printUrl } = usePage().props;
  // Padanan asli dari nama lama: 'can create' -> 'can-create',
  // 'can show kelompok' -> 'view-all-groups'.
  const { auth } = usePage().props;
  const isCreator = auth?.permissions?.includes('can-create');
  const isCanShowKelompok = auth?.permissions?.includes('view-all-groups');

  const [newGenerate, setNewGenerate] = useState(null);

  useEffect(() => {
    setNewGenerate(printUrl.url);
  }, [printUrl.timestamp]);

  const { optKelompok } = useOptionGenerator();
  const { data, setData, post, errors, processing, reset } = useForm({
    isActiveMember: false,
    nik: '',
    request_date: '',
    tanggal_drop: '',
    nama: '',
    alamat: '',
    kelompok: '',
    nomor_anggota: '',
    request_nominal: 0,
    angsuran: [],
    // Ikut terkirim ke server: kalau true, cek tanggal ketat dilewati (sementara).
    bebas: bebasTanggal,
  });

  // WAJIB sesudah useForm: argumennya membaca `data`, dan memanggilnya di atas
  // sana membuat `data` diakses sebelum dideklarasikan (TDZ) — komponennya
  // gagal render sama sekali, bukan cuma salah nilai.
  const hariIni = dayjs().format('YYYY-MM-DD');

  const { majuKeHariKerja, mundurKeHariKerja, siap: kalenderSiap, alasanLibur } =
    useHariLibur(data.request_date || hariIni);

  // Batas tanggal pengajuan: maksimal HARI INI (tak boleh mendatang), paling
  // lama 7 hari lalu. Kalau batas 7-hari-lalu itu jatuh libur, mundur ke hari
  // kerja sebelumnya supaya mantri tetap punya tanggal valid di ujung rentang.
  const minPengajuan = (() => {
    const mentah = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    return kalenderSiap ? mundurKeHariKerja(mentah) : mentah;
  })();

  // handlingForAngsuranBatchProssess
  const [elements, setElements] = useState([]);
  const [calculatePinjaman, setCalculatePinjaman] = useState(0);

  useEffect(() => {
    const totalPinjaman = parseInt(data.request_nominal ?? 0) * 1.3;

    const totalAngsuran = data.angsuran.reduce((acc, curr) => {
      const nominal = parseInt(curr.nominal, 10);
      return acc + (isNaN(nominal) ? 0 : nominal);
    }, 0);

    setCalculatePinjaman(totalPinjaman - totalAngsuran);
  }, [data.angsuran, data.request_nominal]);

  useEffect(() => {
    setElements([]);
  }, [data.tanggal_drop]);

  useEffect(() => {
    setData('angsuran', elements);
  }, [elements]);

  const addElement = () => {
    const lastTransactionDate =
      elements.length > 0
        ? dayjs(elements[elements.length - 1].transaction_date)
            .add(1, 'week')
            .format('YYYY-MM-DD')
        : data.tanggal_drop
          ? dayjs(data.tanggal_drop).add(1, 'week').format('YYYY-MM-DD')
          : '';

    setElements([
      ...elements,
      { id: Date.now(), transaction_date: lastTransactionDate },
    ]);
  };

  const removeElement = (id) => {
    setElements(elements.filter((element) => element.id !== id));
  };

  const onInputElementChange = (id, name, value) => {
    setElements(
      elements.map((element) =>
        element.id === id ? { ...element, [name]: value } : element,
      ),
    );
  };

  const onHandleElementCurencyChange = (value, name, id) => {
    setElements(
      elements.map((element) =>
        element.id === id ? { ...element, [name]: value } : element,
      ),
    );
  };

  // handling pinjaman proses
  const [nik, setNik] = useState('');

  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState();
  const [customerData, setCustomerData] = useState([]);
  const [mixDate, setMixDate] = useState();

  // Tanggal drop DITURUNKAN, tidak dipilih — jadi penurunannya harus tunduk
  // pada aturan yang sama dengan tanggal yang dipilih orang. Sebelumnya cuma
  // `+1 minggu`, sehingga memilih 10 Agustus menghasilkan 17 Agustus: hari
  // libur yang pasti ditolak server, padahal pemilihnya mematikan tanggal itu
  // untuk klik manual.
  //
  // Lompatannya per MINGGU supaya hari tagih kelompok tidak berubah, dan MAJU
  // karena drop belum terjadi — menggesernya mundur berarti mencairkan
  // pinjaman sebelum diajukan.
  useEffect(() => {
    if (!data.request_date) return;

    setMixDate(data.request_date);
    setData((prevData) => ({
      ...prevData,
      tanggal_drop: majuKeHariKerja(
        dayjs(data.request_date).add(1, 'week').format('YYYY-MM-DD'),
      ),
    }));
  }, [data.request_date, kalenderSiap]);

  const onHandleCurencyChange = (value, name, float) => {
    setData(name, value);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const onNikChange = (e) => {
    const { name, value } = e.target;
    setCustomerData([]);
    setNik(value);
  };

  const controllerRef = useRef(null);

  const onNikSubmit = async (e) => {
    e.preventDefault();

    // Batalkan request sebelumnya kalau masih aktif
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    reset();
    setLoading(true);
    setErorAxios();

    try {
      const { data } = await axios.post(
        route('transaction.nasabah_buku_transaksi'),
        { nik },
        { signal: controller.signal },
      );

      setLoading(false);
      setData((prevData) => ({
        ...prevData,
        nik: data.return_nik,
        isActiveMember: !!data.data,
      }));

      if (data.data) {
        setCustomerData(data.data);
      } else {
        setCustomerData([]);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        // Dibatalkan karena ada pencarian baru — bukan kegagalan, jangan
        // tampilkan apa-apa ke user.
      } else {
        setErorAxios(error.response?.data?.message || 'Terjadi kesalahan.');
        setLoading(false);
      }
    }
  };

  const modalIsClosed = (e) => {
    onClosed();
    reset();
  };

  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(submitUrl, {
      onSuccess: () => {
        modalIsClosed();
      },
      replace: true,
    });
  };

  const buttonValue = [
    { value: 300000, label: '300rb' },
    { value: 400000, label: '400rb' },
    { value: 500000, label: '500rb' },
    { value: 700000, label: '700rb' },
    { value: 800000, label: '800rb' },
    { value: 1000000, label: '1 jt' },
    { value: 1300000, label: '1,3 jt' },
    { value: 1500000, label: '1,5 jt' },
    { value: 2000000, label: '2 jt' },
  ];

  const buttonValueClick = (e) => {
    const value = e.target.getAttribute('data-value');
    setData('request_nominal', value);
  };
  // newGenerate
  return (
    <div className="flex flex-col w-full gap-5 xl:flex-row">
      <Loading show={loading || processing} />
      <div className="w-full xl:w-[30rem] xl:shrink-0 space-y-4">
        <fieldset className="p-4 border rounded-lg bg-muted/20">
          <legend className="px-1 -ml-1 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Cek NIK Nasabah
          </legend>
          <form className="w-full" onSubmit={onNikSubmit}>
            <Label htmlFor="cari-nik">NIK</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cari-nik"
                type={typeInput}
                name="nik"
                value={nik}
                onChange={onNikChange}
                placeholder="16 digit NIK"
                className="tabular-nums"
              />
              <Button size="sm" className="shrink-0">
                <Search className="w-4 h-4 mr-1" />
                Cari
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${
                  nik.length === 16
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {nik.length} / 16 digit
              </span>
              {nik.length > 0 && nik.length !== 16 && (
                <span className="text-xs text-muted-foreground">
                  NIK harus tepat 16 digit
                </span>
              )}
            </div>

            {erorAxios && <InputError message={erorAxios} className="mt-2" />}

            {newGenerate && (
              <a
                href={newGenerate ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-sm underline text-primary underline-offset-2"
              >
                Lihat transaksi terakhir
              </a>
            )}
          </form>
        </fieldset>
        <div className="relative">
          {!(nik && data.nik == nik) && (
            <div className="flex flex-col items-center justify-center gap-1 px-6 py-10 text-center border border-dashed rounded-lg">
              <Search className="w-5 h-5 mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">Belum ada nasabah dipilih</div>
              <p className="max-w-xs text-xs text-muted-foreground">
                Cari NIK di atas dulu. Detail pinjaman terbuka setelah nasabahnya
                ketemu.
              </p>
            </div>
          )}
          {nik && data.nik == nik && (
            <fieldset className="w-full p-4 border rounded-lg">
              {!isCreator && (
                <NoEditOverlay value="User Tidak Dapat Digunakan Untuk Menambah Pinjaman" />
              )}
              <legend className="px-1 -ml-1 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                Detail Pinjaman
              </legend>
              <CrashAlert
                historyBranch={customerData?.history_branch}
                kelompok={data.kelompok}
                tanggalDrop={data.tanggal_drop}
              />
              <form className="w-full" onSubmit={onSubmitCreate}>
                <div className="flex flex-col gap-5 lg:flex-row">
                  <div className="flex-1">
                    <div className="flex gap-3">
                      <div className="w-full mb-3">
                        <Label>Tanggal Pengajuan</Label>
                        <TanggalKerja
                          name="request_date"
                          required={true}
                          min={batasiPengajuan ? minPengajuan : undefined}
                          max={batasiPengajuan ? hariIni : undefined}
                          bebas={bebasTanggal}
                          value={data.request_date}
                          onChange={onInputChange}
                        />
                        <InputError message={errors.request_date} />
                      </div>
                      <div className="w-full mb-3">
                        <Label>Tanggal Drop</Label>
                        {aturanDrop ? (
                          <select
                            name="tanggal_drop"
                            required
                            disabled={!data.request_date}
                            value={data.tanggal_drop}
                            onChange={onInputChange}
                            className="w-full h-9 px-3 text-sm border rounded-md border-input bg-background"
                          >
                            {data.request_date && (
                              <>
                                <option value={majuKeHariKerja(dayjs(data.request_date).add(1, 'week').format('YYYY-MM-DD'))}>
                                  {dayjs(majuKeHariKerja(dayjs(data.request_date).add(1, 'week').format('YYYY-MM-DD'))).format('DD MMM YYYY')}{' '}
                                  (minggu depan)
                                </option>
                                <option value={data.request_date}>
                                  {dayjs(data.request_date).format('DD MMM YYYY')} (drop baru)
                                </option>
                              </>
                            )}
                          </select>
                        ) : (
                        <TanggalKerja
                          name="tanggal_drop"
                          min={mixDate}
                          // Kunci ke hari tagih = weekday pengajuan (backend juga
                          // menolak "Hari Tidak Sama"). Drop selalu di hari yang
                          // sama, minggu ini (langsung) atau minggu berikutnya.
                          hariTagih={
                            data.request_date
                              ? dayjs(data.request_date).day()
                              : null
                          }
                          required={true}
                          disabled={batasiPengajuan && !data.request_date}
                          bebas={bebasTanggal}
                          value={data.tanggal_drop}
                          onChange={onInputChange}
                        />
                        )}
                        {/* Peringatan libur hanya untuk pengajuan (drop minggu depan),
                            bukan drop langsung (drop = hari pengajuan). */}
                        {data.request_date &&
                          data.tanggal_drop &&
                          data.tanggal_drop !== data.request_date &&
                          data.tanggal_drop !==
                            dayjs(data.request_date)
                              .add(1, 'week')
                              .format('YYYY-MM-DD') && (
                            <p className="mt-1 text-xs text-amber-700">
                              Minggu depan jatuh hari libur
                              {alasanLibur(
                                dayjs(data.request_date)
                                  .add(1, 'week')
                                  .format('YYYY-MM-DD'),
                              )
                                ? ` (${alasanLibur(
                                    dayjs(data.request_date)
                                      .add(1, 'week')
                                      .format('YYYY-MM-DD'),
                                  )})`
                                : ''}
                              , dilompat ke hari tagih berikutnya.
                            </p>
                          )}
                        <InputError message={errors.tanggal_drop} />
                      </div>
                    </div>
                    <div className="w-full mb-3">
                      {data.request_date &&
                      data.request_date == data.tanggal_drop ? (
                        <span className="inline-flex items-center px-3 py-1 text-base font-bold tracking-wide text-white bg-red-600 rounded-md shadow-sm">
                          DROP BARU
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 text-base font-bold tracking-wide text-white rounded-md shadow-sm bg-sky-600">
                          PENGAJUAN DROP
                        </span>
                      )}
                    </div>
                    <div className="w-full mb-3">
                      <Label optional>NIK</Label>
                      <Input
                        type="text"
                        name="nik"
                        value={data.nik}
                        disabled
                        onChange={onInputChange}
                      />
                      <InputError message={errors.nik} />
                    </div>

                    {!data.isActiveMember ? (
                      <>
                        <div className="w-full mb-3">
                          <Label>Nama</Label>
                          <Input
                            type="text"
                            name="nama"
                            value={data.nama}
                            onChange={onInputChange}
                            required={true}
                          />
                          <InputError message={errors.nama} />
                        </div>
                        <div className="w-full mb-3">
                          <Label>Alamat</Label>
                          <Input
                            type="text"
                            name="alamat"
                            value={data.alamat}
                            onChange={onInputChange}
                            required={true}
                          />
                          <InputError message={errors.alamat} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full mb-3">
                          <Label>Nama</Label>
                          <Input
                            type="text"
                            disabled
                            value={customerData.nama ?? ''}
                          />
                        </div>
                        <div className="w-full mb-3">
                          <Label>Alamat</Label>
                          <Input
                            type="text"
                            disabled
                            value={customerData.alamat ?? ''}
                          />
                        </div>
                      </>
                    )}
                    <div className="w-full mb-3">
                      <Label>
                        Nomor Anggota{' '}
                        <span className="font-normal text-gray-500">(nomor anggota di promes / buku manual)</span>
                      </Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="nomor_anggota"
                        value={data.nomor_anggota}
                        // Nomor anggota hanya angka: huruf dibuang saat diketik.
                        onChange={(e) => setData('nomor_anggota', e.target.value.replace(/\D/g, ''))}
                        required={true}
                      />
                      <InputError message={errors.nomor_anggota} />
                    </div>
                    {isCanShowKelompok && (
                      <div className="w-full mb-3">
                        <Label>Kelompok</Label>
                        <SelectComponent
                          value={data.kelompok}
                          options={optKelompok}
                          name="kelompok"
                          nullvalue={true}
                          onChange={onInputChange}
                        />
                        <InputError message={errors.kelompok} />
                      </div>
                    )}

                    <div className="w-full mb-3">
                      <Label>Nominal Pinjaman</Label>
                      <CurrencyInput
                        className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        name="request_nominal"
                        defaultValue={0}
                        allowDecimals={false}
                        prefix="Rp. "
                        min={1}
                        required
                        onValueChange={onHandleCurencyChange}
                        value={data.request_nominal}
                        placeholder={'Inputkan angka tanpa sparator'}
                      />
                      <InputError message={errors.request_nominal} />
                    </div>
                    <div className="grid grid-cols-4 mb-3 gap-x-2 gap-y-1">
                      {buttonValue.map((button, key) => (
                        <Button
                          type="button"
                          size="xs"
                          key={key}
                          data-value={button.value}
                          onClick={buttonValueClick}
                        >
                          {button.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {elements.length > 0 && (
                    <div className="flex-1">
                      {elements.map((element, key) => (
                        <div
                          key={element.id}
                          className="flex flex-col gap-3 mb-3 lg:flex-row"
                        >
                          <div className="w-full">
                            <Label>Tanggal Storting</Label>
                            <TanggalKerja
                              name="transaction_date"
                              min={dayjs(data.tanggal_drop)
                                .add(1, 'week')
                                .format('YYYY-MM-DD')}
                              hariTagih={
                                data.tanggal_drop
                                  ? dayjs(data.tanggal_drop).day()
                                  : null
                              }
                              required={true}
                              value={element.transaction_date}
                              onChange={(e) =>
                                onInputElementChange(
                                  element.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="w-full">
                            <Label>Nominal</Label>
                            <div className="flex items-center justify-start gap-3">
                              <div className="flex-1 min-w-32">
                                <CurrencyInput
                                  className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  name="nominal"
                                  defaultValue={0}
                                  allowDecimals={false}
                                  prefix="Rp. "
                                  min={1}
                                  required
                                  onValueChange={(value, name) =>
                                    onHandleElementCurencyChange(
                                      parseInt(value),
                                      name,
                                      element.id,
                                    )
                                  }
                                  value={element.nominal}
                                  placeholder={'Inputkan angka tanpa sparator'}
                                />
                              </div>

                              <div className="flex items-center justify-start gap-1">
                                <Checkbox
                                  name="dana_titipan"
                                  id={`dana_titipan_${element.id}`}
                                  checked={element.isActiveMember}
                                  onChange={(e) =>
                                    onInputElementChange(
                                      element.id,
                                      e.target.name,
                                      e.target.checked,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`dana_titipan_${element.id}`}
                                  className="whitespace-nowrap"
                                  nomb={true}
                                >
                                  Dana Titipan
                                </Label>
                              </div>
                              <Button
                                onClick={() => removeElement(element.id)}
                                type="button"
                                size="iconsm"
                                variant="outline"
                              >
                                <X className="w-auto h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        className={`flex items-center justify-end gap-3 rounded-md px-3 py-2 text-sm font-semibold tabular-nums ${
                          calculatePinjaman === 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span>Saldo Tersisa</span>
                        <FormatNumbering value={calculatePinjaman} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t">
                  {generateAngsuran && data.tanggal_drop && (
                    <Button type="button" onClick={addElement} variant="outline">
                      Tambah Angsuran
                    </Button>
                  )}
                  <Button type="button" variant="ghost" onClick={modalIsClosed}>
                    Batal
                  </Button>
                  <Button>Simpan Pengajuan</Button>
                </div>
              </form>
            </fieldset>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full min-w-0 gap-3">
        <div>
          <h3 className="text-sm font-semibold">Riwayat Pengajuan</h3>
          <p className="text-xs text-muted-foreground">
            {customerData?.nama
              ? `Rekam jejak ${customerData.nama} sebagai bahan pertimbangan.`
              : 'Muncul setelah NIK ditemukan.'}
          </p>
        </div>

        <Tabs defaultValue="pengajuan" className="flex flex-col w-full min-w-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pengajuan">Kantor ini</TabsTrigger>
            <TabsTrigger value="pinjaman">Kantor lain &mdash; macet</TabsTrigger>
            <TabsTrigger value="pinjaman2">Kantor lain &mdash; target</TabsTrigger>
          </TabsList>
          <TabsContent value="pengajuan">
            <div className="overflow-auto border rounded-lg scrollbar-thin max-h-[55vh]">
              <RiwayatPengajuan data={customerData?.history_branch} />
            </div>
          </TabsContent>
          <TabsContent value="pinjaman">
            <div className="overflow-auto border rounded-lg scrollbar-thin max-h-[55vh]">
              <RiwayatPengajuan data={customerData?.history_macet_lain} />
            </div>
          </TabsContent>
          <TabsContent value="pinjaman2">
            <div className="overflow-auto border rounded-lg scrollbar-thin max-h-[55vh]">
              <RiwayatPengajuan data={customerData?.history_target} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewNasabah;
