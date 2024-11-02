import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { useForm, usePage } from '@inertiajs/react';
import { Label } from '@/shadcn/ui/label';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@/shadcn/ui/button';
import Loading from '@/Components/Loading';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';

const ApprovalAkhir = ({ datas, show = false, onClosed }) => {
  const { sirkulasi } = usePage().props;

  const [loading, setLoading] = useState(false);
  const { data, setData, post, reset, processing, errors } = useForm({
    ml_amount: '',
    mb_amount: '',
    cm_amount: '',
    amount: '',
  });

  useEffect(() => {
    setData({
      ml_amount: sirkulasi.ml_amount ?? 0,
      mb_amount: sirkulasi.mb_amount ?? 0,
      cm_amount: sirkulasi.cm_amount ?? 0,
      amount: sirkulasi.amount ?? 0,
    });
  }, [sirkulasi]);

  const modalIsClosed = () => {
    onClosed();
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route('adminpanel.sirkulasiAwal'), {
      onSuccess: () => {
        modalIsClosed();
      },
    });
  };

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : modalIsClosed())}>
      <Loading show={loading || processing} />
      <DialogContent
        className={`w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin`}
      >
        <DialogHeader className={'max-h-10'}>
          <DialogTitle>Isi Angsuran</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sirkulasi</CardTitle>
            <div className="flex gap-3">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Sirkulasi Awal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <Label htmlFor="amount">Sirkulasi Awal</Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="amount"
                      allowDecimals={false}
                      prefix="Rp. "
                      min={0}
                      required
                      readOnly
                      onValueChange={onHandleCurencyChange}
                      value={data.amount}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="ml_amount">Saldo Awal (ML)</Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="ml_amount"
                      allowDecimals={false}
                      prefix="Rp. "
                      min={0}
                      required
                      readOnly
                      onValueChange={onHandleCurencyChange}
                      value={data.ml_amount}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="mb_amount">Saldo Awal (MB)</Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="mb_amount"
                      allowDecimals={false}
                      prefix="Rp. "
                      min={0}
                      required
                      readOnly
                      onValueChange={onHandleCurencyChange}
                      value={data.mb_amount}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="cm_amount">Saldo Awal (CM)</Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="cm_amount"
                      allowDecimals={false}
                      prefix="Rp. "
                      min={0}
                      required
                      readOnly
                      onValueChange={onHandleCurencyChange}
                      value={data.cm_amount}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex-1">
                <div>Sirkulasi Akhir</div>
              </div>
              <div className="flex-1">
                <div>Sirkulasi Awal Bulan Depan</div>
              </div>
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalAkhir;
