import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { dengar, pasang, sudahTerpasang } from '@/lib/pasangAplikasi';

const iOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);
// Safari Mac: tanpa dialog pasang; lewat menu File (Safari 17+).
const safariMac = () => /macintosh/i.test(navigator.userAgent) && /safari/i.test(navigator.userAgent) && !/chrome|crios|edg|firefox/i.test(navigator.userAgent);
// Browser di dalam aplikasi (WhatsApp, IG, FB, Line, TikTok): tidak bisa pasang sama sekali.
const dalamAplikasi = () => /FBAN|FBAV|Instagram|WhatsApp|Line\/|musical_ly|; wv\)/i.test(navigator.userAgent);

/**
 * Tombol "Install" di sidebar (atas nama user) dan halaman login: pasang UBMI DIGITAL sebagai ikon di layar HP.
 * Chrome/Edge Android & desktop: dialog pasang bawaan. Browser tanpa dialog
 * itu (iPhone Safari, dll.): petunjuk manual. Hilang kalau sudah dibuka
 * sebagai aplikasi terpasang.
 */
// className: gaya tambahan dari pemanggil (mis. kartu kaca login di HP).
export default function TombolPasangAplikasi({ className = '' }) {
  const [, segarkan] = useState(0);
  const [petunjuk, setPetunjuk] = useState(false);
  useEffect(() => dengar(() => segarkan((n) => n + 1)), []);

  if (sudahTerpasang()) return null;

  const klik = async () => {
    if (!(await pasang())) setPetunjuk(true);
  };

  return (
    <>
      <Button size="sm" variant="outline" className={`h-8 gap-1 px-2 ${className}`} onClick={klik}>
        <Download className="w-4 h-4" aria-hidden="true" />
        <span className="text-xs">Install</span>
      </Button>

      <Dialog open={petunjuk} onOpenChange={setPetunjuk}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Install UBMI DIGITAL</DialogTitle>
            <DialogDescription asChild>
              {dalamAplikasi() ? (
                <ol className="pl-4 space-y-1 text-sm list-decimal">
                  <li>Halaman ini dibuka di dalam aplikasi (WhatsApp / Instagram / Facebook), yang tidak bisa memasang aplikasi.</li>
                  <li>Ketuk menu <b>⋮</b> atau <b>…</b>, pilih <b>Buka di browser</b> / <b>Buka di Chrome</b> / <b>Buka di Safari</b>.</li>
                  <li>Di browser, ketuk tombol <b>Install</b> lagi.</li>
                </ol>
              ) : safariMac() ? (
                <ol className="pl-4 space-y-1 text-sm list-decimal">
                  <li>Di Safari, klik menu <b>File</b> di bar atas.</li>
                  <li>Pilih <b>Tambahkan ke Dock</b>, lalu <b>Tambah</b>.</li>
                </ol>
              ) : iOS() ? (
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
