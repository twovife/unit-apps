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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import useOptionGenerator from '@/Hooks/useOptionGenerator';
import SelectComponent from '@/Components/shadcn/SelectComponent';
// import RiwayatPengajuan from './RiwayatPengajuan';
import dayjs from 'dayjs';
import MobileLayout from '@/Layouts/MobileLayout';

const Index = () => {
  const { auth } = usePage().props;
  console.log(auth);

  const { optKelompok } = useOptionGenerator();
  const { data, setData, post, errors, processing, reset } = useForm({
    isActiveMember: false,
    nik: '',
    kelompok: '',
  });

  const [nik, setNik] = useState('');

  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState();
  const [customerData, setCustomerData] = useState([]);
  const [mixDate, setMixDate] = useState();

  useEffect(() => {
    setMixDate(data.request_date);
    setData((prevData) => ({
      ...prevData,
      tanggal_drop: dayjs(data.request_date)
        .add(1, 'week')
        .format('YYYY-MM-DD'),
    }));
  }, [data.request_date]);

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const onNikChange = (e) => {
    const { name, value } = e.target;
    setNik(value);
  };

  const onNikSubmit = async (e) => {
    e.preventDefault();
    reset();
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
          kelompok: auth.permissions.includes('can show kelompok')
            ? null
            : auth.user.employee.area,
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

  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(route('mobile_apps.store'), {
      onSuccess: () => {
        reset();
      },
    });
  };

  const buttonValueClick = (e) => {
    const value = e.target.getAttribute('data-value');
    setData('request_nominal', value);
  };
  console.log(data);

  return (
    <MobileLayout>
      <Loading show={loading || processing} />
      <div>
        <div>
          <div className="flex flex-col w-full gap-3 lg:flex-row">
            <div className="w-auto">
              <fieldset className="w-full p-4 mb-3 border rounded-lg">
                <legend className="px-1 -ml-1 text-sm font-medium">
                  Cari Nasabah
                </legend>
                <form className="w-full mb-3" onSubmit={onNikSubmit}>
                  <Label optional>NIK</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="text"
                      name="nik"
                      value={nik}
                      onChange={onNikChange}
                      placeholder="Cek NIK"
                    />
                    <Button className="text-xs" size="sm">
                      <Search className="w-auto h-4 mr-1" />
                      Cari
                    </Button>
                  </div>
                  {erorAxios && (
                    <InputError message={erorAxios} className="mt-1" />
                  )}
                  <div
                    className={`font-semibold mt-1 ${
                      nik.length == 16 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {nik.length} Digit
                  </div>
                </form>
              </fieldset>
              {nik && data.nik == nik && (
                <fieldset className="w-full p-4 border rounded-lg">
                  <legend className="px-1 -ml-1 text-sm font-medium">
                    Detail Pinjaman
                  </legend>
                  <form className="w-full mb-3" onSubmit={onSubmitCreate}>
                    <div className="flex gap-3">
                      <div className="w-full mb-3">
                        <Label>Tanggal Pengajuan</Label>
                        <Input
                          type="date"
                          name="request_date"
                          required={true}
                          value={data.request_date}
                          onChange={onInputChange}
                        />
                        <InputError value={errors.request_date} />
                      </div>
                      <div className="w-full mb-3">
                        <Label>Tanggal Drop</Label>
                        <Input
                          type="date"
                          name="tanggal_drop"
                          min={mixDate}
                          required={true}
                          value={data.tanggal_drop}
                          onChange={onInputChange}
                        />
                        <InputError value={errors.tanggal_drop} />
                      </div>
                    </div>
                    {data.request_date &&
                    data.request_date == data.tanggal_drop ? (
                      <div className="w-full mb-3 font-semibold text-red-500">
                        DROP BARU
                      </div>
                    ) : (
                      <div className="w-full mb-3 font-semibold text-red-500">
                        PENGAJUAN DROP
                      </div>
                    )}
                    <div className="w-full mb-3">
                      <Label optional>NIK</Label>
                      <Input
                        type="text"
                        name="nik"
                        value={data.nik}
                        disabled
                        onChange={onInputChange}
                      />
                      <InputError value={errors.nik} />
                    </div>
                    {!data.isActiveMember && (
                      <>
                        <div className="w-full mb-3">
                          <Label optional>NO KK</Label>
                          <Input
                            type="text"
                            name="no_kk"
                            value={data.no_kk}
                            onChange={onInputChange}
                          />
                          <InputError value={errors.no_kk} />
                        </div>
                        <div className="w-full mb-3">
                          <Label>Nama</Label>
                          <Input
                            type="text"
                            name="nama"
                            value={data.nama}
                            onChange={onInputChange}
                            required={true}
                          />
                          <InputError value={errors.nama} />
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
                          <InputError value={errors.alamat} />
                        </div>
                      </>
                    )}

                    {auth.permissions.includes('can show kelompok') ? (
                      <div className="w-full mb-3">
                        <Label>Kelompok</Label>
                        <SelectComponent
                          value={data.kelompok}
                          options={optKelompok}
                          name="kelompok"
                          nullvalue={true}
                          onChange={onInputChange}
                          required={true}
                        />
                        <InputError value={errors.kelompok} />
                      </div>
                    ) : (
                      <div className="w-full mb-3">
                        <div>Nama Mantri</div>
                        <div>
                          {auth.user.employee.nama_karyawan} kelompok{' '}
                          {auth.user.employee.area}
                        </div>
                      </div>
                    )}

                    <div className="w-full mb-3">
                      <Label>Nominal Pinjaman</Label>
                      <CurrencyInput
                        className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        name="request_nominal"
                        allowDecimals={false}
                        prefix="Rp. "
                        min={1}
                        required
                        onValueChange={onHandleCurencyChange}
                        value={data.request_nominal}
                        placeholder={'Inputkan angka tanpa sparator'}
                      />
                      <InputError value={errors.request_nominal} />
                    </div>
                    <div className="flex flex-wrap w-full gap-2 mb-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={buttonValueClick}
                        data-value="400000"
                      >
                        400.000
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={buttonValueClick}
                        data-value="500000"
                      >
                        500.000
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={buttonValueClick}
                        data-value="700000"
                      >
                        700.000
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={buttonValueClick}
                        data-value="1000000"
                      >
                        1.000.000
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="xs"
                        onClick={buttonValueClick}
                        data-value="0"
                      >
                        reset
                      </Button>
                    </div>
                    <div className="text-end">
                      <Button>Submit</Button>
                    </div>
                  </form>
                </fieldset>
              )}
            </div>
            <div className="w-auto lg:w-3/4">
              <Tabs defaultValue="pengajuan" className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pengajuan">Riwayat Pinjaman</TabsTrigger>
                  <TabsTrigger value="pinjaman">Ringkasan Pinjaman</TabsTrigger>
                </TabsList>
                <TabsContent value="pengajuan">
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
                        {/* <RiwayatPengajuan data={customerData} /> */}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="pinjaman">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ringkasan Pinjaman</CardTitle>
                      <CardDescription>
                        Ringkasan Analisa Nasabah
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>masih belum ada, update secara berkala</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
