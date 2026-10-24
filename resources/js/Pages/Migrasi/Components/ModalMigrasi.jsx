import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { rp } from '@/lib/rupiah';

const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

/** Halaman tempat membetulkan satu baris anomali (tab baru, modal tetap terbuka). */
const tautan = (r) => {
  const buku = { kelompok: r.kelompok, hari: r.hari ?? undefined, month: r.tanggal ? dayjs(r.tanggal).format('YYYY-MM') : undefined };
  return {
    storting: () => route('pinjaman.index_pinjaman', buku),
    transaksi: () => route('transaction.index_buku_transaksi', buku),
  }[r.buku]?.();
};

/** Satu jenis anomali: judul + jumlah, contoh baris bisa dibuka. */
const Anomali = ({ a }) => {
  const nada = !a.jumlah ? 'text-emerald-700' : a.menahan ? 'text-red-700' : 'text-amber-700';
  return (
    <details className="border-b last:border-b-0">
      <summary className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm ${a.jumlah ? '' : 'pointer-events-none'}`}>
        <span>
          {a.judul}
          {!a.menahan && <span className="ml-1 text-xs text-slate-400">(peringatan)</span>}
        </span>
        <span className={`font-semibold tabular-nums ${nada}`}>{a.jumlah ? rp(a.jumlah) : '✓'}</span>
      </summary>
      {a.jumlah > 0 && (
        <div className="px-3 pb-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-slate-500">
              <tr>
                <th className="py-1 pr-2 text-left">ID</th>
                <th className="py-1 pr-2 text-left">Nama</th>
                <th className="py-1 pr-2 text-left">Kel.</th>
                <th className="py-1 pr-2 text-left">Hari</th>
                <th className="py-1 pr-2 text-left">Tanggal</th>
                <th className="py-1 pr-2 text-right">Nominal</th>
                <th className="py-1 text-left">Ket.</th>
              </tr>
            </thead>
            <tbody>
              {a.contoh.map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-1 pr-2 tabular-nums">
                    {tautan(r) ? (
                      <a href={tautan(r)} target="_blank" rel="noreferrer" className="text-blue-600 underline decoration-dotted">
                        {r.id ?? 'buka'}
                      </a>
                    ) : (
                      r.id ?? '–'
                    )}
                  </td>
                  <td className="py-1 pr-2">{r.nama ?? '–'}</td>
                  <td className="py-1 pr-2">{r.kelompok}</td>
                  <td className="py-1 pr-2 capitalize">{r.hari ?? '–'}</td>
                  <td className="py-1 pr-2 whitespace-nowrap">{tgl(r.tanggal)}</td>
                  <td className="py-1 pr-2 text-right tabular-nums">{rp(r.nominal)}</td>
                  <td className="py-1">{r.ket}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {a.jumlah > a.contoh.length && (
            <div className="mt-1 text-xs text-slate-500">
              Menampilkan {a.contoh.length} dari {rp(a.jumlah)}.
            </div>
          )}
        </div>
      )}
    </details>
  );
};

/** Drop & storting per tanggal: hitung ulang vs rekap lama; yang beda merah. */
const Pratinjau = ({ hari }) => {
  const beda = (a, b) => (a !== b ? 'font-semibold text-red-600' : '');
  return (
    <div className="overflow-auto border rounded-md max-h-72">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-slate-50 text-slate-500">
          <tr>
            <th className="px-2 py-1 text-left">Tanggal</th>
            <th className="px-2 py-1 text-right">Drop baru</th>
            <th className="px-2 py-1 text-right">Drop lama</th>
            <th className="px-2 py-1 text-right">Storting baru</th>
            <th className="px-2 py-1 text-right">Storting lama</th>
          </tr>
        </thead>
        <tbody>
          {hari.map((h) => (
            <React.Fragment key={h.tanggal}>
              <tr className="border-t">
                <td className="px-2 py-1 whitespace-nowrap">{tgl(h.tanggal)}</td>
                <td className={`px-2 py-1 text-right tabular-nums ${beda(h.drop_baru, h.drop_lama)}`}>{rp(h.drop_baru)}</td>
                <td className="px-2 py-1 text-right tabular-nums">{rp(h.drop_lama)}</td>
                <td className={`px-2 py-1 text-right tabular-nums ${beda(h.storting_baru, h.storting_lama)}`}>{rp(h.storting_baru)}</td>
                <td className="px-2 py-1 text-right tabular-nums">{rp(h.storting_lama)}</td>
              </tr>
              {h.beda.map((k) => (
                <tr key={k.kelompok} className="bg-red-50/60 text-slate-600">
                  <td className="px-2 py-0.5 pl-5">kelompok {k.kelompok}</td>
                  <td className={`px-2 py-0.5 text-right tabular-nums ${beda(k.drop_baru, k.drop_lama)}`}>{rp(k.drop_baru)}</td>
                  <td className="px-2 py-0.5 text-right tabular-nums">{rp(k.drop_lama)}</td>
                  <td className={`px-2 py-0.5 text-right tabular-nums ${beda(k.storting_baru, k.storting_lama)}`}>{rp(k.storting_baru)}</td>
                  <td className="px-2 py-0.5 text-right tabular-nums">{rp(k.storting_lama)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ModalMigrasi = ({ open, onOpenChange, unit, periode }) => {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(null);
  const [kunci, setKunci] = useState(true);
  const [sampai, setSampai] = useState('');
  const [pratinjau, setPratinjau] = useState(null);
  const [memuat, setMemuat] = useState(false);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!open) return;
    setData(null);
    setGalat(null);
    setPratinjau(null);
    axios
      .get(route('migrasi.periksa_migrasi'), { params: { periode } })
      .then(({ data }) => {
        setData(data);
        setSampai(data.usulan_kunci ?? '');
        setKunci(!!data.usulan_kunci);
      })
      .catch(() => setGalat('Pemeriksaan gagal dimuat. Coba lagi.'));
  }, [open, periode]);

  const menahan = (data?.anomali ?? []).filter((a) => a.menahan).reduce((n, a) => n + a.jumlah, 0);
  const kunciSah = !kunci || (sampai && sampai >= periode && sampai <= data?.kemarin);
  const bolehMigrasi = data && !menahan && kunciSah && !proses;

  const muatPratinjau = () => {
    setMemuat(true);
    axios
      .get(route('migrasi.periksa_migrasi'), { params: { periode, sampai } })
      .then(({ data }) => setPratinjau(data.pratinjau))
      .catch(() => setPratinjau(null))
      .finally(() => setMemuat(false));
  };

  const migrasikan = () => {
    const pesan = kunci
      ? `Migrasikan ${unit} mulai ${tgl(periode)} dan KUNCI semua hari s/d ${tgl(sampai)}?`
      : `Migrasikan ${unit} mulai ${tgl(periode)} tanpa kunci otomatis?`;
    if (!confirm(pesan)) return;
    router.post(
      route('migrasi.jalankan_migrasi'),
      { periode, kunci_sampai: kunci ? sampai : null },
      {
        preserveScroll: true,
        onStart: () => setProses(true),
        onFinish: () => setProses(false),
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Migrasikan {unit}</DialogTitle>
          <DialogDescription>
            Pendataan baru mulai {tgl(periode)}. Semua hari sejak tanggal itu masuk ke closing harian baru; hari s/d tanggal
            kunci dikunci otomatis, sisanya dikunci manual per tanggal lewat Buku Transaksi → ACC KM.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">1. Anomali data</h3>
          {galat && <div className="text-sm text-red-600">{galat}</div>}
          {!data && !galat && <div className="text-sm text-slate-500">Memeriksa anomali… (bisa beberapa detik)</div>}
          {data && (
            <>
              <div className="border rounded-md">
                {data.anomali.map((a) => (
                  <Anomali key={a.kode} a={a} />
                ))}
              </div>
              {menahan > 0 && (
                <div className="p-2 text-sm text-red-800 border border-red-200 rounded-md bg-red-50">
                  Ada <b>{rp(menahan)}</b> anomali yang menahan migrasi. Betulkan dulu lewat menu biasa, lalu buka modal ini
                  lagi.
                </div>
              )}
            </>
          )}
        </section>

        {data && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">2. Kunci otomatis</h3>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={kunci} onChange={(e) => setKunci(e.target.checked)} />
              Kunci otomatis s/d tanggal
              <Input
                type="date"
                className="w-44 h-8"
                disabled={!kunci}
                min={periode}
                max={data.kemarin}
                value={sampai}
                onChange={(e) => {
                  setSampai(e.target.value);
                  setPratinjau(null);
                }}
              />
            </label>
            <p className="text-xs text-slate-500">
              Usulan: {data.usulan_kunci ? `${tgl(data.usulan_kunci)} (kunci kasir terakhir di alur lama)` : 'tidak ada kunci kasir lama'}.
              Yang dikunci adalah angka <b>hitung ulang dari data asli</b>, bukan angka rekap lama.
            </p>
            {kunci && kunciSah && (
              <div className="space-y-2">
                <Button size="sm" variant="outline" disabled={memuat} onClick={muatPratinjau}>
                  {memuat ? 'Memuat…' : 'Lihat pratinjau'}
                </Button>
                {pratinjau && (
                  <>
                    <div className="text-xs text-slate-600">
                      {pratinjau.filter((h) => h.beda.length).length
                        ? `${pratinjau.filter((h) => h.beda.length).length} tanggal berbeda dari rekap lama (merah).`
                        : 'Semua tanggal sama dengan rekap lama.'}
                    </div>
                    <Pratinjau hari={pratinjau} />
                  </>
                )}
              </div>
            )}
          </section>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={!bolehMigrasi} onClick={migrasikan}>
            {proses ? 'Memigrasikan…' : 'Migrasikan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMigrasi;
