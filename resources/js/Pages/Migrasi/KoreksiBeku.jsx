import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { History, Lock } from 'lucide-react';
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
    setTanggal(buka?.tanggal ?? '');
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

const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
const PILIH = 'h-9 px-2 text-sm border rounded-md border-input bg-background';
const rb = (n) => new Intl.NumberFormat('id-ID').format(Math.round((n ?? 0) / 1000));

/** Isi satu sel (nasabah x tanggal): daftar angsuran + aksi. */
const DialogSel = ({ sel, onClosed, onAksi }) => {
  const isi = sel ? sel.nasabah.angsuran[sel.tanggal] ?? [] : [];
  return (
    <Dialog open={!!sel} onOpenChange={(o) => !o && onClosed()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {sel?.nasabah.nama} · {sel && dayjs(sel.tanggal).format('dddd, DD MMM YYYY')}
          </DialogTitle>
          <DialogDescription>
            Drop {sel && dayjs(sel.nasabah.drop_date).format('DD-MM-YYYY')} · Rp {rp(sel?.nasabah.pinjaman)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 text-sm">
          {isi.length === 0 && <div className="text-slate-500">Tidak ada angsuran di tanggal ini.</div>}
          {isi.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 p-2 border rounded-md">
              <div>
                <b>Rp {rp(a.nominal)}</b>{' '}
                <span className="text-xs text-slate-500">
                  {[a.katrol && 'katrol', a.transfer && 'transfer', a.topup && 'pelunasan topup'].filter(Boolean).join(', ')}
                </span>
              </div>
              {a.topup ? (
                <Lock className="w-4 h-4 text-slate-400" aria-label="Pelunasan topup, tidak bisa dikoreksi" />
              ) : (
                <div className="flex gap-1">
                  {['ubah', 'pindah', 'hapus'].map((x) => (
                    <Button
                      key={x}
                      size="xs"
                      variant="outline"
                      className={`capitalize ${x === 'hapus' ? 'text-red-600 border-red-200' : ''}`}
                      onClick={() => onAksi({ aksi: x, angsuran: a })}
                    >
                      {x}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onAksi({ aksi: 'tambah', tanggal: sel.tanggal })}>
            Tambah angsuran di tanggal ini
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Koreksi Data Beku (superuser), tampil seperti buku angsuran: kantor (filter
 * global) x kelompok x hari x BULAN DROP. Baris = nasabah drop bulan itu,
 * kolom = tanggal tagih s/d sebelum migrasi. Klik sel -> ubah / hapus /
 * pindah / tambah, dengan pratinjau dampak & alasan wajib.
 */
const KoreksiBeku = ({ kantor, filter, kolom = [], nasabah = [] }) => {
  const [sel, setSel] = useState(null);
  const [buka, setBuka] = useState(null);
  const ganti = (ubah) => router.get(route('migrasi.koreksi_beku'), { ...filter && { kelompok: filter.kelompok, hari: filter.hari, bulan: filter.bulan }, ...ubah }, { preserveScroll: true });

  // Kepala bulan di atas kolom tanggal.
  const bulanKolom = kolom.reduce((acc, t) => {
    const b = t.slice(0, 7);
    const akhir = acc[acc.length - 1];
    akhir && akhir.b === b ? akhir.n++ : acc.push({ b, n: 1 });
    return acc;
  }, []);
  const jumlahKolom = (t) => nasabah.reduce((a, n) => a + (n.angsuran[t] ?? []).reduce((x, i) => x + i.nominal, 0), 0);

  return (
    <Authenticated>
      <Head title="Koreksi Data Beku" />

      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Koreksi Data Beku</h1>
          <p className="text-sm text-slate-500">
            {kantor.unit} · angsuran sebelum migrasi ({kantor.mulai ? dayjs(kantor.mulai).format('DD MMM YYYY') : '—'}). Klik sel untuk
            mengoreksi; saldo bulanan dihitung ulang dan tercatat di log. Angka dalam ribuan.
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
        <>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <select className={PILIH} value={filter.kelompok} onChange={(e) => ganti({ kelompok: e.target.value })}>
              {filter.kelompok_ada.map((k) => (
                <option key={k} value={k}>
                  Kelompok {k}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1">
              {HARI.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => ganti({ hari: h })}
                  className={`h-9 px-3 text-sm capitalize rounded-md border ${
                    filter.hari === h ? 'bg-sky-600 border-sky-600 text-white font-semibold' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
            <select className={PILIH} value={filter.bulan} onChange={(e) => ganti({ bulan: e.target.value })}>
              {filter.bulan_ada.map((b) => (
                <option key={b} value={b}>
                  Drop {dayjs(`${b}-01`).format('MMMM YYYY')}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-auto bg-white border rounded-lg max-h-[70vh]">
            <table className="w-full text-xs tabular-nums">
              <thead className="sticky top-0 z-20 bg-slate-100 text-slate-700">
                <tr>
                  <th rowSpan={2} className="sticky left-0 z-20 px-2 py-1.5 font-medium text-left bg-slate-100">
                    Nasabah
                  </th>
                  <th rowSpan={2} className="px-2 py-1.5 font-medium text-left">Drop</th>
                  <th rowSpan={2} className="px-2 py-1.5 font-medium text-right">Pinjaman</th>
                  <th rowSpan={2} className="px-2 py-1.5 font-medium text-center">Ember</th>
                  {bulanKolom.map((m) => (
                    <th key={m.b} colSpan={m.n} className="px-2 py-1 font-medium text-center border-l-2 border-slate-300">
                      {dayjs(`${m.b}-01`).format('MMMM YYYY')}
                    </th>
                  ))}
                  <th rowSpan={2} className="px-2 py-1.5 font-medium text-right border-l-2 border-slate-300 whitespace-nowrap">
                    Saldo {dayjs(kantor.mulai).subtract(1, 'day').format('DD-MM')}
                  </th>
                </tr>
                <tr>
                  {kolom.map((t, i) => (
                    <th
                      key={t}
                      className={`px-2 py-1 font-normal text-right whitespace-nowrap ${
                        i === 0 || kolom[i - 1].slice(0, 7) !== t.slice(0, 7) ? 'border-l-2 border-slate-300' : 'border-l'
                      } ${dayjs(t).format('dddd').toLowerCase() !== filter.hari ? 'text-amber-700' : ''}`}
                    >
                      {dayjs(t).format('DD')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nasabah.map((n) => (
                  <tr key={n.id} className="border-t even:bg-slate-50 hover:bg-sky-50">
                    <td className="sticky left-0 z-10 px-2 py-1 bg-inherit whitespace-nowrap">
                      <div className="font-medium text-slate-900">{n.nama}</div>
                      <div className="text-[10px] text-slate-500">No. {n.nomor_anggota || '–'}</div>
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap">{dayjs(n.drop_date).format('DD-MM')}</td>
                    <td className="px-2 py-1 text-right">{rb(n.pinjaman)}</td>
                    <td className="px-2 py-1 font-semibold text-center uppercase">{EMBER[n.ember] ?? n.ember}</td>
                    {kolom.map((t, i) => {
                      const isi = n.angsuran[t] ?? [];
                      const total = isi.reduce((a, x) => a + x.nominal, 0);
                      const sebelumDrop = t < n.drop_date;
                      return (
                        <td
                          key={t}
                          className={`p-0 text-right ${
                            i === 0 || kolom[i - 1].slice(0, 7) !== t.slice(0, 7) ? 'border-l-2 border-slate-300' : 'border-l'
                          } ${sebelumDrop ? 'bg-slate-100' : ''}`}
                        >
                          {!sebelumDrop && (
                            <button
                              type="button"
                              onClick={() => setSel({ nasabah: n, tanggal: t })}
                              className={`w-full h-full px-2 py-1 text-right hover:bg-sky-100 ${isi.length ? 'text-slate-900' : 'text-slate-300'}`}
                            >
                              {isi.some((x) => x.katrol) && <span className="mr-0.5 text-[9px] font-semibold text-emerald-700">K</span>}
                              {isi.length ? rb(total) : '·'}
                              {isi.length > 1 && <sup className="ml-0.5 text-amber-600">{isi.length}</sup>}
                            </button>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-2 py-1 font-semibold text-right border-l-2 border-slate-300">{rb(n.saldo_awal)}</td>
                  </tr>
                ))}
                {nasabah.length === 0 && (
                  <tr>
                    <td colSpan={kolom.length + 5} className="py-6 text-center text-slate-500">
                      Tidak ada nasabah drop {dayjs(`${filter.bulan}-01`).format('MMMM YYYY')} di kelompok {filter.kelompok} hari{' '}
                      {filter.hari}.
                    </td>
                  </tr>
                )}
              </tbody>
              {nasabah.length > 0 && (
                <tfoot className="sticky bottom-0 font-bold border-t-2 bg-emerald-50 text-slate-900">
                  <tr>
                    <td className="sticky left-0 px-2 py-1.5 bg-emerald-50">Total ({nasabah.length})</td>
                    <td />
                    <td className="px-2 py-1.5 text-right">{rb(nasabah.reduce((a, n) => a + n.pinjaman, 0))}</td>
                    <td />
                    {kolom.map((t, i) => (
                      <td
                        key={t}
                        className={`px-2 py-1.5 text-right ${i === 0 || kolom[i - 1].slice(0, 7) !== t.slice(0, 7) ? 'border-l-2 border-slate-300' : 'border-l'}`}
                      >
                        {rb(jumlahKolom(t))}
                      </td>
                    ))}
                    <td className="px-2 py-1.5 text-right border-l-2 border-slate-300">{rb(nasabah.reduce((a, n) => a + n.saldo_awal, 0))}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </>
      )}

      <DialogSel
        sel={sel}
        onClosed={() => setSel(null)}
        onAksi={(b) => {
          setBuka({ ...b, nasabah: sel.nasabah });
          setSel(null);
        }}
      />
      <DialogKoreksi
        buka={buka}
        onClosed={() => setBuka(null)}
        pinjaman={buka?.nasabah}
        mulai={kantor.mulai}
      />
    </Authenticated>
  );
};

export default KoreksiBeku;
