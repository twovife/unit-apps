import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';

import React, { useEffect } from 'react';

import { Label } from '@/shadcn/ui/label';
import { Input } from '@/shadcn/ui/input';
import CurrencyInput from 'react-currency-input-field';
import Checkbox from '@/Components/Checkbox';
import { Button } from '@/shadcn/ui/button';
import { useForm } from '@inertiajs/react';
import Loading from '@/Components/Loading';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';

const BayarAngsuran = ({ triggeredId, triggeredPinjaman }) => {
  // const { kelompok } = useOptionGenerator();
  const { data, setData, post, errors, processing, reset, recentlySuccessful } =
    useForm({
      type_transaksi: 'bayar',
      transaction_date: '',
      nominal: '',
      id: '',
    });

  useEffect(() => {
    setData('id', triggeredId);
  }, [triggeredId, recentlySuccessful]);

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    );
  };

  const buttonValueClick = (e) => {
    const value = e.target.getAttribute('data-value');
    setData('nominal', value);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route('pinjaman.bayar_pinjaman', data.id), {
      preserveScroll: true,
      onSuccess: () => {
        reset('transaction_date', 'nominal');
      },
    });
  };

  return (
    <Card className="relative w-full mb-3">
      <Loading show={processing} />
      <CardHeader>
        <CardTitle>Isi Angsuran</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmitForm}>
          <div className="mb-3">
            <Label htmlFor="transaction_date">Tanggal Pembayaran</Label>
            <Input
              type="date"
              name="transaction_date"
              id="transaction_date"
              className="w-full"
              value={data.transaction_date}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="nominal">Nominal</Label>
            <CurrencyInput
              className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              name="nominal"
              allowDecimals={false}
              prefix="Rp. "
              min={1}
              required
              onValueChange={onHandleCurencyChange}
              value={data.nominal}
              placeholder={'Inputkan angka tanpa sparator'}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={buttonValueClick}
            data-value={triggeredPinjaman / 10 ?? 65000}
          >
            {triggeredPinjaman / 10 ?? 65000}
          </Button>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <Checkbox
                name="danatitipan"
                value={data.danatitipan}
                onChange={onInputChange}
              />
              <span className="ml-2 text-sm text-gray-600">Dana Titipan?</span>
            </label>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BayarAngsuran;
