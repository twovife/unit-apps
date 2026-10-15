import { Head, router, usePage } from '@inertiajs/react';
import { Lock, MapPin, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import SavingDetailDrawer from './Components/SavingDetailDrawer';

const rupiah = (value) => new Intl.NumberFormat('id-ID').format(Number(value) || 0);

const columns = [
  ['sw_awal', 'Saldo awal SW'],
  ['sk_awal', 'Saldo awal SK'],
  ['sw_debit', 'Debit SW'],
  ['sk_debit', 'Debit SK'],
  ['sw_kredit', 'Kredit SW'],
  ['sk_kredit', 'Kredit SK'],
  ['saldo_sw', 'Saldo SW'],
  ['saldo_sk', 'Saldo SK'],
  ['saldo_global', 'Saldo global'],
  ['sw_setoran', 'Setoran SW'],
  ['sk_setoran', 'Setoran SK'],
  ['sw_debit_mutasi', 'Mutasi masuk SW'],
  ['sk_debit_mutasi', 'Mutasi masuk SK'],
  ['sw_pengambilan', 'Pengambilan SW'],
  ['sk_pengambilan', 'Pengambilan SK'],
  ['sw_kredit_mutasi', 'Mutasi keluar SW'],
  ['sk_kredit_mutasi', 'Mutasi keluar SK'],
  ['sw_kredit_resign', 'Resign/MD SW'],
  ['sk_kredit_resign', 'Resign/MD SK'],
];


/** Input setoran bulanan SW/SK banyak karyawan sekaligus (sksw.setoran). */
function DialogSetoran({ open, onClose, rows, period }) {
  const hariIni = new Date().toLocaleDateString('sv');
  const akhirPeriode = new Date(Number(period.slice(0, 4)), Number(period.slice(5, 7)), 0).toLocaleDateString('sv');
  const [tanggal, setTanggal] = useState(hariIni);
  const [isi, setIsi] = useState({});
  const [galat, setGalat] = useState(null);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTanggal(akhirPeriode < hariIni ? akhirPeriode : hariIni);
    setIsi({});
    setGalat(null);
  }, [open, period]);

  const ubah = (id, k, v) => setIsi((x) => ({ ...x, [id]: { ...(x[id] ?? {}), [k]: v.replace(/\D/g, '') } }));
  const items = Object.entries(isi)
    .map(([saving_id, v]) => ({ saving_id: Number(saving_id), sw: Number(v.sw) || 0, sk: Number(v.sk) || 0 }))
    .filter((v) => v.sw > 0 || v.sk > 0);
  const total = items.reduce((a, v) => a + v.sw + v.sk, 0);

  const simpan = () => {
    setProses(true);
    router.post(route('sksw.setoran'), { transaction_date: tanggal, items }, {
      preserveScroll: true,
      onError: (e) => setGalat(Object.values(e).join(' ')),
      onSuccess: onClose,
      onFinish: () => setProses(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !proses && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Input setoran SKSW</DialogTitle>
          <DialogDescription>
            Setoran bulanan (sekali per bulan per jenis). Kosongkan karyawan yang tidak setor. Isian mati = setoran bulan ini sudah ada.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-end gap-3">
          <div className="grid gap-1">
            <label className="text-sm font-medium" htmlFor="tgl-setoran">Tanggal setoran</label>
            <Input id="tgl-setoran" type="date" max={hariIni} value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-44" />
          </div>
          <div className="ml-auto text-sm text-right">
            <div className="text-muted-foreground">{items.length} karyawan</div>
            <div className="font-semibold tabular-nums">Rp {rupiah(total)}</div>
          </div>
        </div>
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-2 py-1.5 text-left font-medium">Karyawan</th>
                <th className="px-2 py-1.5 text-right font-medium">SW</th>
                <th className="px-2 py-1.5 text-right font-medium">SK</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.saving_id} className="border-t">
                  <td className="px-2 py-1">
                    <div className="font-medium">{r.employee.nama_karyawan}</div>
                    <div className="text-[11px] text-muted-foreground">{[r.employee.jabatan, r.nomor_rekening].filter(Boolean).join(' · ')}</div>
                  </td>
                  {['sw', 'sk'].map((k) => {
                    const sudah = Number(r[`${k}_setoran`]) > 0;
                    return (
                      <td key={k} className="w-36 px-2 py-1">
                        <Input
                          inputMode="numeric"
                          disabled={sudah}
                          placeholder={sudah ? `sudah ${rupiah(r[`${k}_setoran`])}` : '0'}
                          value={isi[r.saving_id]?.[k] ?? ''}
                          onChange={(e) => ubah(r.saving_id, k, e.target.value)}
                          className="text-right h-8 tabular-nums"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {galat && <div className="p-2 text-sm rounded-md bg-red-50 text-red-700">{galat}</div>}
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClose}>Batal</Button>
          <Button disabled={proses || items.length === 0} onClick={simpan}>
            {proses ? 'Menyimpan…' : `Simpan ${items.length} setoran`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SkswUnit({ branch, period, batch, data = [] }) {
  const [search, setSearch] = useState('');
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [inputBuka, setInputBuka] = useState(false);
  // Input setoran: kasir, staf kontrol, pusat, superuser; batch terkunci = tidak bisa (kecuali bypass).
  const { auth } = usePage().props;
  const bolehInput = ['kasir', 'stafkontrol', 'pusat', 'superuser'].some((r) => auth?.roles?.includes(r))
    && (batch?.status !== 'locked' || auth?.permissions?.includes('bypass-sksw-lock'));
  const filteredData = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('id-ID');
    return needle
      ? data.filter((row) => `${row.employee?.nama_karyawan ?? ''} ${row.nomor_rekening ?? ''}`.toLocaleLowerCase('id-ID').includes(needle))
      : data;
  }, [data, search]);

  const totals = useMemo(() => data.reduce((sum, row) => {
    columns.forEach(([key]) => {
      if (key !== 'saldo_global') sum[key] = (sum[key] ?? 0) + (Number(row[key]) || 0);
    });
    sum.saldo_global = (sum.saldo_global ?? 0) + row.saldo_sw + row.saldo_sk;
    return sum;
  }, {}), [data]);

  const changePeriod = (newPeriod) => {
    if (!newPeriod) return;
    router.get(route('sksw.unit'), { period: newPeriod }, { preserveState: true, preserveScroll: true, replace: true });
  };

  return (
    <AuthenticatedLayout>
      <Head title="SKSW — Laporan Unit" />
      <div className="mx-auto flex w-full max-w-[100vw] flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">SKSW — Laporan Unit</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {branch ? `${branch.unit}${branch.wilayah ? ` · Wilayah ${branch.wilayah}` : ''}` : 'Kantor aktif tidak tersedia'}
              {batch?.status === 'locked' && <Badge variant="secondary" className="ml-2 gap-1"><Lock className="size-3" /> Batch terkunci</Badge>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="sksw-period">Periode laporan</label>
            <Input id="sksw-period" type="month" value={period} onChange={(event) => changePeriod(event.target.value)} className="w-44" />
            {branch && bolehInput && (
              <Button className="gap-1" onClick={() => setInputBuka(true)}>
                <Plus className="size-4" /> Input setoran
              </Button>
            )}
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari karyawan/rekening" className="w-56 pl-8" />
            </div>
          </div>
        </div>

        {!branch ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Tidak ada kantor aktif yang dapat diakses. Pilih kantor melalui filter cabang global.
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border bg-card">
            <div className="overflow-x-auto">
              <Table className="min-w-[1900px] text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="sticky left-0 z-20 min-w-64 bg-background">Karyawan / rekening</TableHead>
                    <TableHead colSpan={2} className="text-center">Saldo awal</TableHead>
                    <TableHead colSpan={2} className="text-center text-emerald-700">Total debit</TableHead>
                    <TableHead colSpan={2} className="text-center text-rose-700">Total kredit</TableHead>
                    <TableHead colSpan={3} className="text-center">Saldo akhir</TableHead>
                    <TableHead colSpan={4} className="text-center text-emerald-700">Breakdown debit</TableHead>
                    <TableHead colSpan={6} className="text-center text-rose-700">Breakdown kredit</TableHead>
                  </TableRow>
                  <TableRow>
                    {columns.map(([key, label]) => <TableHead key={key} className="min-w-28 text-right">{label}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length ? filteredData.map((row, index) => (
                    <TableRow key={row.saving_id} className={!row.is_active ? 'bg-red-50/60 text-muted-foreground' : ''}>
                      <TableCell className="sticky left-0 z-10 bg-background">
                        <button type="button" className="text-left hover:underline" onClick={() => setSelectedSaving(row)}>
                          <span className="mr-1 text-muted-foreground">{index + 1}.</span>
                          <span className="font-medium">{row.employee.nama_karyawan}</span>
                          <span className="block pl-5 text-[11px] text-muted-foreground">
                            {[row.employee.jabatan, row.employee.area ? `Area ${row.employee.area}` : null, row.nomor_rekening].filter(Boolean).join(' · ')}
                            {row.employee.date_resign && <span className="ml-1 font-semibold text-red-600">RESIGN</span>}
                          </span>
                        </button>
                      </TableCell>
                      {columns.map(([key]) => {
                        const value = key === 'saldo_global' ? row.saldo_sw + row.saldo_sk : row[key];
                        return <TableCell key={key} className="text-right tabular-nums">{rupiah(value)}</TableCell>;
                      })}
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={20} className="h-24 text-center text-muted-foreground">
                      {search ? 'Tidak ada karyawan yang cocok dengan pencarian.' : 'Tidak ada data karyawan atau transaksi pada periode ini.'}
                    </TableCell></TableRow>
                  )}
                  {data.length > 0 && (
                    <TableRow className="bg-muted/70 font-bold">
                      <TableCell className="sticky left-0 z-10 bg-muted/70">TOTAL</TableCell>
                      {columns.map(([key]) => <TableCell key={key} className="text-right tabular-nums">{rupiah(totals[key])}</TableCell>)}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
      <SavingDetailDrawer savingId={selectedSaving?.saving_id ?? null} employeeName={selectedSaving?.employee?.nama_karyawan} onClose={() => setSelectedSaving(null)} />
      <DialogSetoran open={inputBuka} onClose={() => setInputBuka(false)} rows={data.filter((r) => r.is_active)} period={period} />
    </AuthenticatedLayout>
  );
}
