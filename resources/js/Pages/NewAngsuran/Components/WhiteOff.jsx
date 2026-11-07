import Loading from '@/Components/Loading';
import { useForm } from '@inertiajs/react';
import React from 'react';
import dayjs from 'dayjs';
import { Input } from '@/shadcn/ui/input';
import TanggalKerja from '@/Components/shadcn/TanggalKerja';
import useHariLibur from '@/Hooks/useHariLibur';
import { Label } from '@/shadcn/ui/label';
import InputError from '@/Components/InputError';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@/shadcn/ui/button';

const HARI_KE_ANGKA = {
  minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6,
};

const WhiteOff = ({ triggeredId, nominalWhiteOff, hari = null }) => {
  const { mundurKeHariKerja, siap: kalenderSiap } = useHariLibur();
  const hariAngka = hari ? (HARI_KE_ANGKA[String(hari).toLowerCase()] ?? null) : null;

  const { data, setData, post, processing, errors } = useForm({
    id: triggeredId || '',
    transaction_date: dayjs().format('YYYY-MM-DD'),
    nominal: nominalWhiteOff || 0,
  });

  // Bawaannya hari ini, yang belum tentu hari tagih pinjaman ini dan belum
  // tentu hari kerja. Server menolak keduanya, jadi bawaannya dibetulkan
  // begitu kalendernya siap: mundur ke hari tagih terakhir yang bekerja.
  React.useEffect(() => {
    if (hariAngka === null) return;

    let calon = dayjs();
    while (calon.day() !== hariAngka) calon = calon.subtract(1, 'day');

    setData('transaction_date', mundurKeHariKerja(calon.format('YYYY-MM-DD')));
  }, [hariAngka, kalenderSiap]);

  const onHandleCurencyChange = (value) => {
    setData('nominal', value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (triggeredId) {
      post(route('pinjaman.white_off_loan', triggeredId));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Loading show={processing} />
        <div className="mb-3">
          <Label htmlFor="transaction_date">Tanggal Pemutihan</Label>
          <TanggalKerja
            name="transaction_date"
            hariTagih={hariAngka}
            value={data.transaction_date}
            onChange={(e) => setData('transaction_date', e.target.value)}
          />
          <InputError message={errors.transaction_date} className="mt-1" />
        </div>
        <div className="mb-3">
          <Label htmlFor="field2">Nominal</Label>
          <CurrencyInput
            className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            name="nominal"
            allowDecimals={false}
            prefix="Rp. "
            min={0}
            required
            onValueChange={onHandleCurencyChange}
            value={data.nominal}
            placeholder={'Inputkan angka tanpa sparator'}
          />
          {errors.field2 && <InputError>{errors.field2}</InputError>}
        </div>

        <div className="p-1 mb-3">
          <Label htmlFor="agreement" className="leading-relaxed">
            <input
              type="checkbox"
              className="mr-3"
              id="agreement"
              required
              onChange={(e) => setData('agreement', e.target.checked)}
            />
            Saya Menyatakan Nasabah Ini Meninggal Dunia ( Dilunaskan )
          </Label>
          {errors.agreement && <InputError>{errors.agreement}</InputError>}
        </div>

        <div className="text-right">
          <Button type="submit" disabled={processing || !triggeredId}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WhiteOff;
