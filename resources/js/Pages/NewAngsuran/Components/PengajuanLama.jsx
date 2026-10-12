import InputError from '@/Components/InputError';
import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { getLastDateForHari } from '@/lib/utils';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import TanggalKerja from '@/Components/shadcn/TanggalKerja';
import useHariLibur from '@/Hooks/useHariLibur';

const PengajuanLama = ({ isActive, triggeredId, triggeredPinjaman }) => {
  const { data, setData, errors, post, processing, reset } = useForm({
    request_date: getLastDateForHari(triggeredPinjaman?.hari),
    tanggal_drop: '',
    request_nominal: 0,
    nomor_anggota: triggeredPinjaman?.nomor_anggota ?? '',
    residential_address: triggeredPinjaman?.domisili ?? '',
    type: 'pengajuan', //type have pengajuan,baru,TD
  });

  // Nasabah yang pinjaman ini sudah punya pengajuan pengganti yang masih
  // berjalan (open/acc/success) tidak boleh diajukan lagi - form diganti
  // ringkasan pengajuan yang sudah ada + link ke drop hari itu. `null`
  // berarti belum dicek / boleh mengajukan.
  // can-edit (koreksi): tanggal drop bebas (server juga mengizinkan).
  const tanggalBebas = usePage().props.auth?.permissions?.includes('can-edit');
  const [existingPengajuan, setExistingPengajuan] = useState(null);
  // Belum selesai dicek -> jangan tampilkan form dulu (kedip form sebelum kartu).
  const [dicek, setDicek] = useState(false);

  const [mixDate, setMixDate] = useState();

  // Sesudah useForm, bukan sebelum: argumennya membaca `data`.
  const {
    majuKeHariKerja,
    mundurKeHariKerja,
    siap: kalenderSiap,
    alasanLibur,
  } = useHariLibur(data.request_date);

  // Bawaan `request_date` = hari tagih terakhir, yang bisa saja libur.
  // Dibetulkan mundur: tanggal pengajuan menunjuk hari yang sudah lewat.
  useEffect(() => {
    if (!data.request_date) return;

    const benar = mundurKeHariKerja(data.request_date);
    if (benar !== data.request_date) setData('request_date', benar);
  }, [kalenderSiap]);

  // Tanggal drop diturunkan, bukan dipilih — jadi penurunannya ikut melompati
  // hari libur. MAJU, karena drop belum terjadi. Per minggu, supaya hari tagih
  // kelompok tidak berubah.
  useEffect(() => {
    if (!data.request_date) return;

    setMixDate(data.request_date);
    setData((prevData) => ({
      ...prevData,
      tanggal_drop: majuKeHariKerja(
        dayjs(data.request_date).add(1, 'week').format('YYYY-MM-DD'),
      ),
    }));
  }, [data.request_date, kalenderSiap]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const onHandleCurencyChange = (value, name, float) => {
    setData(name, value);
  };

  const buttonValueClick = (e) => {
    const value = e.target.getAttribute('data-value');
    setData('request_nominal', value);
  };

  const getDataAxios = async () => {
    try {
      const response = await axios.get(
        route('pinjaman.checkpengajuan', triggeredId)
      );
      const { sudah_diajukan, pengajuan } = response.data.data;
      setExistingPengajuan(sudah_diajukan ? pengajuan : null);
    } catch (error) {
      console.log(error);
    } finally {
      setDicek(true);
    }
  };

  useEffect(() => {
    if (isActive && triggeredId) {
      getDataAxios(); // Call the function here
    }
  }, [isActive, triggeredId]);

  // Batalkan pengajuan (hapus pinjaman pengganti open/acc). Aturannya sama
  // dengan Hapus Pinjaman di Buku Transaksi (AppHelper::canDeleteLoan).
  const [batalYakin, setBatalYakin] = useState(false);
  const [membatalkan, setMembatalkan] = useState(false);
  const batalkan = () =>
    router.delete(route('pinjaman.destroy_loan', existingPengajuan.id), {
      preserveScroll: true,
      preserveState: true,
      onStart: () => setMembatalkan(true),
      onFinish: () => {
        setMembatalkan(false);
        setBatalYakin(false);
        getDataAxios();
      },
    });

  const submitForm = (e) => {
    e.preventDefault();
    post(route('pinjaman.store_pengajuan_lama', triggeredId), {
      onSuccess: () => {
        reset();
        getDataAxios();
      },
      // preserveState: true,
    });
  };
  if (!dicek) return <div className="text-xs text-muted-foreground">Memeriksa pengajuan…</div>;

  return (
    <div>
      {existingPengajuan ? (
        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">
            Nasabah ini sudah diajukan pinjaman baru — tidak bisa diajukan
            lagi.
          </p>
          <div className="grid grid-cols-2 gap-2 p-3 border rounded-md bg-muted/40">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </div>
              <div className="capitalize">{existingPengajuan.status}</div>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Tanggal Drop
              </div>
              <div>{dayjs(existingPengajuan.tanggal_drop).format('DD-MM-YYYY')}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {existingPengajuan.status === 'success' ? 'Drop' : 'Pengajuan'}
              </div>
              <FormatNumbering
                value={
                  existingPengajuan.nominal_drop ??
                  existingPengajuan.request_nominal
                }
                className="font-semibold"
              />
            </div>
          </div>
          <a
            href={route('pinjaman.index_pinjaman', {
              date: existingPengajuan.tanggal_drop,
              kelompok: existingPengajuan.kelompok,
            })}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-blue-500 underline"
          >
            Lihat Drop Hari Itu
          </a>
          {existingPengajuan.batal && (
            <div className="pt-2 mt-2 border-t">
              {existingPengajuan.batal.status ? (
                <>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Selama pengajuan ini ada, angsuran nasabah ini tidak bisa dihapus. Batalkan dulu kalau angsurannya
                    perlu dikoreksi.
                  </p>
                  {batalYakin ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={membatalkan} onClick={() => setBatalYakin(false)}>
                        Tidak
                      </Button>
                      <Button variant="destructive" size="sm" disabled={membatalkan} onClick={batalkan}>
                        {membatalkan ? 'Membatalkan…' : 'Ya, batalkan pengajuan'}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => setBatalYakin(true)}>
                      Batalkan pengajuan
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-xs font-medium text-amber-600">{existingPengajuan.batal.message}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Loading show={processing} />
          <div className="w-full mb-3">
            <Label>Tanggal Pengajuan</Label>
            <TanggalKerja
              name="request_date"
              required={true}
              value={data.request_date}
              onChange={onInputChange}
            />
            <InputError message={errors.request_date} />
          </div>
          <div className="w-full mb-3">
            <Label>Tanggal Drop</Label>
            {/* Dikunci: selalu hari tagih kerja berikutnya sesudah pengajuan
                (diisi otomatis di atas; server menegakkan aturan yang sama).
                can-edit (koreksi): bebas memilih, hari tagih tetap sama. */}
            <TanggalKerja
              name="tanggal_drop"
              min={mixDate}
              required={true}
              disabled={!tanggalBebas}
              hariTagih={tanggalBebas && data.request_date ? dayjs(data.request_date).day() : undefined}
              value={data.tanggal_drop}
              onChange={onInputChange}
            />
            {data.request_date &&
              data.tanggal_drop &&
              // Bukan untuk drop di hari pengajuan.
              data.tanggal_drop !== data.request_date &&
              data.tanggal_drop !==
                dayjs(data.request_date).add(1, 'week').format('YYYY-MM-DD') && (
                <p className="mt-1 text-xs text-amber-700">
                  Minggu depan jatuh hari libur
                  {alasanLibur(
                    dayjs(data.request_date).add(1, 'week').format('YYYY-MM-DD'),
                  )
                    ? ` (${alasanLibur(
                        dayjs(data.request_date)
                          .add(1, 'week')
                          .format('YYYY-MM-DD'),
                      )})`
                    : ''}
                  , dilompat ke hari tagih berikutnya.
                </p>
              )}
            <InputError message={errors.tanggal_drop} />
          </div>

          <div className="w-full mb-3">
            <Label>Kelompok</Label>
            <Input type="text" value={triggeredPinjaman?.kelompok ?? ''} disabled />
          </div>

          <div className="w-full mb-3">
            <Label>Nomor Anggota</Label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="nomor_anggota"
              required={true}
              value={data.nomor_anggota}
              // Nomor anggota hanya angka: huruf dibuang saat diketik.
              onChange={(e) => setData('nomor_anggota', e.target.value.replace(/\D/g, ''))}
            />
            <InputError message={errors.nomor_anggota} />
          </div>

          <div className="w-full mb-3">
            <Label>Domisili Nasabah</Label>
            <Input
              type="text"
              name="residential_address"
              value={data.residential_address}
              onChange={onInputChange}
              placeholder={triggeredPinjaman?.alamat}
            />
            <InputError message={errors.residential_address} />
            {!data.residential_address && (
              <p className="mt-1 text-xs text-muted-foreground">
                Kosong berarti pakai alamat identitas: {triggeredPinjaman?.alamat ?? '—'}
              </p>
            )}
          </div>

          <div className="w-full mb-3">
            <Label>Nominal Pinjaman</Label>
            <CurrencyInput
              className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              name="request_nominal"
              defaultValue={0}
              allowDecimals={false}
              prefix="Rp. "
              min={1}
              required
              onValueChange={onHandleCurencyChange}
              value={data.request_nominal}
              placeholder={'Inputkan angka tanpa sparator'}
            />
            <InputError message={errors.request_nominal} />
          </div>
          <div className="flex flex-wrap w-full gap-2 mb-3">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="400000"
            >
              400rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="500000"
            >
              500rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="700000"
            >
              700rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="800000"
            >
              800rb
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="1000000"
            >
              1 Jt
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={buttonValueClick}
              data-value="1500000"
            >
              1,5 Jt
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="xs"
              onClick={buttonValueClick}
              data-value="0"
            >
              reset
            </Button>
          </div>
          <div className="text-end">
            <Button type="submit" onClick={submitForm} disabled={processing}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengajuanLama;
