import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import SweetAlert from '@/Components/SweetAlert';
import Loading from '@/Components/Loading';
import { Toaster } from '@/shadcn/ui/sonner';
import { SidebarProvider, SidebarInset } from '@/shadcn/ui/sidebar';

// Tiap halaman Inertia memasang layout ini ulang, jadi SidebarProvider mulai
// dari awal. Posisi terakhir (dicatat shadcn di cookie sidebar:state) dibaca
// lagi supaya sidebar yang dilipat tetap terlipat sesudah pindah halaman.
const sidebarTerbuka = () => !/(?:^|;\s*)sidebar:state=false/.test(document.cookie);

export default function Authenticated({ header, children, loading = false }) {
  const { errors, flash, auth } = usePage().props;

  return (
    <SidebarProvider defaultOpen={sidebarTerbuka()}>
      {Object.keys(errors).length > 0 && (
        <SweetAlert type="error" message={errors[0]} keys={flash} />
      )}
      {flash.peringatan ? (
        <SweetAlert type="warning" message={flash.peringatan} keys={flash} />
      ) : (
        flash.message && <SweetAlert type="success" message={flash.message} keys={flash} />
      )}
      <Loading show={loading} />
      <Toaster richColors closeButton />

      <Sidebar />
      {/* min-w-0: tanpa ini isi yang lebar (tabel) melebarkan seluruh halaman,
          jadi gulir samping terjadi di halaman, bukan di dalam tabelnya. */}
      <SidebarInset className="min-w-0">
        <Navbar auth={auth} header={header} />
        <main className="flex-1 px-4 py-6 md:px-6 bg-white min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
