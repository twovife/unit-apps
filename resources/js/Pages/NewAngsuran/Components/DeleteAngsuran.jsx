import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const BATAS_YAKIN_MS = 3000;

/**
 * Hapus angsuran dua ketukan: "Hapus" -> merah "Yakin?" -> hapus.
 * Konfirmasi kedaluwarsa sendiri setelah 3 detik (garis di bawah tombol
 * menyusut sebagai hitung mundur). Dulu pembatalnya cuma onMouseLeave, jadi
 * di HP (tanpa mouse) tombol "Yakin?" tertinggal aktif selamanya.
 */
export default function DeleteAngsuran({ id }) {
  const { auth } = usePage().props;
  const boleh = auth.permissions.includes('can-create');
  const [yakin, setYakin] = useState(false);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!yakin || proses) return;
    const t = setTimeout(() => setYakin(false), BATAS_YAKIN_MS);
    return () => clearTimeout(t);
  }, [yakin, proses]);

  const klik = () => {
    if (!yakin) {
      setYakin(true);
      return;
    }
    router.delete(route('pinjaman.destroy_angsuran', id), {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => {
        setProses(false);
        setYakin(false);
      },
    });
  };

  return (
    <button
      type="button"
      disabled={!boleh || proses}
      onClick={klik}
      className={`relative inline-flex items-center h-6 px-2 overflow-hidden text-[11px] font-semibold rounded-md border transition-colors duration-200 disabled:opacity-40 ${
        yakin ? 'bg-red-600 border-red-600 text-white' : 'bg-white text-red-600 border-red-200 hover:border-red-400'
      }`}
    >
      {proses ? 'Menghapus…' : yakin ? 'Yakin?' : 'Hapus'}
      {yakin && !proses && <span className="absolute bottom-0 left-0 h-0.5 bg-white/80 animate-susut" />}
    </button>
  );
}
