import { Head, router, usePage } from '@inertiajs/react';
import { History, MapPin, PiggyBank, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

const rupiah = (value) => new Intl.NumberFormat('id-ID').format(Number(value) || 0);

const dateLabel = (value) =>
  value ? new Date(`${value}T00:00:00`).toLocaleDateString('id-ID') : '—';

const periodLabel = (value) =>
  new Date(`${value}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

const statusLabels = {
  lunas: { text: 'Lunas', color: 'bg-emerald-500' },
  kurang: { text: 'Kurang', color: 'bg-amber-500' },
  belum: { text: 'Belum', color: 'bg-rose-500' },
  grace_period: { text: 'Masa tenggang', color: 'bg-sky-400' },
  masa_tenggang: { text: 'Masa tenggang', color: 'bg-sky-400' },
  tutup: { text: 'Tutup', color: 'bg-zinc-300' },
};

function Status({ row }) {
  const status = statusLabels[row.status] ?? statusLabels.belum;

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
      <span className={`h-2 w-2 rounded-full ${status.color}`} />
      {status.text}
    </span>
  );
}

export default function OfficeContributionPage({
  period,
  datas = [],
  title,
  routePrefix,
  historyRouteName,
  destroyRouteName,
}) {
  const { errors = {} } = usePage().props;
  const branch = datas[0] ?? null;
  const branchId = branch?.branch_id ?? null;
  const [history, setHistory] = useState({ loading: true, contributions: [], can_delete: false, error: null });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const historyVersion = branch
    ? `${branch.branch_id}|${branch.amount_paid}|${branch.total_akumulasi}|${branch.payment_date}`
    : '';

  useEffect(() => {
    if (!branchId) {
      setHistory({ loading: false, contributions: [], can_delete: false, error: null });
      return undefined;
    }

    const controller = new AbortController();
    setHistory((current) => ({ ...current, loading: true, error: null }));

    fetch(route(historyRouteName, { branch: branchId }), {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            response.status === 403
              ? 'Anda tidak memiliki akses ke kantor ini.'
              : `Gagal memuat riwayat (HTTP ${response.status}).`,
          );
        }

        return response.json();
      })
      .then((data) => setHistory({ loading: false, ...data, error: null }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setHistory((current) => ({ ...current, loading: false, error: error.message }));
        }
      });

    return () => controller.abort();
  }, [branchId, historyRouteName, historyVersion]);

  const deleteContribution = () => {
    if (!confirmDeleteId) return;

    setDeleting(true);
    router.delete(route(destroyRouteName, confirmDeleteId), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => setConfirmDeleteId(null),
      onFinish: () => setDeleting(false),
    });
  };

  return (
    <AuthenticatedLayout header={title}>
      <Head title={title} />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {branch ? 'Riwayat iuran kantor yang sedang dipilih.' : 'Pilih kantor melalui filter global.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1.5 sm:w-fit">
            <Label htmlFor={`${routePrefix}-period`} className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Periode
            </Label>
            <Input
              id={`${routePrefix}-period`}
              type="month"
              value={period}
              onChange={(event) =>
                router.get(
                  route(`${routePrefix}.contributions`),
                  { period: event.target.value },
                  { preserveState: true, preserveScroll: true, replace: true },
                )
              }
              className="w-full sm:w-44"
            />
          </div>
        </header>

        {Object.keys(errors).length > 0 && (
          <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {Object.values(errors).map((error, index) => <p key={`${index}-${error}`}>{error}</p>)}
          </div>
        )}

        {!branch ? (
          <section className="rounded-xl border bg-white px-4 py-12 text-center shadow-sm dark:bg-zinc-950">
            <MapPin className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
            <p className="font-medium text-zinc-700 dark:text-zinc-300">Kantor aktif tidak tersedia untuk akun ini.</p>
          </section>
        ) : (
          <>
            <section className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-950">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">{branch.unit}</h2>
                    <Status row={branch} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">Wilayah {branch.wilayah}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:min-w-64">
                <span className="text-xs text-muted-foreground">Masuk {periodLabel(period)}</span>
                <span className="text-xs text-muted-foreground">Total akumulasi</span>
                <strong className="text-sm tabular-nums">Rp {rupiah(branch.amount_paid)}</strong>
                <strong className="text-sm tabular-nums">Rp {rupiah(branch.total_akumulasi)}</strong>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                    <History className="h-4 w-4 text-zinc-500" />
                    Riwayat Iuran
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{branch.unit} · Wilayah {branch.wilayah}</p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {history.loading ? 'Memuat…' : `${history.contributions.length} transaksi`}
                </span>
              </div>

              {history.loading ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">Memuat riwayat iuran…</p>
              ) : history.error ? (
                <p role="alert" className="px-4 py-10 text-center text-sm text-rose-700">{history.error}</p>
              ) : history.contributions.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">Belum ada riwayat iuran untuk kantor ini.</p>
              ) : (
                <div className="max-h-[520px] overflow-x-auto overflow-y-auto">
                  <table className="w-full min-w-[580px] text-sm">
                    <thead className="sticky top-0 z-10 border-b bg-slate-50 text-xs font-semibold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                      <tr>
                        <th className="w-12 px-3 py-2.5 text-center font-semibold">No</th>
                        <th className="px-3.5 py-2.5 text-left font-semibold">Periode</th>
                        <th className="px-3.5 py-2.5 text-left font-semibold">Tanggal bayar</th>
                        <th className="px-3.5 py-2.5 text-right font-semibold">Nominal</th>
                        <th className="px-3.5 py-2.5 text-left font-semibold">Keterangan</th>
                        <th className="px-3.5 py-2.5 text-left font-semibold">Dicatat oleh</th>
                        {history.can_delete && <th className="w-16 px-3 py-2.5 text-right font-semibold">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {history.contributions.map((item, index) => (
                        <tr key={item.id} className="odd:bg-white even:bg-slate-50/70 hover:bg-amber-50/50 transition-colors">
                          <td className="w-12 px-3 py-2.5 text-center text-xs font-medium text-muted-foreground tabular-nums">
                            {index + 1}
                          </td>
                          <td className="px-3.5 py-2.5 font-medium">{periodLabel(item.period)}</td>
                          <td className="px-3.5 py-2.5 text-slate-700 dark:text-zinc-300">{dateLabel(item.payment_date)}</td>
                          <td className="px-3.5 py-2.5 text-right font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                            Rp {rupiah(item.amount)}
                          </td>
                          <td className="max-w-44 truncate px-3.5 py-2.5 text-zinc-600 dark:text-zinc-300" title={item.notes ?? ''}>
                            {item.notes || '—'}
                          </td>
                          <td className="px-3.5 py-2.5 text-zinc-600 dark:text-zinc-300">{item.kasir || '—'}</td>
                          {history.can_delete && (
                            <td className="w-16 px-3 py-2.5 text-right">
                              {index === 0 && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                  aria-label="Hapus transaksi iuran terakhir"
                                  onClick={() => setConfirmDeleteId(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <Dialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && !deleting && setConfirmDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus transaksi iuran?</DialogTitle>
            <DialogDescription>
              Hanya transaksi terakhir untuk {branch?.unit} yang dapat dihapus. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button type="button" variant="outline" disabled={deleting} onClick={() => setConfirmDeleteId(null)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" disabled={deleting} onClick={deleteContribution}>
              {deleting ? 'Menghapus…' : 'Ya, hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
