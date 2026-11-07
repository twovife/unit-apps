import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

/** Kalimat pratinjau dari rencana GantiNasabah::rencana. */
const KalimatRencana = ({ r }) => {
  const asal = `${r.asal.nama} (${r.asal.nik})`;
  return (
    <ul className="pl-5 space-y-1 text-sm list-disc">
      {r.aksi === 'ganti_nik' && <li>NIK {asal} diganti menjadi <b>{r.nik}</b>. Pinjaman ini satu-satunya pinjaman nasabah itu.</li>}
      {r.aksi === 'pindah' && (
        <li>
          Pinjaman ini pindah ke <b>{r.tujuan.nama} ({r.tujuan.nik})</b>,{' '}
          {r.buat_rekening ? 'dibuatkan rekening baru di kelompok & hari ini.' : `masuk ke rekeningnya di kelompok & hari ini${r.tujuan.nomor_anggota ? ` (no anggota ${r.tujuan.nomor_anggota})` : ''}.`}
        </li>
      )}
      {r.aksi === 'baru' && <li>NIK {r.nik} belum terdaftar dan {asal} masih punya pinjaman lain: dibuat <b>nasabah baru</b>, hanya pinjaman ini yang pindah.</li>}
      {r.hapus_rekening_asal && <li>Rekening lama jadi kosong, dihapus.</li>}
      {r.hapus_nasabah_asal && <li>Nasabah {asal} tidak punya rekening lagi, dihapus.</li>}
      {r.aksi !== 'ganti_nik' && !r.hapus_rekening_asal && <li>{asal} tetap ada (masih punya pinjaman lain).</li>}
    </ul>
  );
};

/** Ganti nasabah satu pinjaman lewat NIK: Periksa (pratinjau) -> Simpan. Superuser. */
export default function DialogGantiNik({ n, onClosed }) {
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [rencana, setRencana] = useState(null);
  const [galat, setGalat] = useState(null);
  const [proses, setProses] = useState(false);
  const periksa = () => {
    setProses(true);
    setGalat(null);
    axios
      .post(route('ganti_nasabah.pratinjau', n.id), { nik, nama })
      .then(({ data }) => {
        setRencana(data);
        if (data.aksi === 'baru' && !nama) setNama(data.tujuan.nama);
      })
      .catch((e) => setGalat(e.response?.data?.message ?? 'Gagal memeriksa NIK.'))
      .finally(() => setProses(false));
  };
  const simpan = () =>
    router.post(route('ganti_nasabah.simpan', n.id), { nik, nama }, {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => setProses(false),
      onError: (e) => setGalat(e.nik ?? Object.values(e)[0]),
      onSuccess: (p) => !Object.keys(p.props.errors ?? {}).length && onClosed(),
    });

  return (
    <Dialog open onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ganti nasabah</DialogTitle>
          <DialogDescription>
            {n.nama} · NIK {n.nik} · drop {dayjs(n.tanggal).format('DD MMM YYYY')}. Yang berpindah hanya pinjaman ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>NIK yang benar (16 digit)</Label>
            <Input
              value={nik}
              inputMode="numeric"
              autoFocus
              onChange={(e) => {
                setNik(e.target.value.replace(/\D/g, '').slice(0, 16));
                setRencana(null);
              }}
            />
          </div>
          {rencana?.aksi === 'baru' && (
            <div className="grid gap-1">
              <Label>Nama nasabah baru</Label>
              <Input value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>
          )}
          {rencana && <KalimatRencana r={rencana} />}
          {galat && <div className="p-2 text-sm rounded-md text-rose-700 bg-rose-50">{galat}</div>}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" disabled={proses || nik.length !== 16} onClick={periksa}>
            Periksa
          </Button>
          <Button disabled={proses || !rencana} onClick={simpan} className="bg-rose-600 hover:bg-rose-700">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
