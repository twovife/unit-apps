import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';

const MAKS_MB = 50;

/**
 * Form superuser menambah video panduan. `menu` terisi = menu tetap (tombol di
 * halaman menu); kosong = pilih dari `menuOpsi` ({kode: nama}, dari panel).
 */
export default function TambahVideo({ open, onOpenChange, menu, menuOpsi = {}, onSelesai }) {
  const [menuPilih, setMenuPilih] = useState(menu ?? Object.keys(menuOpsi)[0] ?? '');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState(null);
  const [kirim, setKirim] = useState(false);

  const simpan = async () => {
    if (!judul.trim() || !file) {
      setGalat('Judul dan file MP4 wajib diisi.');
      return;
    }
    if (file.size > MAKS_MB * 1024 * 1024) {
      setGalat(`Maksimal ${MAKS_MB} MB.`);
      return;
    }
    setKirim(true);
    setGalat(null);
    const f = new FormData();
    f.append('menu', menu ?? menuPilih);
    f.append('judul', judul);
    f.append('deskripsi', deskripsi);
    f.append('file', file);
    try {
      await axios.post(route('video_tutorial.tambah'), f);
      setJudul('');
      setDeskripsi('');
      setFile(null);
      onOpenChange(false);
      onSelesai?.();
    } catch (e) {
      const err = e.response?.data?.errors;
      setGalat(err ? Object.values(err).flat()[0] : 'Gagal mengunggah.');
    } finally {
      setKirim(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Video Panduan</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {!menu && (
            <select
              value={menuPilih}
              onChange={(e) => setMenuPilih(e.target.value)}
              className="h-9 w-full rounded-md border px-2 text-sm"
            >
              {Object.entries(menuOpsi).map(([k, nama]) => (
                <option key={k} value={k}>{nama}</option>
              ))}
            </select>
          )}
          <Input placeholder="Judul" value={judul} onChange={(e) => setJudul(e.target.value)} maxLength={120} />
          <Input placeholder="Deskripsi (opsional)" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} maxLength={500} />
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setFile(e.target.files[0] ?? null)}
            className="block w-full text-sm"
          />
          <p className="text-xs text-muted-foreground">MP4, maksimal {MAKS_MB} MB.</p>
          {galat && <p className="text-sm text-red-600">{galat}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={kirim}>Batal</Button>
            <Button onClick={simpan} disabled={kirim}>{kirim ? 'Mengunggah…' : 'Simpan'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
