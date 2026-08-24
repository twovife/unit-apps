import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Loading from '@/Components/Loading';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectList from '@/Components/SelectList';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

const JenisNasabah = ({ loan }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    notes: '',
    type_transaksi: 'notes',
  });

  useEffect(() => {
    setData('notes', loan.notes);
  }, [loan]);

  const handleOnChange = (e) => {
    setData(
      e.target.name,
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    );
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(route('pinjaman.bayar_pinjaman', loan.id));
    reset('notes');
  };
  return (
    <Card>
      <Loading show={processing} />
      <CardHeader>
        <CardTitle>Jenis Nasabah</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmitCreate}>
          <InputLabel htmlFor="status" value="Status" />
          {/* Dulu select + tombol berdampingan (flex-3/flex-1) - pas kartu
              ini jadi setengah lebar (2 kolom), teks placeholder select
              ("Pilih Salah Satu") kepotong. Ditumpuk saja, sama-sama full
              width, supaya tidak kepotong berapa pun lebar kartunya. */}
          <div className="flex flex-col w-full gap-3">
            <SelectList
              id="notes"
              type="date"
              name="notes"
              value={data.notes}
              options={[
                {
                  id: 1,
                  value: '10L',
                  display: '10L',
                },
                {
                  id: 2,
                  value: 'Beban Pemakaian',
                  display: 'Beban Pemakaian',
                },
                {
                  id: 3,
                  value: 'CM LUNAS',
                  display: 'CM LUNAS',
                },
              ]}
              nullValue={true}
              className="block w-full mt-1"
              onChange={handleOnChange}
            />
            <PrimaryButton title={'Submit'} type="submit" className="w-full" />
          </div>

          <InputError message={errors.notes} className="mt-2" />
        </form>
      </CardContent>
    </Card>
  );
};

export default JenisNasabah;
