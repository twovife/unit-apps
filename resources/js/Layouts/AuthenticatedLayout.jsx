import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/shadcn/ui/dialog';
import { unduhPemindaiNanti } from '@/lib/pindai';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import Loading from '@/Components/Loading';
import { Toaster } from '@/shadcn/ui/sonner';
import { KonfirmasiHost } from '@/lib/konfirmasi';
import { SidebarProvider, SidebarInset } from '@/shadcn/ui/sidebar';

// Tiap halaman Inertia memasang layout ini ulang, jadi SidebarProvider mulai
// dari awal. Posisi terakhir (dicatat shadcn di cookie sidebar:state) dibaca
// lagi supaya sidebar yang dilipat tetap terlipat sesudah pindah halaman.
const sidebarTerbuka = () => !/(?:^|;\s*)sidebar:state=false/.test(document.cookie);

export default function Authenticated({ header, children, loading = false }) {
  const { errors, flash, auth } = usePage().props;
  // Pemindai dokumen/bukti (OpenCV ±4 MB) diunduh ke cache di belakang layar, hanya untuk
  // user yang mengunggah (Lamaran / adm kantor). Layout persisten -> sekali per buka aplikasi.
  const bolehLamaran = !!(auth?.menu?.lamaran || auth?.menu?.admKantor);
  useEffect(() => {
    if (bolehLamaran) unduhPemindaiNanti();
  }, [bolehLamaran]);

  // Pesan server -> toast (berhasil hilang sendiri, gagal menunggu ditutup);
  // peringatan -> dialog yang harus diklik. flash berganti objek tiap respons
  // penuh, jadi efek ini jalan sekali per respons. id: render ganda tidak
  // memunculkan toast dobel.
  const [peringatan, setPeringatan] = useState(null);
  useEffect(() => {
    if (Object.keys(errors).length) {
      // Pesan bernama (withErrors(['items' => ...]), validasi) ikut ditampilkan, bukan hanya errors[0].
      const pesan = errors[0] ?? [...new Set(Object.values(errors).flat())].join(' ');
      toast.error(pesan || 'Terjadi kesalahan, hubungi IT.', { id: `e${flash.timestamp}${pesan}`, duration: Infinity });
    }
    if (flash.peringatan) setPeringatan(flash.peringatan);
    else if (flash.message) toast.success(flash.message, { id: `m${flash.timestamp}${flash.message}` });
  }, [flash]);

  return (
    <SidebarProvider defaultOpen={sidebarTerbuka()}>
      <Dialog open={!!peringatan} onOpenChange={(o) => !o && setPeringatan(null)}>
        <DialogContent className="max-w-md border-[1.5px] border-amber-500">
          <DialogTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="size-5" /> Perhatian
          </DialogTitle>
          <DialogDescription className="text-slate-700 text-[15px]">{peringatan}</DialogDescription>
          <DialogFooter>
            <button
              onClick={() => setPeringatan(null)}
              className="rounded-md border border-amber-500 px-4 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-50"
            >
              Mengerti
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Loading show={loading} />
      <Toaster />
      <KonfirmasiHost />

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
