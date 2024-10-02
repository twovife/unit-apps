import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import Loading from '@/Components/Loading';
import Modal from '@/Components/Modal';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import dayjs from 'dayjs';
import { parse } from 'postcss';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

const Approval = ({ show = false, onClosed, triggeredData, staticData }) => {
  const { data, setData, post, reset, errors, processing } = useForm({
    id: '',
    date: '',
    masuk: '',
    keluar: '',
    target: '',
    baru: '',
    lama: '',
    storting: '',
    drop: '',
    rencana: '',
    tanggal_rencana_minggu_depan: '',
    rencana_minggu_depan: '',
    target_minggu_depan: '',
  });
  const [flaatenData, setFlaatenData] = useState();
  const [erorRequest, setErorRequest] = useState(false);

  useEffect(() => {
    const flaatenData = staticData?.flat(2) ?? [];

    if (triggeredData) {
      const filteredData = flaatenData.filter((item) => {
        return (
          item.request_date === triggeredData.tanggal &&
          item.tanggal_drop != item.request_date
        );
      });

      const uniqueDropDates = [
        ...new Set(filteredData.map((item) => item.tanggal_drop)),
      ];

      const uniqueDropDatesString =
        uniqueDropDates.length === 1
          ? uniqueDropDates[0]
          : uniqueDropDates.length === 0
          ? setErorRequest(false)
          : setErorRequest(true);

      console.log(uniqueDropDatesString);

      const rencana = filteredData.reduce((a, item) => {
        return a + item.acc;
      }, 0);

      setData({
        id: triggeredData.grouping_id ?? null,
        date: triggeredData.tanggal,
        target: triggeredData.target,
        masuk: triggeredData.drop * 0.13,
        keluar: triggeredData.keluar ?? 0,
        baru: triggeredData.baru,
        lama: triggeredData.lama,
        storting: triggeredData.storting,
        drop: triggeredData.drop,
        rencana: triggeredData.rencana,
        tanggal_rencana_minggu_depan: uniqueDropDatesString ?? null,
        rencana_minggu_depan: rencana ?? 0,
        target_minggu_depan: 0,
      });
      setFlaatenData(uniqueDropDatesString ?? null);
    }
  }, [triggeredData, show]);

  useEffect(() => {
    setData(
      'target_minggu_depan',
      parseInt(data.target) + (parseInt(data.masuk) - parseInt(data.keluar))
    );
  }, [data.target, data.masuk, data.keluar]);

  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    );
  };

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const closedModal = () => {
    onClosed();
    reset();
    setErorRequest(false);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    // console.log(data);

    post(route('kasir.rekap.ceklist_kepala'), {
      onSuccess: () => {
        reset();
        onClosed();
      },
    });
  };
  // console.log(data);

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : closedModal())}>
      <Loading show={loading || processing} />
      <DialogContent className="w-[90vw] h-[90vh] lg:h-auto lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Cek Transaksi</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Data Sedang Dimuat</div>
        ) : (
          <div>
            {triggeredData && (
              <div>
                <Table className="mb-3">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        Total Transaksi
                      </TableHead>
                      <TableHead className="text-center">
                        Transaksi Open
                      </TableHead>
                      <TableHead className="text-center">
                        Transaksi Tolak
                      </TableHead>
                      <TableHead className="text-center">
                        Transaksi Gagal
                      </TableHead>
                      <TableHead className="text-center">
                        Transaksi Berhasil
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={data.target}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.drop}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.storting}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.baru}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.baru}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <br />
                <h1 className="mb-1">Transaksi Hari Ini</h1>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Target</TableHead>
                      <TableHead className="text-center">Drop</TableHead>
                      <TableHead className="text-center">Storting</TableHead>
                      <TableHead className="text-center">Baru</TableHead>
                      <TableHead className="text-center">Lama</TableHead>
                      <TableHead className="text-center">Rencana</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={data.target}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.drop}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.storting}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.baru}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.lama}
                        />
                      </TableCell>
                      <TableCell>
                        <FormatNumbering
                          className="text-center"
                          value={triggeredData.rencana}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
            {!triggeredData?.is_approved && (
              <form onSubmit={onSubmitForm}>
                <div className="max-h-[60vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
                  {!triggeredData?.is_generated && (
                    <div className="mb-3">
                      <Label htmlFor="target">Target</Label>

                      <CurrencyInput
                        className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        name="target"
                        readOnly={data.status_dayly_approval}
                        allowDecimals={false}
                        prefix="Rp. "
                        min={1}
                        required
                        onValueChange={onHandleCurencyChange}
                        value={data.target}
                        placeholder={'Inputkan angka tanpa sparator'}
                      />
                    </div>
                  )}
                  <br />
                  <p className="mb-1 italic font-thin text-gray-500">
                    Sebelum Ceklist, Diharapkan Semua Storting, Rencana, target
                    dan drop sudah sesuai, tidak diperbolehkan ada transaksi
                    yang masih Open
                  </p>
                  <div className="mb-3">
                    <Label htmlFor="masuk">Masuk</Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="masuk"
                      readOnly={data.status_dayly_approval}
                      allowDecimals={false}
                      prefix="Rp. "
                      min={1}
                      required
                      onValueChange={onHandleCurencyChange}
                      value={data.masuk}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="keluar">Keluar</Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="keluar"
                      readOnly={data.status_dayly_approval}
                      allowDecimals={false}
                      prefix="Rp. "
                      min={1}
                      required
                      onValueChange={onHandleCurencyChange}
                      value={data.keluar}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>

                  <p className="mb-3 font-semibold underline">
                    Transaksi Minggu Depan
                  </p>
                  <div className="mb-3">
                    <Label htmlFor="tanggal_minggu_depan">
                      Tanggal Rencana Drop Minggu Depan
                    </Label>
                    <Input
                      name="tanggal_rencana_minggu_depan"
                      readOnly={data.tanggal_rencana_minggu_depan}
                      min={dayjs(data.date)
                        .add('1', 'week')
                        .format('YYYY-MM-DD')}
                      required
                      onChange={onInputChange}
                      type="date"
                      value={data.tanggal_rencana_minggu_depan}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                    {erorRequest && (
                      <small className="text-red-500 ">
                        Periksa Kembali, Pengajuan Memiliki 2 Tanggal Drop Yang
                        Berbeda
                      </small>
                    )}
                    {data.tanggal_rencana_minggu_depan == null && (
                      <small className="text-red-500 ">
                        Tidak Ada Pengajuan Untuk Minggu Depan, Isikan Tanggal
                        Secara Manual
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="rencana_minggu_depan">
                      Rencana Drop Minggu Depan
                    </Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="rencana_minggu_depan"
                      allowDecimals={false}
                      readOnly={data.status_dayly_approval}
                      prefix="Rp. "
                      min={1}
                      required
                      onValueChange={onHandleCurencyChange}
                      value={data.rencana_minggu_depan}
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="target_minggu_depan">
                      Target Minggu Depan
                    </Label>
                    <CurrencyInput
                      className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="target_minggu_depan"
                      allowDecimals={false}
                      readOnly={data.status_dayly_approval}
                      prefix="Rp. "
                      min={1}
                      required
                      onValueChange={onHandleCurencyChange}
                      value={
                        parseInt(data.target) +
                        (parseInt(data.masuk) - parseInt(data.keluar))
                      }
                      placeholder={'Inputkan angka tanpa sparator'}
                    />
                  </div>
                  <div className="flex items-center justify-start flex-1 gap-3 mb-1 whitespace-nowrap">
                    <Checkbox
                      readOnly={data.status_dayly_approval}
                      placeholder="Select Permission"
                      id="daily_kepala_approval"
                      required
                    />
                    <InputLabel htmlFor="daily_kepala_approval">
                      Konfirmasi Jika Sudah Benar Semua
                    </InputLabel>
                  </div>
                </div>
                <div className="mb-3 text-right">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Approval;
