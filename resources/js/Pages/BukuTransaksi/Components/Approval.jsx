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
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

const Approval = ({ show = false, onClosed, triggeredData, staticData }) => {
  const { data, setData, post, reset, errors, processing } = useForm({
    id: '',
    date: '',
    kasbon: '',
    transport: '',
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
  const [flaatenData, setFlaatenData] = useState([]);

  useEffect(() => {
    const flaatenData = staticData?.flat(2) ?? [];

    if (triggeredData) {
      const filteredData = flaatenData.filter((item) => {
        return (
          item.request_date === triggeredData.tanggal &&
          item.tanggal_drop != item.request_date
        );
      });

      const rencana = filteredData.reduce((a, item) => {
        return a + item.acc;
      }, 0);

      setData({
        id: triggeredData.grouping_id ?? null,
        date: triggeredData.tanggal,
        kasbon: triggeredData.kasbon,
        transport: triggeredData.transport,
        target: triggeredData.target,
        masuk:
          triggeredData.masuk == 0
            ? triggeredData.drop * 0.13
            : triggeredData.masuk,
        keluar:
          triggeredData.keluar == 0
            ? triggeredData.rencana * 0.13
            : triggeredData.keluar,
        baru: triggeredData.baru,
        lama: triggeredData.lama,
        storting: triggeredData.storting,
        drop: triggeredData.drop,
        rencana: triggeredData.rencana,
        tanggal_rencana_minggu_depan: triggeredData?.tanggal ?? '',
        rencana_minggu_depan: rencana ?? 0,
        target_minggu_depan:
          triggeredData.target + triggeredData.masuk - triggeredData.keluar ??
          0,
      });
      setFlaatenData(filteredData);
    }
  }, [triggeredData, show]);

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
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
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
                <p className="mb-1 italic font-thin text-gray-500">
                  di isi jika kasir belum mengisi
                </p>
                <div className="mb-3">
                  <Label htmlFor="kasbon">Kasbon</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="kasbon"
                    readOnly={data.status_dayly_approval}
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.kasbon}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <div className="mb-3">
                  <Label htmlFor="transport">Transport</Label>
                  <CurrencyInput
                    className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    name="transport"
                    readOnly={data.status_dayly_approval}
                    allowDecimals={false}
                    prefix="Rp. "
                    min={1}
                    required
                    onValueChange={onHandleCurencyChange}
                    value={data.transport}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
                </div>
                <br />
                <p className="mb-1 italic font-thin text-gray-500">
                  di isi saat Approval / Cek Transaksi Mantri
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
                    min={dayjs(data.date).add('1', 'week').format('YYYY-MM-DD')}
                    required
                    onChange={onInputChange}
                    type="date"
                    value={data.tanggal_rencana_minggu_depan}
                    placeholder={'Inputkan angka tanpa sparator'}
                  />
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

                <div className="flex gap-3">
                  <div className="flex-1 text-center">
                    <div className="mb-3">
                      {triggeredData?.is_kasir ? (
                        <>
                          <div>Telah Dicek Oleh Kepala</div>
                          <div>Pada Tanggal : {triggeredData?.at_approved}</div>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="mb-3">
                      {triggeredData?.is_approved ? (
                        <>
                          <div>Telah Dicek Oleh Kepala</div>
                          <div>Pada Tanggal : {triggeredData?.at_approved}</div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-center flex-1 gap-3 mb-1 whitespace-nowrap">
                            <Checkbox
                              readOnly={data.status_dayly_approval}
                              name="daily_kepala_approval"
                              placeholder="Select Permission"
                              id="daily_kepala_approval"
                              onChange={onInputChange}
                            />
                            <InputLabel htmlFor="daily_kepala_approval">
                              Ceklist Pimpinan
                            </InputLabel>
                          </div>
                          <div className="italic font-light">
                            Dicentang jika Kepala Sudah Melakukan Ceklist
                            Terhadap Transaksi Hari ini, setelah ceklist data
                            angsuran dan transaksi tidak dapat diubah
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3 text-right">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Approval;
