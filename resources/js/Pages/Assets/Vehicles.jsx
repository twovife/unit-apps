import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, Car, CircleAlert, MapPin, Pencil, Plus, Search, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import VehicleAssetDetail from '@/Components/Assets/VehicleAssetDetail';
import VehicleAssetForm from '@/Components/Assets/VehicleAssetForm';

const statusLabels = {
  aktif: 'Aktif',
  rusak: 'Rusak',
  hilang: 'Hilang',
  dihapus: 'Dihapus',
};

const statusStyles = {
  aktif: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rusak: 'border-amber-200 bg-amber-50 text-amber-700',
  hilang: 'border-rose-200 bg-rose-50 text-rose-700',
  dihapus: 'border-slate-200 bg-slate-100 text-slate-600',
};

const rupiah = (amount) => new Intl.NumberFormat('id-ID').format(Number(amount) || 0);

const formatDate = (value) => {
  if (!value) return '—';
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(year, month - 1, day));
};

function SummaryCard({ title, value, icon: Icon, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Vehicles({ branch, assets, branches, summary, filters, canEditVehicleRegistration }) {
  const [search, setSearch] = useState(filters.search ?? '');
  const [status, setStatus] = useState(filters.status ?? '');
  const [detail, setDetail] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (!editId) return;
    params.delete('edit');
    window.history.replaceState({}, '', params.size ? `${window.location.pathname}?${params}` : window.location.pathname);
    axios.get(route('assets.detail', editId))
      .then(({ data }) => { setEditAsset(data.asset); setFormOpen(true); })
      .catch(() => toast.error('Gagal memuat data kendaraan.'));
  }, []);

  const applyFilters = (event) => {
    event.preventDefault();
    router.get(route('assets.index'), {
      search: search.trim() || undefined,
      status: status || undefined,
    }, { preserveState: true, preserveScroll: true, replace: true });
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    router.get(route('assets.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Registri Kendaraan" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registri Kendaraan</h1>
            <p className="mt-1 text-sm text-muted-foreground">Daftar kendaraan operasional pada kantor aktif.</p>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1.5 text-sm">
            <MapPin className="size-4" />
            {branch.unit}
          </Badge>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={route('assets.her')}><Calendar className="mr-2 size-4" />Pajak Kendaraan</Link>
            </Button>
            <Button onClick={() => { setEditAsset(null); setFormOpen(true); }}>
              <Plus className="mr-2 size-4" />Kendaraan Baru
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total Kendaraan" value={summary.total} icon={Car} description="Terdaftar di kantor aktif" />
          <SummaryCard title="Aktif Dipakai" value={summary.active} icon={Car} description="Status kendaraan aktif" />
          <SummaryCard title="Rusak / Hilang" value={summary.problematic} icon={CircleAlert} description="Perlu tindak lanjut" />
          <SummaryCard title="Nilai Perolehan" value={`Rp ${rupiah(summary.purchase_value)}`} icon={Wallet} description="Total nilai aset di kantor ini" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daftar kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={applyFilters} className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama, kode aset, atau plat nomor"
                  className="pl-9"
                  aria-label="Cari kendaraan"
                />
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                aria-label="Filter status kendaraan"
              >
                <option value="">Semua status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Button type="submit">Terapkan</Button>
              <Button type="button" variant="outline" onClick={resetFilters}>Reset</Button>
            </form>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>Kode Aset</TableHead>
                    <TableHead>Plat Nomor</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Kantor / Pemakai</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead>Pajak Tahunan</TableHead>
                    <TableHead>STNK (5 Th)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.data.length ? assets.data.map((asset, index) => (
                    <TableRow key={asset.id}>
                      <TableCell>{assets.from + index}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{asset.asset_code}</TableCell>
                      <TableCell className="whitespace-nowrap font-semibold">
                        {asset.vehicle?.plat_nomor ? (
                          <button type="button" className="font-mono text-primary hover:underline" onClick={() => setDetail({ id: asset.id, name: asset.name })}>
                            {asset.vehicle.plat_nomor}
                          </button>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="min-w-40">{asset.name}</TableCell>
                      <TableCell className="min-w-36">
                        <div>{asset.current_location?.branch?.unit ?? branch.unit}</div>
                        <div className="text-xs text-muted-foreground">{asset.current_location?.pengguna ?? '—'}</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right tabular-nums">Rp {rupiah(asset.purchase_cost)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(asset.vehicle?.tanggal_pajak_tahunan)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(asset.vehicle?.tanggal_stnk)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[asset.status] ?? ''}>
                          {statusLabels[asset.status] ?? asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button type="button" size="icon" variant="ghost" title="Ubah kendaraan" onClick={() => {
                          axios.get(route('assets.detail', asset.id))
                            .then(({ data }) => { setEditAsset(data.asset); setFormOpen(true); })
                            .catch(() => toast.error('Gagal memuat data kendaraan.'));
                        }}>
                          <Pencil className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                        Tidak ada kendaraan yang cocok di kantor aktif.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                {assets.total > 0
                  ? `Menampilkan ${assets.from}–${assets.to} dari ${assets.total} kendaraan`
                  : 'Tidak ada data untuk ditampilkan'}
              </span>
              {assets.last_page > 1 && (
                <div className="flex flex-wrap gap-1">
                  {assets.links.map((link, index) => (
                    <Button
                      key={`${index}-${link.label}`}
                      type="button"
                      size="sm"
                      variant={link.active ? 'default' : 'outline'}
                      disabled={!link.url}
                      onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                    >
                      {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <VehicleAssetDetail
        assetId={detail?.id ?? null}
        assetName={detail?.name}
        branches={branches}
        onClose={() => setDetail(null)}
        onEdit={(asset) => { setDetail(null); setEditAsset(asset); setFormOpen(true); }}
      />
      <VehicleAssetForm
        open={formOpen}
        asset={editAsset}
        branch={branch}
        canEditVehicleRegistration={canEditVehicleRegistration}
        onClose={() => setFormOpen(false)}
      />
    </AuthenticatedLayout>
  );
}
