import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

const DropJadi = ({ id, drop_jadi, onClosed }) => {
  const { data, setData, put, errors, processing, reset } = useForm({
    drop: '',
    status: 'success',
  });

  useEffect(() => {
    setData('drop', drop_jadi);
  }, [id, drop_jadi]);

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const accPinjaman = (e) => {
    e.preventDefault();
    put(route('transaction.action_buku_transaksi', id), {
      onFinish: () => {
        onClosed();
      },
    });
  };

  return (
    <form className="w-full" onSubmit={accPinjaman}>
      <Loading show={processing} />
      <Label htmlFor="drop">Drop Jadi</Label>
      <div className="flex items-center justify-center gap-3">
        <CurrencyInput
          className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="drop"
          allowDecimals={false}
          prefix="Rp. "
          min={1}
          required
          onValueChange={onHandleCurencyChange}
          value={data.drop}
          placeholder={'Inputkan angka tanpa sparator'}
        />
        <Button onClick={accPinjaman}>Drop</Button>
      </div>
    </form>
  );
};

export default DropJadi;
