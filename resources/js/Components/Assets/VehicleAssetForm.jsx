import { useForm } from '@inertiajs/react';
import { Lock, Save } from 'lucide-react';
import { useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';

const PIC_OPTIONS = [
  'Pimpinan',
  'Wakil Pimpinan',
  'Kepala Mantri',
  'Kepala Mantri 1',
  'Kepala Mantri 2',
  'Kepala Mantri 3',
  ...Array.from({ length: 10 }, (_, index) => `Mantri ${index + 1}`),
  'Kasir',
  'Pusat',
  'Pengawas',
];

const BPKB_OPTIONS = [
  ['pusat', 'Kantor Pusat'],
  ['cabang', 'Kantor Cabang'],
  ['leasing', 'Leasing / Bank'],
  ['lainnya', 'Lainnya'],
];

const toDateInput = (value) => value ? String(value).slice(0, 10) : '';
const moneyInput = (value) => new Intl.NumberFormat('id-ID').format(Number(value) || 0);

function Field({ label, error, children }) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export default function VehicleAssetForm({ open, asset, branch, canEditVehicleRegistration, onClose }) {
  const form = useForm({
    name: '',
    purchase_date: '',
    purchase_cost: '',
    status: 'aktif',
    description: '',
    pengguna: '',
    notes: '',
    plat_nomor: '',
    nama_stnk: '',
    tanggal_stnk: '',
    tanggal_pajak_tahunan: '',
    bpkb_location: 'pusat',
  });

  useEffect(() => {
    if (!open) return;
    form.setData({
      name: asset?.name ?? '',
      purchase_date: toDateInput(asset?.purchase_date),
      purchase_cost: asset ? String(asset.purchase_cost) : '',
      status: asset?.status ?? 'aktif',
      description: asset?.description ?? '',
      pengguna: '',
      notes: '',
      plat_nomor: asset?.vehicle?.plat_nomor ?? '',
      nama_stnk: asset?.vehicle?.nama_stnk ?? '',
      tanggal_stnk: toDateInput(asset?.vehicle?.tanggal_stnk),
      tanggal_pajak_tahunan: toDateInput(asset?.vehicle?.tanggal_pajak_tahunan),
      bpkb_location: asset?.vehicle?.bpkb_location ?? 'pusat',
    });
    form.clearErrors();
  }, [open, asset?.id]);

  const submit = (event) => {
    event.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: onClose,
    };
    if (asset?.id) {
      form.put(route('assets.update', asset.id), options);
    } else {
      form.post(route('assets.store'), options);
    }
  };

  const isLocked = !!asset?.vehicle && !canEditVehicleRegistration;

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="right" className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <SheetHeader className="border-b px-5 py-4 pr-12 text-left">
          <SheetTitle>{asset ? 'Ubah Kendaraan' : 'Kendaraan Baru'}</SheetTitle>
          <SheetDescription>
            {asset ? asset.asset_code : `Penempatan awal: ${branch.unit}`}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <section className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <h3 className="font-semibold sm:col-span-2">Informasi aset</h3>
              <Field label="Nama Kendaraan" error={form.errors.name}>
                <Input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} required />
              </Field>
              <Field label="Status" error={form.errors.status}>
                <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.data.status} onChange={(event) => form.setData('status', event.target.value)}>
                  <option value="aktif">Aktif / Digunakan</option>
                  <option value="rusak">Rusak</option>
                  <option value="hilang">Hilang</option>
                  {asset && <option value="dihapus">Dihapus</option>}
                </select>
              </Field>
              <Field label="Tanggal Perolehan" error={form.errors.purchase_date}>
                <Input type="date" value={form.data.purchase_date} onChange={(event) => form.setData('purchase_date', event.target.value)} required />
              </Field>
              <Field label="Harga Perolehan (Rp)" error={form.errors.purchase_cost}>
                <Input inputMode="numeric" value={moneyInput(form.data.purchase_cost)} onChange={(event) => form.setData('purchase_cost', event.target.value.replace(/\D/g, ''))} required />
              </Field>
              <Field label="Deskripsi / Spesifikasi" error={form.errors.description}>
                <Input value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} />
              </Field>
              {!asset && (
                <>
                  <Field label="Kantor Penempatan">
                    <Input value={branch.unit} readOnly />
                  </Field>
                  <Field label="Pemakai / PIC" error={form.errors.pengguna}>
                    <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.data.pengguna} onChange={(event) => form.setData('pengguna', event.target.value)} required>
                      <option value="">Pilih PIC</option>
                      {PIC_OPTIONS.map((pic) => <option key={pic} value={pic}>{pic}</option>)}
                    </select>
                  </Field>
                  <Field label="Catatan Penempatan" error={form.errors.notes}>
                    <Input value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} />
                  </Field>
                </>
              )}
            </section>

            <section className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Informasi STNK dan pajak</h3>
                {isLocked && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800"><Lock className="size-3" />Terkunci</span>}
              </div>
              {isLocked && <p className="text-xs text-muted-foreground">Plat serta tanggal STNK/pajak berubah melalui pembayaran pajak. Hak koreksi khusus diperlukan untuk mengubah manual.</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Plat Nomor" error={form.errors.plat_nomor}>
                  <Input value={form.data.plat_nomor} onChange={(event) => form.setData('plat_nomor', event.target.value.toUpperCase())} disabled={isLocked} required />
                </Field>
                <Field label="Nama di STNK" error={form.errors.nama_stnk}>
                  <Input value={form.data.nama_stnk} onChange={(event) => form.setData('nama_stnk', event.target.value)} required />
                </Field>
                <Field label="Masa Berlaku STNK (5 Tahunan)" error={form.errors.tanggal_stnk}>
                  <Input type="date" value={form.data.tanggal_stnk} onChange={(event) => form.setData('tanggal_stnk', event.target.value)} disabled={isLocked} required />
                </Field>
                <Field label="Jatuh Tempo Pajak Tahunan" error={form.errors.tanggal_pajak_tahunan}>
                  <Input type="date" value={form.data.tanggal_pajak_tahunan} onChange={(event) => form.setData('tanggal_pajak_tahunan', event.target.value)} disabled={isLocked} required />
                </Field>
                <Field label="Posisi Fisik BPKB" error={form.errors.bpkb_location}>
                  <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.data.bpkb_location} onChange={(event) => form.setData('bpkb_location', event.target.value)}>
                    {BPKB_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </Field>
              </div>
            </section>
          </div>
          <div className="flex justify-end gap-2 border-t p-4">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={form.processing}>
              <Save className="mr-2 size-4" />{form.processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
