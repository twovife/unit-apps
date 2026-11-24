import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import BlokHari, { TANPA_TAMBALAN } from './RekapWilayah/BlokHari';
import DrawerRekapDua from './RekapWilayah/DrawerRekapDua';
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
  const [rekapDua, setRekapDua] = useState(null);
  // Saldo awal yang baru diketik, per branch_id. Balasan server berisi baris
  // harian saja, jadi panelnya ditambal dari yang dikirim.
  const [tambalanAwal, setTambalanAwal] = useState({});
  const [mengisi, setMengisi] = useState(false);
  const [mengekspor, setMengekspor] = useState(false);

  // Panel accordion dibuka sebelum cetak, kalau tidak isinya hilang dari
  // kertas: <details> yang tertutup memang tidak dirender.
  useEffect(() => {
    const buka = () => document.querySelectorAll('details:not([open])').forEach((d) => (d.open = true));
    window.addEventListener('beforeprint', buka);

    return () => window.removeEventListener('beforeprint', buka);
  }, []);

  // exceljs 900 KB, diimpor hanya saat tombolnya ditekan.
  const unduh = async () => {
    setMengekspor(true);
    try {
      const { unduhExcel } = await import('./RekapWilayah/ekspor');
      const { gabung } = await import('./RekapWilayah/kolom');

      // Angka hasil autosave ikut diekspor, bukan angka saat halaman dibuka.
      const hariGabung = hari.map((h) => ({
        ...h,
        baris: h.baris.map((b) => gabung(b, tambalan[`${h.tanggal}|${b.branch_id}`])),
      }));

      await unduhExcel({
        wilayah,
        bulan,
        namaBulan: namaBulan(bulan + '-01'),
        kantor,
        hari: hariGabung,
      });
    } catch (e) {
      toast.error('Gagal menyusun berkas Excel');
      console.error(e);
    } finally {
      setMengekspor(false);
    }
  };

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

  // Isi sebulan dari angka sistem, tanpa dicek. Barisnya jadi tersimpan, jadi
  // sesudah ini layar tidak bisa lagi membedakan "kasir melapor sama dengan
  // sistem" dari "belum ada laporan".
  const isiSistem = () => {
    if (!confirm(`Isi semua baris ${namaBulan(bulan + '-01')} dari Rekap 2?\n\nBaris yang sudah diketik atau sudah dicek tidak disentuh.`)) {
      return;
    }

    setMengisi(true);
    router.post(
      route('laporan.rekap_wilayah.isi_sistem'),
      { wilayah, bulan },
      {
        preserveScroll: true,
        onSuccess: () => setTambalan({}),
        onError: (e) => toast.error(Object.values(e)[0] ?? 'Gagal mengisi'),
        onFinish: () => setMengisi(false),
      },
    );
  };

  // Saldo awal bulan versi laporan kantor. Tabel sendiri, satu baris per
  // kantor per bulan; mengubahnya menggeser seluruh kumulatif bulan itu, jadi
  // balasannya tambalan yang sama dengan autosave harian.
  const ubahAwal = useCallback(
    (branchId, kolom, nilai) => {
      setTambalanAwal((s) => ({ ...s, [branchId]: { ...s[branchId], [kolom]: nilai } }));

      return kirim(
        window.axios.post(route('laporan.rekap_wilayah.simpan_awal', branchId), {
          periode: bulan + '-01',
          nilai: { [kolom]: nilai },
        }),
      );
    },
    [kirim, bulan],
  );

  const kantorGabung = useMemo(
    () =>
      kantor.map((b) =>
        tambalanAwal[b.branch_id] ? { ...b, diketik: { ...(b.diketik ?? {}), ...tambalanAwal[b.branch_id] } } : b,
      ),
    [kantor, tambalanAwal],
  );

  // Nama kantor diklik: Rekap 2 kantor itu, ditumpangkan di drawer.
  const lihatRekapDua = useCallback(
    (tanggal, b) => setRekapDua({ branch_id: b.branch_id, unit: b.unit, bulan: tanggal.slice(0, 7) }),
    [],
  );

  // Tanggal yang tombolnya menyala. Diisi saat tombolnya diklik.
  //
  // Dulu diikutkan posisi gulir lewat IntersectionObserver, dan itu menyalakan
  // render ulang halaman tiap kali layar bergeser — 25 blok dibandingkan ulang
  // sambil menggulir. Dibuang atas permintaan mas 2026-11-24.
  const [aktif, setAktif] = useState(null);

  // Jarak judul tanggal dari atas layar sesudah melompat: navbar + baris
  // filter. Sama dengan scroll-mt-36 (9rem) di BlokHari.
  const ATAS = 144;

  const lompat = (tanggal, halus = true) => {
    setAktif(tanggal);
    const cari = () => document.getElementById(`tgl-${tanggal}`);
    cari()?.scrollIntoView({ behavior: halus ? 'smooth' : 'auto', block: 'start' });

    // Blok yang dilewati dipasang & dilepas sambil digulir, dan tingginya
    // berubah saat itu, jadi sasarannya bergeser. Dibetulkan berulang sampai
    // judulnya benar-benar berhenti di tempatnya.
    let sisa = 10;
    const betulkan = () => {
      const el = cari();
      if (!el || sisa-- <= 0) {
        return;
      }

      if (Math.abs(el.getBoundingClientRect().top - ATAS) > 4) {
        el.scrollIntoView({ block: 'start' });
      }

      setTimeout(betulkan, 120);
    };

    setTimeout(betulkan, 120);
  };

  // Halaman dibuka langsung di tanggal hari ini, bukan di tanggal 1: yang
  // dikerjakan staf kontrol hampir selalu hari ini. Bulan lain tidak digeser.
  useEffect(() => {
    const ini = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD waktu setempat
    if (hari.some((h) => h.tanggal === ini)) lompat(ini, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulan, wilayah]);

  const namaBulanCm = useMemo(() => namaBulan(bulan_cm), [bulan_cm]);
  const namaBulanMb = useMemo(() => namaBulan(bulan_mb), [bulan_mb]);

  const mintaBuka = useCallback((tanggal, baris) => setBukaBaris({ tanggal, baris }), []);

  const terkunci = useCallback(
    (tanggal, b) => tambalan[`${tanggal}|${b.branch_id}`]?.terkunci ?? b.terkunci,
    [tambalan],
  );

  // Tanggal yang belum terjadi tidak ikut dihitung: barisnya memang belum
  // bisa dicek, jadi memasukkannya membuat "x dari y" terlihat tertinggal.
  const berjalan = hari.filter((h) => !h.mendatang);
  const totalBaris = berjalan.reduce((t, h) => t + h.baris.length, 0);
  const sudahDicek = berjalan.reduce((t, h) => t + h.baris.filter((b) => terkunci(h.tanggal, b)).length, 0);

  return (
    <>
      <Head title="Rekap Sirkulasi Wilayah" />
      <div className="space-y-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight print:text-base">Rekap Sirkulasi Wilayah</h1>
          <p className="mt-1 text-sm text-muted-foreground print:text-[11px]">
            Wilayah {wilayah} · {namaBulan(bulan + '-01')} · {hari.length} hari · {sudahDicek} dari {totalBaris} baris
            sudah dicek
          </p>
        </div>

        {/* top-14 = tinggi navbar (h-14); top-0 dulu menutupinya saat digulir. */}
        <div className="tanpa-cetak sticky top-14 z-30 -mx-2 flex flex-wrap items-center gap-2 border-b bg-white px-2 py-2">
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
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!hari.length}
            className="h-9 rounded-md border px-3 text-sm hover:bg-slate-100 disabled:opacity-40"
          >
            Cetak / PDF
          </button>
          <button
            type="button"
            onClick={unduh}
            disabled={!hari.length || mengekspor}
            className="h-9 rounded-md border px-3 text-sm hover:bg-slate-100 disabled:opacity-40"
          >
            {mengekspor ? 'Menyusun…' : 'Excel'}
          </button>
          {boleh_ubah && (
            <button
              type="button"
              onClick={isiSistem}
              disabled={!hari.length || mengisi}
              title="Buat baris untuk tanggal yang belum terisi, memakai angka Rekap 2. Tidak mencentang apa pun."
              className="h-9 rounded-md border px-3 text-sm hover:bg-slate-100 disabled:opacity-40"
            >
              {mengisi ? 'Mengisi…' : 'Isi dari Rekap 2'}
            </button>
          )}
          {menyimpan > 0 && (
            <span className="text-[12px] text-sky-600">Menyimpan{menyimpan > 1 ? ` ${menyimpan}` : ''}…</span>
          )}
          <span className="text-[11px] text-slate-400">
            Diketik dalam ribuan (200 = 200.000). Tersimpan sendiri saat pindah kotak. Sel merah = beda dengan Rekap
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
                  disabled={h.mendatang}
                  title={
                    h.mendatang
                      ? `${judulTanggal(h.tanggal)} · belum terjadi`
                      : `${judulTanggal(h.tanggal)} · ${dicek}/${h.baris.length} dicek`
                  }
                  onClick={() => lompat(h.tanggal)}
                  className={`h-7 min-w-7 rounded-md border px-1.5 text-xs tabular-nums transition-all ${
                    // Yang dipilih dibalik warnanya, bukan diberi cincin:
                    // cincin tipis tenggelam di antara 30 tombol.
                    aktif === h.tanggal
                      ? 'scale-110 border-sky-700 bg-sky-600 font-bold text-white shadow'
                      : h.mendatang
                        ? 'cursor-not-allowed border-dashed border-slate-200 text-slate-300'
                        : !h.hari_kerja
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
            baris={kantorGabung}
            bulan={namaBulan(bulan + '-01')}
            bulanLalu={namaBulan(bulan_lalu)}
            bulanCm={namaBulan(bulan_cm)}
            bulanMb={namaBulan(bulan_mb)}
            bolehUbah={boleh_ubah}
            onUbah={ubahAwal}
          />
        )}

        {hari.length === 0 && (
          <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">
            Tidak ada kantor aktif di wilayah ini, atau bulan itu belum punya hari kerja.
          </p>
        )}

        {hari.map((h, i) => (
          <BlokHari
            key={h.tanggal}
            hari={h}
            pertama={i === 0}
            tambalan={tambalanPerTanggal[h.tanggal] ?? TANPA_TAMBALAN}
            aktif={aktif === h.tanggal}
            bulanCm={namaBulanCm}
            bulanMb={namaBulanMb}
            onUbah={ubah}
            onCek={cek}
            onBuka={mintaBuka}
            onLog={lihatLog}
            onKantor={lihatRekapDua}
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

        <DrawerRekapDua kantor={rekapDua} onTutup={() => setRekapDua(null)} />

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
