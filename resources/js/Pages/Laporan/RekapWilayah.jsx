import { Head, router } from '@inertiajs/react';
import TabelWilayah from './RekapWilayah/TabelWilayah';

/**
 * Rekap Sirkulasi Wilayah (.agents/rekap_sirkulasi_wilayah.md).
 * Tahap ini baca saja: angka bawaan dari Rekap 2. Isian staf kontrol,
 * tanda selisih, cek, dan ekspor menyusul.
 */
export default function RekapWilayah({ wilayah, tanggal, hari_kerja_ke, daftar_wilayah, baris }) {
  const pindah = (ubah) =>
    router.get(route('laporan.rekap_wilayah.index'), { wilayah, tanggal, ...ubah }, { preserveState: true, preserveScroll: true });

  const sudahDicek = baris.filter((b) => b.terkunci).length;

  return (
    <>
      <Head title="Rekap Sirkulasi Wilayah" />
      <div className="space-y-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rekap Sirkulasi Wilayah</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(tanggal + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {hari_kerja_ke ? ` · hari kerja ke-${hari_kerja_ke}` : ' · bukan hari kerja'}
            {` · ${sudahDicek} dari ${baris.length} kantor sudah dicek`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={wilayah}
            onChange={(e) => pindah({ wilayah: e.target.value })}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            {daftar_wilayah.map((w) => (
              <option key={w} value={w}>
                Wilayah {w}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => e.target.value && pindah({ tanggal: e.target.value })}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          />
        </div>

        {baris.length ? (
          <TabelWilayah baris={baris} />
        ) : (
          <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">Tidak ada kantor aktif di wilayah ini.</p>
        )}

        <p className="text-xs text-slate-400">
          Angka di tabel ini masih angka sistem (sama dengan Rekap 2). Isian staf kontrol dari laporan WA kasir menyusul.
        </p>
      </div>
    </>
  );
}
