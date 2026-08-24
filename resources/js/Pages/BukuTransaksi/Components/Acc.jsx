import Loading from '@/Components/Loading';
import AppBadge from '@/Components/shadcn/AppBadge';
import AppButton from '@/Components/shadcn/AppButton';
import { varianStatus } from '@/Components/shadcn/statusVariants';
import Tundaan from './Tundaan';
import { Label } from '@/shadcn/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

const Acc = ({ id, acc, onClosed, triggeredData }) => {
  const { data, setData, put, errors, processing, reset, transform } = useForm({
    approved_nominal: '',
    status: '',
    drop: '',
  });

  // Dulu memakai useFrontEndPermission() yang memeriksa nama permission lama
  // ('can create', 'area') dan sudah tidak ada di tabel `permissions`, sehingga
  // isCreator selalu false -> NoEditOverlay menutupi seluruh kartu ACC/DROP
  // untuk SEMUA user. 'can-approve' adalah hak yang benar untuk ACC/Tolak:
  // dimiliki kasir, pimpinan, kepala-mantri, pengawas, superuser - dan tidak
  // dimiliki mantri, persis seperti maksud pengecekan lama.
  const { auth } = usePage().props;
  const canApprove = auth?.permissions?.includes('can-approve');

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      approved_nominal: triggeredData?.acc ?? triggeredData?.request,
      drop: triggeredData?.acc,
    }));
  }, [id, acc]);

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const accPinjaman = (status) => {
    transform((data) => ({
      ...data,
      status: status,
    }));
    put(route('transaction.action_buku_transaksi', id), {
      onSuccess: () => {
        reset();
        onClosed();
      },
    });
  };

  return (
    <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
      <Loading show={processing} />

      <div className="mb-3">
        {triggeredData?.status === 'open' && (
          <>
            <Label htmlFor="approved_nominal">Nominal ACC</Label>
            <CurrencyInput
              className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              name="approved_nominal"
              allowDecimals={false}
              prefix="Rp. "
              min={1}
              required
              disabled={!canApprove}
              onValueChange={onHandleCurencyChange}
              value={data.approved_nominal}
              placeholder={'Inputkan angka tanpa sparator'}
            />
            {/* Tanpa hak ACC: kontrol tetap TAMPIL tapi mati, ditemani alasan.
                Dulu ditutup NoEditOverlay - overlay menutup seluruh kartu induk
                sehingga elemen lain yang sebenarnya boleh dipakai ikut mati. */}
            {!canApprove && (
              <p className="mt-2 text-xs font-medium text-amber-600">
                Tunggu Pimpinan / KM meng-ACC terlebih dahulu.
              </p>
            )}
            <div className="flex items-center justify-end gap-3 mt-2">
              <AppButton
                variant="submission"
                size="sm"
                disabled={!canApprove}
                onClick={() => accPinjaman('acc')}
              >
                ACC
              </AppButton>
              <AppButton
                variant="danger"
                size="sm"
                disabled={!canApprove}
                onClick={() => accPinjaman('tolak')}
              >
                Tolak
              </AppButton>
            </div>
          </>
        )}
      </div>

      {triggeredData?.status !== 'open' && (
        <div className="mb-3">
          {triggeredData?.status === 'acc' && (
            <>
              <Label htmlFor="drop" className="whitespace-normal">
                Drop Jadi
              </Label>
              <CurrencyInput
                className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                name="drop"
                allowDecimals={false}
                prefix="Rp. "
                min={1}
                required
                disabled={!canApprove}
                onValueChange={onHandleCurencyChange}
                value={data.drop}
                placeholder={'Inputkan angka tanpa sparator'}
              />
              {!canApprove && (
                <p className="mt-2 text-xs font-medium text-amber-600">
                  Hanya Pimpinan / KM / Kasir yang bisa menutup pencairan.
                </p>
              )}
              <div className="flex flex-wrap items-center justify-end gap-3 mt-2">
                {canApprove && (
                  <Tundaan
                    id={id}
                    dropDateLama={triggeredData?.tanggal_drop}
                    onClosed={onClosed}
                  />
                )}
                <AppButton
                  variant="submission"
                  size="sm"
                  disabled={!canApprove}
                  onClick={() => accPinjaman('success')}
                >
                  DROP
                </AppButton>
                <AppButton
                  variant="danger"
                  size="sm"
                  disabled={!canApprove}
                  onClick={() => accPinjaman('gagal')}
                >
                  GAGAL
                </AppButton>
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
};

export default Acc;
