import dayjs from 'dayjs';
import { router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Check, CheckCircle2, ChevronsUpDown, Loader2, MapPin, Pencil, Trash2, Wrench } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shadcn/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { rpLengkap as rupiah } from '@/lib/rupiah';

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${String(value).slice(0, 10)}T00:00:00`))
  : '—';
const toDateInput = (value) => value ? String(value).slice(0, 10) : '';

// Sama dengan VehicleAssetForm; kosong = Cadangan.
const PIC_OPTIONS = [
  'Pusat', 'Pengawas', 'Pimpinan', 'Wakil Pimpinan', 'Kepala Mantri', 'Kepala Mantri 1', 'Kepala Mantri 2', 'Kepala Mantri 3',
  'Kasir', 'Staf', ...Array.from({ length: 10 }, (_, index) => `Mantri ${index + 1}`),
];

/** Pilih kantor dengan pencarian (pola sama dengan GlobalBranchFilter). */
function PilihKantor({ branches, value, onChange }) {
  const [open, setOpen] = useState(false);
  const pilihan = branches.find((branch) => String(branch.id) === String(value));
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" aria-expanded={open} className="h-10 w-full justify-between font-normal">
          <span className="truncate">{pilihan?.unit ?? 'Pilih kantor'}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Cari kantor..." />
          <CommandList>
            <CommandEmpty>Kantor tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem key={branch.id} value={`${branch.unit} ${branch.id}`} onSelect={() => { onChange(String(branch.id)); setOpen(false); }}>
                  <Check className={`mr-2 size-4 ${String(branch.id) === String(value) ? 'opacity-100' : 'opacity-0'}`} />
                  {branch.unit}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function Field({ label, children }) {
  return <div><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-sm font-semibold">{children}</div></div>;
}

// Dialog Radix, bukan div fixed biasa: Sheet detail yang terbuka mengunci klik di luar
// dirinya (pointer-events body), jadi modal buatan sendiri tidak bisa dipencet.
function Modal({ title, description, children, onClose }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg gap-0 overflow-y-auto p-0">
        <DialogHeader className="border-b p-4 pr-12 text-left">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-xs">{description}</DialogDescription>
        </DialogHeader>
        {children}
        <div className="flex justify-end border-t p-4"><Button type="button" variant="outline" onClick={onClose}>Tutup</Button></div>
      </DialogContent>
    </Dialog>
  );
}

export default function VehicleAssetDetail({ assetId, assetName, branches, onClose, onEdit, bolehKelola = false, bayarPajak = false }) {
  const { auth } = usePage().props;
  const canDelete = !auth?.roles?.includes('kasir');
  const canInputTax = auth?.roles?.includes('superuser') || auth?.permissions?.includes('input-vehicles-tax');
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('placements');
  const [modal, setModal] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [cancelingTaxId, setCancelingTaxId] = useState(null);
  const mutate = useForm({
    branch_id: '',
    pengguna: '',
    assigned_date: dayjs().format('YYYY-MM-DD'),
    notes: '',
  });
  const maintenance = useForm({
    maintenance_date: dayjs().format('YYYY-MM-DD'),
    cost: '',
    odometer: '',
    description: '',
  });
  const taxForm = useForm({
    cost: '',
    denda: '',
    paid_date: dayjs().format('YYYY-MM-DD'),
    plat_nomor: '',
    notes: '',
    sampai_periode: '',
  });

  const load = () => {
    if (!assetId) return;
    setLoading(true);
    setError('');
    axios.get(route('assets.detail', assetId))
      .then(({ data }) => setPayload(data))
      .catch((requestError) => setError(requestError.response?.data?.message ?? 'Gagal memuat detail kendaraan.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    pajakDibuka.current = false;
    if (!assetId) {
      setPayload(null);
      return undefined;
    }
    load();
    return undefined;
  }, [assetId]);

  const asset = payload?.asset;
  const taxes = asset?.vehicle?.taxes ?? [];
  const locations = asset?.locations ?? [];
  const maintenanceLogs = asset?.maintenance_logs ?? [];
  const currentLocation = locations[0] ?? asset?.current_location;
  const taxTotal = useMemo(() => taxes.reduce((sum, tax) => sum + Number(tax.cost) + Number(tax.denda), 0), [taxes]);
  const maintenanceTotal = useMemo(() => maintenanceLogs.reduce((sum, row) => sum + Number(row.cost), 0), [maintenanceLogs]);
  const latestCancelableTaxId = taxes[0]?.pajak_before ? taxes[0].id : null;

  const refresh = () => {
    router.reload();
    load();
  };

  // Hapus penempatan terakhir -> kembali ke penempatan sebelumnya. Dipakai dari
  // toast sesudah mutasi (drawer bisa sudah tertutup) dan dari riwayat penempatan.
  const batalMutasi = (id) => {
    if (!window.confirm('Batalkan mutasi terakhir? Kendaraan kembali ke penempatan sebelumnya.')) return;
    // preserveState: drawer tetap terbuka (tanpa itu halaman dipasang ulang dan
    // drawer tertutup/basi). Kendaraan yang kembali ke kantor lain -> detail 404 ->
    // drawer ditutup.
    router.delete(route('assets.mutate.revert', id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success('Mutasi dibatalkan.');
        if (id !== assetId) return;
        axios.get(route('assets.detail', id))
          .then(({ data }) => setPayload(data))
          .catch(onClose);
      },
      onError: (errors) => toast.error(errors.message ?? 'Pembatalan mutasi gagal.'),
    });
  };

  const submitMutate = (event) => {
    event.preventDefault();
    const id = assetId;
    mutate.post(route('assets.mutate', id), {
      preserveScroll: true,
      onSuccess: () => {
        const movingOut = Number(mutate.data.branch_id) !== Number(currentLocation?.branch_id);
        setModal('');
        mutate.reset();
        refresh();
        toast.success('Mutasi dicatat.', { duration: 15000, action: { label: 'Batalkan', onClick: () => batalMutasi(id) } });
        if (movingOut) onClose();
      },
    });
  };

  const submitMaintenance = (event) => {
    event.preventDefault();
    maintenance.post(route('assets.maintenance.store', assetId), {
      preserveScroll: true,
      onSuccess: () => {
        setModal('');
        maintenance.reset();
        refresh();
      },
    });
  };

  // Dibuka dari tombol "Bayar Pajak" di daftar: langsung ke tab pajak + form bayar,
  // sekali per buka, sesudah detail kendaraan itu termuat.
  const pajakDibuka = useRef(false);
  useEffect(() => {
    if (!bayarPajak || pajakDibuka.current || payload?.asset?.id !== assetId) return;
    pajakDibuka.current = true;
    setActiveTab('taxes');
    openTaxPayment();
  }, [payload, bayarPajak]);

  const openTaxPayment = () => {
    if (!asset?.vehicle) return;
    const info = payload?.tax_info;
    const defaultPeriode = info?.sampai_periode
      ?? (asset.vehicle.tanggal_pajak_tahunan ? new Date(asset.vehicle.tanggal_pajak_tahunan).getFullYear() : new Date().getFullYear());
    taxForm.setData({
      cost: '',
      denda: '',
      paid_date: dayjs().format('YYYY-MM-DD'),
      plat_nomor: '',
      notes: '',
      sampai_periode: String(defaultPeriode),
    });
    taxForm.clearErrors();
    setModal('tax');
  };

  const submitTaxPayment = (event) => {
    event.preventDefault();
    if (!asset?.vehicle?.id) return;
    taxForm.post(route('assets.her.confirm', asset.vehicle.id), {
      preserveScroll: true,
      onSuccess: () => {
        setModal('');
        taxForm.reset();
        refresh();
        toast.success('Pembayaran pajak berhasil dicatat.');
      },
    });
  };

  const deleteAsset = () => {
    if (!window.confirm(`Hapus kendaraan ${asset?.name}? Riwayat pajak, mutasi, dan servis ikut terhapus.`)) return;
    setConfirmingDelete(true);
    router.delete(route('assets.destroy', assetId), {
      onSuccess: onClose,
      onFinish: () => setConfirmingDelete(false),
    });
  };

  const cancelTax = (tax) => {
    const message = tax.pajak_before
      ? `Batalkan konfirmasi pajak periode ${tax.periode}? Tanggal STNK dan jatuh tempo akan dikembalikan.`
      : `Hapus riwayat pajak warisan periode ${tax.periode}?`;
    if (!window.confirm(message)) return;
    setCancelingTaxId(tax.id);
    router.delete(route('assets.her.cancel', tax.id), {
      preserveScroll: true,
      onSuccess: refresh,
      onError: (errors) => toast.error(errors.message ?? 'Pembatalan pajak gagal.'),
      onFinish: () => setCancelingTaxId(null),
    });
  };

  return (
    <>
      <Sheet open={!!assetId} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <SheetHeader className="border-b px-5 py-4 pr-14 text-left">
            <SheetTitle>{asset?.name ?? assetName ?? 'Detail Kendaraan'}</SheetTitle>
            <SheetDescription>{asset?.asset_code ?? (loading ? 'Memuat...' : '')} · {asset?.vehicle?.plat_nomor ?? ''}</SheetDescription>
          </SheetHeader>
          {loading && <div className="p-6 text-sm text-muted-foreground"><Loader2 className="mr-2 inline size-4 animate-spin" />Memuat detail kendaraan...</div>}
          {error && <p role="alert" className="m-5 rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
          {!loading && asset && (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-auto flex-wrap justify-start">
                  <TabsTrigger value="placements">Penempatan ({locations.length})</TabsTrigger>
                  <TabsTrigger value="taxes">Pajak ({taxes.length})</TabsTrigger>
                  <TabsTrigger value="maintenance">Servis ({maintenanceLogs.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="placements" className="space-y-3">
                  <Button className="w-full" variant="outline" onClick={() => {
                    mutate.setData({
                      branch_id: String(currentLocation?.branch_id ?? ''),
                      pengguna: '',
                      assigned_date: dayjs().format('YYYY-MM-DD'),
                      notes: '',
                    });
                    setModal('mutate');
                  }} disabled={!bolehKelola} title={bolehKelola ? undefined : 'Bukan untuk kepala mantri / mantri'}><MapPin className="mr-2 size-4" />Mutasi / Pindah Kantor</Button>
                  <div className="space-y-3">
                    {locations.map((location) => (
                      <div key={location.id} className="rounded-md border p-3">
                        <div className="text-xs text-muted-foreground">{formatDate(location.assigned_date)}</div>
                        <div className="font-semibold">{location.branch?.unit} · {location.pengguna}</div>
                        {location.before_branch && <div className="text-xs text-muted-foreground">Mutasi dari {location.before_branch.unit}</div>}
                        {location.notes && <p className="mt-1 text-xs">{location.notes}</p>}
                        {bolehKelola && locations.length > 1 && location.id === asset?.current_location?.id && (
                          <Button size="sm" variant="outline" className="mt-2 text-red-600 border-red-200" onClick={() => batalMutasi(assetId)}>
                            Batalkan mutasi ini
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="taxes" className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">Akumulasi biaya pajak: {rupiah(taxTotal)}</p>
                      {payload?.tax_info && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Jatuh tempo: <strong className="text-foreground">{formatDate(payload.tax_info.tanggal_pajak_tahunan)}</strong> · {payload.tax_info.jenis_pajak}
                          {payload.tax_info.tertunggak > 0 && (
                            <span className="ml-1.5 font-semibold text-rose-600">(Tertunggak {payload.tax_info.tertunggak} tahun)</span>
                          )}
                        </p>
                      )}
                    </div>
                    {asset.vehicle && (
                      <Button size="sm" onClick={openTaxPayment} disabled={!canInputTax} title={canInputTax ? undefined : 'Butuh izin input-vehicles-tax'}>
                        <CheckCircle2 className="mr-1 size-4" />
                        Bayar Pajak
                      </Button>
                    )}
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 text-left"><tr>{['Periode', 'Jenis', 'Tgl bayar', 'Biaya', 'Denda', 'Keterangan', ''].map((label) => <th key={label} className="px-3 py-2">{label}</th>)}</tr></thead>
                      <tbody className="divide-y">
                        {taxes.length ? taxes.map((tax) => (
                          <tr key={tax.id}>
                            <td className="px-3 py-2 font-semibold">{tax.periode}</td>
                            <td className="px-3 py-2">{tax.jenis === '5_tahunan' ? '5 Tahunan' : '1 Tahunan'}{tax.tahun_ke ? ` · ke-${tax.tahun_ke}` : ''}</td>
                            <td className="whitespace-nowrap px-3 py-2">{formatDate(tax.paid_date)}</td>
                            <td className="px-3 py-2 text-right">{rupiah(tax.cost)}</td>
                            <td className="px-3 py-2 text-right">{rupiah(tax.denda)}</td>
                            <td className="max-w-48 px-3 py-2 text-xs">
                              {tax.plat_before && tax.plat_after && <div>Plat {tax.plat_before} → {tax.plat_after}</div>}
                              {tax.notes ?? '—'}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {(!tax.pajak_before || tax.id === latestCancelableTaxId) && (
                                <Button size="sm" variant="ghost" className="text-destructive" disabled={!canInputTax || cancelingTaxId !== null} title={canInputTax ? undefined : 'Butuh izin input-vehicles-tax'} onClick={() => cancelTax(tax)}>
                                  {cancelingTaxId === tax.id ? 'Memproses...' : tax.pajak_before ? 'Batalkan' : 'Hapus'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        )) : <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Belum ada riwayat pajak.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="maintenance" className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">Akumulasi servis: {rupiah(maintenanceTotal)}</p>
                    <Button size="sm" onClick={() => setModal('maintenance')} disabled={!bolehKelola} title={bolehKelola ? undefined : 'Bukan untuk kepala mantri / mantri'}><Wrench className="mr-1 size-4" />Catat servis</Button>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 text-left"><tr><th className="px-3 py-2">Tanggal</th><th className="px-3 py-2">Odometer</th><th className="px-3 py-2">Keterangan</th><th className="px-3 py-2 text-right">Biaya</th></tr></thead>
                      <tbody className="divide-y">
                        {maintenanceLogs.length ? maintenanceLogs.map((row) => (
                          <tr key={row.id}><td className="whitespace-nowrap px-3 py-2">{formatDate(row.maintenance_date)}</td><td className="px-3 py-2">{row.odometer ? `${new Intl.NumberFormat('id-ID').format(row.odometer)} km` : '—'}</td><td className="min-w-48 whitespace-pre-wrap px-3 py-2">{row.description}</td><td className="whitespace-nowrap px-3 py-2 text-right">{rupiah(row.cost)}</td></tr>
                        )) : <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Belum ada catatan servis.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid gap-3 rounded-lg border bg-muted/20 p-4 sm:grid-cols-2">
                <Field label="Status">{asset.status}</Field>
                <Field label="Lokasi sekarang">{currentLocation ? `${currentLocation.branch?.unit ?? '—'} (${currentLocation.pengguna})` : 'Belum ditempatkan'}</Field>
                <Field label="Tanggal perolehan">{formatDate(asset.purchase_date)}</Field>
                <Field label="Harga perolehan">{rupiah(asset.purchase_cost)}</Field>
                <Field label="Total pajak + denda">{rupiah(taxTotal)}</Field>
                <Field label="Total servis">{rupiah(maintenanceTotal)}</Field>
                <Field label="Nama di STNK">{asset.vehicle?.nama_stnk ?? '—'}</Field>
                <Field label="Posisi BPKB"><span className="capitalize">{asset.vehicle?.bpkb_location ?? '—'}</span></Field>
                {asset.description && <div className="sm:col-span-2"><Field label="Spesifikasi / catatan">{asset.description}</Field></div>}
              </div>
            </div>
          )}

          {!loading && asset && (
            <SheetFooter className="mt-auto flex flex-row items-center justify-between border-t bg-slate-50/70 px-5 py-3 sm:justify-between dark:bg-zinc-900/60">
              <div>
                {canDelete && (
                  <Button size="sm" variant="destructive" onClick={deleteAsset} disabled={confirmingDelete}>
                    <Trash2 className="mr-1.5 size-4" />Hapus Kendaraan
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={onClose}>
                  Tutup
                </Button>
                {onEdit !== undefined && (
                  <Button size="sm" variant="default" disabled={!onEdit} title={onEdit ? undefined : 'Butuh izin edit-vehicle-stnk-data'} onClick={() => onEdit?.(asset)}>
                    <Pencil className="mr-1.5 size-4" />Ubah Kendaraan
                  </Button>
                )}
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {modal === 'mutate' && asset && (
        <Modal title="Mutasi / Pindah Kantor" description="Penempatan baru akan menjadi lokasi aktif kendaraan." onClose={() => setModal('')}>
          <form onSubmit={submitMutate} className="space-y-3 p-4">
            <label className="block space-y-1 text-sm">Kantor tujuan
              <PilihKantor branches={branches} value={mutate.data.branch_id} onChange={(id) => mutate.setData('branch_id', id)} />
              {mutate.errors.branch_id && <span className="text-xs text-destructive">{mutate.errors.branch_id}</span>}
            </label>
            <label className="block space-y-1 text-sm">Pemakai / PIC
              <select className="h-10 w-full rounded-md border bg-background px-3" value={mutate.data.pengguna} onChange={(event) => mutate.setData('pengguna', event.target.value)}>
                <option value="">— Kosong (Cadangan) —</option>{PIC_OPTIONS.map((pic) => <option key={pic} value={pic}>{pic}</option>)}
              </select>
              {mutate.errors.pengguna && <span className="text-xs text-destructive">{mutate.errors.pengguna}</span>}
            </label>
            <label className="block space-y-1 text-sm">Tanggal mutasi<Input type="date" value={mutate.data.assigned_date} onChange={(event) => mutate.setData('assigned_date', event.target.value)} required /></label>
            <label className="block space-y-1 text-sm">Catatan<Input value={mutate.data.notes} onChange={(event) => mutate.setData('notes', event.target.value)} /></label>
            <Button type="submit" disabled={mutate.processing} className="w-full">{mutate.processing ? 'Menyimpan...' : 'Simpan mutasi'}</Button>
          </form>
        </Modal>
      )}
      {modal === 'maintenance' && asset && (
        <Modal title="Catat servis kendaraan" description={asset.name} onClose={() => setModal('')}>
          <form onSubmit={submitMaintenance} className="space-y-3 p-4">
            <label className="block space-y-1 text-sm">Tanggal servis<Input type="date" value={maintenance.data.maintenance_date} onChange={(event) => maintenance.setData('maintenance_date', event.target.value)} required /></label>
            <label className="block space-y-1 text-sm">Biaya (Rp)<Input inputMode="numeric" value={maintenance.data.cost} onChange={(event) => maintenance.setData('cost', event.target.value.replace(/\D/g, ''))} required />{maintenance.errors.cost && <span className="text-xs text-destructive">{maintenance.errors.cost}</span>}</label>
            <label className="block space-y-1 text-sm">Odometer (km)<Input inputMode="numeric" value={maintenance.data.odometer} onChange={(event) => maintenance.setData('odometer', event.target.value.replace(/\D/g, ''))} /></label>
            <label className="block space-y-1 text-sm">Keterangan<textarea className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={maintenance.data.description} onChange={(event) => maintenance.setData('description', event.target.value)} required /></label>
            <Button type="submit" disabled={maintenance.processing} className="w-full">{maintenance.processing ? 'Menyimpan...' : 'Simpan catatan servis'}</Button>
          </form>
        </Modal>
      )}

      {modal === 'tax' && asset && asset.vehicle && (
        <Modal title="Konfirmasi Pembayaran Pajak" description={`${asset.name} · ${asset.vehicle.plat_nomor}`} onClose={() => setModal('')}>
          <form onSubmit={submitTaxPayment} className="space-y-3 p-4">
            <div className="space-y-1 rounded-md border bg-muted/30 p-3 text-sm">
              <p>Kendaraan: <strong>{asset.name} ({asset.vehicle.plat_nomor})</strong></p>
              {payload?.tax_info && (
                <>
                  <p>Jenis: <strong>{payload.tax_info.jenis_pajak} (tahun ke-{payload.tax_info.tahun_ke})</strong></p>
                  <p>Jatuh tempo: <strong>{formatDate(payload.tax_info.tanggal_pajak_tahunan)}</strong></p>
                  <p>
                    Periode: <strong>{payload.tax_info.periode}{Number(taxForm.data.sampai_periode) > payload.tax_info.periode ? ` – ${taxForm.data.sampai_periode}` : ''}</strong>
                  </p>
                  {payload.tax_info.tertunggak > 0 && (
                    <p className="mt-1 text-xs text-amber-700">Tunggakan akan dicatat per tahun; nominal biaya masuk ke periode terakhir.</p>
                  )}
                </>
              )}
            </div>

            {payload?.tax_info?.tertunggak > 10 && (
              <p className="rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                Tanggal jatuh tempo tidak wajar (tertunggak lebih dari 10 tahun). Silakan koreksi tanggal lewat tombol Ubah Kendaraan.
              </p>
            )}

            <label className="block space-y-1 text-sm">
              Bayar sampai periode
              <Input
                type="number"
                min={payload?.tax_info?.periode ?? 2000}
                max={new Date().getFullYear() + 1}
                value={taxForm.data.sampai_periode}
                onChange={(event) => taxForm.setData('sampai_periode', event.target.value)}
                required
              />
              {taxForm.errors.sampai_periode && <span className="text-xs text-destructive">{taxForm.errors.sampai_periode}</span>}
            </label>

            <label className="block space-y-1 text-sm">
              Biaya pajak (Rp)
              <Input
                inputMode="numeric"
                value={taxForm.data.cost ? new Intl.NumberFormat('id-ID').format(taxForm.data.cost) : ''}
                onChange={(event) => taxForm.setData('cost', event.target.value.replace(/\D/g, ''))}
                placeholder="0"
                required
              />
              {taxForm.errors.cost && <span className="text-xs text-destructive">{taxForm.errors.cost}</span>}
            </label>

            <label className="block space-y-1 text-sm">
              Tanggal pembayaran
              <Input
                type="date"
                value={taxForm.data.paid_date}
                onChange={(event) => taxForm.setData('paid_date', event.target.value)}
                required
              />
              {taxForm.errors.paid_date && <span className="text-xs text-destructive">{taxForm.errors.paid_date}</span>}
            </label>

            {payload?.tax_info?.is_5_tahunan && (
              <label className="block space-y-1 text-sm">
                Plat baru (jika ganti plat)
                <Input
                  value={taxForm.data.plat_nomor}
                  onChange={(event) => taxForm.setData('plat_nomor', event.target.value.toUpperCase())}
                  placeholder={asset.vehicle.plat_nomor}
                />
                {taxForm.errors.plat_nomor && <span className="text-xs text-destructive">{taxForm.errors.plat_nomor}</span>}
              </label>
            )}

            <label className="block space-y-1 text-sm">
              Catatan (opsional)
              <Input
                value={taxForm.data.notes}
                onChange={(event) => taxForm.setData('notes', event.target.value)}
                placeholder="Keterangan pembayaran pajak..."
              />
              {taxForm.errors.notes && <span className="text-xs text-destructive">{taxForm.errors.notes}</span>}
            </label>

            <Button
              type="submit"
              disabled={taxForm.processing || (payload?.tax_info?.tertunggak > 10)}
              className="w-full"
            >
              {taxForm.processing ? 'Menyimpan...' : 'Konfirmasi Pembayaran Pajak'}
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
