import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import BlokHari, { TANPA_TAMBALAN } from './RekapWilayah/BlokHari';
import RekapMingguan from './RekapWilayah/RekapMingguan';
import SaldoAwal from './RekapWilayah/SaldoAwal';

const namaBulan = (t) =>
  t ? new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : null;

const judulTanggal = (t) =>
  new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

/**
 * Rekap Sirkulasi Wilayah (.agents/rekap_sirkulasi_wilayah.md).
 *
 * Tidak ada tombol Simpan: tiap sel menyimpan sendiri saat ditinggalkan, dan
 * balasannya adalah kumulatif sebulan yang sudah dihitung ulang untuk kantor
 * itu.
 *
 * Filternya bulan, sama dengan Rekap 2, dan isinya sebulan penuh: satu blok
 * per tanggal, satu baris per kantor. Sel terisi lebih dulu dengan angka
 * sistem; staf kontrol menimpanya dengan angka yang dilaporkan kasir lewat WA.
 */
export default function RekapWilayah({
  wilayah,
  bulan,
  daftar_wilayah,
  boleh_ubah,
  bulan_lalu,
  bulan_cm,
  bulan_mb,
  kantor = [],
  mingguan = [],
  hari = [],
}) {
  // Angka hasil autosave, berkunci "tanggal|branch_id". Isinya mutasi yang
  // diketik DAN kumulatif yang dihitung ulang server, jadi satu sel yang
  // diubah di tanggal 5 langsung menggeser tanggal 6 ke atas di layar.
  const [tambalan, setTambalan] = useState({});
  const [menyimpan, setMenyimpan] = useState(0);
  const [bukaBaris, setBukaBaris] = useState(null);
  const [alasan, setAlasan] = useState('');
  const [log, setLog] = useState(null);

  // Tambalan dipecah per tanggal. Tanggal tanpa tambalan memakai acuan yang
  // SAMA (TANPA_TAMBALAN), supaya BlokHari yang dibungkus memo melewatkannya.
  const tambalanPerTanggal = useMemo(() => {
    const peta = {};
    for (const [kunci, v] of Object.entries(tambalan)) {
      const pisah = kunci.indexOf('|');
      (peta[kunci.slice(0, pisah)] ??= {})[kunci.slice(pisah + 1)] = v;
    }

    return peta;
  }, [tambalan]);

  const pindah = (ubah) =>
    router.get(route('laporan.rekap_wilayah.index'), { wilayah, bulan, ...ubah }, { preserveState: false });

  /**
   * Autosave satu sel, seperti Rekap 1: dikirim saat kotak ditinggalkan.
   *
   * Balasannya bukan halaman penuh melainkan tambalan JSON sebulan untuk
   * kantor itu — memuat ulang halaman berarti menghitung sebulan untuk 33
   * kantor, 1,9 detik dan 92 kueri.
   */
  const kirim = useCallback((janji, pesan) => {
    setMenyimpan((n) => n + 1);

    return janji
      .then(({ data }) => {
        setTambalan((s) => ({ ...s, ...data.tambalan }));
        if (pesan) toast.success(pesan);

        return true;
      })
      .catch((e) => {
        toast.error(e.response?.data?.message ?? 'Gagal menyimpan');
        // Layar bisa sudah berubah padahal server menolak; dimuat ulang
        // supaya yang terlihat tetap yang tersimpan.
        router.reload({ only: ['hari'], onSuccess: () => setTambalan({}) });

        return false;
      })
      .finally(() => setMenyimpan((n) => n - 1));
  }, []);

  const ubah = useCallback(
    (tanggal, branchId, kolom, nilai) => {
      const kunci = `${tanggal}|${branchId}`;
      setTambalan((s) => ({ ...s, [kunci]: { ...s[kunci], nilai: { ...s[kunci]?.nilai, [kolom]: nilai } } }));

      kirim(
        window.axios.post(route('laporan.rekap_wilayah.simpan'), {
          ringkas: true,
          baris: [{ branch_id: branchId, tanggal, nilai: { [kolom]: nilai } }],
        }),
      );
    },
    [kirim],
  );

  const cek = useCallback(
    (tanggal, b) =>
      kirim(
        window.axios.post(route('laporan.rekap_wilayah.cek', b.branch_id), { ringkas: true, tanggal }),
        `${b.unit} ${tanggal} dicek`,
      ),
    [kirim],
  );

  const buka = async () => {
    if (alasan.trim().length < 5) return;
    const { tanggal, baris } = bukaBaris;

    const berhasil = await kirim(
      window.axios.post(route('laporan.rekap_wilayah.buka', baris.branch_id), {
        ringkas: true,
        tanggal,
        alasan: alasan.trim(),
      }),
      `${baris.unit} dibuka`,
    );

    if (berhasil) {
      setBukaBaris(null);
      setAlasan('');
    }
  };

  const lihatLog = useCallback(async (tanggal, b) => {
    setLog({ judul: `${b.unit} · ${tanggal}`, isi: null });
    const r = await fetch(route('laporan.rekap_wilayah.log', b.branch_id) + `?tanggal=${tanggal}`);
    setLog({ judul: `${b.unit} · ${tanggal}`, isi: await r.json() });
  }, []);

  // Tanggal yang sedang terlihat di layar, supaya tombolnya menyala.
  // rootMargin atas = tinggi baris filter yang menempel; bawah -65% supaya
  // yang dihitung hanya blok di sepertiga atas layar, bukan semua yang
  // kebetulan terlihat.
  const [aktif, setAktif] = useState(null);
  const daftarHari = useRef([]);
  daftarHari.current = hari.map((h) => h.tanggal);

  useEffect(() => {
    const terlihat = new Set();
    const pengamat = new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          const t = e.target.id.replace('tgl-', '');
          e.isIntersecting ? terlihat.add(t) : terlihat.delete(t);
        }
        // Yang paling atas di antara yang terlihat.
        const urut = daftarHari.current.filter((t) => terlihat.has(t));
        if (urut.length) setAktif(urut[0]);
      },
      { rootMargin: '-120px 0px -65% 0px' },
    );

    document.querySelectorAll('section[id^="tgl-"]').forEach((el) => pengamat.observe(el));

    return () => pengamat.disconnect();
  }, [hari]);

  const namaBulanCm = useMemo(() => namaBulan(bulan_cm), [bulan_cm]);
  const namaBulanMb = useMemo(() => namaBulan(bulan_mb), [bulan_mb]);

  const mintaBuka = useCallback((tanggal, baris) => setBukaBaris({ tanggal, baris }), []);

  const terkunci = useCallback(
    (tanggal, b) => tambalan[`${tanggal}|${b.branch_id}`]?.terkunci ?? b.terkunci,
    [tambalan],
  );

  const totalBaris = hari.reduce((t, h) => t + h.baris.length, 0);
  const sudahDicek = hari.reduce((t, h) => t + h.baris.filter((b) => terkunci(h.tanggal, b)).length, 0);

  return (
    <>
      <Head title="Rekap Sirkulasi Wilayah" />
      <div className="space-y-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rekap Sirkulasi Wilayah</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {namaBulan(bulan + '-01')} · {hari.length} hari · {sudahDicek} dari {totalBaris} baris sudah dicek
          </p>
        </div>

        <div className="sticky top-0 z-40 -mx-2 flex flex-wrap items-center gap-2 bg-white/95 px-2 py-2 backdrop-blur">
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
            type="month"
            value={bulan}
            onChange={(e) => e.target.value && pindah({ bulan: e.target.value })}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          />
          {menyimpan > 0 && (
            <span className="text-[12px] text-sky-600">Menyimpan{menyimpan > 1 ? ` ${menyimpan}` : ''}…</span>
          )}
          <span className="text-[11px] text-slate-400">
            Diketik dalam ribuan (200 = 200.000). Tersimpan sendiri saat pindah kotak. Sel kuning = beda dengan Rekap
            2. Jumlah dan saldo dihitung sistem.
          </span>

          {/* Tombol tanggal seperti Rekap 2: lompat ke blok tanggal itu.
              Hijau = semua kantor sudah dicek, kelabu = hari libur. */}
          <div className="flex w-full flex-wrap gap-1">
            {hari.map((h) => {
              const dicek = h.baris.filter((b) => terkunci(h.tanggal, b)).length;
              const penuh = dicek === h.baris.length;

              return (
                <button
                  key={h.tanggal}
                  type="button"
                  title={`${judulTanggal(h.tanggal)} · ${dicek}/${h.baris.length} dicek`}
                  onClick={() => document.getElementById(`tgl-${h.tanggal}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`h-7 min-w-7 rounded-md border px-1.5 text-xs tabular-nums transition-colors ${
                    aktif === h.tanggal ? 'ring-2 ring-sky-500 ring-offset-1 font-semibold ' : ''
                  }${
                    !h.hari_kerja
                      ? 'border-slate-200 text-slate-300'
                      : penuh
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'hover:bg-slate-100'
                  }`}
                >
                  {Number(h.tanggal.slice(8))}
                </button>
              );
            })}
          </div>
        </div>

        {kantor.length > 0 && (
          <SaldoAwal
            baris={kantor}
            bulan={namaBulan(bulan + '-01')}
            bulanLalu={namaBulan(bulan_lalu)}
            bulanCm={namaBulan(bulan_cm)}
            bulanMb={namaBulan(bulan_mb)}
          />
        )}

        <RekapMingguan minggu={mingguan} unitKantor={Object.fromEntries(kantor.map((k) => [k.branch_id, k.unit]))} />

        {hari.length === 0 && (
          <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">
            Tidak ada kantor aktif di wilayah ini, atau bulan itu belum punya hari kerja.
          </p>
        )}

        {hari.map((h) => (
          <BlokHari
            key={h.tanggal}
            hari={h}
            tambalan={tambalanPerTanggal[h.tanggal] ?? TANPA_TAMBALAN}
            aktif={aktif === h.tanggal}
            bulanCm={namaBulanCm}
            bulanMb={namaBulanMb}
            onUbah={ubah}
            onCek={cek}
            onBuka={mintaBuka}
            onLog={lihatLog}
          />
        ))}

        {bukaBaris && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setBukaBaris(null)}>
            <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-semibold">
                Buka {bukaBaris.baris.unit} · {bukaBaris.tanggal}
              </h2>
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
                <button type="button" onClick={() => setBukaBaris(null)} className="rounded border px-3 py-1">
                  Batal
                </button>
                <button
                  type="button"
                  onClick={buka}
                  disabled={alasan.trim().length < 5}
                  className="rounded bg-sky-600 px-3 py-1 text-white disabled:opacity-40"
                >
                  Buka
                </button>
              </div>
            </div>
          </div>
        )}

        {log && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setLog(null)}>
            <div className="max-h-[70vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-semibold">Riwayat {log.judul}</h2>
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
                      <span className="text-slate-400">
                        {' '}
                        · {l.oleh} · {l.pada}
                      </span>
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
