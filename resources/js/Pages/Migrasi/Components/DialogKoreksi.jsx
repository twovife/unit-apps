import React, { createContext, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import DampakKoreksi from './DampakKoreksi';
import { rp } from '@/lib/rupiah';

/**
 * Mode koreksi beku di buku angsuran (halaman superuser Migrasi/BukuBeku): diisi
 * { mulai, filter }; null di /pinjaman biasa -> modal Action tetap pakai gembok.
 */
export const KoreksiBekuContext = createContext(null);

const JUDUL = { ubah: 'Ubah nominal angsuran', hapus: 'Hapus angsuran', tambah: 'Tambah angsuran', hapus_pemutihan: 'Hapus pemutihan', tambah_pinjaman: 'Tambah nasabah (pinjaman sebelum migrasi)', hapus_pinjaman: 'Hapus pinjaman' };
const ALASAN_BAWAAN = 'selisih penyesuaian';
const semuaAngsuran = (n) => Object.values(n?.angsuran ?? {}).flat();
const jumlahAngsuran = (n) => semuaAngsuran(n).length;
const totalAngsuran = (n) => semuaAngsuran(n).reduce((a, i) => a + i.nominal, 0);

/**
 * Dialog satu koreksi: nominal (+ alasan opsional) -> Pratinjau dampak (dijalankan
 * lalu dibatalkan di server) -> Simpan. Simpan baru aktif sesudah pratinjau
 * dengan isian yang sama. Angsuran yang ada bisa diganti ke "hapus" dari sini.
 */
const DialogKoreksi = ({ buka, onClosed, pinjaman, filter, mulai, onSaved }) => {
  const { angsuran, tanggal, pemutihan } = buka ?? {};
  // tambah_pinjaman: isian nasabah + tanggal drop (kelompok & hari dari filter).
  const [baru, setBaru] = useState({});
  const isiBaru = (k) => (e) => setBaru((b) => ({ ...b, [k]: e.target.value }));
  const [aksi, setAksi] = useState(null);
  const [nominal, setNominal] = useState('');
  const [alasan, setAlasan] = useState('');
  const [ikutBucket, setIkutBucket] = useState(true);
  const [pratinjau, setPratinjau] = useState(null);
  // Nasabah yang benar-benar dipakai: NIK terdaftar -> nama lama, isian nama diabaikan.
  const [nasabahBaru, setNasabahBaru] = useState(null);
  const [galat, setGalat] = useState(null);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    setAksi(buka?.aksi ?? null);
    setNominal(angsuran ? String(angsuran.nominal) : '');
    setBaru({});
    setAlasan('');
    setIkutBucket(true);
    setPratinjau(null);
    setGalat(null);
  }, [buka]);

  // Isian berubah -> pratinjau lama tidak berlaku lagi.
  useEffect(() => setPratinjau(null), [aksi, nominal, alasan, ikutBucket, baru]);

  const isian = () => ({
    aksi,
    alasan: alasan.trim() || ALASAN_BAWAAN,
    angsuran_id: angsuran?.id,
    pemutihan_id: pemutihan?.id,
    loan_id: pinjaman?.id,
    nominal: ['hapus', 'hapus_pemutihan', 'hapus_pinjaman'].includes(aksi) ? undefined : Number(nominal),
    tanggal: aksi === 'tambah' ? tanggal : undefined,
    ikut_bucket: ikutBucket,
    ...(aksi === 'tambah_pinjaman' && { ...baru, tanggal: baru.tanggal, grouping_id: filter?.grouping_id, hari: filter?.hari }),
  });

  const lihat = () => {
    setProses(true);
    setGalat(null);
    axios
      .post(route('migrasi.koreksi_beku_pratinjau'), isian())
      .then((r) => {
        setPratinjau(r.data.dampak);
        setNasabahBaru(aksi === 'tambah_pinjaman' ? r.data.sesudah : null);
      })
      .catch((e) => setGalat(e.response?.data?.message ?? 'Pratinjau gagal.'))
      .finally(() => setProses(false));
  };

  const simpan = () =>
    router.post(route('migrasi.koreksi_beku_simpan'), isian(), {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => setProses(false),
      onSuccess: (p) => {
        if (Object.keys(p.props.errors ?? {}).length) return;
        onClosed();
        onSaved?.(aksi);
      },
    });

  return (
    <Dialog open={!!buka} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{JUDUL[aksi]}</DialogTitle>
          <DialogDescription>
            {aksi === 'tambah_pinjaman' && `Kelompok ${filter?.kelompok} · hari ${filter?.hari} · drop sebelum ${dayjs(mulai).format('DD-MM-YYYY')}`}
            {pinjaman?.nama} · drop {pinjaman && dayjs(pinjaman.drop_date).format('DD-MM-YYYY')}
            {angsuran
              ? ` · angsuran ${dayjs(angsuran.tanggal).format('DD-MM-YYYY')} Rp ${rp(angsuran.nominal)}`
              : pemutihan
              ? ` · pemutihan ${dayjs(pemutihan.tanggal).format('DD-MM-YYYY')} Rp ${rp(pemutihan.nominal)}`
              : tanggal && ` · tanggal ${dayjs(tanggal).format('DD-MM-YYYY')}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 text-sm">
          {aksi === 'tambah_pinjaman' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="font-medium">NIK</span>
                <Input inputMode="numeric" maxLength={16} autoFocus value={baru.nik ?? ''} onChange={isiBaru('nik')} />
              </label>
              <label className="grid gap-1">
                <span className="font-medium">Nomor anggota (boleh kosong)</span>
                <Input inputMode="numeric" value={baru.nomor_anggota ?? ''} onChange={isiBaru('nomor_anggota')} />
              </label>
              <label className="grid gap-1">
                <span className="font-medium">Nama</span>
                <Input value={baru.nama ?? ''} onChange={isiBaru('nama')} />
              </label>
              <label className="grid gap-1">
                <span className="font-medium">Alamat</span>
                <Input value={baru.alamat ?? ''} onChange={isiBaru('alamat')} />
              </label>
              <label className="grid gap-1">
                <span className="font-medium">Tanggal drop</span>
                <Input type="date" max={mulai && dayjs(mulai).subtract(1, 'day').format('YYYY-MM-DD')} value={baru.tanggal ?? ''} onChange={isiBaru('tanggal')} />
              </label>
              <span className="self-end text-xs text-slate-500">Nama & alamat hanya dipakai kalau NIK belum terdaftar.</span>
            </div>
          )}
          {aksi === 'hapus_pinjaman' ? (
            <div className="p-2 text-red-700 rounded-md bg-red-50">
              Pinjaman ini dihapus beserta {jumlahAngsuran(pinjaman)} angsurannya (Rp {rp(totalAngsuran(pinjaman))}). Nasabahnya tetap
              tercatat.
            </div>
          ) : aksi === 'hapus_pemutihan' ? (
            <div className="p-2 text-red-700 rounded-md bg-red-50">
              Pemutihan ini akan dihapus: saldonya kembali jadi tagihan nasabah dan status lunas karena pemutihan dicabut.
            </div>
          ) : aksi === 'hapus' ? (
            <div className="flex items-center justify-between gap-2 p-2 text-red-700 rounded-md bg-red-50">
              Angsuran ini akan dihapus.
              <Button size="xs" variant="outline" onClick={() => setAksi('ubah')}>
                Batal hapus
              </Button>
            </div>
          ) : (
            <label className="grid gap-1">
              <span className="font-medium">{aksi === 'tambah_pinjaman' ? 'Nominal drop' : 'Nominal'}</span>
              <Input type="number" min="0" step="1000" autoFocus={aksi !== 'tambah_pinjaman'} value={nominal} onChange={(e) => setNominal(e.target.value)} />
            </label>
          )}
          <label className="grid gap-1">
            <span className="font-medium">Alasan (boleh kosong)</span>
            <textarea
              rows={2}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md border-input bg-background"
              placeholder={ALASAN_BAWAAN}
            />
          </label>
          {/* Centang: koreksi membetulkan kenyataan -> bucket ikut, tidak jadi selisih di Cek
              Selisih Migrasi. Lepas kalau koreksinya justru untuk menyamakan dengan bucket. */}
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 mt-0.5" checked={ikutBucket} onChange={(e) => setIkutBucket(e.target.checked)} />
            <span>
              <span className="font-medium">Bucket serah terima ikut dikoreksi</span>
              <span className="block text-xs text-slate-500">Lepas centang kalau koreksi ini untuk menyamakan saldo dengan bucket.</span>
            </span>
          </label>

          {galat && <div className="p-2 text-sm text-red-700 rounded-md bg-red-50">{galat}</div>}
          {pratinjau && (
            <div className="grid gap-1">
              {nasabahBaru && (
                <div className="p-2 rounded-md bg-emerald-50 text-emerald-900">
                  Nasabah: <b>{nasabahBaru.nasabah}</b> (NIK {nasabahBaru.nik}) · drop {dayjs(nasabahBaru.drop_date).format('DD-MM-YYYY')} · Rp{' '}
                  {rp(nasabahBaru.nominal)}
                </div>
              )}
              <span className="font-medium">Dampak ke saldo bulanan</span>
              <DampakKoreksi dampak={pratinjau} />
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" disabled={proses} onClick={onClosed}>
              Batal
            </Button>
            {aksi === 'ubah' && (
              <Button variant="outline" disabled={proses} className="text-red-600 border-red-200" onClick={() => setAksi('hapus')}>
                Hapus
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={proses} onClick={lihat}>
              {proses && !pratinjau ? 'Menghitung…' : 'Pratinjau dampak'}
            </Button>
            <Button disabled={proses || !pratinjau} onClick={simpan} className="bg-rose-600 hover:bg-rose-700">
              Simpan koreksi
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogKoreksi;
