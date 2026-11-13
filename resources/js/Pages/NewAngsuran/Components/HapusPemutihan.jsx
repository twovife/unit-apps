import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';

/**
 * Hapus pemutihan (belum terkunci): dua langkah - Hapus -> "Yakin? target
 * keluar dibatalkan". Server menghitung ulang lunas & keluar target.
 */
export default function HapusPemutihan({ p }) {
  const [yakin, setYakin] = useState(false);
  const [proses, setProses] = useState(false);

  const hapus = () =>
    router.delete(route('pinjaman.destroy_white_off', p.id), {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => {
        setProses(false);
        setYakin(false);
      },
    });

  return yakin ? (
    <span className="flex items-center gap-1">
      <span className="hidden sm:inline text-[11px]">Target keluar ikut batal.</span>
      <Button size="xs" variant="outline" disabled={proses} onClick={() => setYakin(false)}>
        Tidak
      </Button>
      <Button size="xs" variant="destructive" disabled={proses} onClick={hapus}>
        {proses ? '…' : 'Ya, hapus'}
      </Button>
    </span>
  ) : (
    <Button size="xs" variant="outline" className="text-red-600 bg-white border-red-200" onClick={() => setYakin(true)}>
      Hapus
    </Button>
  );
}
