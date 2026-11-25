import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import PilihBulan from "@/Components/shadcn/PilihBulan";
import { angka, satuanAngka, useModeRibuan } from "@/lib/modeAngka";
import { rp } from "@/lib/rupiah";
import { WARNA } from "@/Pages/Kasir/Rekap/Components/TableRekapKasir";
import { AlertTriangle, ArrowDown, ArrowUp, Archive, Check, Eye, RotateCcw, Save, Trash2, Undo2 } from "lucide-react";
import { konfirmasi } from '@/lib/konfirmasi';
import { toast } from 'sonner';

// Rancangan: .agents/rombak_resort.md §6–§9. Draf + pratinjau server, terapkan & batal.
const HARI = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
const H3 = { senin: "Sen", selasa: "Sel", rabu: "Rab", kamis: "Kam", jumat: "Jum", sabtu: "Sab" };
const NAMA_HARI = { senin: "Senin", selasa: "Selasa", rabu: "Rabu", kamis: "Kamis", jumat: "Jumat", sabtu: "Sabtu" };
const PILIH = "h-9 px-2 text-sm border rounded-md border-input bg-background";

const kunci = (g, h) => `${g}|${h}`;
const asalnya = (b) => kunci(b.grouping_id, b.hari);
const rb = (n) => angka(n);
const jumlah = (xs, f) => xs.reduce((s, x) => s + x[f], 0);
// Tempat parkir blok yang belum dapat kotak. Disimpan sebagai peta dengan ke_* NULL.
const STASH = "stash";

// Letak = hanya blok yang pindah (asal -> tujuan / STASH); yang tidak disebut ada di kotaknya sendiri.
const letakAwal = (draf) => {
  const l = {};
  (draf?.peta ?? []).forEach(
    (p) =>
      (l[kunci(p.dari_grouping_id, p.dari_hari)] =
        p.ke_grouping_id == null ? STASH : kunci(p.ke_grouping_id, p.ke_hari)),
  );
  return l;
};

// Pola Panah dari RencanaBersanding: naik/turun dibanding tabel Sebelum.
const Panah = ({ ini, dulu }) =>
  ini > dulu ? (
    <ArrowUp className="inline w-3 h-3 mr-1 text-emerald-600" aria-label="naik" />
  ) : ini < dulu ? (
    <ArrowDown className="inline w-3 h-3 mr-1 text-rose-600" aria-label="turun" />
  ) : null;

const KOLOM_SIRK = [["nasabah", "Nasabah"], ["saldo", "Sirkulasi"], ["cm", "Saldo CM"], ["mb", "Saldo MB"], ["ml", "Saldo ML"]];
const fmtSirk = (k, v) => (k === "nasabah" ? rp(v) : rb(v));

// Tabel saldo per kelompok, bentuk sama dengan "Saldo Awal Bulan" di Rekap 2.
// baris: [{label, nilai: {nasabah, saldo, cm, mb, ml}, dulu?}] — `dulu` = pembanding panah.
const TabelSirkulasi = ({ judul, baris }) => {
  const total = Object.fromEntries(KOLOM_SIRK.map(([k]) => [k, baris.reduce((s, r) => s + r.nilai[k], 0)]));
  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <div className="px-3 py-1.5 text-sm font-semibold border-b bg-slate-50 text-slate-800">{judul}</div>
      <table className="w-full text-xs tabular-nums">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2 font-medium text-left">Kelompok</th>
            {KOLOM_SIRK.map(([k, l]) => (
              <th key={k} className="px-3 py-2 font-medium text-right">{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {baris.map((r) => (
            <tr key={r.label} className="border-t even:bg-slate-50">
              <td className="px-3 py-1.5 font-medium">{r.label}</td>
              {KOLOM_SIRK.map(([k]) => (
                <td key={k} className={`px-3 py-1.5 text-right ${k === "saldo" ? "font-semibold" : ""}`}>
                  {r.dulu && <Panah ini={r.nilai[k]} dulu={r.dulu[k]} />}
                  {fmtSirk(k, r.nilai[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={`font-bold border-t text-slate-900 ${WARNA.hijau.total}`}>
            <td className="px-3 py-1.5">Total</td>
            {KOLOM_SIRK.map(([k]) => (
              <td key={k} className="px-3 py-1.5 text-right">{fmtSirk(k, total[k])}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const Blok = ({ b, pindah, terpilih, onPilih }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData("text/plain", kunci(b.grouping_id, b.hari));
      e.dataTransfer.effectAllowed = "move";
    }}
    onClick={(e) => {
      e.stopPropagation();
      onPilih();
    }}
    className={`cursor-grab select-none rounded border px-1.5 py-1 text-xs leading-tight ${
      pindah ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50"
    } ${terpilih ? "ring-2 ring-blue-500" : ""}`}
  >
    <div className="flex justify-between gap-1 font-semibold text-slate-800">
      <span>K{b.kelompok} {H3[b.hari]}</span>
      <span className="tabular-nums">{rb(b.saldo)}</span>
    </div>
    <div className="text-slate-600 tabular-nums">{b.nasabah} nsb</div>
    <div className="text-[10px] text-slate-500 tabular-nums">
      L {rb(b.lancar)} · CM {rb(b.cm)} · MB {rb(b.mb)} · ML {rb(b.ml)}
    </div>
    {(b.open > 0 || b.acc > 0) && (
      <div className="text-[10px] text-blue-700">open {b.open} · acc {b.acc}</div>
    )}
  </div>
);

const Bagian = ({ judul, children }) => (
  <div className="space-y-1">
    <div className="text-sm font-semibold text-slate-800">{judul}</div>
    {children}
  </div>
);
const TH = "px-2 py-1 font-medium text-left";
const TD = "px-2 py-1";

// Dialog pratinjau: semua angka dihitung server dari data asli (RombakResort::pratinjau).
const Pratinjau = ({ data, onTutup, onTerapkan, sibuk }) => (
  <Dialog open={!!data} onOpenChange={(o) => !o && onTutup()}>
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Pratinjau rombak · berlaku {data?.berlaku_bulan.slice(0, 7)}</DialogTitle>
      </DialogHeader>
      {data && (
        <div className="space-y-4 text-xs tabular-nums">
          {data.galat.length > 0 ? (
            <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">
              <div className="font-semibold">Belum bisa diterapkan:</div>
              {data.galat.map((g, i) => <div key={i}>• {g}</div>)}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 p-2 text-sm border rounded text-emerald-800 border-emerald-200 bg-emerald-50">
              <span>Tidak ada galat.</span>
              <Button size="sm" onClick={onTerapkan} disabled={sibuk}>
                <Check className="w-4 h-4 mr-1" /> {sibuk ? "Menerapkan…" : "Terapkan"}
              </Button>
            </div>
          )}

          <Bagian judul={`Kotak sesudah rombak (saldo awal ${data.berlaku_bulan.slice(0, 7)})`}>
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className={TH}>Resort</th><th className={TH}>Asal</th>
                  {["Nasabah", "Saldo", "Lancar", "CM", "MB", "ML"].map((l) => <th key={l} className={`${TH} text-right`}>{l}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.kotak.map((k) => (
                  <tr key={k.resort} className={`border-t ${k.berubah ? "bg-amber-50" : ""}`}>
                    <td className={`${TD} font-medium`}>{k.label}</td>
                    <td className={TD}>{k.asal.join(" + ")}</td>
                    <td className={`${TD} text-right`}>{rp(k.nasabah)}</td>
                    {["saldo", "lancar", "cm", "mb", "ml"].map((f) => <td key={f} className={`${TD} text-right`}>{rb(k[f])}</td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold border-t">
                  <td className={TD} colSpan={2}>Total</td>
                  <td className={`${TD} text-right`}>{rp(jumlah(data.kotak, "nasabah"))}</td>
                  {["saldo", "lancar", "cm", "mb", "ml"].map((f) => <td key={f} className={`${TD} text-right`}>{rb(jumlah(data.kotak, f))}</td>)}
                </tr>
              </tfoot>
            </table>
          </Bagian>

          <Bagian judul={`Pinjaman pindah: ${rp(jumlah(data.pindah, "aktif"))} aktif · ${jumlah(data.pindah, "open")} open · ${jumlah(data.pindah, "acc")} acc`}>
            <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.pindah.map((p) => (
                <div key={p.resort}>{p.label} → {p.ke}: {p.aktif} aktif{p.open ? ` · ${p.open} open` : ""}{p.acc ? ` · ${p.acc} acc` : ""}</div>
              ))}
            </div>
            <div className="text-slate-600">
              Transaksi bulan ini ikut pindah: {rp(data.angsuran_m.jumlah)} angsuran ({rb(data.angsuran_m.nominal)}) ·{" "}
              {data.angsuran_m.pemutihan_jumlah} pemutihan ({rb(data.angsuran_m.pemutihan_nominal)}) · {data.angsuran_m.penyesuaian_jumlah} penyesuaian saldo
            </div>
          </Bagian>

          <Bagian judul={`Hari terkunci yang akan dibuka: ${data.hari_dibuka.length}`}>
            {data.hari_dibuka.length === 0 ? (
              <div className="text-slate-500">Tidak ada.</div>
            ) : (
              <div>{data.hari_dibuka.map((h) => `K${h.kelompok} ${h.tanggal}`).join(" · ")}</div>
            )}
          </Bagian>

          <Bagian judul="Target hari tagih pertama (recount, resort yang berubah)">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr><th className={TH}>Resort</th><th className={TH}>Tanggal</th><th className={`${TH} text-right`}>Lama</th><th className={`${TH} text-right`}>Baru</th></tr>
              </thead>
              <tbody>
                {data.target.map((t) => (
                  <tr key={t.resort} className="border-t">
                    <td className={TD}>{t.label}</td>
                    <td className={TD}>{t.tanggal_pertama ?? "—"}</td>
                    <td className={`${TD} text-right`}>{t.lama === null ? "—" : rb(t.lama)}</td>
                    <td className={`${TD} text-right font-semibold`}>
                      {t.lama !== null && <Panah ini={t.baru} dulu={t.lama} />}
                      {rb(t.baru)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Bagian>

          <Bagian judul={`MACET LAMA dilebur: ${data.macet_lama.length} resort`}>
            {data.macet_lama.length === 0 && <div className="text-slate-500">Tidak ada resort dengan MACET LAMA ganda.</div>}
            {data.macet_lama.map((m) => (
              <div key={m.resort}>
                <b>{m.label}</b>: pertahankan #{m.pertahankan.id} (asal {m.pertahankan.asal}, {rb(m.pertahankan.saldo)}) ← lebur{" "}
                {m.lebur.map((l) => `#${l.id} (asal ${l.asal}, ${rb(l.saldo)})`).join(", ")} = {rb(m.saldo)}
              </div>
            ))}
          </Bagian>

          <Bagian judul={`Rekening: ${rp(data.rekening.ditimpa)} ditimpa ke resort tujuan · ${data.rekening.bentrok.length} bentrok (tidak diubah)`}>
            {data.rekening.bentrok.map((b) => (
              <div key={b.id} className="text-amber-800">#{b.id} {b.nama} → {b.ke}: {b.bentrok}</div>
            ))}
          </Bagian>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

// Rombak diterapkan / dibatalkan: angka dari `ringkasan` + peta yang dipakai.
const Ringkasan = ({ draf, kelompok }) => {
  const r = draf.ringkasan;
  const nama = Object.fromEntries(kelompok.map((k) => [k.id, k.kelompok]));
  const label = (g, h) => `K${nama[g] ?? "?"} ${H3[h] ?? h}`;
  return (
    <div className={`p-2 text-sm border rounded-lg space-y-1 ${draf.status === "diterapkan" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="font-semibold">
        Rombak #{draf.id} {draf.status} · berlaku {draf.berlaku_bulan.slice(0, 7)}
        {draf.diterapkan_at && ` · diterapkan ${draf.diterapkan_at}`}
        {draf.dibatalkan_at && ` · dibatalkan ${draf.dibatalkan_at}`}
      </div>
      {r && (
        <div className="text-xs tabular-nums">
          {rp(r.pinjaman.jumlah)} pinjaman pindah ({r.pinjaman.success} success · {r.pinjaman.open} open · {r.pinjaman.acc} acc) ·{" "}
          baris bulan ini: {r.baris_m.angsuran} angsuran, {r.baris_m.pemutihan} pemutihan, {r.baris_m.penyesuaian} penyesuaian ·{" "}
          {r.macet_lama} MACET LAMA dilebur · {r.target} target resort diubah · {r.hari_dibuka} hari dibuka ·{" "}
          {rp(r.rekening)} rekening ditimpa ({r.rekening_bentrok} bentrok)
        </div>
      )}
      {r?.batal && (
        <div className="text-xs">
          Batal: {rp(r.batal.pinjaman)} pinjaman kembali · {r.batal.hari_dibuka} hari dibuka · {r.batal.drop_sesudah} pinjaman baru sesudah terapkan tetap di resort baru
        </div>
      )}
      {draf.galat_batal?.length > 0 && <div className="text-xs text-red-700">Tidak bisa dibatalkan: {draf.galat_batal.join(" ")}</div>}
      <details className="text-xs">
        <summary className="cursor-pointer text-slate-600">Peta ({draf.peta.length} resort)</summary>
        <div className="grid gap-x-4 mt-1 sm:grid-cols-3 lg:grid-cols-6">
          {draf.peta.map((p) => (
            <div key={`${p.dari_grouping_id}|${p.dari_hari}`}>
              {label(p.dari_grouping_id, p.dari_hari)} → {label(p.ke_grouping_id, p.ke_hari)}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

const RombakResort = ({ kantor, branch_id, bulan, kelompok, blok, rombak, draf }) => {
  useModeRibuan();
  const { errors } = usePage().props;
  // Diterapkan / dibatalkan: `blok` = susunan sebelum rombak (server), jadi peta tetap ditumpuk = riwayat rencana.
  const [letak, setLetak] = useState(() => letakAwal(draf));
  const [catatan, setCatatan] = useState(draf?.catatan ?? "");
  const [pilih, setPilih] = useState(null);
  const [pratinjau, setPratinjau] = useState(null);
  const [memuat, setMemuat] = useState(false);
  const bisaSimpan = !draf || draf.status === "draf";
  const hanyaBaca = !bisaSimpan; // diterapkan / dibatalkan: papan = rencana waktu itu, terkunci
  const namaKantor = kantor.find((k) => k.id === branch_id)?.unit ?? "";

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setPilih(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const pindahkan = (asal, tujuan) => {
    if (hanyaBaca) return;
    if (blok.some((b) => asalnya(b) === asal)) setLetak({ ...letak, [asal]: tujuan });
    setPilih(null);
  };

  // Ganti bulan menjaga susunan di layar (preserveState); ganti kantor mulai dari nol.
  const muat = (param, preserveState) =>
    router.get(route("rombak_resort.index"), param, { preserveState, preserveScroll: true });

  // Blok yang belum punya letak (mis. baru muncul sesudah ganti bulan) = di kotaknya sendiri.
  const di = (b) => letak[asalnya(b)] ?? asalnya(b);

  const isiKotak = useMemo(() => {
    const isi = {};
    blok.forEach((b) => (isi[di(b)] ??= []).push(b));
    return isi;
  }, [blok, letak]);

  const berubah = blok.filter((b) => di(b) !== asalnya(b)); // dikirim sebagai peta (termasuk stash)
  const stash = isiKotak[STASH] ?? [];
  const pindah = berubah.filter((b) => di(b) !== STASH);
  const totalSebelum = { nasabah: jumlah(blok, "nasabah"), saldo: jumlah(blok, "saldo") };
  const sesudah = Object.values(isiKotak).flat();
  const totalSesudah = { nasabah: jumlah(sesudah, "nasabah"), saldo: jumlah(sesudah, "saldo") };

  // Sirkulasi per kelompok untuk tabel Sebelum/Sesudah.
  const jumlahBlok = (xs) => Object.fromEntries(KOLOM_SIRK.map(([k]) => [k, jumlah(xs, k)]));
  const perKelSebelum = Object.fromEntries(kelompok.map((k) => [k.id, jumlahBlok(blok.filter((b) => b.grouping_id === k.id))]));
  const perKelSesudah = Object.fromEntries(
    kelompok.map((k) => [k.id, jumlahBlok(HARI.flatMap((h) => isiKotak[kunci(k.id, h)] ?? []))]),
  );
  const alasanTutup = stash.length ? `Masih ada ${stash.length} blok di stash` : "Tahap berikutnya";

  // K5 (tidak memblokir): kelompok yang kehilangan blok tapi masih punya blok yang tetap.
  const gPindah = new Set(berubah.map((b) => b.grouping_id));
  const tertinggal = blok.filter(
    (b) => gPindah.has(b.grouping_id) && di(b) === asalnya(b),
  );
  const kosong = kelompok.filter(
    (k) => blok.some((b) => b.grouping_id === k.id) && HARI.every((h) => !isiKotak[kunci(k.id, h)]?.length),
  );

  const petaKirim = berubah.map((b) => {
    if (di(b) === STASH) return { dari_grouping_id: b.grouping_id, dari_hari: b.hari, ke_grouping_id: null, ke_hari: null };
    const [g, h] = di(b).split("|");
    return { dari_grouping_id: b.grouping_id, dari_hari: b.hari, ke_grouping_id: Number(g), ke_hari: h };
  });
  const urut = (ps) => JSON.stringify(ps.map((p) => [p.dari_grouping_id, p.dari_hari, p.ke_grouping_id, p.ke_hari]).sort());
  const tersimpan =
    draf && draf.berlaku_bulan.slice(0, 7) === bulan && (draf.catatan ?? "") === catatan && urut(draf.peta) === urut(petaKirim);

  const simpan = (onSuccess) =>
    router.post(
      route("rombak_resort.simpan"),
      { id: draf?.id ?? null, branch_id, berlaku_bulan: `${bulan}-01`, catatan: catatan || null, peta: petaKirim },
      // Gagal validasi -> susunan di layar tetap; berhasil -> dimuat ulang dari draf tersimpan.
      { preserveScroll: true, preserveState: "errors", onSuccess },
    );

  // Submit / Preview: simpan draf dulu kalau berubah, lalu minta pratinjau server.
  const lihat = async (id) => {
    setMemuat(true);
    try {
      const { data } = await axios.post(route("rombak_resort.pratinjau", id));
      setPratinjau(data);
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Pratinjau gagal dimuat.", { duration: Infinity });
    } finally {
      setMemuat(false);
    }
  };
  const submit = () => (tersimpan ? lihat(draf.id) : simpan((page) => page.props.draf?.id && lihat(page.props.draf.id)));

  // Terapkan: konfirmasi dengan mengetik nama kantor.
  const terapkan = async () => {
    if (!(await konfirmasi(`Terapkan rombak #${draf.id} untuk ${namaKantor}? Ketik nama kantor untuk konfirmasi.`, { ketik: namaKantor }))) return;
    router.post(route("rombak_resort.terapkan", draf.id), {}, {
      preserveScroll: true,
      onStart: () => setMemuat(true),
      onFinish: () => setMemuat(false),
      onSuccess: () => setPratinjau(null),
    });
  };
  const batal = async () => {
    if (!(await konfirmasi(`Batalkan rombak #${draf.id}? Pinjaman & transaksi bulan ${draf.berlaku_bulan.slice(0, 7)} kembali ke susunan lama.`))) return;
    router.post(route("rombak_resort.batal", draf.id), {}, {
      preserveScroll: true,
      onStart: () => setMemuat(true),
      onFinish: () => setMemuat(false),
    });
  };

  const hapus = async (r) => {
    if (!(await konfirmasi(`Hapus draf #${r.id} (berlaku ${r.berlaku_bulan})?`))) return;
    router.delete(route("rombak_resort.hapus", r.id), { preserveScroll: true, preserveState: true });
  };

  return (
    <>
      <Head title="Rombak Resort" />
      <Pratinjau data={pratinjau} onTutup={() => setPratinjau(null)} onTerapkan={terapkan} sibuk={memuat} />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Rombak Resort</h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Kotak = resort tujuan (kelompok × hari), isinya blok resort asal. Seret blok ke kotak lain,
            atau klik blok lalu klik kotak (Esc membatalkan). Saldo = saldo awal bulan berlaku (seperti Rekap bulan itu). {satuanAngka()}
          </p>
        </div>

        {/* Kepala */}
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-slate-500">
            Kantor
            <select
              className={`${PILIH} block mt-1`}
              value={branch_id}
              onChange={(e) => muat({ branch_id: e.target.value, bulan }, false)}
            >
              {kantor.map((k) => (
                <option key={k.id} value={k.id}>{k.unit}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-500">
            Berlaku mulai
            <PilihBulan
              className="mt-1 w-44"
              value={bulan}
              onChange={(e) => muat({ branch_id, bulan: e.target.value, rombak: draf?.id }, true)}
            />
          </label>
          <label className="flex-1 min-w-[14rem] text-xs text-slate-500">
            Catatan
            <Input className="mt-1" maxLength={255} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
          </label>
          <Button onClick={() => simpan()} disabled={!bisaSimpan}>
            <Save className="w-4 h-4 mr-1" /> Simpan draf{draf ? ` #${draf.id}` : ""}
          </Button>
          <Button
            variant="outline"
            onClick={submit}
            disabled={!bisaSimpan || stash.length > 0 || memuat}
            title={stash.length ? alasanTutup : tersimpan ? "Pratinjau draf tersimpan" : "Simpan draf lalu pratinjau"}
          >
            <Eye className="w-4 h-4 mr-1" /> {memuat ? "Menghitung…" : "Submit / Preview"}
          </Button>
          {draf?.status === "diterapkan" && (
            <Button
              variant="destructive"
              onClick={batal}
              disabled={memuat || draf.galat_batal?.length > 0}
              title={draf.galat_batal?.join(" ") || "Kembalikan ke susunan lama"}
            >
              <Undo2 className="w-4 h-4 mr-1" /> {memuat ? "Membatalkan…" : "Batal rombak"}
            </Button>
          )}
          {draf?.status === "dibatalkan" && (
            <Button
              variant="outline"
              onClick={() => router.post(route("rombak_resort.salin", draf.id))}
              disabled={memuat}
              title="Buat draf baru (bulan berjalan) dengan peta yang sama, bisa diedit lalu diterapkan lagi"
            >
              Salin jadi draf baru
            </Button>
          )}
          {stash.length > 0 && <span className="text-xs text-amber-700">Masih ada {stash.length} blok di stash</span>}
        </div>

        {Object.values(errors ?? {}).length > 0 && (
          <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">
            {Object.values(errors).map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        {hanyaBaca && <Ringkasan draf={draf} kelompok={kelompok} />}

        <div className="flex flex-wrap items-start gap-4">
          {/* Daftar rombak */}
          <div className="w-64 p-2 text-sm border rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">Rombak kantor ini</span>
              <Link
                className="text-xs text-blue-600"
                title="Mulai rancangan baru dari susunan sekarang"
                href={route("rombak_resort.index", { branch_id, bulan })}
              >
                + Rombak baru
              </Link>
            </div>
            {rombak.length === 0 && <div className="text-xs text-slate-400">Belum ada.</div>}
            {rombak.map((r) => (
              <div
                key={r.id}
                className={`flex items-center justify-between gap-1 rounded px-1 py-0.5 ${r.id === draf?.id ? "bg-blue-50" : ""}`}
              >
                <Link href={route("rombak_resort.index", { branch_id, rombak: r.id })} className="flex-1 min-w-0">
                  <div className="truncate">
                    #{r.id} · {r.berlaku_bulan.slice(0, 7)} · <span className="text-slate-500">{r.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {r.jumlah_pindah} pindah{r.catatan ? ` · ${r.catatan}` : ""}
                  </div>
                </Link>
                {r.status === "draf" && (
                  <button type="button" title="Hapus draf" onClick={() => hapus(r)} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Ringkasan + peringatan */}
          <div className="flex-1 min-w-[18rem] p-2 text-sm border rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span>
                <b>{pindah.length}</b> resort pindah · <b>{rp(jumlah(pindah, "nasabah"))}</b> nasabah pindah
              </span>
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              Total kantor sebelum {rp(totalSebelum.nasabah)} nsb · {rb(totalSebelum.saldo)} — sesudah{" "}
              {rp(totalSesudah.nasabah)} nsb · {rb(totalSesudah.saldo)}
              {(totalSebelum.nasabah !== totalSesudah.nasabah || totalSebelum.saldo !== totalSesudah.saldo) && (
                <b className="ml-1 text-red-600">TIDAK SAMA</b>
              )}
            </div>
            {(kosong.length > 0 || tertinggal.length > 0 || stash.length > 0) && (
              <div className="p-1.5 text-xs border rounded border-amber-200 bg-amber-50 text-amber-900">
                <div className="flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> Peringatan (tidak memblokir)
                </div>
                {stash.length > 0 && (
                  <div>
                    Stash: {stash.length} blok · {rp(jumlah(stash, "nasabah"))} nasabah belum dapat kotak
                  </div>
                )}
                {kosong.length > 0 && (
                  <div>Kelompok kosong sesudah rombak: {kosong.map((k) => `K${k.kelompok}`).join(", ")}</div>
                )}
                {tertinggal.map((b) => (
                  <div key={kunci(b.grouping_id, b.hari)}>
                    K{b.kelompok} {NAMA_HARI[b.hari]}: {b.nasabah} nasabah tetap di kel {b.kelompok}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sirkulasi per kelompok: sebelum (susunan sekarang) | sesudah (susunan papan, langsung). */}
        <div className="grid gap-4 lg:grid-cols-2">
          <TabelSirkulasi judul="Sebelum" baris={kelompok.map((k) => ({ label: k.kelompok, nilai: perKelSebelum[k.id] }))} />
          <TabelSirkulasi
            judul="Sesudah"
            baris={[
              ...kelompok.map((k) => ({ label: k.kelompok, nilai: perKelSesudah[k.id], dulu: perKelSebelum[k.id] })),
              ...(stash.length ? [{ label: "Stash", nilai: jumlahBlok(stash) }] : []),
            ]}
          />
        </div>

        {/* Kepala papan + stash. */}
        <div className="sticky top-0 z-10 p-2 space-y-2 bg-white border rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              Papan{hanyaBaca ? " — rencana rombak (susunan sebelum rombak), hanya baca" : ""}
            </span>
            <Button size="sm" variant="outline" className="ml-auto" disabled={hanyaBaca} onClick={() => {
              setLetak(Object.fromEntries(blok.map((b) => [asalnya(b), STASH])));
              setPilih(null);
            }}>
              <Archive className="w-4 h-4 mr-1" /> Semua ke stash
            </Button>
            <Button size="sm" variant="ghost" disabled={hanyaBaca} onClick={() => { setLetak({}); setPilih(null); }}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pindahkan(e.dataTransfer.getData("text/plain"), STASH);
            }}
            onClick={() => pilih && pindahkan(pilih, STASH)}
            className={`flex flex-wrap gap-1 p-1.5 overflow-y-auto border border-dashed rounded max-h-48 min-h-[3rem] bg-slate-50 ${
              pilih ? "cursor-pointer hover:bg-blue-50" : ""
            }`}
          >
            {stash.length === 0 && (
              <div className="self-center w-full text-xs text-center text-slate-400">
                Stash kosong — tarik blok ke sini untuk diparkir dulu.
              </div>
            )}
            {stash.map((b) => {
              const bk = asalnya(b);
              return (
                <div key={bk} className="w-40">
                  <Blok b={b} pindah terpilih={pilih === bk} onPilih={() => setPilih(pilih === bk ? null : bk)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Penyusun: baris = kelompok, kolom = hari. Scroll horizontal di dalam kontainer saja. */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="sticky left-0 px-2 py-1 text-left bg-slate-50">Kel</th>
                {HARI.map((h) => (
                  <th key={h} className="px-2 py-1 font-medium text-left min-w-[11rem]">{NAMA_HARI[h]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kelompok.map((k) => (
                <tr key={k.id} className="border-t align-top">
                  <th className="sticky left-0 px-2 py-1 font-medium text-left bg-white text-slate-700">{k.kelompok}</th>
                  {HARI.map((h) => {
                    const kk = kunci(k.id, h);
                    const isi = isiKotak[kk] ?? [];
                    return (
                      <td
                        key={h}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          pindahkan(e.dataTransfer.getData("text/plain"), kk);
                        }}
                        onClick={() => pilih && pindahkan(pilih, kk)}
                        className={`p-1 border-l w-[11rem] ${pilih ? "cursor-pointer hover:bg-blue-50" : ""}`}
                      >
                        <div className="space-y-1 min-h-[3rem]">
                          {isi.length === 0 && <div className="py-3 text-xs text-center text-slate-300">(kosong)</div>}
                          {isi.map((b) => {
                            const bk = asalnya(b);
                            return (
                              <Blok
                                key={bk}
                                b={b}
                                pindah={di(b) !== bk}
                                terpilih={pilih === bk}
                                onPilih={() => setPilih(pilih === bk ? null : bk)}
                              />
                            );
                          })}
                        </div>
                        {isi.length > 0 && (
                          <div className="pt-1 mt-1 text-[11px] border-t text-slate-600 tabular-nums">
                            Σ {rp(jumlah(isi, "nasabah"))} nsb · {rb(jumlah(isi, "saldo"))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RombakResort;
