import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { BookOpen, UserPlus } from 'lucide-react';
import FilterBar from '@/Components/FilterBar';
import SatuanAngka from '@/Components/SatuanAngka';
import { Button } from '@/shadcn/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import AngsuranTable from '@/Pages/NewAngsuran/Components/AngsuranTable';
import BukuStorting from '@/Pages/NewAngsuran/Components/BukuStorting';
import FastCreateV2 from '@/Pages/BukuTransaksi/Web/FastCreateV2';
import { FilterAngsuranContext } from '@/Pages/NewAngsuran/FilterAngsuran';

const bulanPanjang = (m) => dayjs(`${m}-01`).toDate().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
const TIPE = { 0: 'normal', 1: 'n1', 2: 'ccm', 3: 'cm', 4: 'mb' };
const tipeDi = (drop, lihat) => {
  const n = dayjs(lihat).startOf('month').diff(dayjs(drop).startOf('month'), 'month');
  return n > 4 ? 'ml' : TIPE[n] ?? 'normal';
};

/**
 * Sisa awal bulan depan dari Buku Storting satu bulan - rumus yang sama dengan
 * BukuStorting + ApprovalAkhir (ML = sirkulasi ML tersimpan, ember bergeser satu tingkat).
 */
const awalDepan = ({ datas, dateOfWeek, sirkulasi }) => {
  const saldo = {};
  let total = 0;
  datas.forEach((g) => {
    const awal = g.type === 'ml' ? Number(sirkulasi?.ml_amount ?? 0) : g.data.reduce((t, r) => t + Number(r.saldo_sebelumnya || 0), 0);
    const angs = g.data.reduce((t, r) => t + dateOfWeek.reduce((u, d) => u + Number(r.instalment?.[d]?.total_nominal ?? 0), 0), 0);
    const md = g.data.reduce((t, r) => t + Number(r.pemutihanThisMonth || 0), 0);
    saldo[g.type] = awal - angs - md;
    total += awal - angs - md;
  });
  return { amount: total, ml_amount: (saldo.ml ?? 0) + (saldo.mb ?? 0), mb_amount: saldo.cm ?? 0, cm_amount: saldo.ccm ?? 0 };
};

/**
 * Baris buku lebar: semua nasabah bulan terpilih, ditambah nasabah yang hanya ada di
 * bulan-bulan lalu yang dibuka (mis. drop Juni yang sudah lunas sebelum November).
 * Dikelompokkan per bulan drop. Nasabah tambahan dihitung ulang untuk blok bulan terpilih.
 */
const gabungBaris = (bulan) => {
  const ini = bulan[bulan.length - 1];
  const awalIni = `${ini.month}-01`;
  const baris = new Map();
  ini.datas.forEach((g) => g.data.forEach((r) => baris.set(r.id, { ...r, _tipe: g.type })));
  // Dari bulan terbaru ke terlama: versi terbaru tiap pinjaman yang dipakai.
  [...bulan].reverse().slice(1).forEach((b) =>
    b.datas.forEach((g) =>
      g.data.forEach((r) => {
        if (baris.has(r.id)) return;
        const tgl = Object.entries(r.instalment ?? {});
        const angsIni = tgl.reduce((t, [d, x]) => (d.startsWith(ini.month) ? t + Number(x.total_nominal || 0) : t), 0);
        const sesudah = tgl.reduce((t, [d, x]) => (d >= `${b.month}-32` && d < awalIni ? t + Number(x.total_nominal || 0) : t), 0);
        const perBulan = {};
        tgl.forEach(([d, x]) => d < awalIni && (perBulan[d.slice(0, 7)] = (perBulan[d.slice(0, 7)] ?? 0) + Number(x.total_nominal || 0)));
        const sisa = Number(r.saldo || 0) - sesudah;
        baris.set(r.id, {
          ...r,
          per_bulan: perBulan,
          saldo_sebelumnya: sisa,
          angsuran: angsIni,
          pemutihanThisMonth: 0,
          saldo: sisa - angsIni,
          lunas: !r.pecahan_ml && sisa - angsIni <= 0,
          _tipe: tipeDi(r.tanggal_drop, awalIni),
        });
      }),
    ),
  );
  // Drop sejak MB bulan paling lama (4 bulan sebelumnya) tampil penuh per bulan drop;
  // yang lebih tua jadi satu grup ML (hanya yang ada angsuran / MD di bulan terbuka).
  const batas = dayjs(`${bulan[0].month}-01`).subtract(4, 'month').format('YYYY-MM');
  const grup = {};
  baris.forEach((r) => {
    const m = String(r.tanggal_drop).slice(0, 7);
    const k = m < batas ? '0000-ML' : m;
    (grup[k] ??= k === '0000-ML' ? { month: 'ML', date: null, type: 'ml', data: [] } : { month: bulanPanjang(m), date: `${m}-01`, type: r._tipe, data: [] }).data.push(r);
  });
  return Object.keys(grup).sort().map((k) => grup[k]);
};

/**
 * Perbaikan Angsuran (mas 2026-11-10): buku angsuran lebar untuk kantor yang belum
 * migrasi. Tombol < membuka bulan sebelumnya (dimuat server = /pinjaman bulan itu);
 * sel tanggal diisi langsung. Buku Storting per bulan bertumpuk, tutup buku alur lama.
 */
export default function PerbaikanAngsuran({ server_filter, bulan, mundur, maks_mundur, sudah_migrasi }) {
  const [storting, setStorting] = useState(false);
  // Fastcreate di sheet: simpan -> redirect back ke halaman ini, buku dimuat ulang.
  const [fastcreate, setFastcreate] = useState(false);
  // Klik angka storting: tutup sheet, sorot + geser ke kolom tanggal itu di buku lebar.
  // Di-null-kan dulu supaya klik tanggal yang sama tetap menggeser lagi.
  const [sorot, setSorot] = useState(null);
  const keTanggal = (d) => {
    setStorting(false);
    setSorot(null);
    requestAnimationFrame(() => setSorot(dayjs(d).format('YYYY-MM-DD')));
  };
  const ini = bulan[bulan.length - 1];
  const datas = useMemo(() => gabungBaris(bulan), [bulan]);

  // Bulan yang sisa awal bulan depannya (tersimpan) tidak sama dengan hasil hitung sekarang.
  const beda = bulan.slice(0, -1).map((b, i) => {
    const hitung = awalDepan(b);
    const simpan = bulan[i + 1].sirkulasi;
    const kolom = ['amount', 'cm_amount', 'mb_amount', 'ml_amount'];
    return !simpan || kolom.some((c) => Number(simpan[c] ?? 0) !== hitung[c]);
  });

  const keMundur = (n) =>
    router.get(
      route('perbaikan_angsuran.index'),
      { ...Object.fromEntries(new URLSearchParams(window.location.search)), mundur: n },
      { preserveScroll: true, preserveState: true },
    );

  return (
    <>
      <Head title="Perbaikan Angsuran" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Perbaikan Angsuran</h1>
          <p className="text-xs text-muted-foreground">
            Buku angsuran lebar untuk kantor yang belum migrasi. Klik sel tanggal, ketik, Enter (0 = hapus). <SatuanAngka />
          </p>
        </div>
      </div>
      <div className="mb-3">
        <FilterBar
          urlLink={route('perbaikan_angsuran.index')}
          storageKey="perbaikan_angsuran"
          showHari
          showMonth
          showKelompok={server_filter.userAuthorized?.canShowKelompok}
        />
      </div>

      {sudah_migrasi ? (
        <div className="p-3 text-sm border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
          Kantor ini sudah migrasi. Perbaikan angsuran lewat menu Buku Angsuran Beku.
        </div>
      ) : (
        <>
          {beda.some(Boolean) && (
            <div className="p-3 mb-3 text-sm border rounded-lg border-rose-300 bg-rose-50 text-rose-800">
              <b>Perlu tutup buku ulang</b> (urut dari yang paling lama):{' '}
              {bulan
                .slice(0, -1)
                .filter((_, i) => beda[i])
                .map((b) => bulanPanjang(b.month))
                .join(', ')}
              . Sisa awal bulan berikutnya belum sama dengan hasil hitung sekarang - buka Buku Storting lalu Tutup Buku.
            </div>
          )}
          <div className="sticky z-30 flex items-center justify-end h-12 gap-2 bg-white top-14">
            <Button type="button" variant="outline" onClick={() => setFastcreate(true)} className="gap-1 font-semibold">
              <UserPlus className="w-4 h-4" />
              Fastcreate
            </Button>
            <Button type="button" onClick={() => setStorting(true)} className="gap-1 font-semibold text-white shadow-sm bg-sky-600 hover:bg-sky-700">
              <BookOpen className="w-4 h-4" />
              Buku Storting
            </Button>
          </div>
          <AngsuranTable
            dateOfWeek={ini.dateOfWeek}
            datas={datas}
            selRute="perbaikan_angsuran.sel"
            mundur={mundur}
            onMundur={keMundur}
            maksMundur={maks_mundur}
            sorot={sorot}
            atasKepala="top-[6.5rem]"
          />

          <Sheet open={fastcreate} onOpenChange={setFastcreate}>
            <SheetContent side="right" className="flex flex-col w-full p-0 sm:max-w-5xl lg:max-w-none">
              <SheetHeader className="px-5 py-4 border-b pr-14 shrink-0">
                <SheetTitle>Fastcreate</SheetTitle>
                <SheetDescription>Sesudah disimpan, buku angsuran di halaman ini dimuat ulang.</SheetDescription>
              </SheetHeader>
              <div className="relative flex-1 min-h-0 p-4 overflow-auto scrollbar-thin">
                <FastCreateV2 bulanAwal={ini.month} kelompokAwal={server_filter.kelompok} />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={storting} onOpenChange={setStorting}>
            <SheetContent side="right" className="flex flex-col w-full p-0 sm:max-w-5xl lg:max-w-none">
              <SheetHeader className="px-5 py-4 border-b pr-14 shrink-0">
                <SheetTitle>Buku Storting</SheetTitle>
                <SheetDescription>
                  Kelompok {server_filter.kelompok} · {server_filter.hari} · {bulanPanjang(bulan[0].month)} s/d {bulanPanjang(ini.month)}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 min-h-0 p-3 space-y-4 overflow-auto divide-y scrollbar-thin">
                {bulan.map((b, i) => (
                  <section key={b.month} className="pt-4 first:pt-0">
                    <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      {bulanPanjang(b.month)}
                      {beda[i] && <span className="px-2 py-0.5 text-[11px] rounded-full bg-rose-100 text-rose-700">Perlu tutup buku ulang</span>}
                    </h3>
                    <FilterAngsuranContext.Provider value={{ ...server_filter, month: b.month }}>
                      <BukuStorting dateOfWeek={b.dateOfWeek} datas={b.datas} sirkulasi={b.sirkulasi} tutupBuku={null} pas onKlikTanggal={keTanggal} />
                    </FilterAngsuranContext.Provider>
                  </section>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  );
}
