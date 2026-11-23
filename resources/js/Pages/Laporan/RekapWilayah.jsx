import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import TabelWilayah from './RekapWilayah/TabelWilayah';

/**
 * Rekap Sirkulasi Wilayah (.agents/rekap_sirkulasi_wilayah.md).
 *
 * Sel terisi lebih dulu dengan angka sistem (sama dengan Rekap 2). Staf
 * kontrol menimpanya dengan angka yang dilaporkan kasir lewat WA. Beda angka
 * hanya DITANDAI, tidak menghalangi simpan: angka laporan dicatat apa adanya
 * supaya jejak kasir yang salah lapor tidak hilang.
 */
export default function RekapWilayah({ wilayah, tanggal, hari_kerja_ke, hari_kerja, daftar_wilayah, baris, boleh_ubah }) {
  // Hanya sel yang benar-benar diketik, berkunci "branch_id|kolom". Baris yang
  // tidak disentuh tidak ikut dikirim, jadi angka sistem tidak tersimpan
  // seolah-olah dilaporkan kasir.
  const [ubahan, setUbahan] = useState({});
  const [menyimpan, setMenyimpan] = useState(false);

  // Angka yang diketik dituang ke baris, supaya tanda selisih, persen, dan
  // baris total ikut berubah saat mengetik.
  const barisTampil = useMemo(
    () =>
      baris.map((b) => {
        const milik = Object.entries(ubahan)
          .filter(([kunci]) => kunci.startsWith(`${b.branch_id}|`))
          .map(([kunci, v]) => [kunci.split('|')[1], v]);

        return milik.length ? { ...b, diketik: { ...(b.diketik ?? {}), ...Object.fromEntries(milik) } } : b;
      }),
    [baris, ubahan],
  );

  const pindah = (ubah) => {
    if (Object.keys(ubahan).length && !confirm('Ada isian yang belum disimpan. Tinggalkan halaman ini?')) return;
    setUbahan({});
    router.get(route('laporan.rekap_wilayah.index'), { wilayah, tanggal, ...ubah }, { preserveState: false });
  };

  const simpan = () => {
    const perKantor = {};
    for (const [kunci, v] of Object.entries(ubahan)) {
      const [id, kolom] = kunci.split('|');
      perKantor[id] ??= { branch_id: Number(id), nilai: {} };
      perKantor[id].nilai[kolom] = v;
    }

    setMenyimpan(true);
    router.post(
      route('laporan.rekap_wilayah.simpan'),
      { tanggal, baris: Object.values(perKantor) },
      {
        preserveScroll: true,
        onSuccess: () => {
          setUbahan({});
          toast.success(`${Object.keys(perKantor).length} kantor disimpan`);
        },
        onError: (e) => toast.error(Object.values(e)[0] ?? 'Gagal menyimpan'),
        onFinish: () => setMenyimpan(false),
      },
    );
  };

  const jumlahUbahan = Object.keys(ubahan).length;
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

        {!hari_kerja && (
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
            Tanggal ini bukan hari kerja menurut kalender, jadi tidak ada rekap yang diisi di sini. Angka yang tampil
            murni dari sistem. Kalau angkanya tidak nol, berarti ada transaksi tercatat di hari libur dan itu perlu
            ditelusuri.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <select value={wilayah} onChange={(e) => pindah({ wilayah: e.target.value })} className="h-9 rounded-md border bg-background px-3 text-sm">
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
          {boleh_ubah && (
            <button
              type="button"
              onClick={simpan}
              disabled={!jumlahUbahan || menyimpan}
              className="h-9 rounded-md bg-sky-600 px-4 text-sm font-medium text-white disabled:opacity-40"
            >
              {menyimpan ? 'Menyimpan…' : jumlahUbahan ? `Simpan ${jumlahUbahan} isian` : 'Simpan'}
            </button>
          )}
          <span className="text-[11px] text-slate-400">
            Diketik dalam ribuan (200 = 200.000). Sel kuning = beda dengan Rekap 2. Jumlah dan saldo dihitung sistem.
          </span>
        </div>

        {baris.length ? (
          <TabelWilayah
            baris={barisTampil}
            bolehUbah={boleh_ubah}
            belumSimpan={new Set(Object.keys(ubahan).map((k) => Number(k.split('|')[0])))}
            onUbah={(branchId, kolom, v) => setUbahan((s) => ({ ...s, [`${branchId}|${kolom}`]: v }))}
          />
        ) : (
          <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">Tidak ada kantor aktif di wilayah ini.</p>
        )}
      </div>
    </>
  );
}
