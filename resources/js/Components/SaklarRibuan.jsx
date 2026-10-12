import { Button } from '@/shadcn/ui/button';
import { setModeRibuan, useModeRibuan } from '@/lib/modeAngka';

/** Saklar header: angka tabel dalam ribuan atau rupiah penuh (lib/modeAngka). */
export default function SaklarRibuan() {
  const ribuan = useModeRibuan();

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 px-2 text-xs tabular-nums"
      title={ribuan ? 'Angka dalam ribuan. Klik untuk rupiah penuh.' : 'Angka rupiah penuh. Klik untuk ribuan.'}
      onClick={() => setModeRibuan(!ribuan)}
    >
      {ribuan ? '000 disembunyikan' : '000 ditampilkan'}
    </Button>
  );
}
