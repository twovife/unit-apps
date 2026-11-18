import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bike } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { InputAwal } from './AngsuranMotor';

/**
 * Tombol merah di navbar (mas 2026-11-19): jumlah motor AKTIF kantor aktif yang belum diinput
 * angsurannya. Klik = dialog Input Awal. Kasir / stafkontrol: terbuka sendiri sekali per sesi
 * per kantor selama masih ada yang belum. Hilang kalau semua sudah diinput.
 */
export default function AlertAngsuranMotor() {
  const { auth } = usePage().props;
  const boleh = !!auth?.menu?.admKantor;
  const otomatis = ['kasir', 'stafkontrol'].some((r) => auth?.roles?.includes(r));
  const [belum, setBelum] = useState(0);
  const [kandidat, setKandidat] = useState(null);
  const [buka, setBuka] = useState(false);

  const hitung = () => axios.get(route('assets.angsuran.belum')).then(({ data }) => setBelum(data.belum)).catch(() => {});
  const muatKandidat = () => axios.get(route('assets.angsuran.data')).then(({ data }) => setKandidat(data.kandidat));

  useEffect(() => {
    if (!boleh) return;
    axios.get(route('assets.angsuran.belum')).then(({ data }) => {
      setBelum(data.belum);
      // Sekali per sesi browser per user (ganti kantor di pemilih atas = hitung ulang, tidak buka lagi).
      const kunci = `alert-angsuran-${auth?.user?.id}`;
      let sudah = false;
      try { sudah = !!sessionStorage.getItem(kunci); sessionStorage.setItem(kunci, '1'); } catch { /* storage diblok */ }
      if (otomatis && data.belum > 0 && !sudah) setBuka(true);
    }).catch(() => {});
  }, [boleh]);

  useEffect(() => { if (buka) muatKandidat(); }, [buka]);
  // Layout persisten: hitung ulang tiap pindah halaman, dan begitu kantor aktif berganti
  // (pemilih kantor di navbar). Lazy: hanya angka; daftar dialog dimuat saat dibuka.
  const kantor = auth?.global_filter?.active_branch_id;
  useEffect(() => (boleh ? router.on('navigate', hitung) : undefined), [boleh]);
  useEffect(() => { if (boleh && kantor) hitung(); }, [kantor]);

  // Hanya masa pendataan: hilang begitu semua motor aktif sudah diinput. Bayar rutin lewat
  // Tugas Harian Dashboard Kasir / menu Angsuran Motor.
  if (!boleh || belum <= 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setBuka(true)}
        className="relative inline-flex h-9 items-center gap-1.5 rounded-md bg-rose-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
      >
        <Bike className="size-4" />
        <span className="hidden sm:inline">Input Angsuran Motor</span>
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-rose-600 ring-2 ring-rose-600">{belum}</span>
      </button>
      <Dialog open={buka} onOpenChange={setBuka}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
          <DialogHeader className="border-b px-5 py-4 pr-12 text-left">
            <DialogTitle>Input Angsuran Motor</DialogTitle>
            <DialogDescription>{belum} motor aktif di kantor ini belum diinput. Isi yang angsurannya masih berjalan, centang &ldquo;Tidak ada angsuran&rdquo; untuk yang lain.</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {kandidat ? (
              <InputAwal kandidat={kandidat} onSelesai={() => { hitung(); muatKandidat(); }} />
            ) : (
              <div className="text-sm text-muted-foreground">Memuat…</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
