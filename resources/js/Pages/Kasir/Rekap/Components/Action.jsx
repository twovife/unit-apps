import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import Loading from '@/Components/Loading';
import Modal from '@/Components/Modal';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

const Action = ({ show = false, onClosed, triggeredData }) => {
  console.log(triggeredData);

  const { data, setData, post, reset, errors, processing } = useForm({
    id: '',
    kelompok: '',
    date: '',
    kasbon: '',
    transport: '',
    daily_kepala_approval: '',
    daily_kasir_approval: '',
    status_dayly_approval: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (triggeredData) {
      setData({
        id: triggeredData.id,
        kelompok: triggeredData.kelompok,
        date: triggeredData.tanggal,
        kasbon: triggeredData.kasbon,
        transport: triggeredData.transport,
        daily_kepala_approval: triggeredData.status_approve_kepala,
        daily_kasir_approval: triggeredData.status_approve_kasir,
        status_dayly_approval: triggeredData.status_dayly_approval,
      });
    }
  }, [triggeredData]);

  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    );
  };

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const closedModal = () => {
    onClosed();
    reset();
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route('kasir.rekap.rekap_post'), {
      onSuccess: () => {
        reset();
        onClosed();
      },
    });
  };

  console.log(data);

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : closedModal())}>
      <Loading show={loading || processing} />
      <DialogContent className="w-[90vw] h-[90vh] lg:h-auto lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        {/* {erorAxios && <div>terjadi kesalahan saat memuat data</div>} */}
        {loading ? (
          <div>Data Sedang Dimuat</div>
        ) : (
          <DialogHeader>
            <DialogTitle>Cek Transaksi</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    readOnly
                    name="date"
                    type="date"
                    required
                    onChange={onInputChange}
                    value={data.date}
                  />
                </div>
                <div className="mb-3">
                  <Label htmlFor="kasbon">Kasbon</Label>

                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="kasbon"
                    readOnly={data.status_dayly_approval}
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.kasbon}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="mb-3">
                  <Label htmlFor="transport">Transport</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="transport"
                    allowDecimals={false}
                    readOnly={data.status_dayly_approval}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.transport}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="mb-3">
                  <div className="flex items-center flex-1 gap-3 mb-1 whitespace-nowrap">
                    <Checkbox
                      readOnly={data.status_dayly_approval}
                      name="daily_kasir_approval"
                      placeholder="Select Permission"
                      id="daily_kasir_approval"
                      onChange={onInputChange}
                    />
                    <InputLabel htmlFor="daily_kasir_approval">
                      Ceklist Kasir
                    </InputLabel>
                  </div>
                  <div className="italic font-light">
                    Dicentang oleh kasir jika Nilai Kasbon - Transport dan Tunai
                    Sudah Sesuai
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center flex-1 gap-3 mb-1 whitespace-nowrap">
                    <Checkbox
                      readOnly={data.status_dayly_approval}
                      name="daily_kepala_approval"
                      placeholder="Select Permission"
                      id="daily_kepala_approval"
                      onChange={onInputChange}
                    />
                    <InputLabel htmlFor="daily_kepala_approval">
                      Ceklist Pimpinan
                    </InputLabel>
                  </div>
                  <div className="italic font-light">
                    Dicentang oleh Pimpinan jika Nilai Nilai Rekap Telah Sesuai
                    ( Drop, Storting, Target, Rencana dll)
                  </div>
                </div>
                <div className="mb-3 text-right">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Action;
