import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PembayaranKantor from '@/Components/PembayaranKantor';

/** Dashboard Kasir: kartu pembayaran kantor aktif per bulan (PembayaranKantorController). */
export default function DashboardKasir() {
  return (
    <AuthenticatedLayout header="Dashboard Kasir">
      <Head title="Dashboard Kasir" />
      <PembayaranKantor />
    </AuthenticatedLayout>
  );
}
