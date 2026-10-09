import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

// Cek #2 kasir (alur baru): catat setoran mantri lalu KUNCI baris hari itu.
// Post ke transaction.kasir_kunci -> update setoran -> delegasi ke
// ClosingHarianController@kunci (hitung ulang + Gembok + susun bulanan).
export default function KunciKasir({ show = false, onClosed, row }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    setoran_mantri: '',
    kasbon: '',
    transport: '',
  });

  useEffect(() => {
    if (show && row)
      setData({
        setoran_mantri: row.setoran_mantri ?? '',
        // Opsional: kosong = tidak diubah.
        kasbon: row.kasbon || '',
        transport: row.transport || '',
      });
  }, [show, row]);

  const kelasInput =
    'flex w-full px-3 py-1 mt-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring';

  const submit = (e) => {
    e.preventDefault();
    if (!row?.closing_id) return;
    post(route('transaction.kasir_kunci', row.closing_id), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        onClosed();
      },
    });
  };

  return (
    <Dialog open={show} onOpenChange={(o) => (o ? '' : onClosed())}>
      <DialogContent className="max-w-md">
        <Loading show={processing} />
        <DialogHeader>
          <DialogTitle>
            Kunci Kasir {row ? `— ${dayjs(row.tanggal).format('DD MMM YYYY')}` : ''}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Cek #2. Sesudah dikunci, angka hari ini beku permanen dan masuk rekap
            bulanan. Syarat: kepala sudah cek, hari sebelumnya sudah terkunci.
          </p>
          <div>
            <Label htmlFor="setoran_mantri">
              Setoran Mantri (uang fisik diterima kasir)
            </Label>
            <CurrencyInput
              className="flex w-full px-3 py-1 mt-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              id="setoran_mantri"
              name="setoran_mantri"
              allowDecimals={false}
              prefix="Rp. "
              min={0}
              required
              value={data.setoran_mantri}
              onValueChange={(v) => setData('setoran_mantri', v ?? '')}
              placeholder="0 = mantri tidak menyetor"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['kasbon', 'transport'].map((k) => (
              <div key={k}>
                <Label htmlFor={k} className="capitalize">
                  {k} <span className="font-normal text-muted-foreground">(opsional)</span>
                </Label>
                <CurrencyInput
                  className={kelasInput}
                  id={k}
                  name={k}
                  allowDecimals={false}
                  prefix="Rp. "
                  min={0}
                  value={data[k]}
                  onValueChange={(v) => setData(k, v ?? '')}
                  placeholder="boleh kosong"
                />
              </div>
            ))}
          </div>
          {Object.values(errors)[0] && (
            <p className="text-xs font-medium text-destructive">{Object.values(errors)[0]}</p>
          )}
          <div className="text-right">
            <Button type="submit" disabled={processing}>
              Simpan &amp; Kunci
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
