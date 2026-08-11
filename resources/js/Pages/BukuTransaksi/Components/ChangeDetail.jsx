import Loading from '@/Components/Loading';
import SelectList from '@/Components/SelectList';
import { showNominalByStatus } from '@/lib/utils';

import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm, usePage } from '@inertiajs/react';

import React, { useEffect, useState, useTransition } from 'react';
import CurrencyInput from 'react-currency-input-field';

const ChangeDetail = ({ triggeredData, onClosed }) => {
  //genereate form for put/patch

  // Mantri dikenali lewat ROLE, bukan permission 'area' yang tidak pernah ada
  const { auth } = usePage().props;
  const isMantri = auth?.roles?.includes('mantri');

  /**
   * Gerbang tombol "Reset Pinjaman" (updateType: 'resetdata'), tiga lapis:
   *  1. Hak akses  - hanya pemegang `can-approve`. Mantri tidak boleh.
   *  2. Rekap harian - begitu rekap tanggal drop di-ACC kepala
   *     (`recap_approved`), angka hari itu sudah masuk laporan sehingga status
   *     tidak boleh diputar balik. Superuser dikecualikan.
   *  3. Sudah diajukan pengganti - pinjaman ini sudah dijadikan dasar
   *     pengajuan lain yang masih aktif (top-up ATAU Tundaan). Reset di sini
   *     akan bikin data pengajuan pengganti itu jadi tidak konsisten (dia
   *     merujuk balik ke pinjaman ini lewat previous_loan_id/postponed_loan_id).
   *     TIDAK ada pengecualian superuser untuk yang ini.
   */
  const canApprove = auth?.permissions?.includes('can-approve');
  const isSuperUser = auth?.roles?.includes('superuser');
  const terkunciRekap = triggeredData?.recap_approved && !isSuperUser;
  const terkunciPengganti = triggeredData?.sudah_diajukan_pengganti;
  const bolehReset = canApprove && !terkunciRekap && !terkunciPengganti;

  /**
   * Satu keterangan saja yang tampil, bukan ditumpuk - kalau tombolnya bisa
   * diklik, tampilkan penjelasan dasar (cara pakai). Kalau mati, tampilkan
   * SATU alasan paling relevan kenapa (bukan digabung semua kemungkinan
   * sekaligus, supaya tidak membingungkan).
   */
  const pesanTidakBisa = !canApprove
    ? 'JIKA ADA KESALAHAN SAAT KLICK TOMBOL, BISA HUBUNGI KM / PIMPINAN UNTUK MENGUBAHNYA'
    : terkunciPengganti
      ? 'Transaksi ini sudah diajukan (jadi dasar pengajuan/Tundaan lain yang masih berjalan), tidak bisa direset.'
      : terkunciRekap
        ? 'Rekap harian tanggal drop ini sudah di-ACC pimpinan, pinjaman tidak bisa direset lagi. Hubungi superuser bila memang harus diubah.'
        : null;

  const { data, setData, put, processing, reset, transform, errors } = useForm({
    request_date: '',
    drop_date: '',
    request_nominal: '',
    approved_nominal: '',
    nominal_drop: '',
    drop_langsung: '',
  });
  const [errorClient, setErrorClient] = useState(null);
  useEffect(() => {
    if (triggeredData) {
      setData((prevData) => ({
        ...prevData,
        request_date: triggeredData.request_date,
        drop_date: triggeredData.tanggal_drop,
        drop_langsung: triggeredData.drop_langsung,

        request_nominal:
          triggeredData.drop_langsung == 'baru'
            ? triggeredData.drop_jadi
            : triggeredData.request,

        approved_nominal: triggeredData.acc,
        nominal_drop: triggeredData.drop_jadi,
      }));
    }
  }, [triggeredData]);

  const onDateChange = (e) => {
    setErrorClient(null);

    const { name, value } = e.target;
    const isRequestDate = name === 'request_date' && data.drop_date === value;
    const isDropDate = name === 'drop_date' && data.request_date === value;

    const istrue = isRequestDate || isDropDate;
    const statusBefore =
      triggeredData?.status == 'gagal' || triggeredData?.status == 'tolak';

    if (istrue && statusBefore) {
      setErrorClient(
        'Status GAGAL / TOLAK tidak bisa diubah ke drop Langsung / Pengajuan',
      );
      return null;
    }

    setData((prevData) => ({
      ...prevData,
      [name]: value,
      drop_langsung: istrue ? 'baru' : 'lama',

      request_nominal: istrue
        ? null
        : triggeredData.drop_langsung == 'baru'
          ? triggeredData.drop_jadi
          : triggeredData.request,

      approved_nominal: istrue
        ? null
        : triggeredData.drop_langsung == 'baru'
          ? triggeredData.drop_jadi
          : triggeredData.acc,

      nominal_drop: istrue
        ? triggeredData.drop_langsung == 'baru'
          ? triggeredData.drop_jadi
          : triggeredData.request
        : triggeredData.status == 'success'
          ? triggeredData.drop_jadi
          : null,
    }));
  };

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const onChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const handleSubmit = (status) => {
    transform((data) => ({
      ...data,
      updateType: status,
    }));

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
    <form onSubmit={(e) => e.preventDefault()}>
      {isMantri && (
        <p className="mb-2 text-xs font-medium text-amber-600">
          Hanya bisa dilakukan oleh Pimpinan / Staff
        </p>
      )}
      <Loading show={processing} />
      {/* <div className="mb-1 ">
        <div className="flex w-full gap-3">
          <div className="flex-1">
            <Label htmlFor="request_date">Tanggal Pengajuan</Label>
            <Input
              type="date"
              onChange={onDateChange}
              value={data.request_date}
              id={'request_date'}
              max={data.drop_date}
              required
              name={'request_date'}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor="drop_date">Tanggal Drop</Label>
            <Input
              type="date"
              onChange={onDateChange}
              value={data.drop_date}
              id={'drop_date'}
              min={data.request_date}
              required
              name={'drop_date'}
            />
          </div>
        </div>
        {errorClient ? (
          <div className="font-semibold text-red-500">{errorClient}</div>
        ) : data.drop_langsung == 'baru' ? (
          <div className="text-red-500 w-fullfont-semibold">DROP BARU</div>
        ) : (
          <div className="w-full font-semibold text-red-500">
            PENGAJUAN DROP
          </div>
        )}
      </div> */}

      {/* <div className="mb-3">
        <div className="text-xs text-blue-500">
          Perubahan Tanggal Mempengaruhi Perolehan Drop dan Rencana Drop
        </div>
        <div className="text-xs">
          Jika <span className="font-semibold text-blue-500">Drop Baru</span>{' '}
          diubah ke{' '}
          <span className="font-semibold text-blue-500">
            Drop Lama / Pengajuan
          </span>
        </div>
      </div> */}

      {/* <div className="flex w-full gap-3 mb-1">
        {data.drop_langsung == 'lama' && (
          <>
            <div className="flex-1">
              <Label htmlFor="request_nominal">Pengajuan</Label>
              <CurrencyInput
                className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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

            {data.approved_nominal && (
              <div className="flex-1">
                <Label htmlFor="approved_nominal">Acc</Label>
                <CurrencyInput
                  className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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

        {data.nominal_drop && (
          <div className="flex-1">
            <Label htmlFor="nominal_drop">Drop Jadi</Label>
            <CurrencyInput
              className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
      </div> */}
      <div className="mb-3">
        {pesanTidakBisa ? (
          <div
            className={`text-xs font-medium leading-relaxed ${
              canApprove ? 'text-destructive' : 'text-amber-600'
            }`}
          >
            {pesanTidakBisa}
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground">
              Jika ada kesalahan status, reset pinjaman agar status kembali{' '}
              <span className="font-semibold text-foreground">open</span>, lalu
              lakukan ACC ulang.
            </div>
            <div className="text-xs text-yellow-500">
              Setelah Transaksi Hari Ini Dikunci Pinjaman Tidak Bisa Direset
              Lagi
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between">
        {/* <Button onClick={() => handleSubmit('detailchange')} type="submit">
          Ubah
        </Button> */}
        {triggeredData?.drop_langsung == 'lama' && canApprove && (
          <Button
            onClick={() => handleSubmit('resetdata')}
            variant="yellow"
            type="submit"
            disabled={!bolehReset}
          >
            Reset Pinjaman
          </Button>
        )}
      </div>
    </form>
  );
};

export default ChangeDetail;
