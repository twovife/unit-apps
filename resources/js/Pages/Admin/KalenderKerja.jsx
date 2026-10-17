import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Lock,
} from "lucide-react";

const NAMA_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const Kartu = ({ judul, utama, bawah, nada = "netral" }) => (
  <div
    className={`rounded-lg border p-4 ${
      {
        netral: "border-slate-200 bg-white",
        baik: "border-emerald-200 bg-emerald-50/40",
        ingat: "border-amber-300 bg-amber-50/60",
      }[nada]
    }`}
  >
    <div className="text-xs font-medium tracking-wide uppercase text-slate-500">
      {judul}
    </div>
    <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
      {utama}
    </div>
    {bawah && <div className="mt-0.5 text-xs text-slate-500">{bawah}</div>}
  </div>
);

const KalenderKerja = ({ kalender, server_filter }) => {
  const [dipilih, setDipilih] = useState(null);
  const [keterangan, setKeterangan] = useState("");

  const pindahBulan = (periode) =>
    router.get(route("kalender.index"), { periode }, { preserveScroll: true });

  const buka = (h) => {
    setDipilih(h);
    setKeterangan(h.keterangan ?? "");
  };

  const tetapkan = (isLibur) => {
    router.post(
      route("kalender.simpan"),
      { tanggal: dipilih.tanggal, is_libur: isLibur, keterangan },
      { preserveScroll: true, onSuccess: () => setDipilih(null) },
    );
  };

  const terapkanSaran = () => {
    if (
      !window.confirm(
        `Terapkan ${kalender.jumlah_saran} saran untuk ${kalender.nama_periode}?\n\n` +
          "Hanya tanggal yang belum ditetapkan yang disentuh. Penetapan yang sudah " +
          "ada adalah keputusan orang dan tidak akan ditimpa.",
      )
    )
      return;

    router.post(
      route("kalender.terapkan_saran"),
      { periode: `${kalender.periode}-01` },
      { preserveScroll: true },
    );
  };

  // Susun grid: baris minggu, kolom Senin..Minggu.
  const hari = kalender?.hari ?? [];
  const kotakKosongAwal = hari.length ? hari[0].urut_hari - 1 : 0;
  const sel = [...Array(kotakKosongAwal).fill(null), ...hari];

  return (
    <Authenticated>
      <Head title="Kalender Kerja" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Kalender Kerja Nasional
            </h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Berlaku untuk seluruh kantor sekaligus. Menentukan tanggal mana
              yang punya baris closing harian — dan karena tanda tangan bulanan
              mensyaratkan semua hari kerja terkunci, satu hari libur yang lupa
              ditandai membuat bulan itu <b>tidak akan pernah bisa ditutup</b>.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={!kalender?.ada_bulan_sebelumnya}
              title={
                kalender?.ada_bulan_sebelumnya
                  ? undefined
                  : `Kalender hanya berlaku sejak ${kalender?.nama_bulan_paling_awal}`
              }
              onClick={() => pindahBulan(server_filter?.sebelumnya)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[9rem] text-center text-sm font-medium">
              {kalender?.nama_periode}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pindahBulan(server_filter?.berikutnya)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu judul="Hari kerja" utama={kalender?.hari_kerja} />
          <Kartu judul="Hari libur" utama={kalender?.hari_libur} />
          <Kartu
            judul="Belum ditetapkan"
            utama={kalender?.belum_ditetapkan}
            bawah="memakai bawaan Senin–Sabtu"
            nada={kalender?.belum_ditetapkan > 0 ? "ingat" : "baik"}
          />
          <Kartu
            judul="Saran"
            utama={kalender?.jumlah_saran}
            bawah="Minggu dan libur bertanggal tetap"
          />
        </div>

        {!kalender?.sudah_dikonfirmasi && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm border rounded-lg border-amber-300 bg-amber-50/60 text-amber-900">
            <div className="flex items-start gap-2">
              <CalendarDays className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="max-w-2xl">
                <b>{kalender?.nama_periode} belum dikonfirmasi.</b> Alurnya tidak
                diblokir — semuanya jatuh ke bawaan Senin–Sabtu, jadi libur
                nasional apa pun di bulan ini masih terhitung hari kerja.
              </span>
            </div>
            {kalender?.jumlah_saran > 0 && (
              <Button onClick={terapkanSaran} size="sm">
                <Lightbulb className="w-4 h-4 mr-1.5" />
                Terapkan {kalender.jumlah_saran} saran
              </Button>
            )}
          </div>
        )}

        <div className="p-3 bg-white border rounded-lg border-slate-200">
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {NAMA_HARI.map((n) => (
              <div
                key={n}
                className="py-1 text-xs font-medium text-center text-slate-500"
              >
                {n}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {sel.map((h, i) =>
              h === null ? (
                <div key={`kosong-${i}`} />
              ) : (
                <button
                  key={h.tanggal}
                  onClick={() => buka(h)}
                  className={`relative min-h-[5.5rem] rounded-md border p-2 text-left transition hover:ring-2 hover:ring-slate-300 ${
                    h.is_libur
                      ? "border-red-200 bg-red-50/70"
                      : "border-slate-200 bg-white"
                  } ${!h.ditetapkan ? "border-dashed" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        h.is_libur ? "text-red-700" : "text-slate-900"
                      }`}
                    >
                      {h.tanggal_pendek}
                    </span>
                    {h.closing_terkunci > 0 && (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>

                  {h.keterangan && (
                    <div
                      className={`mt-0.5 line-clamp-2 text-[10px] leading-tight ${
                        h.ditetapkan ? "text-slate-600" : "text-amber-700"
                      }`}
                    >
                      {h.keterangan}
                    </div>
                  )}

                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-end text-[10px] text-slate-400">
                    {!h.ditetapkan && <span>bawaan</span>}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 border rounded border-slate-200 bg-white" />
            hari kerja
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 border rounded border-red-200 bg-red-50" />
            libur
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 border border-dashed rounded border-slate-400" />
            belum ditetapkan (pakai bawaan)
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> ada closing terkunci
          </span>
          <span>klik tanggal untuk mengubah</span>
        </div>

        <Dialog open={!!dipilih} onOpenChange={(o) => !o && setDipilih(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dipilih?.nama_hari}, {dipilih?.tanggal}
              </DialogTitle>
            </DialogHeader>

            {dipilih && (
              <div className="space-y-3">
                <div className="p-2 text-sm rounded bg-slate-50">
                  <div className="text-xs text-slate-500">Sekarang</div>
                  <div className="font-medium">
                    {dipilih.is_libur ? "Libur" : "Hari kerja"}
                    {!dipilih.ditetapkan && (
                      <span className="text-slate-400"> (bawaan)</span>
                    )}
                  </div>
                </div>

                {dipilih.disarankan_libur && !dipilih.ditetapkan && (
                  <div className="flex items-start gap-2 p-2 text-xs border rounded border-amber-300 bg-amber-50/60 text-amber-900">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>Disarankan libur — {dipilih.keterangan}</span>
                  </div>
                )}

                {dipilih.closing_baris > 0 && (
                  <div className="text-xs text-slate-600">
                    {dipilih.closing_baris} baris closing,{" "}
                    {dipilih.closing_terkunci} terkunci, {dipilih.closing_berisi}{" "}
                    berisi angka.
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-500">Keterangan</label>
                  <Input
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="mis. Hari Kemerdekaan RI"
                    className="mt-1"
                  />
                </div>

                {!dipilih.boleh_jadi_libur && (
                  <div className="p-2 text-xs border rounded border-red-300 bg-red-50/60 text-red-900">
                    Tidak bisa dijadikan libur: {dipilih.alasan_tolak}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => tetapkan(false)}
                  >
                    Hari kerja
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    disabled={!dipilih.boleh_jadi_libur}
                    onClick={() => tetapkan(true)}
                  >
                    Libur
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <p className="max-w-3xl text-xs text-slate-500">
          Saran hanya berisi yang <b>pasti</b>: hari Minggu dan libur bertanggal
          tetap (17 Agustus, 25 Desember, dan seterusnya). Yang tanggalnya
          bergeser tiap tahun — Idul Fitri, Nyepi, Waisak — sengaja tidak
          ditebak, karena tebakan yang salah tetap terlihat meyakinkan. Kalender
          juga hanya berlaku maju: bulan sebelum{" "}
          <b>{kalender?.nama_bulan_paling_awal}</b> tidak bisa dibuka, karena
          tidak ada agregat baru bertanggal sebelum itu yang membacanya.
        </p>
      </div>
    </Authenticated>
  );
};

export default KalenderKerja;
