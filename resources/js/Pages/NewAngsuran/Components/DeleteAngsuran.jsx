import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { rp as rupiah } from '@/lib/rupiah';


/**
 * Hapus satu angsuran: tombol "Hapus" (ikon sampah di HP) -> dialog
 * konfirmasi yang menyebut tanggal & nominalnya -> hapus.
 */
export default function DeleteAngsuran({ id, tanggal, nominal }) {
  const { auth } = usePage().props;
  // can-edit (koreksi) boleh menghapus walau tanpa can-create.
  const boleh = auth.permissions.includes('can-create') || auth.permissions.includes('can-edit');
  const [buka, setBuka] = useState(false);
  const [proses, setProses] = useState(false);

  const hapus = () =>
    router.delete(route('pinjaman.destroy_angsuran', id), {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => {
        setProses(false);
        setBuka(false);
      },
    });

  return (
    <>
      <button
        type="button"
        disabled={!boleh || proses}
        onClick={() => setBuka(true)}
        title="Hapus angsuran"
        aria-label="Hapus angsuran"
        className="inline-flex items-center justify-center h-6 px-1.5 sm:px-2 text-[11px] font-semibold text-red-600 bg-white border border-red-200 rounded-md transition-colors hover:border-red-400 hover:bg-red-50 disabled:opacity-40"
      >
        <Trash2 className="w-3.5 h-3.5 sm:hidden" aria-hidden="true" />
        <span className="hidden sm:inline">Hapus</span>
      </button>

      <Dialog open={buka} onOpenChange={(o) => !proses && setBuka(o)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus angsuran?</DialogTitle>
            <DialogDescription>
              Angsuran{tanggal ? ` ${dayjs(tanggal).format('DD MMM YYYY')}` : ''}
              {nominal !== undefined ? ` sebesar Rp ${rupiah(nominal)}` : ''} akan dihapus. Tindakan ini tidak bisa
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
            <Button variant="outline" disabled={proses} onClick={() => setBuka(false)}>
              Batal
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" disabled={proses} onClick={hapus}>
              {proses ? 'Menghapus…' : 'Ya, hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
