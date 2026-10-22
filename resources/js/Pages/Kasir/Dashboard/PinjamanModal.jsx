import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeft, Landmark, Receipt } from 'lucide-react';
import { rpLengkap as rp } from '@/lib/rupiah';

/** Detail Pinjaman Modal kantor aktif per sumber (baca-saja; bayar dari Dashboard Kasir). */
const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

const Angka = ({ label, nilai, tebal = false }) => (
  <div className="p-3 bg-white border rounded-lg">
    <div className="text-xs font-medium uppercase text-slate-500">{label}</div>
    <div className={`mt-1 tabular-nums ${tebal ? 'text-lg font-bold text-violet-800' : 'text-base font-semibold text-slate-900'}`}>{rp(nilai)}</div>
  </div>
);

export default function PinjamanModal({ unit, sumber, sumber_ada = [], ringkas, pinjaman = [], angsuran = [] }) {
  // Tab buku = drawer app_laravel: Semua | Pusat | Hertawan | Sherly | Modal Awal.
  const judul = sumber_ada.find((x) => x.kunci === sumber)?.judul ?? 'Pinjaman Modal';
  const ke = (q) => router.get(route('dashboard.kasir.pinjaman_modal'), { sumber, ...q }, { preserveScroll: true });
  const lintasBuku = sumber === 'semua' || sumber === 'modal_awal';

  return (
    <>
      <Head title={judul} />
      <div className="space-y-4">
        <div>
          <Link href={route('dashboard.kasir')} className="inline-flex items-center gap-1 mb-1 text-xs font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard Kasir
          </Link>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Landmark className="w-5 h-5 text-violet-600" /> {judul} — {unit}
          </h1>
        </div>

        <div className="inline-flex p-1 rounded-lg bg-slate-100">
          {sumber_ada.map((x) => (
            <button
              key={x.kunci}
              type="button"
              onClick={() => ke({ sumber: x.kunci })}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                x.kunci === sumber ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {x.judul.replace('Pinjaman Modal ', '')}
            </button>
          ))}
        </div>


        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Angka label="Total pinjaman" nilai={ringkas.total_pinjaman} />
          <Angka label="Pokok dibayar" nilai={ringkas.total_pokok} />
          <Angka label="Jasa modal dibayar" nilai={ringkas.total_jasa} />
          <Angka label="Sisa pokok" nilai={ringkas.sisa} tebal />
          {ringkas.jasa_wajib !== null && ringkas.jasa_wajib !== undefined && (
            <Angka label="Jasa wajib bulan ini" nilai={ringkas.jasa_wajib} />
          )}
        </div>

        <section>
          <h2 className="mb-2 font-semibold text-slate-900">Daftar pinjaman</h2>
          <div className="overflow-x-auto bg-white border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-medium text-left">Tanggal</th>
                  {lintasBuku && <th className="px-3 py-2 font-medium text-left">Sumber / jenis</th>}
                  <th className="px-3 py-2 font-medium text-right">Pinjaman</th>
                  <th className="px-3 py-2 font-medium text-right">Pokok dibayar</th>
                  <th className="px-3 py-2 font-medium text-right">Sisa</th>
                  <th className="px-3 py-2 font-medium text-right">Jasa wajib bulan ini</th>
                  <th className="px-3 py-2 font-medium text-center">Status</th>
                  <th className="px-3 py-2 font-medium text-left">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {pinjaman.length === 0 && (
                  <tr>
                    <td colSpan={lintasBuku ? 8 : 7} className="py-6 text-center text-slate-500">
                      Kantor ini tidak punya pinjaman di buku ini.
                    </td>
                  </tr>
                )}
                {pinjaman.map((l) => (
                  <tr key={l.id} className="border-t even:bg-slate-50">
                    <td className="px-3 py-2 whitespace-nowrap">{tgl(l.tanggal)}</td>
                    {lintasBuku && (
                      <td className="px-3 py-2 text-xs whitespace-nowrap text-slate-600">
                        {l.sumber.replace('Pinjaman Modal ', '')} · {l.jenis}
                      </td>
                    )}
                    <td className="px-3 py-2 text-right tabular-nums">{rp(l.jumlah)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{rp(l.dibayar)}</td>
                    <td className="px-3 py-2 font-semibold text-right tabular-nums">{rp(l.sisa)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {l.jasa_berlaku ? (
                        rp(l.jasa_wajib)
                      ) : l.wajib_mulai && l.sisa > 0 ? (
                        <span className="text-xs text-amber-600">tempo s/d {dayjs(`${l.wajib_mulai}-01`).subtract(1, 'month').format('MMM YY')}</span>
                      ) : (
                        '–'
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          l.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status === 'paid' ? 'Lunas' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{l.catatan || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-slate-900">Riwayat angsuran</h2>
          <div className="overflow-x-auto bg-white border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-medium text-left">Tanggal</th>
                  <th className="px-3 py-2 font-medium text-right">Pokok</th>
                  <th className="px-3 py-2 font-medium text-right">Jasa modal</th>
                  <th className="px-3 py-2 font-medium text-left">Pinjaman</th>
                  <th className="px-3 py-2 font-medium text-left">Dicatat oleh</th>
                  <th className="px-3 py-2 font-medium text-center">Bukti</th>
                </tr>
              </thead>
              <tbody>
                {angsuran.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      Belum ada angsuran.
                    </td>
                  </tr>
                )}
                {angsuran.map((p) => {
                  const l = pinjaman.find((x) => x.id === p.pinjaman_id);
                  return (
                    <tr key={p.id} className="border-t even:bg-slate-50">
                      <td className="px-3 py-2 whitespace-nowrap">{tgl(p.tanggal)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{rp(p.pokok)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{rp(p.jasa)}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{l ? `${tgl(l.tanggal)} · ${rp(l.jumlah)}` : '–'}</td>
                      <td className="px-3 py-2 text-slate-600">{p.oleh || '–'}</td>
                      <td className="px-3 py-2 text-center">
                        {p.bukti ? (
                          <a href={p.bukti} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-sky-700 hover:underline">
                            <Receipt className="w-3.5 h-3.5" /> lihat
                          </a>
                        ) : (
                          '–'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
