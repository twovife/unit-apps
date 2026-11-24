import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';

/**
 * Rekap 2 satu kantor, dibuka dari nama kantor di tabel wilayah.
 *
 * Isinya halaman Rekap 2 yang SEBENARNYA, dimuat lewat <iframe> dengan
 * ?polos=1 supaya sidebar & navbar tidak ikut. Bukan tiruan: tidak ada tabel
 * kedua yang perlu dijaga supaya tetap sama dengan aslinya.
 *
 * Cabang aktif pengguna tidak ikut berpindah — rutenya mengembalikannya
 * sesudah data dihitung. Tautan "tab baru" di kepala drawer tidak begitu:
 * halaman yang berdiri sendiri memang memindahkan cabang aktif.
 */
export default function DrawerRekapDua({ kantor, onTutup }) {
  const url = kantor
    ? route('laporan.rekap_wilayah.rekap_dua', kantor.branch_id) + `?bulan=${kantor.bulan}&polos=1`
    : null;

  return (
    <Sheet open={!!kantor} onOpenChange={(o) => (o ? '' : onTutup())}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-5xl lg:max-w-none">
        <SheetHeader className="border-b px-5 py-4 pr-14">
          <SheetTitle>
            Rekap 2 — {kantor?.unit}
            <span className="ml-2 text-sm font-normal text-slate-400">{kantor?.bulan}</span>
          </SheetTitle>
          <SheetDescription>
            Halaman Rekap 2 kantor ini apa adanya. Cabang aktif Anda tidak berpindah.{' '}
            {url && (
              <a
                href={url.replace('&polos=1', '')}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 underline"
                title="Halaman penuh — cabang aktif Anda akan berpindah ke kantor ini"
              >
                buka di tab baru
              </a>
            )}
          </SheetDescription>
        </SheetHeader>

        {/* key: ganti kantor -> iframe dimuat ulang, bukan memakai isi lama. */}
        {url && <iframe key={url} src={url} title={`Rekap 2 ${kantor.unit}`} className="w-full flex-1 border-0" />}
      </SheetContent>
    </Sheet>
  );
}
