import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { ArrowLeft, History, Loader2, Plane, Receipt, Trash2 } from 'lucide-react';
import { Label } from '@/shadcn/ui/label';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { rp as rupiah } from '@/lib/rupiah';

dayjs.locale('id');


export default function GoroUmrah({
  unit,
  wilayah,
  tahun = 'semua',
  tahun_ada = [],
  total = 0,
  total_tampil = 0,
  can_manage = false,
  setoran = [],
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pilihanTahun = [...new Set(tahun_ada.map(Number))].sort((a, b) => b - a);
  const isSemua = tahun === 'semua' || !tahun;

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    router.delete(route('dashboard.kasir.umrah.destroy', confirmDeleteId), {
      preserveScroll: true,
      onFinish: () => {
        setIsDeleting(false);
        setConfirmDeleteId(null);
      },
    });
  };

  return (
    <>
      <Head title="Tabungan Goro Umrah" />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        {/* Navigasi & Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href={route('dashboard.kasir')}
              className="inline-flex items-center gap-1.5 mb-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard Kasir
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Tabungan Goro Umrah</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Semua riwayat setoran tabungan goro umrah kantor yang sedang dipilih.
            </p>
          </div>
          <div className="flex w-full flex-col gap-1.5 sm:w-fit">
            <Label htmlFor="umrah-tahun" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Filter Tahun
            </Label>
            <select
              id="umrah-tahun"
              value={tahun}
              onChange={(e) => {
                const val = e.target.value;
                router.get(
                  route('dashboard.kasir.goro_umrah'),
                  val === 'semua' ? {} : { tahun: val },
                  { preserveScroll: true, preserveState: true }
                );
              }}
              className="w-full sm:w-40 h-9 px-3 text-sm border rounded-md border-input bg-background focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="semua">Semua Tahun</option>
              {pilihanTahun.map((t) => (
                <option key={t} value={t}>
                  Tahun {t}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Card Info Kantor Aktif */}
        <section className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-950">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
              <Plane className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">{unit}</h2>
              </div>
              {wilayah && <p className="mt-0.5 text-sm text-muted-foreground">Wilayah {wilayah}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:min-w-64">
            <span className="text-xs text-muted-foreground">
              {isSemua ? 'Total Riwayat' : `Masuk Tahun ${tahun}`}
            </span>
            <span className="text-xs text-muted-foreground">Total Akumulasi</span>
            <strong className="text-sm tabular-nums text-teal-800 dark:text-teal-400">
              Rp {rupiah(total_tampil)}
            </strong>
            <strong className="text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
              Rp {rupiah(total)}
            </strong>
          </div>
        </section>

        {/* Section Tabel Riwayat */}
        <section className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                <History className="h-4 w-4 text-zinc-500" />
                Riwayat Setoran
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {unit}
                {wilayah ? ` · Wilayah ${wilayah}` : ''} {isSemua ? '· Semua Periode' : `· Tahun ${tahun}`}
              </p>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {setoran.length} transaksi
            </span>
          </div>

          {setoran.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              <History className="mx-auto mb-2 h-7 w-7 text-zinc-300" />
              Belum ada riwayat setoran{isSemua ? '' : ` di tahun ${tahun}`}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="border-b bg-slate-50 text-xs font-semibold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                  <tr>
                    <th className="w-12 px-3 py-3 text-center">#</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                    <th className="px-4 py-3 text-left">Catatan</th>
                    <th className="px-4 py-3 text-left">Dicatat oleh</th>
                    <th className="px-4 py-3 text-center">Bukti Transfer</th>
                    {can_manage && <th className="w-16 px-4 py-3 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {setoran.map((s, index) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-3 py-3 text-center text-xs text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-700 dark:text-zinc-300 font-medium">
                        {dayjs(s.tanggal).format('DD MMMM YYYY')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-right tabular-nums text-zinc-900 dark:text-zinc-100">
                        Rp {rupiah(s.nominal)}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {s.catatan || '—'}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {s.oleh || '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {s.bukti ? (
                          <a
                            href={s.bukti}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 hover:underline dark:text-sky-400"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Lihat bukti
                          </a>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      {can_manage && (
                        <td className="px-4 py-3 text-right">
                          {s.can_delete ? (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              title="Hapus setoran ini"
                              onClick={() => setConfirmDeleteId(s.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Terkunci
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 bg-slate-50 font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-left">
                      Total {isSemua ? 'Semua Riwayat' : `Tahun ${tahun}`}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-teal-800 dark:text-teal-400">
                      Rp {rupiah(total_tampil)}
                    </td>
                    <td colSpan={can_manage ? 4 : 3} className="px-4 py-3 text-xs text-muted-foreground font-normal">
                      {setoran.length} transaksi setoran
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Dialog Konfirmasi Hapus Setoran */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && !isDeleting && setConfirmDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Setoran Goro Umrah?</DialogTitle>
            <DialogDescription>
              Data setoran dan file bukti transfer akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setConfirmDeleteId(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
