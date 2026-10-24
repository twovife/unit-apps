import { Head } from '@inertiajs/react';
import PembayaranKantor from '@/Components/PembayaranKantor';

/** Dashboard Kasir: kartu pembayaran kantor aktif per bulan (PembayaranKantorController). */
export default function DashboardKasir({ videos }) {
  return (
    <>
      <Head title="Dashboard Kasir" />
      <PembayaranKantor videos={videos} />
    </>
  );
}
