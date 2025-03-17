import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import InputLabel from '@/Components/InputLabel';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Search, SearchCheck } from 'lucide-react';
import Loading from '@/Components/Loading';
import { useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import useFrontEndPermission from '@/Hooks/useFrontEndPermission';
import { Label } from '@/shadcn/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import axios from 'axios';
import CurrencyInput from 'react-currency-input-field';
import SelectComponent from '@/Components/shadcn/SelectComponent';
import useOptionGenerator from '@/Hooks/useOptionGenerator';
import RiwayatPengajuan from '@/Pages/NewLoan/Components/RiwayatPengajuan';
import LinkButton from '@/Components/LinkButton';
import DatePicker from '@/Components/shadcn/DatePicker';

const InputMacet = ({ show, onClosed }) => {
  const { isUnit, isMantri, isCanShowKelompok, isCreator } =
    useFrontEndPermission();
  const { auth } = usePage().props;

  const initialKelompok = isCanShowKelompok
    ? localStorage.getItem('currentKelompok') || 1
    : auth.user.employee.area;
  const [currentKelompok, setCurrentKelompok] = useState(initialKelompok);

  useEffect(() => {
    localStorage.setItem('currentKelompok', currentKelompok);
  }, [currentKelompok]);

  const { printUrl } = usePage().props;

  const { optKelompok } = useOptionGenerator();

  const firstDate = new Date();
  const fiveMonthsAgo = new Date(
    firstDate.getFullYear(),
    firstDate.getMonth() - 5,
    0
  );

  const { data, setData, post, errors, processing, reset } = useForm({
    isActiveMember: false,
    nik: '',
    tanggal_drop: dayjs(fiveMonthsAgo).format('YYYY-MM-DD'),
    no_kk: '',
    nama: '',
    alamat: '',
    kelompok: currentKelompok || '',
    request_nominal: 0,
    saldo_before: 0,
    angsuran: [
      {
        transaction_date: dayjs(fiveMonthsAgo).format('YYYY-MM-DD'),
        nominal: 0,
      },
      { transaction_date: dayjs().format('YYYY-MM-DD'), nominal: 0 },
    ],
  });

  const [nik, setNik] = useState('');
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState();
  const [customerData, setCustomerData] = useState([]);
  const [sisaSaldo, setSisaSaldo] = useState(0);

  useEffect(() => {
    const pinjaman = parseInt(data.request_nominal) * 1.3 || 0;
    const sisalSaldos = parseInt(data.saldo_before);
    const angsuranAwal = pinjaman - sisalSaldos;

    setSisaSaldo(pinjaman - angsuranAwal - data.angsuran[0].nominal);
  }, [data]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
    if (name == 'kelompok') {
      setCurrentKelompok(value);
    }
  };

  const onHandlePinjaman = (value) => {
    const nominal = parseInt(value) || 0;
    setData({
      ...data,
      request_nominal: value,
      saldo_before: (nominal * 1.3).toString(),
    });
  };

  const handleAngsuranNominalChange = (value) => {
    setData({
      ...data,
      angsuran: [
        {
          ...data.angsuran[1],
          nominal: parseInt(value) || 0,
        },
      ],
    });
  };

  const onHandleCurencyChange = (value, name, prams) => {
    if (value > data.request_nominal * 1.3) {
      return false;
    }

    setData({
      ...data,
      [name]: value,
      angsuran: [
        {
          ...data.angsuran[0],
          nominal: parseInt(value) || 0,
        },
      ],
    });
  };

  const onNikChange = (e) => {
    const { name, value } = e.target;
    setCustomerData([]);
    reset();
    setData('kelompok', currentKelompok);

    setNik(value);
  };

  const onNikSubmit = async (e) => {
    e.preventDefault();
    reset();
    setData('kelompok', currentKelompok);

    setLoading(true);
    setErorAxios();

    await axios({
      method: 'post',
      url: route('transaction.nasabah_buku_transaksi'),
      data: {
        nik: nik,
      },
    })
      .then(function ({ data }) {
        setLoading(false);
        setData((prevData) => ({
          ...prevData,
          nik: data.return_nik,
          isActiveMember: data.data ? true : false,
        }));
        if (data.data) {
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

  const buttonValue = [
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

    setData({
      ...data,
      request_nominal: value,
      saldo_before: (value * 1.3).toString(),
    });
  };

  const modalIsClosed = (e) => {
    reset();
    onClosed();
    setData('kelompok', currentKelompok);
  };

  const onSubmitCreate = (e) => {
    e.preventDefault();

    post(route('transaction.store_buku_transaksi_batch'), {
      onSuccess: () => {
        modalIsClosed();
      },
      replace: true,
    });
  };

  return (
    <Dialog open={show} onOpenChange={modalIsClosed}>
      <DialogContent className={`w-[95vw] p-2 lg:p-6`}>
        <DialogHeader className={'max-h-10'}>
          <DialogTitle className="p-2">Isi Angsurans</DialogTitle>
          {/* <Button type="button" /> */}
        </DialogHeader>
        <Loading show={loading} />
        <div className="h-[80vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin flex flex-col lg:flex-row gap-2">
          <div className={`w-auto min-w-[20vw] lg:w-auto`}>
            <form className="mb-1" onSubmit={onNikSubmit}>
              <InputLabel value="NIK" className="mb-1" />
              <div className="flex gap-3">
                <Input type="text" onChange={onNikChange} />
                <Button variant="destructiveoutline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>
            {erorAxios && <InputError message={erorAxios} className="mt-1" />}
            <div
              className={`font-semibold mb-3 ${
                nik.length == 16 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {nik.length} Digit
            </div>

            <form className="relative" onSubmit={onSubmitCreate}>
              <div className="flex flex-col w-full gap-3 lg:flex-row">
                {nik && data.nik == nik && (
                  <fieldset className="flex-1 p-4 border rounded-lg">
                    <legend className="px-1 -ml-1 text-sm font-medium">
                      Detail Pinjaman
                    </legend>
                    <div className="w-full mb-3">
                      <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex-1">
                          <div className="flex gap-3">
                            <div className="w-full mb-3">
                              <Label>Tanggal Drop</Label>
                              <DatePicker
                                name="tanggal_drop"
                                values={data.tanggal_drop}
                                onChange={setData}
                                minDate={fiveMonthsAgo}
                              />
                              <InputError message={errors.tanggal_drop} />
                              <div className="mt-1 font-semibold text-green-500">
                                {dayjs(data.tanggal_drop).format('dddd')}
                              </div>
                            </div>
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
                              onValueChange={onHandlePinjaman}
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

                          <div className="w-full mb-3">
                            <Label>Sisa Saldo Awal Bulan</Label>
                            <CurrencyInput
                              className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              name="saldo_before"
                              defaultValue={0}
                              allowDecimals={false}
                              prefix="Rp. "
                              min={1}
                              required
                              onValueChange={onHandleCurencyChange}
                              value={data.saldo_before}
                              placeholder={'Inputkan angka tanpa sparator'}
                            />
                            <InputError message={errors.saldo_before} />
                          </div>

                          <div className="w-full mb-3">
                            <Label>
                              Angsuran {dayjs().format('DD-MM-YYYY')}
                            </Label>
                            <CurrencyInput
                              className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              name="request_nominal"
                              defaultValue={0}
                              allowDecimals={false}
                              prefix="Rp. "
                              min={1}
                              required
                              onValueChange={handleAngsuranNominalChange}
                              value={data.angsuran.nominal}
                              placeholder={'Inputkan angka tanpa sparator'}
                            />
                            <InputError message={errors.request_nominal} />
                          </div>

                          <div>
                            Sisa Saldo ={sisaSaldo.toLocaleString('id-ID')}
                            <span className="font-semibold text-green-500"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                )}
              </div>
              <div className="flex justify-between">
                <div>
                  {data.request_nominal
                    ? sisaSaldo >= 0 && <Button>Submit</Button>
                    : ''}
                </div>
              </div>
            </form>
          </div>
          <div className={`w-auto lg:w-full`}>
            <div>History</div>
            <Tabs defaultValue="pengajuan" className="w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pengajuan">Crash Kantor</TabsTrigger>
                <TabsTrigger value="pinjaman">Crash UBM</TabsTrigger>
              </TabsList>
              <TabsContent value="pengajuan">
                <div className="overflow-auto shadow-sm scrollbar-thin h-max">
                  <RiwayatPengajuan data={customerData?.history_branch} />
                </div>
              </TabsContent>
              <TabsContent value="pinjaman">
                <div className="overflow-auto shadow-sm scrollbar-thin h-max">
                  <RiwayatPengajuan data={customerData?.history_lain} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InputMacet;
