import Authenticated from '@/Layouts/AuthenticatedLayout';
import BadgeKoreksiBeku from '@/Components/BadgeKoreksiBeku';
import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion';
import { CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Layers } from 'lucide-react';
import BannerHariTerbuka from '@/Pages/Kasir/Rekap/Components/BannerHariTerbuka';

const rb = (n) => (n === null || n === undefined ? '—' : new Intl.NumberFormat('id-ID').format(Math.round((Number(n) || 0) / 1000)));
const EMBER = [
  ['month1', 'Month 1'],
  ['month2', 'Month 2'],
  ['ccm', 'CCM'],
  ['cm', 'CM'],
  ['mb', 'MB'],
  ['ml', 'ML'],
];
const ANGKA = ['awal_total', 'drop', 'storting', 'pemutihan', 'mutasi_masuk', 'mutasi_keluar', 'akhir_total', 'hari_kerja', 'hari_terkunci'];

// Rumus sirkulasi: awal + drop x 1,3 - storting - pemutihan + mutasi = akhir.
// Penyesuaian saldo (saldo masuk) sudah terbawa di saldo awal, tidak ditambah lagi.
const hitungAkhir = (d) =>
  d.awal_total + Math.round(d.drop * 1.3) - d.storting - d.pemutihan + d.mutasi_masuk - d.mutasi_keluar;

const Kartu = ({ judul, utama, bawah, nada = 'netral' }) => (
  <div
    className={`rounded-lg border p-3 ${
      { netral: 'border-slate-200 bg-white', baik: 'border-emerald-200 bg-emerald-50/60', ingat: 'border-amber-300 bg-amber-50/70', salah: 'border-rose-300 bg-rose-50' }[nada]
    }`}
  >
    <div className="text-xs font-medium tracking-wide uppercase text-slate-500">{judul}</div>
    <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{utama}</div>
    {bawah && <div className="mt-0.5 text-xs text-slate-500">{bawah}</div>}
  </div>
);

// Selisih kecil (pembulatan 1,3) ditoleransi < 1.000.
const Cek = ({ hitung, nyata }) => {
  if (nyata === null || nyata === undefined) return <span className="text-slate-400">—</span>;
  const selisih = nyata - hitung;
  return Math.abs(selisih) < 1000 ? (
    <CheckCircle className="inline w-4 h-4 text-emerald-500" aria-label="cocok" />
  ) : (
    <span className="font-semibold text-rose-700" title={`Selisih ${new Intl.NumberFormat('id-ID').format(selisih)}`}>
      {selisih > 0 ? '+' : ''}
      {rb(selisih)}
    </span>
  );
};

const SelAngka = ({ d }) => (
  <>
    <td className="px-3 py-1.5 text-center">
      <span className={d.hari_terkunci >= d.hari_kerja && d.hari_kerja > 0 ? 'text-emerald-700' : 'text-amber-700'}>
        {d.hari_terkunci}/{d.hari_kerja}
      </span>
    </td>
    <td className="px-3 py-1.5 text-right">{rb(d.awal_total)}</td>
    <td className="px-3 py-1.5 text-right">{rb(Math.round(d.drop * 1.3))}</td>
    <td className="px-3 py-1.5 text-right">{rb(d.storting)}</td>
    <td className="px-3 py-1.5 text-right">{rb(d.pemutihan)}</td>
    <td className="px-3 py-1.5 text-right">{rb(d.mutasi_masuk - d.mutasi_keluar)}</td>
    <td className="px-3 py-1.5 text-right font-semibold">{rb(d.akhir_total)}</td>
    <td className="px-3 py-1.5 text-center">
      <Cek hitung={hitungAkhir(d)} nyata={d.akhir_total} />
    </td>
    <td className="px-3 py-1.5 text-center">
      <Cek hitung={d.akhir_total} nyata={d.awal_depan} />
    </td>
  </>
);

/**
 * Closing Bulanan = LAPORAN pemeriksaan bulan (mas 2026-10-10). Angka
 * tersusun otomatis tiap tutup harian; tanda tangan bulanan dilakukan sekali
 * per buku lewat Tutup Buku Storting (buku storting), bukan di sini. Tombol
 * ACC / Kunci / Buka bulanan dicabut.
 */
const Bulanan = ({ datas = [], server_filter }) => {
  const pindah = (periode) => router.get(route('closing.bulanan.index'), { periode }, { preserveScroll: true });
  const [buka, setBuka] = useState({});

  // Ringkasan per kelompok (6 hari tagih digabung); awal_depan null kalau ada hari yang belum punya baris.
  const perKelompok = useMemo(() => {
    const g = {};
    datas.forEach((d) => {
      const k = (g[d.kelompok] ??= { kelompok: d.kelompok, baris: [], awal_depan: 0, ditutup: 0 });
      k.baris.push(d);
      ANGKA.forEach((a) => (k[a] = (k[a] ?? 0) + (Number(d[a]) || 0)));
      k.awal_depan = k.awal_depan === null || d.awal_depan === null ? null : k.awal_depan + d.awal_depan;
      if (d.terkunci) k.ditutup++;
    });
    return Object.values(g);
  }, [datas]);

  const ditutup = datas.filter((d) => d.terkunci).length;
  const belumLengkap = datas.filter((d) => !d.lengkap).length;
  const meleset = datas.filter((d) => Math.abs(d.akhir_total - hitungAkhir(d)) >= 1000).length;
  const putus = datas.filter((d) => d.awal_depan !== null && Math.abs(d.awal_depan - d.akhir_total) >= 1000).length;
  const emberTotal = (awalan) =>
    Object.fromEntries(EMBER.map(([k]) => [k, datas.reduce((a, d) => a + (d[awalan]?.[k] ?? 0), 0)]));
  const emberAwal = emberTotal('awal');
  const emberAkhir = emberTotal('akhir');

  return (
    <Authenticated>
      <Head title="Closing Bulanan" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-900">
              Closing Bulanan — {server_filter?.unit}
              <BadgeKoreksiBeku jumlah={server_filter?.koreksi_beku} />
            </h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Laporan pemeriksaan bulan. Angka tersusun otomatis tiap hari dikunci; tanda tangan dilakukan sekali per buku
              lewat <b>Tutup Buku Storting</b>. Angka dalam ribuan.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => pindah(server_filter?.sebelumnya)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[9rem] text-center text-sm font-medium">{server_filter?.nama_periode}</div>
            <Button variant="outline" size="icon" onClick={() => pindah(server_filter?.berikutnya)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!server_filter?.sudah_migrasi && (
          <div className="p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
            Kantor ini belum memakai alur agregasi baru, jadi belum ada closing bulanan.
          </div>
        )}

        <BannerHariTerbuka hari={server_filter?.hari_terbuka ?? []} />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kartu
            judul="Buku ditutup"
            utama={`${ditutup}/${datas.length}`}
            bawah="kelompok × hari tagih"
            nada={datas.length > 0 && ditutup === datas.length ? 'baik' : 'netral'}
          />
          <Kartu judul="Belum lengkap" utama={belumLengkap} bawah="masih ada hari belum terkunci" nada={belumLengkap ? 'ingat' : 'baik'} />
          <Kartu judul="Rumus meleset" utama={meleset} bawah="awal + drop×1,3 − storting − pemutihan ≠ akhir" nada={meleset ? 'salah' : 'baik'} />
          <Kartu judul="Sambungan putus" utama={putus} bawah="akhir ≠ awal bulan depan" nada={putus ? 'salah' : 'baik'} />
        </div>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-xs tabular-nums">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-medium text-left">Kelompok</th>
                <th className="px-3 py-2 font-medium text-center">Hari terkunci</th>
                <th className="px-3 py-2 font-medium text-right">Awal</th>
                <th className="px-3 py-2 font-medium text-right">Drop ×1,3</th>
                <th className="px-3 py-2 font-medium text-right">Storting</th>
                <th className="px-3 py-2 font-medium text-right">Pemutihan</th>
                <th className="px-3 py-2 font-medium text-right">Mutasi</th>
                <th className="px-3 py-2 font-medium text-right">Akhir</th>
                <th className="px-3 py-2 font-medium text-center">Cek rumus</th>
                <th className="px-3 py-2 font-medium text-center">Awal bln depan</th>
                <th className="px-3 py-2 font-medium text-center">Tutup Buku</th>
              </tr>
            </thead>
            <tbody>
              {perKelompok.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-500">
                    Belum ada baris bulanan untuk periode ini.
                  </td>
                </tr>
              )}
              {perKelompok.map((k) => (
                <React.Fragment key={k.kelompok}>
                  <tr className="border-t cursor-pointer hover:bg-sky-50" onClick={() => setBuka((b) => ({ ...b, [k.kelompok]: !b[k.kelompok] }))}>
                    <td className="px-3 py-1.5 font-semibold text-sky-700">
                      {buka[k.kelompok] ? <ChevronUp className="inline w-3.5 h-3.5" /> : <ChevronDown className="inline w-3.5 h-3.5" />}{' '}
                      {k.kelompok}
                    </td>
                    <SelAngka d={k} />
                    <td className={`px-3 py-1.5 text-center ${k.ditutup === k.baris.length ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {k.ditutup}/{k.baris.length}
                    </td>
                  </tr>
                  {buka[k.kelompok] &&
                    k.baris.map((d) => (
                      <tr key={d.id} className="border-t bg-slate-50 text-slate-700">
                        <td className="px-3 py-1 pl-8 capitalize">
                          {d.hari}
                          {d.diperbarui_at && (
                            <span title={d.diperbarui_alasan ?? ''} className="ml-1 rounded bg-sky-100 px-1 text-[10px] text-sky-800">
                              diperbarui
                            </span>
                          )}
                        </td>
                        <SelAngka d={d} />
                        <td className="px-3 py-1 text-center">
                          {d.terkunci ? (
                            <span className="text-emerald-700" title={d.kasir_lock_at ?? ''}>
                              ✓ {d.kasir_nama ?? ''}
                            </span>
                          ) : (
                            <span className="text-slate-400" title={d.halangan.join(' ')}>
                              belum
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <Accordion type="single" collapsible className="overflow-hidden bg-white border rounded-lg">
          <AccordionItem value="ember" className="border-b-0">
            <AccordionTrigger className="px-4 py-3 bg-slate-50 hover:bg-slate-100 hover:no-underline data-[state=open]:border-b">
              <span className="flex items-center gap-3 font-semibold text-slate-900">
                <Layers className="w-5 h-5 text-sky-600" /> Rincian per ember (kantor)
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <table className="w-full text-xs tabular-nums">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 font-medium text-left">Ember</th>
                    <th className="px-3 py-2 font-medium text-right">Awal</th>
                    <th className="px-3 py-2 font-medium text-right">Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {EMBER.map(([k, label]) => (
                    <tr key={k} className="border-t even:bg-slate-50">
                      <td className="px-3 py-1.5 font-medium">{label}</td>
                      <td className="px-3 py-1.5 text-right">{rb(emberAwal[k])}</td>
                      <td className="px-3 py-1.5 text-right">{rb(emberAkhir[k])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="max-w-3xl text-xs text-slate-500">
          <b>Cek rumus</b> merah = saldo akhir tidak sama dengan awal + drop×1,3 − storting − pemutihan + mutasi; angkanya
          selisihnya. <b>Awal bln depan</b> merah = rantai ke bulan depan putus. Keduanya tanda ada data yang berubah tanpa
          dihitung ulang. Klik kelompok untuk rincian per hari tagih.
        </p>
      </div>
    </Authenticated>
  );
};

export default Bulanan;
