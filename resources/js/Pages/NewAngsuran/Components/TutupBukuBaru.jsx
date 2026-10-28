import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useFilterAngsuran } from '../FilterAngsuran';
import dayjs from 'dayjs';
import { Lock } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { angka, useModeRibuan } from '@/lib/modeAngka';
import SatuanAngka from '@/Components/SatuanAngka';

const rb = (n) => angka(n, { bulat: true });
const EMBER = [
  ['month1', 'Month 1'],
  ['month2', 'Month 2'],
  ['ccm', 'CCM'],
  ['cm', 'CM'],
  ['mb', 'MB'],
  ['ml', 'ML'],
];
const jumlah = (o) => Object.values(o ?? {}).reduce((a, n) => a + (Number(n) || 0), 0);

/**
 * Tutup Buku Storting kantor migrasi: angka dari baris bulanan buku ini
 * (props.tutup_buku, PinjamanTrait::getLoan) - awal & akhir per ember, lalu
 * awal bulan depan (ember naik satu tingkat). Tutup = tanda tangan sekali
 * (closing.bulanan.tutup_buku); sesudahnya tombol di buku hilang.
 */
const TutupBukuBaru = ({ tb, month, show, onClosed }) => {
  useModeRibuan();
  const [proses, setProses] = useState(false);
  const sf = useFilterAngsuran() ?? {};
  const bulan = dayjs(month);
  const namaBulan = (d) => d.toDate().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  // Angka baru dihitung ulang saat hari dikunci: selama ada hari terbuka angkanya bisa basi,
  // jadi tabel & kotak jumlah disembunyikan (mas 2026-10-28).
  const lengkap = !!tb.ditutup_at || (tb.hari_kerja > 0 && tb.hari_terkunci >= tb.hari_kerja);

  const tutup = () =>
    router.post(route('closing.bulanan.tutup_buku', tb.id), {}, {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => setProses(false),
      onSuccess: () => onClosed(),
    });

  return (
    <Sheet open={show} onOpenChange={(o) => !o && !proses && onClosed()}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="px-5 py-4 pr-12 border-b">
          <SheetTitle>Tutup Buku Storting — {namaBulan(bulan)}</SheetTitle>
          <SheetDescription>
            Saldo per ember awal & akhir bulan, lalu saldo awal bulan depan (ember naik satu tingkat). Semua angka hasil
            hitung otomatis. <SatuanAngka />
          </SheetDescription>
        </SheetHeader>

        <div className="px-5 py-4 space-y-4">
          {lengkap && (
          <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm tabular-nums">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-medium text-left">Ember</th>
                  <th className="px-3 py-2 font-medium text-right">Awal {bulan.format('MMM')}</th>
                  <th className="px-3 py-2 font-medium text-right">Akhir {bulan.format('MMM')}</th>
                  <th className="px-3 py-2 font-medium text-right bg-emerald-50">
                    Awal {bulan.add(1, 'month').format('MMM')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {EMBER.map(([k, label]) => (
                  <tr key={k} className="border-t even:bg-slate-50">
                    <td className="px-3 py-1.5 font-medium">{label}</td>
                    <td className="px-3 py-1.5 text-right">{rb(tb.awal?.[k])}</td>
                    <td className="px-3 py-1.5 text-right">{rb(tb.akhir?.[k])}</td>
                    <td className="px-3 py-1.5 text-right bg-emerald-50">{tb.depan ? rb(tb.depan[k]) : '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-bold border-t-2 bg-slate-100">
                <tr>
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2 text-right">{rb(tb.awal_total)}</td>
                  <td className="px-3 py-2 text-right">{rb(tb.akhir_total)}</td>
                  <td className="px-3 py-2 text-right bg-emerald-100">{tb.depan ? rb(jumlah(tb.depan)) : '—'}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {[
              ['Drop', tb.drop],
              ['Storting', tb.storting],
              ['Pemutihan', tb.pemutihan],
            ].map(([l, n]) => (
              <div key={l} className="p-2 border rounded-md">
                <div className="text-xs text-slate-500">{l}</div>
                <div className="font-semibold tabular-nums">{rb(n)}</div>
              </div>
            ))}
            <div className="p-2 border rounded-md">
              <div className="text-xs text-slate-500">Hari terkunci</div>
              <div className="font-semibold tabular-nums">
                {tb.hari_terkunci} / {tb.hari_kerja}
              </div>
            </div>
          </div>
          </>
          )}

          {tb.ditutup_at ? (
            <div className="p-3 text-sm border rounded-lg border-emerald-300 bg-emerald-50 text-emerald-900">
              Sudah ditutup {tb.ditutup_oleh ? `oleh ${tb.ditutup_oleh} ` : ''}
              {dayjs(tb.ditutup_at).format('DD-MM-YYYY HH:mm')}.
            </div>
          ) : !lengkap ? (
            <div className="p-3 space-y-2 text-sm border rounded-lg border-rose-300 bg-rose-50 text-rose-800">
              <div className="font-semibold">Buku belum bisa ditutup, dikarenakan ada hari yang belum terkunci di bulan ini:</div>
              <ul className="pl-5 list-disc">
                {(tb.hari_terbuka ?? []).map((d) => (
                  <li key={d}>
                    {/* Ke Rekap 1 tanggal itu untuk dikunci. */}
                    <Link
                      href={route('kasir.rekap.rekap_satu', {
                        date: d,
                        ...(sf.branch_id ? { branch_id: sf.branch_id } : {}),
                        ...(sf.wilayah ? { wilayah: sf.wilayah } : {}),
                      })}
                      className="font-medium underline hover:text-rose-900"
                    >
                      {dayjs(d).toDate().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </Link>
                  </li>
                ))}
              </ul>
              <div>Mohon kunci hari terlebih dahulu sebelum melakukan tutup buku.</div>
            </div>
          ) : tb.halangan?.length ? (
            <div className="p-3 text-sm border rounded-lg border-rose-300 bg-rose-50 text-rose-800">
              Belum bisa ditutup: {tb.halangan.join(' ')}
            </div>
          ) : null}

          <div className="flex justify-between gap-2">
            <Button variant="outline" disabled={proses} onClick={onClosed}>
              Batal
            </Button>
            {!tb.ditutup_at && (
              <Button disabled={proses || tb.halangan?.length > 0} onClick={tutup}>
                <Lock className="w-4 h-4" />
                {proses ? 'Menutup…' : 'Ya, tutup buku'}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TutupBukuBaru;
