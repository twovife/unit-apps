import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, Car, CircleAlert, Eye, Pencil, Plus, Search, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import VehicleAssetDetail from '@/Components/Assets/VehicleAssetDetail';
import VehicleAssetForm from '@/Components/Assets/VehicleAssetForm';
import VideoTutorialButton from '@/Components/VideoTutorialButton';
import { rp as rupiah } from '@/lib/rupiah';

const statusLabels = {
  aktif: 'Aktif',
  rusak: 'Rusak',
  hilang: 'Hilang',
  dijual: 'Dijual',
  dihapus: 'Dihapus',
};

const statusStyles = {
  aktif: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rusak: 'border-amber-200 bg-amber-50 text-amber-700',
  hilang: 'border-rose-200 bg-rose-50 text-rose-700',
  dijual: 'border-blue-200 bg-blue-50 text-blue-700',
  dihapus: 'border-slate-200 bg-slate-100 text-slate-600',
};

// PIC kosong / '-' / 'Cadangan' = kendaraan cadangan.
const isCadangan = (pengguna) => !pengguna || pengguna === '-' || pengguna === 'Cadangan';


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

export default function Vehicles({ branch, assets, branches, summary, canEditVehicleRegistration, canInputTax, bolehKelola, video }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [detail, setDetail] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const semua = Array.isArray(assets) ? assets : (assets?.data ?? []);
  // Satu kantor = sedikit kendaraan: cari & filter status langsung di browser, tanpa tombol.
  const assetList = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qPlat = q.replace(/\s/g, '');
    return semua.filter((a) => (!status || a.status === status) && (!q
      || a.name?.toLowerCase().includes(q)
      || a.asset_code?.toLowerCase().includes(q)
      || a.current_location?.pengguna?.toLowerCase().includes(q)
      || a.vehicle?.plat_nomor?.toLowerCase().replace(/\s/g, '').includes(qPlat)));
  }, [semua, search, status]);
  const bukaEdit = (id) => {
    if (!canEditVehicleRegistration) return;
    axios.get(route('assets.edit_data', id))
      .then(({ data }) => { setEditAsset(data.asset); setFormOpen(true); })
      .catch(() => toast.error('Gagal memuat data kendaraan.'));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (!editId) return;
    params.delete('edit');
    window.history.replaceState({}, '', params.size ? `${window.location.pathname}?${params}` : window.location.pathname);
    bukaEdit(editId);
  }, []);

  return (
    <>
      <Head title="Registri Kendaraan" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registri Kendaraan</h1>
            <p className="mt-1 text-sm text-muted-foreground">Daftar kendaraan operasional pada kantor aktif.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <VideoTutorialButton videos={video} menu="aset" />
            {canInputTax && (
              <Button asChild variant="outline">
                <Link href={route('assets.her')}><Calendar className="mr-2 size-4" />Pajak Kendaraan</Link>
              </Button>
            )}
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
            <div className="flex flex-col gap-2 sm:flex-row">
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
            </div>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead className="w-14 text-center">Edit</TableHead>
                    <TableHead>Kode Aset</TableHead>
                    <TableHead>Plat Nomor</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Kantor / Pemakai</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead>Pajak Tahunan</TableHead>
                    <TableHead>STNK (5 Th)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetList.length ? assetList.map((asset, index) => (
                    <TableRow key={asset.id} className={asset.status === 'aktif' ? '' : 'bg-slate-50 text-muted-foreground'}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          disabled={!canEditVehicleRegistration}
                          title={canEditVehicleRegistration ? 'Ubah kendaraan' : 'Butuh izin edit-vehicle-stnk-data'}
                          onClick={() => bukaEdit(asset.id)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{asset.asset_code}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {asset.vehicle?.plat_nomor ? (
                          <button
                            type="button"
                            title="Lihat detail kendaraan"
                            className="inline-flex items-center gap-1.5 font-mono font-bold text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={() => setDetail({ id: asset.id, name: asset.name })}
                          >
                            {asset.vehicle.plat_nomor}
                            <Eye className="size-3.5" />
                          </button>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="min-w-40">{asset.name}</TableCell>
                      <TableCell className="min-w-36">
                        <div>{asset.current_location?.branch?.unit ?? branch.unit}</div>
                        {isCadangan(asset.current_location?.pengguna) ? (
                          <Badge variant="outline" className="mt-0.5 border-violet-200 bg-violet-50 text-violet-700">Cadangan</Badge>
                        ) : (
                          <div className="text-xs text-muted-foreground">{asset.current_location.pengguna}</div>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right tabular-nums">Rp {rupiah(asset.purchase_cost)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(asset.vehicle?.tanggal_pajak_tahunan)}
                        {canInputTax && asset.status === 'aktif' && asset.vehicle && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="ml-2 h-7 gap-1 px-2 text-xs"
                            onClick={() => setDetail({ id: asset.id, name: asset.name, bayarPajak: true })}
                          >
                            <Wallet className="size-3.5" />
                            Bayar Pajak
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(asset.vehicle?.tanggal_stnk)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {asset.status === 'aktif' ? (
                          <Badge variant="outline" className={statusStyles.aktif}>Aktif</Badge>
                        ) : (
                          <div className="flex flex-col items-start gap-0.5">
                            <Badge variant="outline" className="border-slate-300 bg-slate-100 text-slate-600">Nonaktif</Badge>
                            <span className={`text-xs font-medium ${(statusStyles[asset.status] ?? '').split(' ').find((c) => c.startsWith('text-')) ?? ''}`}>
                              {statusLabels[asset.status] ?? asset.status}
                            </span>
                          </div>
                        )}
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
                {assetList.length > 0
                  ? `Menampilkan seluruh ${assetList.length} kendaraan di kantor aktif`
                  : 'Tidak ada data untuk ditampilkan'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <VehicleAssetDetail
        assetId={detail?.id ?? null}
        assetName={detail?.name}
        branches={branches}
        onClose={() => setDetail(null)}
        onEdit={canEditVehicleRegistration ? (asset) => { setDetail(null); setEditAsset(asset); setFormOpen(true); } : null}
        bolehKelola={bolehKelola}
        bayarPajak={!!detail?.bayarPajak}
      />
      <VehicleAssetForm
        open={formOpen}
        asset={editAsset}
        branch={branch}
        canEditVehicleRegistration={canEditVehicleRegistration}
        onClose={() => setFormOpen(false)}
      />
    </>
  );
}
