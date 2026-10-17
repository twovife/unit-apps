import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CheckCircle2, CircleAlert, MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VehicleAssetDetail from '@/Components/Assets/VehicleAssetDetail';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';

const rupiah = (value) => new Intl.NumberFormat('id-ID').format(Number(value) || 0);
const formatDate = (value) => {
  if (!value) return '—';
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day));
};

function Summary({ label, value, icon: Icon, tone = '' }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle><Icon className={`size-4 ${tone}`} />
      </CardHeader>
      <CardContent><div className="text-2xl font-bold">{value}</div><p className="text-xs text-muted-foreground">Kantor aktif</p></CardContent>
    </Card>
  );
}

export default function VehicleTaxes({ branch, vehicles, branches, period: initialPeriod }) {
  const [detail, setDetail] = useState(null);
  const [payment, setPayment] = useState(null);
  const [period, setPeriod] = useState(initialPeriod);
  const form = useForm({ cost: '', denda: '', paid_date: new Date().toISOString().slice(0, 10), plat_nomor: '', notes: '', sampai_periode: '' });
  const paidOnPage = vehicles.data.filter((vehicle) => vehicle.is_paid).length;
  const overdueOnPage = vehicles.data.filter((vehicle) => !vehicle.is_paid && vehicle.tanggal_pajak_tahunan < new Date().toISOString().slice(0, 10)).length;
  const monthLabel = useMemo(() => {
    const [year, month] = period.split('-').map(Number);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
  }, [period]);

  const changePeriod = (value) => {
    setPeriod(value);
    router.get(route('assets.her'), { bulan: value }, { preserveState: true, preserveScroll: true, replace: true });
  };

  const beginPayment = (vehicle) => {
    setPayment(vehicle);
    form.setData({
      cost: '',
      denda: '',
      paid_date: new Date().toISOString().slice(0, 10),
      plat_nomor: '',
      notes: '',
      sampai_periode: String(vehicle.sampai_periode),
    });
    form.clearErrors();
  };

  const submitPayment = (event) => {
    event.preventDefault();
    if (!payment) return;
    form.post(route('assets.her.confirm', payment.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Pembayaran pajak kendaraan berhasil dikonfirmasi.');
        setPayment(null);
        form.reset();
      },
      onError: (errors) => {
        const list = Object.values(errors);
        if (list.length > 0) {
          toast.error(list[0], {
            description: list.length > 1 ? `Terdapat ${list.length} data yang perlu diperbaiki.` : undefined,
          });
        }
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Pajak Kendaraan" />
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1"><Link href={route('assets.index')}><ArrowLeft className="mr-1 size-4" />Registri Kendaraan</Link></Button>
            <h1 className="text-2xl font-bold">Pajak Kendaraan</h1>
            <p className="mt-1 text-sm text-muted-foreground">Jadwal jatuh tempo, pembayaran pajak, dan HER untuk kendaraan kantor aktif.</p>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1.5 text-sm"><MapPin className="size-4" />{branch.unit}</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Summary label={`Jatuh tempo · ${monthLabel}`} value={vehicles.total} icon={CalendarDays} />
          <Summary label="Sudah dibayar (halaman)" value={paidOnPage} icon={CheckCircle2} tone="text-emerald-600" />
          <Summary label="Lewat jatuh tempo (halaman)" value={overdueOnPage} icon={CircleAlert} tone="text-rose-600" />
        </div>

        <Card>
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle className="text-base">Jadwal {monthLabel}</CardTitle><p className="mt-1 text-sm text-muted-foreground">Klik plat nomor untuk melihat detail kendaraan dan riwayat pajaknya.</p></div>
            <Input className="w-full sm:w-48" aria-label="Pilih bulan jatuh tempo" type="month" value={period} onChange={(event) => changePeriod(event.target.value)} />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>No.</TableHead><TableHead>Kode Aset</TableHead><TableHead>Plat Nomor</TableHead><TableHead>Kendaraan / STNK</TableHead><TableHead>Jenis Pajak</TableHead><TableHead>Jatuh Tempo</TableHead><TableHead>Pemakai</TableHead><TableHead>Status / Aksi</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {vehicles.data.length ? vehicles.data.map((vehicle, index) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicles.from + index}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{vehicle.asset_code}</TableCell>
                      <TableCell><button type="button" className="font-mono font-semibold text-primary hover:underline" onClick={() => setDetail({ id: vehicle.asset_id, name: vehicle.name })}>{vehicle.plat_nomor}</button></TableCell>
                      <TableCell><div className="font-medium">{vehicle.name}</div><div className="text-xs text-muted-foreground">STNK {formatDate(vehicle.tanggal_stnk)} · {vehicle.nama_stnk}</div></TableCell>
                      <TableCell><div>{vehicle.jenis_pajak}</div>{vehicle.tertunggak > 0 && <div className="text-xs text-amber-700">Tunggakan {vehicle.tertunggak} tahun</div>}</TableCell>
                      <TableCell className={vehicle.tanggal_pajak_tahunan < new Date().toISOString().slice(0, 10) && !vehicle.is_paid ? 'font-semibold text-rose-600' : ''}>{formatDate(vehicle.tanggal_pajak_tahunan)}</TableCell>
                      <TableCell>{vehicle.pengguna}</TableCell>
                      <TableCell>
                        {vehicle.is_paid
                          ? <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700"><CheckCircle2 className="mr-1 size-3" />Lunas</Badge>
                          : <Button size="sm" variant="outline" onClick={() => beginPayment(vehicle)}><CheckCircle2 className="mr-1 size-4" />Bayar Pajak</Button>}
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground"><Search className="mx-auto mb-2 size-4" />Tidak ada jadwal kendaraan untuk bulan ini di kantor aktif.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>{vehicles.total ? `Menampilkan ${vehicles.from}–${vehicles.to} dari ${vehicles.total} kendaraan` : 'Tidak ada kendaraan'}</span>
              {vehicles.last_page > 1 && <div className="flex flex-wrap gap-1">{vehicles.links.map((link, index) => (
                <Button key={`${index}-${link.label}`} size="sm" variant={link.active ? 'default' : 'outline'} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}>
                  {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                </Button>
              ))}</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <VehicleAssetDetail
        assetId={detail?.id ?? null}
        assetName={detail?.name}
        branches={branches}
        onClose={() => setDetail(null)}
        onEdit={(asset) => router.visit(route('assets.index', { edit: asset.id }))}
      />

      {payment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border bg-background shadow-xl">
            <header className="border-b p-4 pr-12"><h2 className="font-semibold">Konfirmasi Pajak Terbayar</h2><p className="text-sm text-muted-foreground">{payment.name} · {payment.plat_nomor}</p></header>
            <form onSubmit={submitPayment} className="space-y-3 p-4">
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <p>Jenis: <strong>{payment.jenis_pajak} (tahun ke-{payment.tahun_ke})</strong></p>
                <p>Periode: <strong>{payment.periode}{Number(form.data.sampai_periode) > payment.periode ? ` – ${form.data.sampai_periode}` : ''}</strong></p>
                {payment.tertunggak > 0 && <p className="mt-1 text-xs text-amber-700">Tunggakan akan dicatat per tahun; biaya masuk ke periode terakhir.</p>}
              </div>
              {payment.tertunggak > 10 && <p className="rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">Tanggal jatuh tempo tidak wajar. Pembayaran dibatasi maksimal 10 periode; koreksi dahulu lewat Ubah Kendaraan.</p>}
              <label className="block space-y-1 text-sm">Bayar sampai periode
                <Input type="number" min={payment.periode} max={new Date().getFullYear() + 1} value={form.data.sampai_periode} onChange={(event) => form.setData('sampai_periode', event.target.value)} required />
                {form.errors.sampai_periode && <span className="text-xs text-destructive">{form.errors.sampai_periode}</span>}
              </label>
              <label className="block space-y-1 text-sm">Biaya pajak (Rp)<Input inputMode="numeric" value={form.data.cost} onChange={(event) => form.setData('cost', event.target.value.replace(/\D/g, ''))} required />{form.errors.cost && <span className="text-xs text-destructive">{form.errors.cost}</span>}</label>
              <label className="block space-y-1 text-sm">Denda (Rp)<Input inputMode="numeric" value={form.data.denda} onChange={(event) => form.setData('denda', event.target.value.replace(/\D/g, ''))} />{form.errors.denda && <span className="text-xs text-destructive">{form.errors.denda}</span>}</label>
              <label className="block space-y-1 text-sm">Tanggal pembayaran<Input type="date" value={form.data.paid_date} onChange={(event) => form.setData('paid_date', event.target.value)} /></label>
              {payment.jenis_pajak !== '1 Tahunan' && <label className="block space-y-1 text-sm">Plat baru (jika ganti plat)<Input value={form.data.plat_nomor} onChange={(event) => form.setData('plat_nomor', event.target.value.toUpperCase())} placeholder={payment.plat_nomor} />{form.errors.plat_nomor && <span className="text-xs text-destructive">{form.errors.plat_nomor}</span>}</label>}
              <label className="block space-y-1 text-sm">Catatan<Input value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} /></label>
              <div className="flex justify-end gap-2 border-t pt-3">
                <Button type="button" variant="outline" onClick={() => setPayment(null)}>Batal</Button>
                <Button type="submit" disabled={form.processing || payment.tertunggak > 10}>{form.processing ? 'Memproses...' : 'Konfirmasi pembayaran'}</Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
