import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@/shadcn/ui/button';
import Loading from '@/Components/Loading';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';

const rp = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0);

// Baris tabel: [label, kolom awal, kolom akhir, kolom bulan depan (isian)].
const BARIS = [
  ['ML', 'ml_amount', 'ml_amount_akhir', 'ml_next'],
  ['MB', 'mb_amount', 'mb_amount_akhir', 'mb_next'],
  ['CM', 'cm_amount', 'cm_amount_akhir', 'cm_next'],
  ['Calon CM', 'calon_cm_amount', 'calon_cm_amount_akhir', null],
  ['Normal', 'normal', 'normal_akhir', 'normal_next'],
];

const ApprovalAkhir = ({ datas, show = false, onClosed }) => {
  const {
    sirkulasi,
    server_filter: { month, hari, groupId },
  } = usePage().props;

  const { data, setData, post, reset, processing, errors, transform } = useForm(
    {
      ml_amount: '',
      mb_amount: '',
      cm_amount: '',
      amount: '',

      amount_next: '',
      cm_next: '',
      mb_next: '',
      ml_next: '',
    }
  );

  useEffect(() => {
    // const calculateTotals = datas.reduce(
    //   (acc, item) => acc + parseInt(item[saldo] ?? 0),
    //   0
    // );
    const sumAllSaldo = (data) => {
      return Object.values(data).reduce((total, { saldo }) => total + saldo, 0);
    };
    let totalSaldo = 0;

    if (datas) {
      totalSaldo = sumAllSaldo(datas);
    }

    setData({
      month: month,
      hari: hari,
      transaction_loan_officer_grouping_id: groupId,
      ml_amount: sirkulasi?.ml_amount ?? 0,
      mb_amount: sirkulasi?.mb_amount ?? 0,
      cm_amount: sirkulasi?.cm_amount ?? 0,
      calon_cm_amount: datas?.ccm?.sirkulasi ?? 0,
      normal: (datas?.n1?.sirkulasi ?? 0) + (datas?.normal?.sirkulasi ?? 0),
      amount: sirkulasi?.amount ?? 0,

      ml_amount_akhir: datas?.ml?.saldo ?? 0,
      mb_amount_akhir: datas?.mb?.saldo ?? 0,
      cm_amount_akhir: datas?.cm?.saldo ?? 0,
      calon_cm_amount_akhir: datas?.ccm?.saldo ?? 0,
      normal_akhir: (datas?.n1?.saldo ?? 0) + (datas?.normal?.saldo ?? 0),
      amount_akhir: totalSaldo,

      amount_next: totalSaldo,
      ml_next: (datas?.ml?.saldo ?? 0) + (datas?.mb?.saldo ?? 0),
      mb_next: datas?.cm?.saldo ?? 0,
      cm_next: datas?.ccm?.saldo ?? 0,
      normal_next: (datas?.n1?.saldo ?? 0) + (datas?.normal?.saldo ?? 0),
    });
  }, [sirkulasi, show]);

  const modalIsClosed = () => {
    onClosed();
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route('adminpanel.sirkulasiAwal'), {
      onSuccess: () => {
        modalIsClosed();
      },
    });
  };

  const onHandleCurencyChange = (value, name) => {
    const keySum = ['ml_next', 'mb_next', 'cm_next', 'normal_next'];
    let nominalData = 0;

    keySum.forEach((key) => {
      nominalData += parseInt(key === name ? value : data[key]) || 0;
    });

    setData((prevData) => ({
      ...prevData,
      [name]: value,
      amount_next: nominalData,
    }));
  };

  return (
    <Sheet open={show} onOpenChange={(open) => (open ? '' : modalIsClosed())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-2xl">
        <Loading show={processing} />
        <SheetHeader className="px-5 py-4 pr-12 border-b">
          <SheetTitle>Approval Akhir Bulan</SheetTitle>
          <SheetDescription>
            Sirkulasi awal &amp; akhir bulan ini, lalu saldo awal bulan depan per ember. Kolom bulan depan sudah
            terisi dari saldo akhir (ember bergeser satu tingkat); ubah hanya bila perlu.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmitForm} className="px-5 py-4 space-y-4">
          <div className="overflow-x-auto border rounded-lg">
            <Table className="text-sm">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-3">Ember</TableHead>
                  <TableHead className="px-3 text-right">Awal bulan</TableHead>
                  <TableHead className="px-3 text-right">Akhir bulan</TableHead>
                  <TableHead className="px-3 text-right">Awal bulan depan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BARIS.map(([label, awal, akhir, depan]) => (
                  <TableRow key={label}>
                    <TableCell className="px-3 font-medium">{label}</TableCell>
                    <TableCell className="px-3 text-right tabular-nums text-slate-600">{rp(data[awal])}</TableCell>
                    <TableCell className="px-3 text-right tabular-nums">{rp(data[akhir])}</TableCell>
                    <TableCell className="px-3 py-1.5 text-right">
                      {depan ? (
                        <CurrencyInput
                          className="w-36 h-8 px-2 text-sm text-right border rounded-md tabular-nums border-input"
                          name={depan}
                          allowDecimals={false}
                          allowNegativeValue={false}
                          groupSeparator="."
                          decimalSeparator=","
                          required
                          onValueChange={onHandleCurencyChange}
                          value={data[depan]}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">masuk CM</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold bg-slate-50">
                  <TableCell className="px-3">Total</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{rp(data.amount)}</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{rp(data.amount_akhir)}</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{rp(data.amount_next)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" required className="mt-0.5" />
            Saldo awal bulan depan sudah saya cek dan sesuai.
          </label>

          <Button type="submit" className="w-full" disabled={processing}>
            Simpan approval akhir
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ApprovalAkhir;
