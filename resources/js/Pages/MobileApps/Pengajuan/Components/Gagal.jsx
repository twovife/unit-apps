import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import { useForm } from '@inertiajs/react';
import React from 'react';

const Gagal = ({ id, onClosed }) => {
  const { data, setData, put, errors, processing, reset } = useForm({
    status: 'gagal',
  });

  const tolakPinjaman = (e) => {
    e.preventDefault();
    put(route('transaction.action_buku_transaksi', id), {
      onFinish: () => {
        reset();
        onClosed();
      },
    });
  };

  return (
    <form onSubmit={tolakPinjaman}>
      <Loading show={processing} />
      <Button onClick={tolakPinjaman} variant="destructive">
        TOLAK
      </Button>
    </form>
  );
};

export default Gagal;
