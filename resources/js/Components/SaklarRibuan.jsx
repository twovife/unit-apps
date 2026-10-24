import { Button } from '@/shadcn/ui/button';
import { setModeRibuan, useModeRibuan } from '@/lib/modeAngka';

/**
 * Saklar header: angka tabel dalam ribuan atau rupiah penuh (lib/modeAngka).
 * "000" dicoret, merah penuh = ribuan (000 disembunyikan);
 * "000" utuh, garis merah = rupiah penuh.
 */
export default function SaklarRibuan() {
  const ribuan = useModeRibuan();

  return (
    <Button
      size="sm"
      variant="outline"
      aria-pressed={ribuan}
      className={`h-8 px-2 text-xs font-bold tabular-nums ${
        ribuan
          ? 'line-through decoration-2 border-red-600 bg-red-600 text-white hover:bg-red-700 hover:text-white'
          : 'border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700'
      }`}
      title={ribuan ? '000 disembunyikan (angka dalam ribuan). Klik untuk menampilkan.' : '000 ditampilkan (rupiah penuh). Klik untuk menyembunyikan.'}
      onClick={() => setModeRibuan(!ribuan)}
    >
      000
    </Button>
  );
}
