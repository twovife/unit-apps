import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { dengar, pasang, sudahTerpasang } from '@/lib/pasangAplikasi';

const iOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

/**
 * Tombol "Pasang" di header: pasang UBMI Apps sebagai ikon di layar HP.
 * Chrome/Edge Android & desktop: dialog pasang bawaan. Browser tanpa dialog
 * itu (iPhone Safari, dll.): petunjuk manual. Hilang kalau sudah dibuka
 * sebagai aplikasi terpasang.
 */
export default function TombolPasangAplikasi() {
  const [, segarkan] = useState(0);
  const [petunjuk, setPetunjuk] = useState(false);
  useEffect(() => dengar(() => segarkan((n) => n + 1)), []);

  if (sudahTerpasang()) return null;

  const klik = async () => {
    if (!(await pasang())) setPetunjuk(true);
  };

  return (
    <>
      <Button size="sm" variant="outline" className="h-8 gap-1 px-2" onClick={klik}>
        <Download className="w-4 h-4" aria-hidden="true" />
        <span className="text-xs">Pasang</span>
      </Button>

      <Dialog open={petunjuk} onOpenChange={setPetunjuk}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Pasang UBMI Apps</DialogTitle>
            <DialogDescription asChild>
              {iOS() ? (
                <ol className="pl-4 space-y-1 text-sm list-decimal">
                  <li>Buka halaman ini di <b>Safari</b>.</li>
                  <li>Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas).</li>
                  <li>Pilih <b>Tambah ke Layar Utama</b>, lalu <b>Tambah</b>.</li>
                </ol>
              ) : (
                <ol className="pl-4 space-y-1 text-sm list-decimal">
                  <li>Buka halaman ini di <b>Chrome</b>.</li>
                  <li>Ketuk menu <b>⋮</b> di kanan atas.</li>
                  <li>Pilih <b>Instal aplikasi</b> / <b>Tambahkan ke layar utama</b>.</li>
                </ol>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
