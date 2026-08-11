import AppButton from '@/Components/shadcn/AppButton';
import Loading from '@/Components/Loading';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';

/**
 * Tombol "Tundaan" - cuma muncul untuk pengajuan yang sudah di-ACC (dipasang
 * oleh `Acc.jsx`). Cuma mengganti tanggal drop: pengajuan ini otomatis jadi
 * 'gagal' (TIDAK dihapus), dan dibuat pengajuan baru dengan tanggal drop
 * baru yang mewarisi approved_nominal/user_check/check_date - langsung
 * 'acc' lagi, tidak perlu di-ACC ulang.
 */
const Tundaan = ({ id, dropDateLama, onClosed }) => {
  const [open, setOpen] = useState(false);
  const defaultTanggalBaru = dayjs(dropDateLama).add(1, 'week').format('YYYY-MM-DD');
  const minTanggalBaru = dayjs(dropDateLama).add(1, 'day').format('YYYY-MM-DD');

  const { data, setData, post, processing, errors, reset } = useForm({
    tanggal_drop: defaultTanggalBaru,
  });

  const bukaForm = () => {
    setData('tanggal_drop', defaultTanggalBaru);
    setOpen(true);
  };

  const submit = () => {
    post(route('transaction.tundaan_pengajuan', id), {
      onSuccess: () => {
        reset();
        setOpen(false);
        onClosed?.();
      },
    });
  };

  if (!open) {
    return (
      <AppButton variant="warningOutline" size="sm" type="button" onClick={bukaForm}>
        Tundaan
      </AppButton>
    );
  }

  // Sengaja bukan <form> - komponen ini dipasang di dalam <form> milik
  // Acc.jsx. <form> bersarang tidak valid di HTML; tombol submit di
  // dalamnya bisa "diklaim" oleh form terluar (yang cuma preventDefault(),
  // no-op) alih-alih memicu handler di sini. Submit ditangani manual lewat
  // onClick, bukan lewat event submit form.
  const pesanError = Object.values(errors)[0];

  return (
    <div className="w-full p-3 mt-2 border rounded-md bg-muted/40">
      <Loading show={processing} />
      <Label htmlFor="tanggal_drop_tundaan">Tanggal Drop Baru</Label>
      <Input
        type="date"
        id="tanggal_drop_tundaan"
        name="tanggal_drop"
        min={minTanggalBaru}
        required
        value={data.tanggal_drop}
        onChange={(e) => setData('tanggal_drop', e.target.value)}
      />
      {pesanError && (
        <p className="mt-1 text-xs font-medium text-destructive">
          {pesanError}
        </p>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <AppButton
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => setOpen(false)}
        >
          Batal
        </AppButton>
        <AppButton
          variant="warning"
          size="sm"
          type="button"
          disabled={processing}
          onClick={submit}
        >
          Tunda ke Tanggal Ini
        </AppButton>
      </div>
    </div>
  );
};

export default Tundaan;
