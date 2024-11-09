import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

import React, { useEffect, useState } from 'react';

import { Label } from '@/shadcn/ui/label';
import { Input } from '@/shadcn/ui/input';
import CurrencyInput from 'react-currency-input-field';
import Checkbox from '@/Components/Checkbox';
import { Button } from '@/shadcn/ui/button';
import { useForm, usePage } from '@inertiajs/react';
import Loading from '@/Components/Loading';
import dayjs from 'dayjs';
import NoEditOverlay from '@/Components/NoEditOverlay';
import useFrontEndPermission from '@/Hooks/useFrontEndPermission';

const BayarAngsuran = ({ triggeredId, triggeredPinjaman, instalment }) => {
  const [triggeredData, setTriggeredData] = useState({});
  useEffect(() => {
    setTriggeredData(triggeredPinjaman);
  }, [triggeredPinjaman]);

  const {
    server_filter: { closed_transaction, today },
  } = usePage().props;

  const { data, setData, post, errors, processing, reset, recentlySuccessful } =
    useForm({
      type_transaksi: 'bayar',
      transaction_date: '',
      nominal: 0,
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
  const buttonAddNominal = (e) => {
    const nominal = parseInt(data.nominal);
    const value = parseInt(e.target.getAttribute('data-value'));
    setData('nominal', value + nominal);
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

  const [pelunasan, setPelunasan] = useState(0);

  useEffect(() => {
    const pelunasan =
      instalment?.sort((a, b) => a.saldo - b.saldo)[0]?.saldo ?? 0;
    setData((prev) => ({
      ...prev,
      transaction_date: today,
    }));

    setPelunasan(pelunasan);
  }, [instalment]);

  return (
    <Card className="relative w-full mb-3">
      <Loading show={processing} />
      <CardHeader>
        <CardTitle>Isi Angsuran</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={onSubmitForm}>
          <div className="mb-3">
            <Label htmlFor="transaction_date">Tanggal Pembayaran</Label>
            <Input
              type="date"
              min={closed_transaction}
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
              min={0}
              required
              onValueChange={onHandleCurencyChange}
              value={data.nominal}
              placeholder={'Inputkan angka tanpa sparator'}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonAddNominal}
              data-value={5000}
            >
              +5 Rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonAddNominal}
              data-value={10000}
            >
              +10 Rb
            </Button>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={50000}
            >
              50 Rb
            </Button>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={52000}
            >
              52 Rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={60000}
            >
              60 Rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={65000}
            >
              65 Rb
            </Button>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={100000}
            >
              100 Rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={130000}
            >
              130 Rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={195000}
            >
              195 Rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={260000}
            >
              260 Rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={390000}
            >
              390 Rb
            </Button>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value={pelunasan}
            >
              {pelunasan}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div>
              {triggeredData.status_pinjaman !== 'normal' && (
                <label className="flex items-center">
                  <Checkbox
                    name="danatitipan"
                    value={data.danatitipan}
                    onChange={onInputChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Dana Titipan?
                  </span>
                </label>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BayarAngsuran;
