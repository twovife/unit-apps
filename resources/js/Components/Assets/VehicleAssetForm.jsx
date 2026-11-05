import { useForm } from '@inertiajs/react';
import { AlertCircle, Lock, Save } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';

// Urutan = urutan tabel aset (VehicleAssetController::urutanPemakai). Kosong = Cadangan.
const PIC_OPTIONS = [
  'Pusat',
  'Pengawas',
  'Pimpinan',
  'Wakil Pimpinan',
  'Kepala Mantri',
  'Kepala Mantri 1',
  'Kepala Mantri 2',
  'Kepala Mantri 3',
  'Kasir',
  'Staf',
  ...Array.from({ length: 10 }, (_, index) => `Mantri ${index + 1}`),
];
const CADANGAN = ['', '-', 'Cadangan'];

const BPKB_OPTIONS = [
  ['pusat', 'Kantor Pusat'],
  ['cabang', 'Kantor Cabang'],
  ['leasing', 'Leasing / Bank'],
  ['lainnya', 'Lainnya'],
];

const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');
const formatTgl = (tgl) => {
  const [y, m, d] = tgl.split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
};
// STNK 5 tahunan jatuh di bulan & tanggal yang sama dengan pajak tahunan (29 Feb -> 28 Feb di tahun bukan kabisat).
const stnkPada = (pajak, tahun) => {
  const [, m, d] = pajak.split('-');
  return `${tahun}-${m}-${m === '02' && d === '29' && tahun % 4 ? '28' : d}`;
};

function Field({ label, error, required, children }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="flex items-center gap-1 font-medium">
        {label}
        {required && <span className="font-bold text-rose-500">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

const STATUS_SAH = ['aktif', 'rusak', 'hilang', 'dijual', 'dihapus'];

export default function VehicleAssetForm({ open, asset, branch, canEditVehicleRegistration, onClose }) {
  const scrollRef = useRef(null);
  const form = useForm({
    name: '',
    purchase_date: '',
    status: '',
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
    const currentPengguna = asset?.current_location?.pengguna ?? asset?.locations?.[0]?.pengguna ?? '';
    form.setData({
      name: asset?.name ?? '',
      purchase_date: toDateInput(asset?.purchase_date),
      // Status di luar pilihan (non-aktif hasil impor lama): dikosongkan, kasir wajib
      // memilih status sebenarnya (rusak / hilang / dijual / ...) - mas 2026-10-26.
      status: STATUS_SAH.includes(asset?.status) ? asset.status : '',
      description: asset?.description ?? '',
      pengguna: CADANGAN.includes(currentPengguna) ? '' : currentPengguna,
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
      onSuccess: () => {
        toast.success(asset?.id ? 'Data kendaraan berhasil diperbarui.' : 'Kendaraan baru berhasil didaftarkan.');
        onClose();
      },
      onError: (errors) => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        const list = Object.values(errors);
        if (list.length > 0) {
          toast.error(list[0], {
            description: list.length > 1 ? `Terdapat ${list.length} data yang perlu diperbaiki.` : undefined,
          });
        }
      },
    };
    if (asset?.id) {
      form.put(route('assets.update', asset.id), options);
    } else {
      form.post(route('assets.store'), options);
    }
  };

  const isLocked = !!asset?.vehicle && !canEditVehicleRegistration;
  // Pilihan STNK: tahun pajak tahunan s/d +4 (STNK berlaku 5 tahun); nilai lama tetap ditampilkan.
  const tahunPajak = Number(form.data.tanggal_pajak_tahunan.slice(0, 4));
  const pilihanStnk = tahunPajak
    ? [...new Set([...Array.from({ length: 5 }, (_, i) => stnkPada(form.data.tanggal_pajak_tahunan, tahunPajak + i)), form.data.tanggal_stnk].filter(Boolean))].sort()
    : [];
  const gantiPajak = (pajak) => {
    const tahunStnk = Number(form.data.tanggal_stnk.slice(0, 4));
    form.setData((d) => ({ ...d, tanggal_pajak_tahunan: pajak, tanggal_stnk: pajak && tahunStnk ? stnkPada(pajak, tahunStnk) : d.tanggal_stnk }));
  };
  const errorEntries = Object.entries(form.errors);
  const hasErrors = errorEntries.length > 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl lg:max-w-5xl">
        <DialogHeader className="border-b px-5 py-4 pr-12 text-left">
          <DialogTitle>{asset ? 'Ubah Kendaraan' : 'Kendaraan Baru'}</DialogTitle>
          <DialogDescription>
            {asset ? asset.asset_code : `Penempatan awal: ${branch.unit}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0">
            {hasErrors && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 lg:col-span-2 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-rose-900 dark:text-rose-100">Gagal menyimpan data kendaraan</p>
                    <p className="text-xs text-rose-700 dark:text-rose-300">Mohon periksa kolom-kolom berikut sebelum menyimpan kembali:</p>
                    <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-rose-800 dark:text-rose-200">
                      {errorEntries.map(([key, msg]) => (
                        <li key={key}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <section className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              <h3 className="font-semibold sm:col-span-2">Informasi aset</h3>
              <Field label="Nama Kendaraan" error={form.errors.name} required>
                <Input
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  className={form.errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
              </Field>
              <Field label="Status" error={form.errors.status} required>
                <select
                  className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                    form.errors.status ? 'border-destructive ring-1 ring-destructive' : ''
                  }`}
                  value={form.data.status}
                  onChange={(event) => form.setData('status', event.target.value)}
                  required
                >
                  <option value="" disabled>— Pilih status —</option>
                  <option value="aktif">Aktif / Digunakan</option>
                  <option value="rusak">Rusak</option>
                  <option value="hilang">Hilang</option>
                  <option value="dijual">Dijual</option>
                  {asset && <option value="dihapus">Dihapus</option>}
                </select>
                {asset?.status && !STATUS_SAH.includes(asset.status) && (
                  <p className="mt-1 text-xs text-amber-700">
                    Status lama "{asset.status}" sudah tidak dipakai. Pilih status sebenarnya: aktif, rusak, hilang, dijual, atau dihapus.
                  </p>
                )}
              </Field>
              <Field label="Tanggal Perolehan" error={form.errors.purchase_date} required>
                <Input
                  type="date"
                  value={form.data.purchase_date}
                  onChange={(event) => form.setData('purchase_date', event.target.value)}
                  className={form.errors.purchase_date ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
              </Field>
              <Field label="Pemakai / PIC (kosong = Cadangan)" error={form.errors.pengguna}>
                <select
                  className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                    form.errors.pengguna ? 'border-destructive ring-1 ring-destructive' : ''
                  }`}
                  value={form.data.pengguna}
                  onChange={(event) => form.setData('pengguna', event.target.value)}
                >
                  <option value="">— Kosong (Cadangan) —</option>
                  {PIC_OPTIONS.map((pic) => (
                    <option key={pic} value={pic}>
                      {pic}
                    </option>
                  ))}
                  {form.data.pengguna && !PIC_OPTIONS.includes(form.data.pengguna) && (
                    <option value={form.data.pengguna}>{form.data.pengguna}</option>
                  )}
                </select>
              </Field>
              <Field label="Deskripsi / Spesifikasi" error={form.errors.description}>
                <Input
                  value={form.data.description}
                  onChange={(event) => form.setData('description', event.target.value)}
                  className={form.errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
              </Field>
              {!asset && (
                <>
                  <Field label="Kantor Penempatan">
                    <Input value={branch.unit} readOnly />
                  </Field>
                  <Field label="Catatan" error={form.errors.notes}>
                    <Input
                      value={form.data.notes}
                      onChange={(event) => form.setData('notes', event.target.value)}
                      className={form.errors.notes ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                  </Field>
                </>
              )}
            </section>

            <section className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Informasi STNK dan pajak</h3>
                {isLocked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                    <Lock className="size-3" />
                    Terkunci
                  </span>
                )}
              </div>
              {isLocked && (
                <p className="text-xs text-muted-foreground">
                  Plat serta tanggal STNK/pajak berubah melalui pembayaran pajak. Hak koreksi khusus (superuser / izin
                  edit STNK) diperlukan untuk mengubah manual.
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Plat Nomor" error={form.errors.plat_nomor} required>
                  <Input
                    value={form.data.plat_nomor}
                    onChange={(event) => form.setData('plat_nomor', event.target.value.toUpperCase())}
                    disabled={isLocked}
                    className={form.errors.plat_nomor ? 'border-destructive focus-visible:ring-destructive' : ''}
                    required
                  />
                  {isLocked && (
                    <span className="block text-[11px] text-amber-700 dark:text-amber-400">
                      Terkunci untuk Kasir. Perubahan plat nomor hanya dapat dilakukan saat pembayaran Pajak 5 Tahunan di menu Pajak Kendaraan atau melalui hak akses Superuser.
                    </span>
                  )}
                </Field>
                <Field label="Nama di STNK" error={form.errors.nama_stnk} required>
                  <Input
                    value={form.data.nama_stnk}
                    onChange={(event) => form.setData('nama_stnk', event.target.value)}
                    className={form.errors.nama_stnk ? 'border-destructive focus-visible:ring-destructive' : ''}
                    required
                  />
                </Field>
                <Field label="Jatuh Tempo Pajak Tahunan" error={form.errors.tanggal_pajak_tahunan} required>
                  <Input
                    type="date"
                    value={form.data.tanggal_pajak_tahunan}
                    onChange={(event) => gantiPajak(event.target.value)}
                    disabled={isLocked}
                    className={form.errors.tanggal_pajak_tahunan ? 'border-destructive focus-visible:ring-destructive' : ''}
                    required
                  />
                  {isLocked && (
                    <span className="block text-[11px] text-amber-700 dark:text-amber-400">
                      Terkunci untuk Kasir. Diperbarui otomatis saat konfirmasi pembayaran pajak atau oleh Superuser.
                    </span>
                  )}
                </Field>
                <Field label="Masa Berlaku STNK (5 Tahunan)" error={form.errors.tanggal_stnk} required>
                  {/* Bulan & tanggal STNK = bulan & tanggal pajak tahunan; tinggal pilih tahunnya. */}
                  <select
                    className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                      form.errors.tanggal_stnk ? 'border-destructive ring-1 ring-destructive' : ''
                    }`}
                    value={form.data.tanggal_stnk}
                    onChange={(event) => form.setData('tanggal_stnk', event.target.value)}
                    disabled={isLocked || !form.data.tanggal_pajak_tahunan}
                    required
                  >
                    <option value="" disabled>{form.data.tanggal_pajak_tahunan ? '— Pilih tahun —' : 'Isi pajak tahunan dulu'}</option>
                    {pilihanStnk.map((tgl) => (
                      <option key={tgl} value={tgl}>
                        {formatTgl(tgl)}
                      </option>
                    ))}
                  </select>
                  {isLocked && (
                    <span className="block text-[11px] text-amber-700 dark:text-amber-400">
                      Terkunci untuk Kasir. Diperbarui otomatis saat pembayaran Pajak 5 Tahunan atau oleh Superuser.
                    </span>
                  )}
                </Field>
                <Field label="Posisi Fisik BPKB" error={form.errors.bpkb_location} required>
                  <select
                    className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                      form.errors.bpkb_location ? 'border-destructive ring-1 ring-destructive' : ''
                    }`}
                    value={form.data.bpkb_location}
                    onChange={(event) => form.setData('bpkb_location', event.target.value)}
                    required
                  >
                    {BPKB_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>
          </div>
          <div className="flex justify-end gap-2 border-t p-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={form.processing}>
              <Save className="mr-2 size-4" />
              {form.processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
