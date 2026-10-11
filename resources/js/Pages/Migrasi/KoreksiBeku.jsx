import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { History, Lock, Search } from 'lucide-react';
import DampakKoreksi from './Components/DampakKoreksi';

const rp = (n) => new Intl.NumberFormat('id-ID').format(n ?? 0);
const EMBER = { month1: 'M1', month2: 'M2', ccm: 'CCM', cm: 'CM', mb: 'MB', ml: 'ML' };
const JUDUL = { ubah: 'Ubah nominal angsuran', hapus: 'Hapus angsuran', tambah: 'Tambah angsuran', pindah: 'Pindah ke pinjaman lain' };

/** Baris pinjaman di hasil pencarian / pilihan tujuan. */
const BarisPinjaman = ({ l, onClick, aktif = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full px-3 py-2 text-left border-b last:border-b-0 hover:bg-sky-50 ${aktif ? 'bg-sky-50' : ''}`}
  >
    <div className="text-sm font-medium text-slate-900">
      {l.nama} <span className="text-xs font-normal text-slate-500">· {l.nomor_anggota || '–'} · NIK {l.nik}</span>
    </div>
    <div className="text-xs capitalize text-slate-500">
      Kel {l.kelompok} · {l.hari} · drop {dayjs(l.drop_date).format('DD-MM-YYYY')} · Rp {rp(l.pinjaman)}
      {l.ember && <span className="ml-1 font-semibold uppercase text-slate-700">({EMBER[l.ember] ?? l.ember})</span>}
    </div>
  </button>
);

/**
 * Dialog satu koreksi: isian per aksi + alasan -> Pratinjau dampak (dijalankan
 * lalu dibatalkan di server) -> Simpan. Simpan baru aktif sesudah pratinjau
 * dengan isian yang sama.
 */
const DialogKoreksi = ({ buka, onClosed, pinjaman, mulai }) => {
  const { aksi, angsuran } = buka ?? {};
  const [nominal, setNominal] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [alasan, setAlasan] = useState('');
  const [cariTujuan, setCariTujuan] = useState('');
  const [hasilTujuan, setHasilTujuan] = useState([]);
  const [tujuan, setTujuan] = useState(null);
  const [pratinjau, setPratinjau] = useState(null);
  const [galat, setGalat] = useState(null);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    setNominal(angsuran ? String(angsuran.nominal) : '');
    setTanggal('');
    setAlasan('');
    setCariTujuan('');
    setHasilTujuan([]);
    setTujuan(null);
    setPratinjau(null);
    setGalat(null);
  }, [buka]);

  // Isian berubah -> pratinjau lama tidak berlaku lagi.
  useEffect(() => setPratinjau(null), [nominal, tanggal, alasan, tujuan]);

  useEffect(() => {
    if (aksi !== 'pindah' || cariTujuan.trim().length < 3) return setHasilTujuan([]);
    const t = setTimeout(
      () =>
        axios
          .get(route('migrasi.koreksi_beku_tujuan'), { params: { q: cariTujuan } })
          .then((r) => setHasilTujuan(r.data.filter((l) => l.id !== pinjaman.id))),
      300,
    );
    return () => clearTimeout(t);
  }, [cariTujuan, aksi]);

  const isian = () => ({
    aksi,
    alasan,
    angsuran_id: angsuran?.id,
    loan_id: pinjaman?.id,
    nominal: aksi === 'ubah' || aksi === 'tambah' ? Number(nominal) : undefined,
    tanggal: aksi === 'tambah' ? tanggal : undefined,
    loan_tujuan_id: aksi === 'pindah' ? tujuan?.id : undefined,
  });

  const lihat = () => {
    setProses(true);
    setGalat(null);
    axios
      .post(route('migrasi.koreksi_beku_pratinjau'), isian())
      .then((r) => setPratinjau(r.data.dampak))
      .catch((e) => setGalat(e.response?.data?.message ?? 'Pratinjau gagal.'))
      .finally(() => setProses(false));
  };

  const simpan = () =>
    router.post(route('migrasi.koreksi_beku_simpan'), isian(), {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => setProses(false),
      onSuccess: (p) => !Object.keys(p.props.errors ?? {}).length && onClosed(),
    });

  return (
    <Dialog open={!!buka} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{JUDUL[aksi]}</DialogTitle>
          <DialogDescription>
            {pinjaman?.nama} · drop {pinjaman && dayjs(pinjaman.drop_date).format('DD-MM-YYYY')}
            {angsuran && ` · angsuran ${dayjs(angsuran.tanggal).format('DD-MM-YYYY')} Rp ${rp(angsuran.nominal)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 text-sm">
          {aksi === 'tambah' && (
            <label className="grid gap-1">
              <span className="font-medium">Tanggal angsuran</span>
              <Input
                type="date"
                value={tanggal}
                min={pinjaman?.drop_date}
                max={dayjs(mulai).subtract(1, 'day').format('YYYY-MM-DD')}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </label>
          )}
          {(aksi === 'ubah' || aksi === 'tambah') && (
            <label className="grid gap-1">
              <span className="font-medium">{aksi === 'ubah' ? 'Nominal baru' : 'Nominal'}</span>
              <Input type="number" min="0" step="1000" value={nominal} onChange={(e) => setNominal(e.target.value)} />
            </label>
          )}
          {aksi === 'pindah' && (
            <div className="grid gap-1">
              <span className="font-medium">Pinjaman tujuan (kantor yang sama)</span>
              {tujuan ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 border rounded-md">
                    <BarisPinjaman l={tujuan} aktif onClick={() => {}} />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setTujuan(null)}>
                    Ganti
                  </Button>
                </div>
              ) : (
                <>
                  <Input placeholder="Cari nama / NIK / no. anggota" value={cariTujuan} onChange={(e) => setCariTujuan(e.target.value)} />
                  {hasilTujuan.length > 0 && (
                    <div className="overflow-y-auto border rounded-md max-h-48">
                      {hasilTujuan.map((l) => (
                        <BarisPinjaman key={l.id} l={l} onClick={() => setTujuan(l)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <label className="grid gap-1">
            <span className="font-medium">Alasan (wajib, tercatat di log)</span>
            <textarea
              rows={2}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md border-input bg-background"
              placeholder="Mis. angsuran 12 Agustus milik Siti tercatat ke Sumi; ditambah sesudah bucket ditutup"
            />
          </label>

          {galat && <div className="p-2 text-sm text-red-700 rounded-md bg-red-50">{galat}</div>}
          {pratinjau && (
            <div className="grid gap-1">
              <span className="font-medium">Dampak ke saldo bulanan</span>
              <DampakKoreksi dampak={pratinjau} />
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClosed}>
            Batal
          </Button>
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

/**
 * Koreksi Data Beku (superuser): angsuran bertanggal sebelum migrasi kantor.
 * Kantor ikut filter global. Cari nasabah -> pilih pinjaman -> ubah / hapus /
 * tambah / pindah angsuran, dengan pratinjau dampak & alasan wajib.
 */
const KoreksiBeku = ({ kantor, q, hasil = [], pinjaman }) => {
  const [cari, setCari] = useState(q ?? '');
  const [buka, setBuka] = useState(null);
  const pilih = (id) => router.get(route('migrasi.koreksi_beku'), { q: cari, loan: id }, { preserveScroll: true });

  return (
    <Authenticated>
      <Head title="Koreksi Data Beku" />

      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Koreksi Data Beku</h1>
          <p className="text-sm text-slate-500">
            {kantor.unit} · angsuran sebelum migrasi ({kantor.mulai ? dayjs(kantor.mulai).format('DD MMM YYYY') : '—'}). Superuser saja;
            setiap koreksi menghitung ulang saldo bulanan dari bulan migrasi dan tercatat di log.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-1">
          <Link href={route('migrasi.koreksi_beku_log')}>
            <History className="w-4 h-4" />
            Log koreksi ({kantor.jumlah_koreksi})
          </Link>
        </Button>
      </div>

      {!kantor.mulai ? (
        <div className="p-4 text-sm border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
          Kantor ini belum migrasi - datanya belum beku. Ubah angsuran lewat menu biasa.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
          <div className="bg-white border rounded-lg">
            <form
              className="flex gap-2 p-3 border-b"
              onSubmit={(e) => {
                e.preventDefault();
                router.get(route('migrasi.koreksi_beku'), { q: cari }, { preserveState: true });
              }}
            >
              <Input placeholder="Nama / NIK / no. anggota (min. 3 huruf)" value={cari} onChange={(e) => setCari(e.target.value)} />
              <Button type="submit" size="icon" variant="outline" aria-label="Cari">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            <div className="max-h-[60vh] overflow-y-auto">
              {hasil.map((l) => (
                <BarisPinjaman key={l.id} l={l} aktif={pinjaman?.id === l.id} onClick={() => pilih(l.id)} />
              ))}
              {q && hasil.length === 0 && <div className="p-3 text-sm text-slate-500">Tidak ada pinjaman sebelum migrasi yang cocok.</div>}
            </div>
          </div>

          <div>
            {!pinjaman ? (
              <div className="p-6 text-sm text-center bg-white border rounded-lg text-slate-500">Pilih pinjaman di kiri.</div>
            ) : (
              <div className="bg-white border rounded-lg">
                <div className="flex flex-wrap items-start justify-between gap-3 p-4 border-b">
                  <div>
                    <div className="text-lg font-semibold">{pinjaman.nama}</div>
                    <div className="text-sm capitalize text-slate-500">
                      No. {pinjaman.nomor_anggota || '–'} · Kel {pinjaman.kelompok} · {pinjaman.hari} · drop{' '}
                      {dayjs(pinjaman.drop_date).format('DD-MM-YYYY')} · Rp {rp(pinjaman.pinjaman)}
                    </div>
                    <div className="mt-1 text-sm">
                      Ember di {dayjs(kantor.mulai).format('MMMM YYYY')}:{' '}
                      <b className="uppercase">{EMBER[pinjaman.ember] ?? pinjaman.ember}</b> · saldo per{' '}
                      {dayjs(kantor.mulai).subtract(1, 'day').format('DD-MM-YYYY')}: <b>Rp {rp(pinjaman.saldo_awal)}</b>
                    </div>
                  </div>
                  <Button onClick={() => setBuka({ aksi: 'tambah' })}>Tambah angsuran</Button>
                </div>
                <table className="w-full text-sm tabular-nums">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-medium text-left">Tanggal</th>
                      <th className="px-3 py-2 font-medium text-right">Nominal</th>
                      <th className="px-3 py-2 font-medium text-left">Ket</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {pinjaman.angsuran.map((a) => (
                      <tr key={a.id} className="border-t even:bg-slate-50">
                        <td className="px-3 py-1.5">{dayjs(a.tanggal).format('DD-MM-YYYY')}</td>
                        <td className="px-3 py-1.5 text-right">{rp(a.nominal)}</td>
                        <td className="px-3 py-1.5 text-xs text-slate-500">
                          {[a.katrol && 'katrol', a.transfer && 'transfer', a.topup && 'pelunasan topup'].filter(Boolean).join(', ')}
                        </td>
                        <td className="px-3 py-1.5 text-right whitespace-nowrap">
                          {a.topup ? (
                            <Lock className="inline w-4 h-4 text-slate-400" aria-label="Pelunasan topup, tidak bisa dikoreksi" />
                          ) : (
                            <div className="inline-flex gap-1">
                              {['ubah', 'pindah', 'hapus'].map((x) => (
                                <Button
                                  key={x}
                                  size="xs"
                                  variant="outline"
                                  className={`capitalize ${x === 'hapus' ? 'text-red-600 border-red-200' : ''}`}
                                  onClick={() => setBuka({ aksi: x, angsuran: a })}
                                >
                                  {x}
                                </Button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {pinjaman.angsuran.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                          Belum ada angsuran sebelum migrasi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <DialogKoreksi buka={buka} onClosed={() => setBuka(null)} pinjaman={pinjaman} mulai={kantor.mulai} />
    </Authenticated>
  );
};

export default KoreksiBeku;
