import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import Loading from '@/Components/Loading';
import Modal from '@/Components/Modal';
import BadgeStatus from '@/Components/shadcn/BadgeStatus';
import BargeStatus from '@/Components/shadcn/BargeStatus';
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
import React, { useEffect, useState, useRef } from 'react';
import CurrencyInput from 'react-currency-input-field';

const Action = ({ show = false, onClosed, triggeredData, type }) => {
  const { data, setData, post, reset, errors, processing } = useForm({
    id: '',
    kelompok: '',
    date: '',
    kasbon: '',
    transport: '',
    type: '1',
  });
  const [loading, setLoading] = useState(false);
  const focusInputAngka = useRef(null);

  useEffect(() => {
    if (focusInputAngka.current) {
      console.log('asd');

      focusInputAngka.current.focus();
    }
  }, [focusInputAngka.current]);

  useEffect(() => {
    if (triggeredData) {
      setData({
        id: triggeredData.id,
        kelompok: triggeredData.kelompok,
        date: triggeredData.tanggal,
        kasbon: triggeredData.rekap_status ? triggeredData.kasbon : 200000,
        transport: triggeredData.transport,
        type: type,
        tunai: type == 1 ? 0 : triggeredData.tunai,
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

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : closedModal())}>
      <Loading show={loading || processing} />
      <DialogContent className="w-[90vw] h-[90vh] lg:h-auto lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        {/* {erorAxios && <div>terjadi kesalahan saat memuat data</div>} */}
        {loading ? (
          <div>Data Sedang Dimuat</div>
        ) : (
          <DialogHeader>
            <DialogTitle>
              {type == 1 ? 'Input Kasbon & Transport' : 'Cek Tunai Mantri'}
            </DialogTitle>
            {triggeredData?.status_dayly_approval ? (
              <DialogDescription>
                'Data Sudah DiSetujui Kasid & Pimpinan, Data Pada Tanggal Ini
                Telah Ditutup'
              </DialogDescription>
            ) : (
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
                      ref={focusInputAngka}
                      readOnly={data.status_dayly_approval}
                      prefix="Rp. "
                      min={1}
                      required
                      onValueChange={onHandleCurencyChange}
                      value={data.transport}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                  {triggeredData?.status_approve_kepala && (
                    <BadgeStatus className="mb-3" value="acc">
                      Kepala Sudah Aprov
                    </BadgeStatus>
                  )}
                  {triggeredData?.status_approve_kepala && type == 2 && (
                    <>
                      <div className="flex items-center justify-start flex-1 gap-3 mb-1 whitespace-nowrap">
                        <Checkbox
                          placeholder="Select Permission"
                          id="daily_kepala_approval"
                          required
                        />
                        <InputLabel htmlFor="daily_kepala_approval">
                          Konfirmasi Jika Sudah Benar Semua
                        </InputLabel>
                      </div>
                      <div className="mb-3 text-right">
                        <Button type="submit">Submit</Button>
                      </div>
                    </>
                  )}
                  {type == 1 && (
                    <div className="mb-3 text-right">
                      <Button type="submit">Submit</Button>
                    </div>
                  )}
                </form>
              </DialogDescription>
            )}
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Action;
