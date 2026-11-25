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

import { KONDISI } from '@/lib/statusKendaraan';
import { kecilkan } from '@/Components/PembayaranKantor';
import { MultiBukti } from '@/Components/Assets/AngsuranMotor';

// Satu kelompok isian berjudul, 2 kolom mulai sm.
function Bagian({ judul, tambahan, children }) {
  return (
    <section className="rounded-lg border">
      <div className="flex items-center gap-2 border-b bg-slate-50 px-4 py-2">
        <h3 className="text-sm font-semibold text-slate-800">{judul}</h3>
        {tambahan}
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

// Tombol pilihan (status / kondisi): satu klik, tanpa dropdown.
function Pilihan({ aktif, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-md border px-3 text-sm font-medium transition-colors ${aktif ? 'border-slate-900 bg-slate-900 text-white' : 'bg-background hover:bg-slate-50'}`}
    >
      {children}
    </button>
  );
}

const Kunci = ({ children }) => <span className="block text-[11px] text-amber-700">{children}</span>;

export default function VehicleAssetForm({ open, asset, branch, canEditVehicleRegistration, onClose }) {
  const scrollRef = useRef(null);
  const form = useForm({
    name: '',
    purchase_date: '',
    status: '',
    kondisi: '',
    description: '',
    pengguna: '',
    notes: '',
    plat_nomor: '',
    nama_stnk: '',
    tanggal_stnk: '',
    tanggal_pajak_tahunan: '',
    bpkb_location: 'pusat',
    angsuran_lunas: false,
    angsuran_nominal: '',
    angsuran_tenor: '',
    angsuran_terbayar: '',
    angsuran_tanggal: '',
    angsuran_bukti: [],
  });

  useEffect(() => {
    if (!open) return;
    const currentPengguna = asset?.current_location?.pengguna ?? asset?.locations?.[0]?.pengguna ?? '';
    form.setData({
      name: asset?.name ?? '',
      purchase_date: toDateInput(asset?.purchase_date),
      // Kendaraan baru: aktif / baik. Nonaktif tanpa kondisi (impor lama): kondisi wajib dipilih.
      status: asset ? (asset.status === 'aktif' ? 'aktif' : 'nonaktif') : 'aktif',
      kondisi: asset ? (asset.kondisi ?? '') : 'baik',
      description: asset?.description ?? '',
      pengguna: CADANGAN.includes(currentPengguna) ? '' : currentPengguna,
      notes: '',
      plat_nomor: asset?.vehicle?.plat_nomor ?? '',
      nama_stnk: asset?.vehicle?.nama_stnk ?? '',
      tanggal_stnk: toDateInput(asset?.vehicle?.tanggal_stnk),
      tanggal_pajak_tahunan: toDateInput(asset?.vehicle?.tanggal_pajak_tahunan),
      bpkb_location: asset?.vehicle?.bpkb_location ?? 'pusat',
      angsuran_lunas: false,
      angsuran_nominal: '',
      angsuran_tenor: '',
      angsuran_terbayar: '',
      angsuran_tanggal: '',
      angsuran_bukti: [],
    });
    form.clearErrors();
  }, [open, asset?.id]);

  const submit = async (event) => {
    event.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(asset?.id ? 'Data kendaraan berhasil diperbarui.' : 'Kendaraan baru berhasil didaftarkan.');
        onClose();
      },
      onError: () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }),
    };
    if (asset?.id) {
      form.put(route('assets.update', asset.id), options);
    } else {
      // Bukti angsuran (foto) dikecilkan dulu; tanpa angsuran = tidak dikirim.
      const bukti = await Promise.all((form.data.angsuran_bukti ?? []).map(kecilkan));
      form.transform((d) => ({ ...d, angsuran_bukti: bukti }));
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
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-5 py-4 pr-12 text-left">
          <DialogTitle>{asset ? 'Ubah Kendaraan' : 'Kendaraan Baru'}</DialogTitle>
          <DialogDescription>
            {asset ? asset.asset_code : `Penempatan awal: ${branch.unit}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {hasErrors && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
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

            {/* Urutan isian mengikuti STNK di tangan: kendaraan -> STNK & pajak -> penempatan -> status. */}
            <Bagian judul="1. Kendaraan">
              <Field label="Plat Nomor" error={form.errors.plat_nomor} required>
                <Input
                  value={form.data.plat_nomor}
                  onChange={(event) => form.setData('plat_nomor', event.target.value.toUpperCase())}
                  disabled={isLocked}
                  placeholder="AG 1234 AB"
                  className={`font-mono text-base font-semibold tracking-wider ${form.errors.plat_nomor ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  required
                />
                {isLocked && <Kunci>Plat berubah lewat pembayaran Pajak 5 Tahunan, atau oleh superuser.</Kunci>}
              </Field>
              <Field label="Nama Kendaraan" error={form.errors.name} required>
                <Input
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  placeholder="mis. Honda Vario 150"
                  className={form.errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
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
              <Field label="Spesifikasi" error={form.errors.description}>
                <Input
                  value={form.data.description}
                  onChange={(event) => form.setData('description', event.target.value)}
                  placeholder="mis. warna hitam, tahun 2022 (opsional)"
                  className={form.errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
              </Field>
            </Bagian>

            <Bagian
              judul="2. STNK & Pajak"
              tambahan={isLocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                  <Lock className="size-3" />Terkunci
                </span>
              )}
            >
              <Field label="Nama di STNK" error={form.errors.nama_stnk} required>
                <Input
                  value={form.data.nama_stnk}
                  onChange={(event) => form.setData('nama_stnk', event.target.value)}
                  className={form.errors.nama_stnk ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
              </Field>
              <Field label="Posisi Fisik BPKB" error={form.errors.bpkb_location} required>
                <select className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${form.errors.bpkb_location ? 'border-destructive ring-1 ring-destructive' : ''}`} value={form.data.bpkb_location} onChange={(event) => form.setData('bpkb_location', event.target.value)} required>
                  {BPKB_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
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
                {isLocked && <Kunci>Ikut pembayaran pajak, atau oleh superuser.</Kunci>}
              </Field>
              <Field label="Masa Berlaku STNK (5 Tahunan)" error={form.errors.tanggal_stnk} required>
                {/* Bulan & tanggal STNK = bulan & tanggal pajak tahunan; tinggal pilih tahunnya. */}
                <select
                  className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${form.errors.tanggal_stnk ? 'border-destructive ring-1 ring-destructive' : ''}`}
                  value={form.data.tanggal_stnk}
                  onChange={(event) => form.setData('tanggal_stnk', event.target.value)}
                  disabled={isLocked || !form.data.tanggal_pajak_tahunan}
                  required
                >
                  <option value="" disabled>{form.data.tanggal_pajak_tahunan ? '— Pilih tahun —' : 'Isi jatuh tempo pajak dulu'}</option>
                  {pilihanStnk.map((tgl) => <option key={tgl} value={tgl}>{formatTgl(tgl)}</option>)}
                </select>
                {isLocked && <Kunci>Ikut pembayaran Pajak 5 Tahunan, atau oleh superuser.</Kunci>}
              </Field>
            </Bagian>

            <Bagian judul="3. Penempatan">
              {!asset && (
                <Field label="Kantor">
                  {/* Selalu kantor aktif (server memakai kantor aktif, bukan isian). */}
                  <div className="flex h-10 items-center rounded-md border border-dashed bg-slate-50 px-3 text-sm font-medium text-slate-700">{branch.unit}</div>
                  <span className="block text-xs text-muted-foreground">Ikut kantor aktif. Ganti lewat pilihan kantor di atas.</span>
                </Field>
              )}
              <Field label="Pemakai / PIC" error={form.errors.pengguna}>
                <select className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${form.errors.pengguna ? 'border-destructive ring-1 ring-destructive' : ''}`} value={form.data.pengguna} onChange={(event) => form.setData('pengguna', event.target.value)}>
                  <option value="">Cadangan (belum dipakai)</option>
                  {PIC_OPTIONS.map((pic) => <option key={pic} value={pic}>{pic}</option>)}
                  {form.data.pengguna && !PIC_OPTIONS.includes(form.data.pengguna) && <option value={form.data.pengguna}>{form.data.pengguna}</option>}
                </select>
              </Field>
              {!asset && (
                <div className="sm:col-span-2">
                  <Field label="Catatan penempatan" error={form.errors.notes}>
                    <Input
                      value={form.data.notes}
                      onChange={(event) => form.setData('notes', event.target.value)}
                      placeholder="Opsional, bawaan: Penempatan Awal"
                      className={form.errors.notes ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                  </Field>
                </div>
              )}
            </Bagian>

            <Bagian judul="4. Status">
              <div className="space-y-1 text-sm">
                <span className="font-medium">Status <span className="font-bold text-rose-500">*</span></span>
                <div className="grid grid-cols-2 gap-2">
                  {[['aktif', 'Aktif'], ['nonaktif', 'Nonaktif']].map(([nilai, label]) => (
                    <Pilihan key={nilai} aktif={form.data.status === nilai} onClick={() => form.setData({ ...form.data, status: nilai, kondisi: nilai === 'aktif' ? 'baik' : '' })}>{label}</Pilihan>
                  ))}
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <span className="font-medium">Kondisi <span className="font-bold text-rose-500">*</span></span>
                <div className="grid grid-cols-3 gap-2">
                  {(KONDISI[form.data.status] ?? []).map(([nilai, label]) => (
                    <Pilihan key={nilai} aktif={form.data.kondisi === nilai} onClick={() => form.setData('kondisi', nilai)}>{label}</Pilihan>
                  ))}
                </div>
                {(form.errors.status || form.errors.kondisi) && <span className="block text-xs font-medium text-destructive">{form.errors.status ?? form.errors.kondisi}</span>}
              </div>
            </Bagian>

            {!asset && (
              <Bagian judul="5. Angsuran Motor (opsional)">
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" className="size-4" checked={form.data.angsuran_lunas} onChange={(e) => form.setData('angsuran_lunas', e.target.checked)} />
                  Tidak ada angsuran <span className="text-muted-foreground">(beli tunai / sudah lunas)</span>
                </label>
                {!form.data.angsuran_lunas && (
                  <>
                    <Field label="Angsuran per bulan" error={form.errors.angsuran_nominal}>
                      <Input inputMode="numeric" placeholder="0" value={form.data.angsuran_nominal ? new Intl.NumberFormat('id-ID').format(form.data.angsuran_nominal) : ''} onChange={(e) => form.setData('angsuran_nominal', e.target.value.replace(/\D/g, ''))} />
                    </Field>
                    <Field label="Tenor (bulan)" error={form.errors.angsuran_tenor}>
                      <Input inputMode="numeric" placeholder="0" value={form.data.angsuran_tenor} onChange={(e) => form.setData('angsuran_tenor', e.target.value.replace(/\D/g, ''))} />
                    </Field>
                    <Field label="Angsuran ke" error={form.errors.angsuran_terbayar}>
                      <Input inputMode="numeric" placeholder="0" value={form.data.angsuran_terbayar} onChange={(e) => form.setData('angsuran_terbayar', e.target.value.replace(/\D/g, ''))} />
                    </Field>
                    <Field label="Tanggal pembayaran" error={form.errors.angsuran_tanggal}>
                      <Input type="date" value={form.data.angsuran_tanggal} onChange={(e) => form.setData('angsuran_tanggal', e.target.value)} />
                    </Field>
                    <div className="sm:col-span-2">
                      <MultiBukti files={form.data.angsuran_bukti} setFiles={(f) => form.setData((d) => ({ ...d, angsuran_bukti: typeof f === 'function' ? f(d.angsuran_bukti) : f }))} judul="Bukti transfer angsuran terakhir" wajib galat={form.errors.angsuran_bukti} />
                    </div>
                    {form.data.angsuran_nominal && form.data.angsuran_tenor && (
                      <p className="text-xs text-muted-foreground sm:col-span-2">
                        Total harga Rp {new Intl.NumberFormat('id-ID').format(form.data.angsuran_nominal * form.data.angsuran_tenor)}
                        {form.data.angsuran_terbayar ? ` · sudah dibayar Rp ${new Intl.NumberFormat('id-ID').format(form.data.angsuran_nominal * form.data.angsuran_terbayar)}` : ''}.
                        Kosongkan semua kalau belum tahu; nanti diisi lewat Input Angsuran Motor.
                      </p>
                    )}
                  </>
                )}
              </Bagian>
            )}
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
