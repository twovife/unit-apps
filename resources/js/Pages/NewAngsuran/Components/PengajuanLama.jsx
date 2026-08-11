import InputError from '@/Components/InputError';
import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { getLastDateForHari } from '@/lib/utils';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';

const PengajuanLama = ({ isActive, triggeredId, triggeredPinjaman }) => {
  const { data, setData, errors, post, processing, reset } = useForm({
    request_date: getLastDateForHari(triggeredPinjaman?.hari),
    tanggal_drop: '',
    request_nominal: 0,
    nomor_anggota: triggeredPinjaman?.nomor_anggota ?? '',
    residential_address: triggeredPinjaman?.domisili ?? '',
    type: 'pengajuan', //type have pengajuan,baru,TD
  });

  // Nasabah yang pinjaman ini sudah punya pengajuan pengganti yang masih
  // berjalan (open/acc/success) tidak boleh diajukan lagi - form diganti
  // ringkasan pengajuan yang sudah ada + link ke drop hari itu. `null`
  // berarti belum dicek / boleh mengajukan.
  const [existingPengajuan, setExistingPengajuan] = useState(null);

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

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const onHandleCurencyChange = (value, name, float) => {
    setData(name, value);
  };

  const buttonValueClick = (e) => {
    const value = e.target.getAttribute('data-value');
    setData('request_nominal', value);
  };

  const getDataAxios = async () => {
    try {
      const response = await axios.get(
        route('pinjaman.checkpengajuan', triggeredId)
      );
      const { sudah_diajukan, pengajuan } = response.data.data;
      setExistingPengajuan(sudah_diajukan ? pengajuan : null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isActive && triggeredId) {
      getDataAxios(); // Call the function here
    }
  }, [isActive, triggeredId]);

  const submitForm = (e) => {
    e.preventDefault();
    post(route('pinjaman.store_pengajuan_lama', triggeredId), {
      onSuccess: () => {
        reset();
        getDataAxios();
      },
      // preserveState: true,
    });
  };
  return (
    <div>
      {existingPengajuan ? (
        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">
            Nasabah ini sudah diajukan pinjaman baru — tidak bisa diajukan
            lagi.
          </p>
          <div className="grid grid-cols-2 gap-2 p-3 border rounded-md bg-muted/40">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </div>
              <div className="capitalize">{existingPengajuan.status}</div>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Tanggal Drop
              </div>
              <div>{dayjs(existingPengajuan.tanggal_drop).format('DD-MM-YYYY')}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {existingPengajuan.status === 'success' ? 'Drop' : 'Pengajuan'}
              </div>
              <FormatNumbering
                value={
                  existingPengajuan.nominal_drop ??
                  existingPengajuan.request_nominal
                }
                className="font-semibold"
              />
            </div>
          </div>
          <a
            href={route('pinjaman.index_pinjaman', {
              date: existingPengajuan.tanggal_drop,
              kelompok: existingPengajuan.kelompok,
            })}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-blue-500 underline"
          >
            Lihat Drop Hari Itu
          </a>
        </div>
      ) : (
        <div>
          <Loading show={processing} />
          <div className="w-full mb-3">
            <Label>Tanggal Pengajuan</Label>
            <Input
              type="date"
              name="request_date"
              required={true}
              value={data.request_date}
              onChange={onInputChange}
            />
            <InputError message={errors.request_date} />
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
            <InputError message={errors.tanggal_drop} />
          </div>

          <div className="w-full mb-3">
            <Label>Kelompok</Label>
            <Input type="text" value={triggeredPinjaman?.kelompok ?? ''} disabled />
          </div>

          <div className="w-full mb-3">
            <Label>Nomor Anggota</Label>
            <Input
              type="text"
              name="nomor_anggota"
              required={true}
              value={data.nomor_anggota}
              onChange={onInputChange}
            />
            <InputError message={errors.nomor_anggota} />
          </div>

          <div className="w-full mb-3">
            <Label>Domisili Nasabah</Label>
            <Input
              type="text"
              name="residential_address"
              value={data.residential_address}
              onChange={onInputChange}
              placeholder={triggeredPinjaman?.alamat}
            />
            <InputError message={errors.residential_address} />
            {!data.residential_address && (
              <p className="mt-1 text-xs text-muted-foreground">
                Kosong berarti pakai alamat identitas: {triggeredPinjaman?.alamat ?? '—'}
              </p>
            )}
          </div>

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
          <div className="flex flex-wrap w-full gap-2 mb-3">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="400000"
            >
              400rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="500000"
            >
              500rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="700000"
            >
              700rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="800000"
            >
              800rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="1000000"
            >
              1 Jt
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="1500000"
            >
              1,5 Jt
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
            <Button type="submit" onClick={submitForm} disabled={processing}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengajuanLama;
