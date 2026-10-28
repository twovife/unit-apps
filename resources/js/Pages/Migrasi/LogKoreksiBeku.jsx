import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { ArrowLeft } from 'lucide-react';
import DampakKoreksi from './Components/DampakKoreksi';
import { rp } from '@/lib/rupiah';

const AKSI = { ubah: 'Ubah nominal', hapus: 'Hapus', tambah: 'Tambah', pindah: 'Pindah pinjaman', hapus_pemutihan: 'Hapus pemutihan', tambah_pinjaman: 'Tambah pinjaman' };
const NADA = { ubah: 'bg-sky-100 text-sky-800', hapus: 'bg-red-100 text-red-800', tambah: 'bg-emerald-100 text-emerald-800', pindah: 'bg-amber-100 text-amber-800', hapus_pemutihan: 'bg-red-100 text-red-800', tambah_pinjaman: 'bg-emerald-100 text-emerald-800' };

const Angsuran = ({ a }) =>
  a ? (
    <span>
      {a.nasabah} · {dayjs(a.tanggal).format('DD-MM-YYYY')} · <b>Rp {rp(a.nominal)}</b>
    </span>
  ) : (
    <span className="text-slate-400">—</span>
  );

/** Log Koreksi Data Beku: kantor aktif (bawaan) atau semua kantor. */
const LogKoreksiBeku = ({ log, semua, unit }) => (
  <>
    <Head title="Log Koreksi Data Beku" />

    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Log Koreksi Data Beku</h1>
        <p className="text-sm text-slate-500">
          {semua ? 'Semua kantor' : unit} · {log.total} koreksi sesudah migrasi
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.get(route('migrasi.koreksi_beku_log'), semua ? {} : { semua: 1 })}>
          {semua ? 'Kantor aktif saja' : 'Semua kantor'}
        </Button>
        <Button asChild variant="outline" className="gap-1">
          <Link href={route('migrasi.koreksi_beku')}>
            <ArrowLeft className="w-4 h-4" />
            Koreksi
          </Link>
        </Button>
      </div>
    </div>

    <div className="space-y-3">
      {log.data.map((r) => (
        <div key={r.id} className="p-4 bg-white border rounded-lg">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${NADA[r.aksi]}`}>{AKSI[r.aksi] ?? r.aksi}</span>
            <span className="text-slate-500">
              {dayjs(r.waktu).format('DD-MM-YYYY HH:mm')} · {r.oleh}
              {semua && ` · ${r.kantor}`}
            </span>
          </div>
          <div className="grid gap-1 mb-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-xs text-slate-500">Sebelum: </span>
              <Angsuran a={r.sebelum} />
            </div>
            <div>
              <span className="text-xs text-slate-500">Sesudah: </span>
              <Angsuran a={r.sesudah} />
            </div>
          </div>
          <div className="p-2 mb-2 text-sm rounded-md bg-slate-50">
            <span className="text-xs text-slate-500">Alasan: </span>
            {r.alasan}
          </div>
          <DampakKoreksi dampak={r.dampak ?? []} />
        </div>
      ))}
      {log.data.length === 0 && <div className="p-6 text-sm text-center bg-white border rounded-lg text-slate-500">Belum ada koreksi.</div>}
    </div>

    {log.last_page > 1 && (
      <div className="flex justify-center gap-1 mt-4">
        {log.links.map((l, i) => (
          <Button
            key={i}
            size="sm"
            variant={l.active ? 'default' : 'outline'}
            disabled={!l.url}
            onClick={() => l.url && router.get(l.url, {}, { preserveScroll: true })}
            dangerouslySetInnerHTML={{ __html: l.label }}
          />
        ))}
      </div>
    )}
  </>
);

export default LogKoreksiBeku;
