import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';
import dayjs from 'dayjs';
import Loading from '@/Components/Loading';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';

// Nama bulan Indonesia (dayjs di proyek ini tanpa locale id).
const namaBulan = (d, tahun = false) =>
  d.toDate().toLocaleDateString('id-ID', tahun ? { month: 'long', year: 'numeric' } : { month: 'long' });

const rp = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0);

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

  const bulan = dayjs(month);

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

  return (
    <Sheet open={show} onOpenChange={(open) => (open ? '' : modalIsClosed())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-2xl">
        <Loading show={processing} />
        <SheetHeader className="px-5 py-4 pr-12 border-b">
          <SheetTitle>Approval Akhir Bulan</SheetTitle>
          <SheetDescription>
            Sirkulasi awal &amp; akhir bulan ini, lalu saldo awal bulan depan per ember — diambil dari saldo akhir
            dengan ember bergeser satu tingkat. Semua angka hasil hitung, tidak bisa diubah.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmitForm} className="px-5 py-4 space-y-4">
          {/* Satu baris per ember: awal -> angsuran -> akhir | awal bulan depan (ember bergeser satu tingkat).
              Lancar dipecah per bulan drop: n1 = drop bulan lalu, normal = drop bulan ini. */}
          <div className="overflow-x-auto border rounded-lg">
            <Table className="text-sm">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-3">Ember</TableHead>
                  <TableHead className="px-3 text-right">Awal {namaBulan(bulan)}</TableHead>
                  <TableHead className="px-3 text-right">Angsuran</TableHead>
                  <TableHead className="px-3 text-right">Akhir {namaBulan(bulan)}</TableHead>
                  <TableHead className="px-3 text-right border-l">Awal {namaBulan(bulan.add(1, 'month'))}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ['ML', data.ml_amount, datas?.ml, data.ml_next],
                  ['MB', data.mb_amount, datas?.mb, data.mb_next],
                  ['CM', data.cm_amount, datas?.cm, data.cm_next],
                  ['Calon CM', datas?.ccm?.sirkulasi, datas?.ccm, datas?.n1?.saldo],
                  [`Drop ${namaBulan(bulan.subtract(1, 'month'))}`, datas?.n1?.sirkulasi, datas?.n1, datas?.normal?.saldo, `Drop ${namaBulan(bulan)}`],
                  [`Drop ${namaBulan(bulan)}`, datas?.normal?.sirkulasi, datas?.normal, 0, `Drop ${namaBulan(bulan.add(1, 'month'))}`],
                ].map(([label, awal, ember, depan, isiDepan]) => (
                  <TableRow key={label}>
                    <TableCell className="px-3 font-medium whitespace-nowrap">{label}</TableCell>
                    <TableCell className="px-3 text-right tabular-nums">{rp(awal)}</TableCell>
                    <TableCell className="px-3 text-right tabular-nums">
                      {rp(ember?.angsuran)}
                      {!!ember?.pemutihan && <div className="text-[11px] text-red-600">+ MD {rp(ember.pemutihan)}</div>}
                    </TableCell>
                    <TableCell className="px-3 font-medium text-right tabular-nums">{rp(ember?.saldo)}</TableCell>
                    <TableCell className="px-3 font-semibold text-right border-l tabular-nums">
                      {rp(depan)}
                      {isiDepan && <div className="text-[11px] font-normal text-slate-400">jadi {isiDepan}</div>}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold bg-slate-50">
                  <TableCell className="px-3">Total</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{rp(data.amount)}</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">
                    {rp(Object.values(datas ?? {}).reduce((t, e) => t + (Number(e?.angsuran) || 0), 0))}
                  </TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{rp(data.amount_akhir)}</TableCell>
                  <TableCell className="px-3 text-right border-l tabular-nums">{rp(data.amount_next)}</TableCell>
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
