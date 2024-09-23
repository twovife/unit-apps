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

const Approval = ({ show = false, onClosed, triggeredData, triggeredDate }) => {
  const [loading, setLoading] = useState(false);
  // const [pelunasan, setPelunasan] = useState({});
  // const [rencana, setRencana] = useState({});
  // console.log(pelunasan);

  // const { data, setData, post, reset, errors, processing } = useForm({
  //   id: '',
  //   date: '',
  //   kasbon: '',
  //   transport: '',
  //   masuk: '',
  //   keluar: '',
  //   baru: '',
  //   lama: '',
  //   storting: '',
  //   drop: '',
  //   rencana: '',
  //   tanggal_rencana_minggu_depan: '',
  //   rencana_minggu_depan: '',
  //   target_minggu_depan: '',
  // });
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const lunas = triggeredData.filter((item) => item.type === 'pelunasan')[0];
  //   const rencana = triggeredData.filter((item) => item.type === 'rencana')[0];
  //   setPelunasan(lunas);
  //   setRencana(rencana);

  //   setData({
  //     id: lunas.grouping_id ?? null,
  //     date: lunas.tanggal,
  //     kasbon: lunas.kasbon,
  //     transport: lunas.transport,
  //     target: lunas.target,
  //     masuk: lunas.masuk ?? lunas.drop * 0.13,
  //     keluar: lunas.keluar ?? lunas.rencana * 0.13,
  //     baru: lunas.baru,
  //     lama: lunas.lama,
  //     storting: lunas.storting,
  //     drop: lunas.drop,
  //     rencana: lunas.rencana,
  //     tanggal_rencana_minggu_depan: rencana?.tanggal ?? '',
  //     rencana_minggu_depan: rencana?.rencana ?? 0,
  //     target_minggu_depan: lunas.target + lunas.masuk - lunas.keluar ?? 0,
  //   });
  // }, [triggeredData, show]);

  // const onInputChange = (e) => {
  //   setData(
  //     e.target.name,
  //     e.target.type === 'checkbox' ? e.target.checked : e.target.value
  //   );
  // };

  // const onHandleCurencyChange = (value, name) => {
  //   setData(name, value);
  // };

  const closedModal = () => {
    onClosed();
    reset();
  };

  // const onSubmitForm = (e) => {
  //   e.preventDefault();
  //   post(route('kasir.rekap.ceklist_kepala'), {
  //     onSuccess: () => {
  //       reset();
  //       onClosed();
  //     },
  //   });
  // };
  // console.log(data);

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : closedModal())}>
      {/* <Loading show={loading || processing} /> */}
      <DialogContent className="w-[90vw] h-[90vh] lg:h-auto lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin">
        {/* {erorAxios && <div>terjadi kesalahan saat memuat data</div>} */}
        {loading ? (
          <div>Data Sedang Dimuat</div>
        ) : (
          <div>das</div>
          // <DialogHeader>
          //   <DialogTitle>Cek Transaksi</DialogTitle>
          //   <DialogDescription>
          //     <form onSubmit={onSubmitForm}>
          //       <p className="mb-3 font-semibold underline">
          //         Transaksi Hari Ini
          //       </p>
          //       <div className="mb-3">
          //         <Label htmlFor="kasbon">Kasbon</Label>

          //         <CurrencyInput
          //           className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          //           name="kasbon"
          //           readOnly={data.status_dayly_approval}
          //           allowDecimals={false}
          //           prefix="Rp. "
          //           min={1}
          //           required
          //           onValueChange={onHandleCurencyChange}
          //           value={data.kasbon}
          //           placeholder={'Inputkan angka tanpa sparator'}
          //         />
          //       </div>
          //       <div className="mb-3">
          //         <Label htmlFor="transport">Transport</Label>
          //         <CurrencyInput
          //           className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          //           name="transport"
          //           allowDecimals={false}
          //           readOnly={data.status_dayly_approval}
          //           prefix="Rp. "
          //           min={1}
          //           required
          //           onValueChange={onHandleCurencyChange}
          //           value={data.transport}
          //           placeholder={'Inputkan angka tanpa sparator'}
          //         />
          //       </div>
          //       <Table>
          //         <TableHeader>
          //           <TableRow>
          //             <TableHead className="text-center">Target</TableHead>
          //             <TableHead className="text-center">Drop</TableHead>
          //             <TableHead className="text-center">Storting</TableHead>
          //             <TableHead className="text-center">Baru</TableHead>
          //             <TableHead className="text-center">Lama</TableHead>
          //             <TableHead className="text-center">Rencana</TableHead>
          //           </TableRow>
          //         </TableHeader>
          //         <TableBody>
          //           <TableRow>
          //             <TableCell>
          //               <FormatNumbering
          //                 className="text-center"
          //                 value={pelunasan.target}
          //               />
          //             </TableCell>
          //             <TableCell>
          //               <FormatNumbering
          //                 className="text-center"
          //                 value={pelunasan.drop}
          //               />
          //             </TableCell>
          //             <TableCell>
          //               <FormatNumbering
          //                 className="text-center"
          //                 value={pelunasan.storting}
          //               />
          //             </TableCell>
          //             <TableCell>
          //               <FormatNumbering
          //                 className="text-center"
          //                 value={pelunasan.baru}
          //               />
          //             </TableCell>
          //             <TableCell>
          //               <FormatNumbering
          //                 className="text-center"
          //                 value={pelunasan.lama}
          //               />
          //             </TableCell>
          //             <TableCell>
          //               <FormatNumbering
          //                 className="text-center"
          //                 value={pelunasan.rencana}
          //               />
          //             </TableCell>
          //           </TableRow>
          //         </TableBody>
          //       </Table>
          //       <div className="mb-3">
          //         <Label htmlFor="masuk">Masuk</Label>
          //         <CurrencyInput
          //           className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          //           name="masuk"
          //           allowDecimals={false}
          //           readOnly={data.status_dayly_approval}
          //           prefix="Rp. "
          //           min={1}
          //           required
          //           onValueChange={onHandleCurencyChange}
          //           value={data.masuk}
          //           placeholder={'Inputkan angka tanpa sparator'}
          //         />
          //       </div>
          //       <div className="mb-3">
          //         <Label htmlFor="keluar">Keluar</Label>
          //         <CurrencyInput
          //           className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          //           name="keluar"
          //           allowDecimals={false}
          //           readOnly={data.status_dayly_approval}
          //           prefix="Rp. "
          //           min={1}
          //           required
          //           onValueChange={onHandleCurencyChange}
          //           value={data.keluar}
          //           placeholder={'Inputkan angka tanpa sparator'}
          //         />
          //       </div>
          //       <p className="mb-3 font-semibold underline">
          //         Transaksi Minggu Depan
          //       </p>
          //       <div className="mb-3">
          //         <Label htmlFor="tanggal_minggu_depan">
          //           Tanggal Rencana Drop Minggu Depan
          //         </Label>
          //         <Input
          //           name="tanggal_rencana_minggu_depan"
          //           readOnly={data.tanggal_rencana_minggu_depan}
          //           min={dayjs(pelunasan.tanggal)
          //             .add('1', 'week')
          //             .format('YYYY-MM-DD')}
          //           required
          //           onChange={onInputChange}
          //           type="date"
          //           value={data.tanggal_rencana_minggu_depan}
          //           placeholder={'Inputkan angka tanpa sparator'}
          //         />
          //       </div>
          //       <div className="mb-3">
          //         <Label htmlFor="rencana_minggu_depan">
          //           Rencana Drop Minggu Depan
          //         </Label>
          //         <CurrencyInput
          //           className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          //           name="rencana_minggu_depan"
          //           allowDecimals={false}
          //           readOnly={data.status_dayly_approval}
          //           prefix="Rp. "
          //           min={1}
          //           required
          //           onValueChange={onHandleCurencyChange}
          //           value={data.rencana_minggu_depan}
          //           placeholder={'Inputkan angka tanpa sparator'}
          //         />
          //       </div>
          //       <div className="mb-3">
          //         <Label htmlFor="target_minggu_depan">
          //           Target Minggu Depan
          //         </Label>
          //         <CurrencyInput
          //           className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          //           name="target_minggu_depan"
          //           allowDecimals={false}
          //           readOnly={data.status_dayly_approval}
          //           prefix="Rp. "
          //           min={1}
          //           required
          //           onValueChange={onHandleCurencyChange}
          //           value={data.target + (data.masuk - data.keluar)}
          //           placeholder={'Inputkan angka tanpa sparator'}
          //         />
          //       </div>
          //       {/* <div className="mb-3">
          //         <div className="flex items-center flex-1 gap-3 mb-1 whitespace-nowrap">
          //           <Checkbox
          //             readOnly={data.status_dayly_approval}
          //             name="daily_kasir_approval"
          //             placeholder="Select Permission"
          //             id="daily_kasir_approval"
          //             onChange={onInputChange}
          //           />
          //           <InputLabel htmlFor="daily_kasir_approval">
          //             Ceklist Kasir
          //           </InputLabel>
          //         </div>
          //         <div className="italic font-light">
          //           Dicentang oleh kasir jika Nilai Kasbon - Transport dan Tunai
          //           Sudah Sesuai
          //         </div>
          //       </div>
          //       <div className="mb-3">
          //         <div className="flex items-center flex-1 gap-3 mb-1 whitespace-nowrap">
          //           <Checkbox
          //             readOnly={data.status_dayly_approval}
          //             name="daily_kepala_approval"
          //             placeholder="Select Permission"
          //             id="daily_kepala_approval"
          //             onChange={onInputChange}
          //           />
          //           <InputLabel htmlFor="daily_kepala_approval">
          //             Ceklist Pimpinan
          //           </InputLabel>
          //         </div>
          //         <div className="italic font-light">
          //           Dicentang oleh Pimpinan jika Nilai Nilai Rekap Telah Sesuai
          //           ( Drop, Storting, Target, Rencana dll)
          //         </div>
          //       </div> */}
          //       <div className="mb-3 text-right">
          //         <Button type="submit">Submit</Button>
          //       </div>
          //     </form>
          //   </DialogDescription>
          // </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Approval;
