import Loading from '@/Components/Loading';
import SelectList from '@/Components/SelectList';
import { showNominalByStatus } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

const ChangeDetail = ({ triggeredData, onClosed }) => {
  //genereate form for put/patch
  const { data, setData, put, processing, reset } = useForm({});

  useEffect(() => {
    if (triggeredData) {
      setData({
        request_date: triggeredData.request_date,
        drop_date: triggeredData.tanggal_drop,
        request_nominal:
          triggeredData.drop_langsung == 'lama'
            ? triggeredData.request
            : triggeredData.drop_jadi,
        approved_nominal:
          triggeredData.drop_langsung == 'lama'
            ? triggeredData.acc
            : triggeredData.drop_jadi,
        nominal_drop: triggeredData.drop_jadi,
      });
    }
  }, [triggeredData]);

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const onChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('transaction.updateEverything', triggeredData?.nomor_pengajuan), {
      preventDefault: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onClosed();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Loading show={processing} />

      <div className="flex w-full gap-3 mb-3">
        <div className="flex-1">
          <Label htmlFor="request_date">Tanggal Pengajuan</Label>
          <Input
            type="date"
            onChange={onChange}
            value={data.request_date}
            id={'request_date'}
            required
            name={'request_date'}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="drop_date">Tanggal Pengajuan</Label>
          <Input
            type="date"
            onChange={onChange}
            value={data.drop_date}
            id={'drop_date'}
            required
            name={'drop_date'}
          />
        </div>
      </div>
      <small>
        Perubahan Tanggal Mempengaruhi Perolehan Drop dan Rencana Drop
      </small>
      {data.request_date == data.drop_date ? (
        <div className="w-full mb-3 font-semibold text-red-500">DROP BARU</div>
      ) : (
        <div className="w-full mb-3 font-semibold text-red-500">
          PENGAJUAN DROP
        </div>
      )}
      <div className="flex w-full gap-3 mb-3">
        {triggeredData?.drop_langsung == 'lama' && (
          <>
            <div className="flex-1">
              <Label htmlFor="request_nominal">Nominal Pengajuan</Label>
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
            </div>
            {showNominalByStatus('acc', triggeredData?.status) && (
              <div className="flex-1">
                <Label htmlFor="approved_nominal">Nominal Acc</Label>
                <CurrencyInput
                  className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  name="approved_nominal"
                  allowDecimals={false}
                  prefix="Rp. "
                  min={1}
                  required
                  onValueChange={onHandleCurencyChange}
                  value={data.approved_nominal}
                  placeholder={'Inputkan angka tanpa sparator'}
                />
              </div>
            )}
          </>
        )}

        {showNominalByStatus('nominal_drop', triggeredData?.status) && (
          <div className="flex-1">
            <Label htmlFor="nominal_drop">Drop Jadi</Label>
            <CurrencyInput
              className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              name="nominal_drop"
              allowDecimals={false}
              prefix="Rp. "
              min={1}
              required
              onValueChange={onHandleCurencyChange}
              value={data.nominal_drop}
              placeholder={'Inputkan angka tanpa sparator'}
            />
          </div>
        )}
      </div>
      <div>
        <Button type="submit">Ubah</Button>
      </div>
    </form>
  );
};

export default ChangeDetail;
