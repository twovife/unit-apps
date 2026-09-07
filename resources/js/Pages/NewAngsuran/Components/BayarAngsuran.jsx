import React, { useEffect, useState } from 'react';

import { Label } from '@/shadcn/ui/label';
import { Input } from '@/shadcn/ui/input';
import CurrencyInput from 'react-currency-input-field';
import Checkbox from '@/Components/Checkbox';
import { Button } from '@/shadcn/ui/button';
import { useForm, usePage } from '@inertiajs/react';
import Loading from '@/Components/Loading';
import NoEditOverlay from '@/Components/NoEditOverlay';
import { getLastDateForHari } from '@/lib/utils';
import useHariLibur from '@/Hooks/useHariLibur';

const BayarAngsuran = ({ triggeredId, triggeredPinjaman, instalment }) => {
  const [triggeredData, setTriggeredData] = useState({});
  useEffect(() => {
    setTriggeredData(triggeredPinjaman);
  }, [triggeredPinjaman]);

  const {
    server_filter: {
      closed_transaction,
      tanggal: tanggalTerpilih,
      is_locked: terkunci,
    },
  } = usePage().props;

  const { mundurKeHariKerja, siap: kalenderSiap, alasanLibur } = useHariLibur();

  const { data, setData, post, errors, processing, reset, recentlySuccessful } =
    useForm({
      type_transaksi: 'bayar',
      transaction_date: '',
      nominal: 0,
      id: '',
    });

  useEffect(() => {
    setData('id', triggeredId);
  }, [triggeredId, recentlySuccessful]);

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    );
  };

  const buttonValueClick = (e) => {
    const value = e.target.getAttribute('data-value');
    setData('nominal', value);
  };
  const buttonAddNominal = (e) => {
    const nominal = parseInt(data.nominal);
    const value = parseInt(e.target.getAttribute('data-value'));
    setData('nominal', value + nominal);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route('pinjaman.bayar_pinjaman', data.id), {
      preserveScroll: true,
      onSuccess: () => {
        reset('transaction_date', 'nominal');
      },
    });
  };

  const [nominalPembayaran, setNominalPembayaran] = useState([
    50000, 52000, 60000, 65000, 100000, 130000, 195000, 260000, 390000,
  ]);

  useEffect(() => {
    // Tanggalnya diturunkan dari hari tagih pinjaman dan kolomnya dimatikan,
    // jadi user tidak punya cara membetulkannya. Kalau hari tagih terakhir
    // ternyata libur, server akan menolaknya (App\Rules\HariKerja) dan
    // pembayaran jadi BUNTU. Karena itu yang menurunkan tanggal harus ikut
    // tahu kalender: mundur ke hari tagih terakhir yang benar-benar bekerja.
    setData((prev) => ({
      ...prev,
      transaction_date:
        tanggalTerpilih ??
        mundurKeHariKerja(getLastDateForHari(triggeredPinjaman?.hari)),
    }));

    if (instalment.length > 0) {
      const getMostFrequentNumber = (data) => {
        const frequency = data.reduce((acc, { nomor }) => {
          acc[nomor] = (acc[nomor] || 0) + 1;
          return acc;
        }, {});

        return Object.keys(frequency).reduce((a, b) =>
          frequency[a] > frequency[b] ? a : b,
        );
      };

      const result = Number(getMostFrequentNumber(instalment));
      const pelunasan =
        instalment.sort((a, b) => a.saldo - b.saldo)[0]?.saldo ?? 0;

      setNominalPembayaran((prev) => {
        // Filter hanya angka yang valid
        const validResult = !isNaN(result) && result > 0 ? result : null;
        const validPelunasan =
          !isNaN(pelunasan) && pelunasan > 0 ? pelunasan : null;

        // Gabungkan array baru tanpa duplikasi, dengan filter validasi
        const updated = [
          ...new Set(
            [
              ...prev.filter(
                (value) => value !== validResult && value !== validPelunasan,
              ),
              validResult,
              validPelunasan,
            ].filter((value) => value !== null),
          ), // Hapus null dari array
        ];

        return updated.sort((a, b) => a - b); // Urutkan dari kecil ke besar
      });
    }
  }, [instalment, triggeredPinjaman?.hari, kalenderSiap, tanggalTerpilih]);

  return (
    // Tanpa Card sendiri - sudah berada di dalam TabsContent "Input
    // Angsuran" (Action.jsx), pembungkus Card di sini dulu bikin kotak
    // bertumpuk (Card di dalam Card).
    <div className="relative w-full">
      <Loading show={processing} />
      <form onSubmit={onSubmitForm}>
        <div className="mb-3">
          <Label htmlFor="transaction_date">Tanggal Pembayaran</Label>
          <Input
            type="date"
            min={closed_transaction}
            name="transaction_date"
            id="transaction_date"
            className="w-full"
            value={data.transaction_date}
            onChange={onInputChange}
            disabled
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Angsuran dicatat pada tanggal yang sedang dibuka, tidak bisa diubah
            manual di sini. Ganti tanggal lewat filter di atas.
          </p>
        </div>
        <div className="mb-3">
          <Label htmlFor="nominal">Nominal</Label>
          <CurrencyInput
            className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            name="nominal"
            allowDecimals={false}
            prefix="Rp. "
            min={0}
            required
            disabled={terkunci}
            onValueChange={onHandleCurencyChange}
            value={data.nominal}
            placeholder={'Inputkan angka tanpa sparator'}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={buttonAddNominal}
            disabled={terkunci}
            data-value={1000}
          >
            +1 Rb
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={buttonAddNominal}
            disabled={terkunci}
            data-value={5000}
          >
            +5 Rb
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={buttonAddNominal}
            disabled={terkunci}
            data-value={10000}
          >
            +10 Rb
          </Button>
          {nominalPembayaran &&
            nominalPembayaran.map((item) => (
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={buttonValueClick}
                disabled={terkunci}
                data-value={item}
              >
                {(item / 1000).toLocaleString('id-ID')} Rb
              </Button>
            ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            {triggeredData.status_pinjaman !== 'normal' && (
              <label className="flex items-center">
                {/* Nama field `danatitipan` TIDAK diubah - itu nama kolom
                      di `transaction_loan_instalments` dan dipakai server.
                      Yang berubah hanya labelnya jadi "KATROL". */}
                <Checkbox
                  name="danatitipan"
                  value={data.danatitipan}
                  disabled={terkunci}
                  onChange={onInputChange}
                />
                <span className="ml-2 text-sm font-semibold text-gray-600">
                  KATROL
                </span>
              </label>
            )}
          </div>
          <Button disabled={processing || terkunci} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BayarAngsuran;
