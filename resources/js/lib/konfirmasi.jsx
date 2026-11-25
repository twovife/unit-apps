import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/shadcn/ui/dialog';

// Pengganti window.confirm: `if (!(await konfirmasi('Hapus X?'))) return;`
// Kalimat sampai tanda tanya pertama jadi judul, sisanya isi. Tombol = kata
// kerja pertama bila dikenal ("Hapus", "Simpan", ...), selain itu "Lanjut".
// Kata kerja yang merusak/membatalkan -> tombol merah.
// { ketik: 'X' }: tombol baru aktif sesudah user mengetik X (abaikan besar/kecil huruf).
const KERJA = ['Hapus', 'Batalkan', 'Kosongkan', 'Nonaktifkan', 'Aktifkan', 'Simpan', 'Migrasikan', 'Terapkan', 'Buat'];
const BAHAYA = ['Hapus', 'Batalkan', 'Kosongkan', 'Nonaktifkan'];

let tampilkan = null; // diisi <KonfirmasiHost /> di layout

export const konfirmasi = (pesan, { ketik } = {}) =>
  new Promise((jawab) =>
    tampilkan
      ? tampilkan({ pesan, ketik, jawab })
      : jawab(ketik ? window.prompt(pesan)?.trim().toLowerCase() === ketik.trim().toLowerCase() : window.confirm(pesan)),
  );

export function KonfirmasiHost() {
  const [aktif, setAktif] = useState(null);
  const [teks, setTeks] = useState('');
  useEffect(() => {
    tampilkan = setAktif;
    return () => {
      if (tampilkan === setAktif) tampilkan = null;
    };
  }, []);

  const tutup = (hasil) => {
    aktif?.jawab(hasil);
    setAktif(null);
    setTeks('');
  };

  const pesan = aktif?.pesan ?? '';
  const q = pesan.indexOf('?');
  const judul = q >= 0 ? pesan.slice(0, q + 1) : pesan;
  const isi = q >= 0 ? pesan.slice(q + 1).trim() : '';
  const kata = pesan.split(/\s/)[0];
  const tombol = KERJA.includes(kata) ? kata : 'Lanjut';
  const bahaya = BAHAYA.includes(kata);
  const cocok = !aktif?.ketik || teks.trim().toLowerCase() === aktif.ketik.trim().toLowerCase();
  const Ikon = bahaya ? Trash2 : AlertTriangle;
  const warna = bahaya
    ? { garis: 'border-red-500', teks: 'text-red-800', tombol: 'border-red-500 text-red-700 hover:bg-red-50' }
    : { garis: 'border-amber-500', teks: 'text-amber-800', tombol: 'border-amber-500 text-amber-800 hover:bg-amber-50' };

  return (
    <Dialog open={!!aktif} onOpenChange={(o) => !o && tutup(false)}>
      <DialogContent className={`max-w-md border-[1.5px] ${warna.garis}`}>
        <DialogTitle className={`flex items-start gap-2 leading-snug ${warna.teks}`}>
          <Ikon className="size-5 shrink-0 mt-0.5" /> {judul}
        </DialogTitle>
        <DialogDescription className={`text-slate-700 text-[15px] whitespace-pre-line ${isi ? '' : 'sr-only'}`}>
          {isi || judul}
        </DialogDescription>
        {aktif?.ketik && (
          <input
            autoFocus
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && cocok && tutup(true)}
            placeholder={aktif.ketik}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        )}
        <DialogFooter className="gap-2">
          <button onClick={() => tutup(false)} className="rounded-md border border-slate-300 px-4 py-1.5 text-sm hover:bg-slate-50">
            Batal
          </button>
          <button
            autoFocus={!aktif?.ketik}
            disabled={!cocok}
            onClick={() => tutup(true)}
            className={`rounded-md border px-4 py-1.5 text-sm font-medium disabled:opacity-40 ${warna.tombol}`}
          >
            {tombol}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
