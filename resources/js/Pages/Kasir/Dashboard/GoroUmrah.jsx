import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeft, Plane, Receipt } from 'lucide-react';

/** Detail Tabungan Goro Umrah kantor aktif (baca-saja; setor dari Dashboard Kasir). */
const rp = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(n) || 0);

export default function GoroUmrah({ unit, tahun, tahun_ada = [], total, per_bulan = [], setoran = [] }) {
  const pilihanTahun = [...new Set([Number(tahun), dayjs().year(), ...tahun_ada.map(Number)])].sort((a, b) => b - a);
  const totalTahun = per_bulan.reduce((a, b) => a + b.jumlah, 0);

  return (
    <AuthenticatedLayout header="Tabungan Goro Umrah">
      <Head title="Tabungan Goro Umrah" />
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link href={route('dashboard.kasir')} className="inline-flex items-center gap-1 mb-1 text-xs font-medium text-slate-500 hover:text-slate-800">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard Kasir
            </Link>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Plane className="w-5 h-5 text-teal-600" /> Tabungan Goro Umrah — {unit}
            </h1>
            <p className="text-sm text-slate-500">
              Total tabungan {rp(total)} · tahun {tahun}: {rp(totalTahun)}
            </p>
          </div>
          <select
            value={tahun}
            onChange={(e) => router.get(route('dashboard.kasir.goro_umrah'), { tahun: e.target.value }, { preserveScroll: true })}
            className="h-9 px-3 text-sm border rounded-md border-input bg-background"
          >
            {pilihanTahun.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {per_bulan.map((b) => (
            <div key={b.bulan} className={`p-2 text-center border rounded-lg ${b.kali ? 'bg-teal-50 border-teal-200' : 'bg-white'}`}>
              <div className="text-xs font-semibold text-slate-600">{dayjs(b.bulan + '-01').format('MMM')}</div>
              <div className={`text-sm tabular-nums ${b.kali ? 'font-semibold text-teal-800' : 'text-slate-300'}`}>
                {b.kali ? new Intl.NumberFormat('id-ID').format(b.jumlah / 1000) + 'rb' : '–'}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-medium text-left">Tanggal</th>
                <th className="px-3 py-2 font-medium text-right">Nominal</th>
                <th className="px-3 py-2 font-medium text-left">Catatan</th>
                <th className="px-3 py-2 font-medium text-left">Dicatat oleh</th>
                <th className="px-3 py-2 font-medium text-center">Bukti</th>
              </tr>
            </thead>
            <tbody>
              {setoran.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Belum ada setoran di tahun {tahun}.
                  </td>
                </tr>
              )}
              {setoran.map((s) => (
                <tr key={s.id} className="border-t even:bg-slate-50">
                  <td className="px-3 py-2 whitespace-nowrap">{dayjs(s.tanggal).format('DD MMM YYYY')}</td>
                  <td className="px-3 py-2 font-semibold text-right tabular-nums">{rp(s.nominal)}</td>
                  <td className="px-3 py-2 text-slate-600">{s.catatan || '–'}</td>
                  <td className="px-3 py-2 text-slate-600">{s.oleh || '–'}</td>
                  <td className="px-3 py-2 text-center">
                    {s.bukti ? (
                      <a href={s.bukti} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-sky-700 hover:underline">
                        <Receipt className="w-3.5 h-3.5" /> lihat
                      </a>
                    ) : (
                      '–'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
