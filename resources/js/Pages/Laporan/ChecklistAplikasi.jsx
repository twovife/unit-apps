import { Head } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/shadcn/ui/input';

/** Laporan Checklist Aplikasi Baru per kantor (superuser & pusat). Urut: paling belum selesai dulu. */
export default function ChecklistAplikasi({ item, kantor }) {
  const [cari, setCari] = useState('');
  const [wilayah, setWilayah] = useState('');
  const daftarWilayah = useMemo(() => [...new Set(kantor.map((k) => k.wilayah).filter(Boolean))].sort(), [kantor]);
  const tampil = kantor.filter((k) => (!wilayah || String(k.wilayah) === wilayah) && k.unit.toLowerCase().includes(cari.toLowerCase()));
  const selesaiSemua = tampil.filter((k) => k.jumlah === item.length).length;

  return (
    <>
      <Head title="Laporan Checklist Aplikasi" />
      <div className="space-y-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Checklist Aplikasi Baru</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selesaiSemua} dari {tampil.length} kantor sudah menyelesaikan semua item. Arahkan kursor ke ✓ untuk melihat kapan & siapa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Cari kantor…" value={cari} onChange={(e) => setCari(e.target.value)} className="h-9 w-56" />
          <select value={wilayah} onChange={(e) => setWilayah(e.target.value)} className="h-9 rounded-md border bg-background px-3 text-sm">
            <option value="">Semua wilayah</option>
            {daftarWilayah.map((w) => <option key={w} value={w}>Wilayah {w}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Kantor</th>
                {item.map((i) => <th key={i.kunci} title={i.petunjuk} className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">{i.judul}</th>)}
                <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">Selesai</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tampil.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2"><div className="font-medium">{k.unit}</div><div className="text-xs text-muted-foreground">Wilayah {k.wilayah ?? '—'}</div></td>
                  {item.map((i) => {
                    const sel = k.sel[i.kunci];
                    return (
                      <td key={i.kunci} className="px-3 py-2 text-center" title={sel.ket ?? 'Belum'}>
                        {sel.selesai ? <CheckCircle2 className="mx-auto size-5 text-emerald-600" /> : <XCircle className="mx-auto size-5 text-rose-400" />}
                      </td>
                    );
                  })}
                  <td className={`px-3 py-2 text-center font-semibold tabular-nums ${k.jumlah === item.length ? 'text-emerald-600' : 'text-rose-600'}`}>{k.jumlah} / {item.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
