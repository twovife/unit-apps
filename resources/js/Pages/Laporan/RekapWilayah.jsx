import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import SaldoAwal from './RekapWilayah/SaldoAwal';
import TabelWilayah from './RekapWilayah/TabelWilayah';

/**
 * Rekap Sirkulasi Wilayah (.agents/rekap_sirkulasi_wilayah.md).
 *
 * Sel terisi lebih dulu dengan angka sistem (sama dengan Rekap 2). Staf
 * kontrol menimpanya dengan angka yang dilaporkan kasir lewat WA. Beda angka
 * hanya DITANDAI, tidak menghalangi simpan: angka laporan dicatat apa adanya
 * supaya jejak kasir yang salah lapor tidak hilang.
 */
const namaBulan = (t) =>
  t ? new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : null;

export default function RekapWilayah({ wilayah, tanggal, hari_kerja_ke, hari_kerja, hari_tertinggal = [], bulan_lalu, bulan_cm, bulan_mb, daftar_wilayah, baris, boleh_ubah }) {
  // Hanya sel yang benar-benar diketik, berkunci "branch_id|kolom". Baris yang
  // tidak disentuh tidak ikut dikirim, jadi angka sistem tidak tersimpan
  // seolah-olah dilaporkan kasir.
  const [ubahan, setUbahan] = useState({});
  const [menyimpan, setMenyimpan] = useState(false);
  const [bukaBaris, setBukaBaris] = useState(null);
  const [alasan, setAlasan] = useState('');
  const [log, setLog] = useState(null);

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

  const cek = (b) =>
    router.post(route('laporan.rekap_wilayah.cek', b.branch_id), { tanggal }, {
      preserveScroll: true,
      onSuccess: () => toast.success(`${b.unit} dicek`),
      onError: (e) => toast.error(Object.values(e)[0] ?? 'Gagal mengecek'),
    });

  const buka = () => {
    if (alasan.trim().length < 5) return;
    router.post(route('laporan.rekap_wilayah.buka', bukaBaris.branch_id), { tanggal, alasan: alasan.trim() }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`${bukaBaris.unit} dibuka`);
        setBukaBaris(null);
        setAlasan('');
      },
      onError: (e) => toast.error(Object.values(e)[0] ?? 'Gagal membuka'),
    });
  };

  const lihatLog = async (b) => {
    setLog({ unit: b.unit, isi: null });
    const r = await fetch(route('laporan.rekap_wilayah.log', b.branch_id) + `?tanggal=${tanggal}`);
    setLog({ unit: b.unit, isi: await r.json() });
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

        {hari_tertinggal.length > 0 && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
            <div className="font-semibold">{hari_tertinggal.length} hari sejak November belum dicek</div>
            <p className="mt-0.5 text-[11px]">Selama masih tertinggal, hari sesudahnya tidak bisa dicek. Klik tanggalnya.</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
              {hari_tertinggal.map((h) => (
                <button key={h.tanggal} type="button" onClick={() => pindah({ tanggal: h.tanggal })} className="underline">
                  {h.tanggal} — {h.kantor} kantor belum dicek
                </button>
              ))}
            </div>
          </div>
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

        {baris.length > 0 && (
          <SaldoAwal
            baris={barisTampil}
            bulanLalu={namaBulan(bulan_lalu)}
            bulanCm={namaBulan(bulan_cm)}
            bulanMb={namaBulan(bulan_mb)}
            bulan={new Date(tanggal + 'T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          />
        )}

        {baris.length ? (
          <TabelWilayah
            baris={barisTampil}
            bolehUbah={boleh_ubah}
            belumSimpan={new Set(Object.keys(ubahan).map((k) => Number(k.split('|')[0])))}
            onUbah={(branchId, kolom, v) => setUbahan((s) => ({ ...s, [`${branchId}|${kolom}`]: v }))}
            bulanCm={namaBulan(bulan_cm)}
            bulanMb={namaBulan(bulan_mb)}
            onCek={cek}
            onBuka={(b) => setBukaBaris(b)}
            onLog={lihatLog}
          />
        ) : (
          <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">Tidak ada kantor aktif di wilayah ini.</p>
        )}
        {bukaBaris && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setBukaBaris(null)}>
            <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-semibold">Buka {bukaBaris.unit}</h2>
              <p className="mt-1 text-[12px] text-slate-500">
                Alasan dicatat di riwayat bersama nama Anda. Minimal 5 huruf.
              </p>
              <textarea
                autoFocus
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded border px-2 py-1 text-sm"
                placeholder="Mis. kasir salah lapor storting"
              />
              <div className="mt-3 flex justify-end gap-2 text-sm">
                <button type="button" onClick={() => setBukaBaris(null)} className="rounded border px-3 py-1">Batal</button>
                <button type="button" onClick={buka} disabled={alasan.trim().length < 5} className="rounded bg-sky-600 px-3 py-1 text-white disabled:opacity-40">
                  Buka
                </button>
              </div>
            </div>
          </div>
        )}

        {log && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setLog(null)}>
            <div className="max-h-[70vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-semibold">Riwayat {log.unit}</h2>
              {!log.isi ? (
                <p className="mt-2 text-sm text-slate-500">Memuat…</p>
              ) : log.isi.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">Belum ada riwayat.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-[12px]">
                  {log.isi.map((l, i) => (
                    <li key={i} className="border-b pb-1">
                      <span className="font-medium">{l.aksi}</span>
                      {l.kolom && ` ${l.kolom}: ${l.lama ?? '-'} → ${l.baru ?? '-'}`}
                      {l.alasan && ` · ${l.alasan}`}
                      <span className="text-slate-400"> · {l.oleh} · {l.pada}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
