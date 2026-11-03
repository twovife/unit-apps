import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import PilihBulan from "@/Components/shadcn/PilihBulan";
import { angka, satuanAngka, useModeRibuan } from "@/lib/modeAngka";
import { rp } from "@/lib/rupiah";
import { AlertTriangle, RotateCcw, Save, Trash2 } from "lucide-react";

// Rancangan: .agents/rombak_resort.md §6. Tahap ini hanya draf — Submit/Preview & Terapkan belum ada.
const HARI = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
const H3 = { senin: "Sen", selasa: "Sel", rabu: "Rab", kamis: "Kam", jumat: "Jum", sabtu: "Sab" };
const NAMA_HARI = { senin: "Senin", selasa: "Selasa", rabu: "Rabu", kamis: "Kamis", jumat: "Jumat", sabtu: "Sabtu" };
const PILIH = "h-9 px-2 text-sm border rounded-md border-input bg-background";

const kunci = (g, h) => `${g}|${h}`;
const asalnya = (b) => kunci(b.grouping_id, b.hari);
const rb = (n) => angka(n, { bulat: true });

// Letak = hanya blok yang pindah (asal -> tujuan); yang tidak disebut ada di kotaknya sendiri.
const letakAwal = (draf) => {
  const l = {};
  (draf?.peta ?? []).forEach((p) => (l[kunci(p.dari_grouping_id, p.dari_hari)] = kunci(p.ke_grouping_id, p.ke_hari)));
  return l;
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

const RombakResort = ({ kantor, branch_id, bulan, kelompok, blok, rombak, draf }) => {
  useModeRibuan();
  const { errors } = usePage().props;
  const [letak, setLetak] = useState(() => letakAwal(draf));
  const [catatan, setCatatan] = useState(draf?.catatan ?? "");
  const [pilih, setPilih] = useState(null);
  const bisaSimpan = !draf || draf.status === "draf";

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setPilih(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const pindahkan = (asal, tujuan) => {
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

  const pindah = blok.filter((b) => di(b) !== asalnya(b));
  const jumlah = (xs, f) => xs.reduce((s, x) => s + x[f], 0);
  const totalSebelum = { nasabah: jumlah(blok, "nasabah"), saldo: jumlah(blok, "saldo") };
  const sesudah = Object.values(isiKotak).flat();
  const totalSesudah = { nasabah: jumlah(sesudah, "nasabah"), saldo: jumlah(sesudah, "saldo") };

  // K5 (tidak memblokir): kelompok yang kehilangan blok tapi masih punya blok yang tetap.
  const gPindah = new Set(pindah.map((b) => b.grouping_id));
  const tertinggal = blok.filter(
    (b) => gPindah.has(b.grouping_id) && di(b) === asalnya(b),
  );
  const kosong = kelompok.filter(
    (k) => blok.some((b) => b.grouping_id === k.id) && HARI.every((h) => !isiKotak[kunci(k.id, h)]?.length),
  );

  const simpan = () =>
    router.post(
      route("rombak_resort.simpan"),
      {
        id: draf?.id ?? null,
        branch_id,
        berlaku_bulan: `${bulan}-01`,
        catatan: catatan || null,
        peta: pindah.map((b) => {
          const [g, h] = di(b).split("|");
          return { dari_grouping_id: b.grouping_id, dari_hari: b.hari, ke_grouping_id: Number(g), ke_hari: h };
        }),
      },
      // Gagal validasi -> susunan di layar tetap; berhasil -> dimuat ulang dari draf tersimpan.
      { preserveScroll: true, preserveState: "errors" },
    );

  const hapus = (r) => {
    if (!window.confirm(`Hapus draf #${r.id} (berlaku ${r.berlaku_bulan})?`)) return;
    router.delete(route("rombak_resort.hapus", r.id), { preserveScroll: true, preserveState: true });
  };

  return (
    <>
      <Head title="Rombak Resort" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Rombak Resort</h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Kotak = resort tujuan (kelompok × hari), isinya blok resort asal. Seret blok ke kotak lain,
            atau klik blok lalu klik kotak (Esc membatalkan). Saldo per akhir bulan sebelum berlaku. {satuanAngka()}
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
          <Button onClick={simpan} disabled={!bisaSimpan}>
            <Save className="w-4 h-4 mr-1" /> Simpan draf{draf ? ` #${draf.id}` : ""}
          </Button>
          <Button variant="outline" disabled title="Tahap berikutnya">Submit / Preview</Button>
          <Button variant="outline" disabled>Terapkan — belum tersedia</Button>
        </div>

        {Object.values(errors ?? {}).length > 0 && (
          <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">
            {Object.values(errors).map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <div className="flex flex-wrap items-start gap-4">
          {/* Daftar rombak */}
          <div className="w-64 p-2 text-sm border rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">Rombak kantor ini</span>
              <Link className="text-xs text-blue-600" href={route("rombak_resort.index", { branch_id, bulan })}>
                + baru
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
              <Button size="sm" variant="ghost" onClick={() => { setLetak({}); setPilih(null); }}>
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </Button>
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              Total kantor sebelum {rp(totalSebelum.nasabah)} nsb · {rb(totalSebelum.saldo)} — sesudah{" "}
              {rp(totalSesudah.nasabah)} nsb · {rb(totalSesudah.saldo)}
              {(totalSebelum.nasabah !== totalSesudah.nasabah || totalSebelum.saldo !== totalSesudah.saldo) && (
                <b className="ml-1 text-red-600">TIDAK SAMA</b>
              )}
            </div>
            {(kosong.length > 0 || tertinggal.length > 0) && (
              <div className="p-1.5 text-xs border rounded border-amber-200 bg-amber-50 text-amber-900">
                <div className="flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> Peringatan (tidak memblokir)
                </div>
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
