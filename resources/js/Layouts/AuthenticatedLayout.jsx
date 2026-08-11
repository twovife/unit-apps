import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import SweetAlert from '@/Components/SweetAlert';
import Loading from '@/Components/Loading';
import { SidebarProvider, SidebarInset } from '@/shadcn/ui/sidebar';

export default function Authenticated({ header, children, loading = false }) {
  const { errors, flash, auth } = usePage().props;

  return (
    <SidebarProvider>
      {Object.keys(errors).length > 0 && (
        <SweetAlert type="error" message={errors[0]} keys={flash} />
      )}
      {flash.message && (
        <SweetAlert type="success" message={flash.message} keys={flash} />
      )}
      <Loading show={loading} />

      <Sidebar />
      <SidebarInset>
        <Navbar auth={auth} header={header} />
        <main className="flex-1 px-4 py-6 md:px-6 bg-white min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
