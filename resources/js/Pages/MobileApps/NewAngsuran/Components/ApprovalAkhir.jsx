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

const ApprovalAkhir = ({ datas, show = false, onClosed }) => {
  const {
    server_filter: { groupId, hari },
  } = usePage().props;

  const [loading, setLoading] = useState(false);
  const { data, setData, post, reset, processing, errors } = useForm({});
  useEffect(() => {
    if (datas) {
      setData({
        hari: hari,
        groupId: groupId,
        cm_awal: datas.cm.sirkulasi,
        cm_akhir: datas.cm.saldo,
        ccm_awal: datas.ccm.sirkulasi,
        ccm_akhir: datas.ccm.saldo,

        mb_awal: datas.mb.sirkulasi,
        mb_akhir: datas.mb.saldo,
        ml_awal: 0,
        ml_akhir: 0,
        sirkulasi_awal: 0,
        sirkulasi_akhir: 0,
      });
    }
  }, [show, datas]);

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
            <CardTitle>Input Sirkulasi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmitForm}>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <Label htmlFor="cm_awal">CM Awal</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="cm_awal"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.cm_awal}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="cm_akhir">CM Akhir</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="cm_akhir"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.cm_akhir}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <Label htmlFor="mb_awal">MB Awal</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="mb_awal"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.mb_awal}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="mb_akhir">MB Akhir</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="mb_akhir"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.mb_akhir}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <Label htmlFor="ml_awal">ML Awal</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="ml_awal"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.ml_awal}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="ml_akhir">ML Akhir</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="ml_akhir"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.ml_akhir}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <Label htmlFor="ccm_awal">Calon CM</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="ccm_awal"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.ccm_awal}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="ccm_akhir">ML Akhir</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="ccm_akhir"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.ccm_akhir}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <Label htmlFor="sirkulasi_awal">Sirkulasi Awal</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="sirkulasi_awal"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.sirkulasi_awal}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="sirkulasi_akhir">Sirkulasi Akhir</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="sirkulasi_akhir"
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.sirkulasi_akhir}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalAkhir;
