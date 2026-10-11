import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { FilePenLine } from 'lucide-react';

/**
 * Penanda "Dikoreksi N× sesudah migrasi" (Koreksi Data Beku) untuk kantor
 * aktif. Superuser: klik -> Log Koreksi. Tidak tampil kalau belum ada koreksi.
 */
export default function BadgeKoreksiBeku({ jumlah }) {
  const { auth } = usePage().props;
  if (!jumlah) return null;
  const superuser = auth?.roles?.includes('superuser');

  return (
    <span
      role={superuser ? 'link' : undefined}
      title={superuser ? 'Lihat log koreksi' : 'Saldo pernah dikoreksi superuser sesudah migrasi'}
      onClick={(e) => {
        if (!superuser) return;
        e.stopPropagation();
        router.visit(route('migrasi.koreksi_beku_log'));
      }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ring-1 ring-amber-400 bg-amber-50 text-amber-800 ${
        superuser ? 'cursor-pointer hover:bg-amber-100' : ''
      }`}
    >
      <FilePenLine className="w-3 h-3" aria-hidden="true" />
      Dikoreksi {jumlah}× sesudah migrasi
    </span>
  );
}
