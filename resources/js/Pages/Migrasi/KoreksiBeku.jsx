import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { History, Lock, Trash2, UserPlus } from 'lucide-react';
import DialogKoreksi from './Components/DialogKoreksi';
import { angka, useModeRibuan } from '@/lib/modeAngka';
import SatuanAngka from '@/Components/SatuanAngka';
import { rp } from '@/lib/rupiah';

const EMBER = { month1: 'M1', month2: 'M2', ccm: 'CCM', cm: 'CM', mb: 'MB', ml: 'ML' };

const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
const PILIH = 'h-9 px-2 text-sm border rounded-md border-input bg-background';
const rb = (n) => angka(n, { bulat: true });

/** Sel berisi lebih dari satu angsuran / pelunasan topup: pilih yang dikoreksi. */
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
                <Button size="xs" variant="outline" onClick={() => onAksi({ aksi: 'ubah', angsuran: a })}>
                  Ubah
                </Button>
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
 * kolom = tanggal tagih s/d sebelum migrasi. Klik sel -> langsung isi nominal
 * (ubah / tambah; hapus dari dialog yang sama), pratinjau dampak, alasan opsional.
 */
const KoreksiBeku = ({ kantor, filter, kolom = [], nasabah = [] }) => {
  useModeRibuan();
  const [sel, setSel] = useState(null);
  const [buka, setBuka] = useState(null);
  // Sel kosong -> tambah; satu angsuran biasa -> ubah langsung; selain itu pilih dulu.
  const klikSel = (n, t) => {
    const isi = n.angsuran[t] ?? [];
    if (!isi.length) return setBuka({ aksi: 'tambah', tanggal: t, nasabah: n });
    if (isi.length === 1 && !isi[0].topup) return setBuka({ aksi: 'ubah', angsuran: isi[0], nasabah: n });
    setSel({ nasabah: n, tanggal: t });
  };
  const ganti = (ubah) => router.get(route('migrasi.koreksi_beku'), { ...filter && { kelompok: filter.kelompok, hari: filter.hari, bulan: filter.bulan }, ...ubah }, { preserveScroll: true });

  // Kepala bulan di atas kolom tanggal.
  const bulanKolom = kolom.reduce((acc, t) => {
    const b = t.slice(0, 7);
    const akhir = acc[acc.length - 1];
    akhir && akhir.b === b ? akhir.n++ : acc.push({ b, n: 1 });
    return acc;
  }, []);
  // Kolom saldo patokan (akhir bulan sebelum migrasi) disisipkan tepat sebelum
  // tanggal pertama bulan migrasi.
  const kolomPertamaMigrasi = kolom.find((t) => t >= kantor.mulai);
  const jumlahKolom = (t) => nasabah.reduce((a, n) => a + (n.angsuran[t] ?? []).reduce((x, i) => x + i.nominal, 0), 0);

  return (
    <>
      <Head title="Koreksi Data Beku" />

      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Koreksi Data Beku</h1>
          <p className="text-sm text-slate-500">
            {kantor.unit} · angsuran sebelum migrasi ({kantor.mulai ? dayjs(kantor.mulai).format('DD MMM YYYY') : '—'}). Klik sel untuk
            mengoreksi; saldo bulanan dihitung ulang dan tercatat di log. <SatuanAngka />
          </p>
        </div>
        <div className="flex gap-2">
        {kantor.mulai && filter?.grouping_id && (
          <Button variant="outline" className="gap-1" onClick={() => setBuka({ aksi: 'tambah_pinjaman' })}>
            <UserPlus className="w-4 h-4" />
            Tambah nasabah
          </Button>
        )}
        <Button asChild variant="outline" className="gap-1">
          <Link href={route('migrasi.koreksi_beku_log')}>
            <History className="w-4 h-4" />
            Log koreksi ({kantor.jumlah_koreksi})
          </Link>
        </Button>
        </div>
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
            {/* Bulan drop bebas (mas 2026-10-28), asal sebelum bulan migrasi - server menolak sisanya. */}
            <label className="flex items-center gap-1 text-sm">
              Drop
              <input
                type="month"
                className={PILIH}
                value={filter.bulan}
                max={dayjs(kantor.mulai).subtract(1, 'month').format('YYYY-MM')}
                onChange={(e) => e.target.value && ganti({ bulan: e.target.value })}
              />
            </label>
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
                  <th rowSpan={2} className="px-2 py-1.5 font-medium text-right">MD</th>
                  {bulanKolom.map((m) => (
                    <React.Fragment key={m.b}>
                      {m.b === kantor.mulai.slice(0, 7) && (
                        <th rowSpan={2} className="px-2 py-1.5 font-medium text-right border-l-2 border-slate-300 whitespace-nowrap bg-amber-100">
                          Saldo {dayjs(kantor.mulai).subtract(1, 'day').format('DD-MM')}
                        </th>
                      )}
                      <th
                        colSpan={m.n}
                        className={`px-2 py-1 font-medium text-center border-l-2 border-slate-300 ${m.b >= kantor.mulai.slice(0, 7) ? 'bg-sky-100' : ''}`}
                      >
                        {dayjs(`${m.b}-01`).format('MMMM YYYY')}
                        {m.b >= kantor.mulai.slice(0, 7) && <span className="ml-1 font-normal text-slate-500">(sesudah migrasi)</span>}
                      </th>
                    </React.Fragment>
                  ))}
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
                      <div className="flex items-center gap-1 font-medium text-slate-900">
                        {n.nama}
                        <button
                          type="button"
                          title="Hapus pinjaman ini (salah input)"
                          onClick={() => setBuka({ aksi: 'hapus_pinjaman', nasabah: n })}
                          className="text-slate-300 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500">No. {n.nomor_anggota || '–'}</div>
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap">{dayjs(n.drop_date).format('DD-MM')}</td>
                    <td className="px-2 py-1 text-right">{rb(n.pinjaman)}</td>
                    <td className="px-2 py-1 font-semibold text-center uppercase">{EMBER[n.ember] ?? n.ember}</td>
                    <td className="px-2 py-1 text-right">
                      {/* Pemutihan sebelum migrasi: klik untuk hapus (ternyata salah). */}
                      {n.pemutihan ? (
                        <button
                          type="button"
                          title={`Pemutihan ${dayjs(n.pemutihan.tanggal).format('DD-MM-YYYY')} - klik untuk hapus`}
                          onClick={() => setBuka({ aksi: 'hapus_pemutihan', pemutihan: n.pemutihan, nasabah: n })}
                          className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-white text-red-600 border border-red-500 hover:bg-red-50"
                        >
                          {rb(n.pemutihan.nominal)}
                        </button>
                      ) : (
                        <span className="text-slate-300">·</span>
                      )}
                    </td>
                    {kolom.map((t, i) => {
                      const isi = n.angsuran[t] ?? [];
                      const total = isi.reduce((a, x) => a + x.nominal, 0);
                      const sebelumDrop = t < n.drop_date;
                      const sesudah = t >= kantor.mulai;
                      return (
                        <React.Fragment key={t}>
                        {t === kolomPertamaMigrasi && (
                          <td className="px-2 py-1 font-semibold text-right border-l-2 border-slate-300 bg-amber-50">{rb(n.saldo_awal)}</td>
                        )}
                        {sesudah ? (
                          <td className={`px-2 py-1 text-right bg-sky-50/60 ${t === kolomPertamaMigrasi ? 'border-l-2 border-slate-300' : 'border-l'}`}>
                            {isi.length ? rb(total) : <span className="text-slate-300">·</span>}
                          </td>
                        ) : (
                        <td
                          key={t}
                          className={`p-0 text-right ${
                            i === 0 || kolom[i - 1].slice(0, 7) !== t.slice(0, 7) ? 'border-l-2 border-slate-300' : 'border-l'
                          } ${sebelumDrop ? 'bg-slate-100' : ''}`}
                        >
                          {!sebelumDrop && (
                            <button
                              type="button"
                              onClick={() => klikSel(n, t)}
                              className={`w-full h-full px-2 py-1 text-right hover:bg-sky-100 ${isi.length ? 'text-slate-900' : 'text-slate-300'}`}
                            >
                              {isi.some((x) => x.katrol) && <span className="mr-0.5 text-[9px] font-semibold text-emerald-700">K</span>}
                              {isi.length ? rb(total) : '·'}
                              {isi.length > 1 && <sup className="ml-0.5 text-amber-600">{isi.length}</sup>}
                            </button>
                          )}
                        </td>
                        )}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
                {nasabah.length === 0 && (
                  <tr>
                    <td colSpan={kolom.length + 7} className="py-6 text-center text-slate-500">
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
                    <td className="px-2 py-1.5 text-right">{rb(nasabah.reduce((a, n) => a + (n.pemutihan?.nominal ?? 0), 0))}</td>
                    {kolom.map((t, i) => (
                      <React.Fragment key={t}>
                        {t === kolomPertamaMigrasi && (
                          <td className="px-2 py-1.5 text-right border-l-2 border-slate-300 bg-amber-100">
                            {rb(nasabah.reduce((a, n) => a + n.saldo_awal, 0))}
                          </td>
                        )}
                        <td
                          className={`px-2 py-1.5 text-right ${i === 0 || kolom[i - 1].slice(0, 7) !== t.slice(0, 7) ? 'border-l-2 border-slate-300' : 'border-l'}`}
                        >
                          {rb(jumlahKolom(t))}
                        </td>
                      </React.Fragment>
                    ))}
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
        filter={filter}
        mulai={kantor.mulai}
      />
    </>
  );
};

export default KoreksiBeku;
