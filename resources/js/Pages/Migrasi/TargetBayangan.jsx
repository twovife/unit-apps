import Authenticated from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head, router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Button } from "@/shadcn/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const rupiah = (n) =>
  n === null || n === undefined ? "—" : new Intl.NumberFormat("id-ID").format(n);

const Kartu = ({ judul, utama, bawah, nada = "netral" }) => (
  <div
    className={`rounded-lg border p-4 ${
      {
        netral: "border-slate-200 bg-white",
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

const TargetBayangan = ({ baris = [], ringkas, server_filter }) => {
  const pindah = (periode) =>
    router.get(route("migrasi.target_bayangan"), { periode }, { preserveScroll: true });

  return (
    <Authenticated>
      <Head title="Target Bayangan" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Target: Rantai vs Hitung — {server_filter?.unit}
            </h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Perbandingan <b>read-only</b>: target <b>rantai</b> yang tersimpan
              (warisan minggu lalu + drop×0,13 − keluar) berdampingan dengan
              target <b>hitung</b> dari portofolio (Σ nominal_drop×0,13 atas
              pinjaman belum lunas di ember target). Bukan untuk mengubah apa
              pun — ini ukuran seberapa jauh rantai sudah hanyut, untuk menilai
              kapan tombol recount layak dinyalakan.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => pindah(server_filter?.sebelumnya)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[7rem] text-center text-sm font-medium tabular-nums">
              {server_filter?.periode}
            </div>
            <Button variant="outline" size="icon" onClick={() => pindah(server_filter?.berikutnya)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu judul="Target rantai" utama={rupiah(ringkas?.rantai)} bawah="tersimpan" />
          <Kartu judul="Target hitung" utama={rupiah(ringkas?.hitung)} bawah="dari portofolio" />
          <Kartu
            judul="Hanyut (rantai − hitung)"
            utama={rupiah(ringkas?.selisih)}
            nada={ringkas?.selisih !== 0 ? "ingat" : "netral"}
          />
          <Kartu judul="Baris meleset" utama={ringkas?.meleset ?? 0} />
        </div>

        <div className="overflow-x-auto bg-white border rounded-lg border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kelompok</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead className="text-right">Target rantai</TableHead>
                <TableHead className="text-right">Target hitung</TableHead>
                <TableHead className="text-right">Hanyut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baris.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                    Tidak ada data untuk periode ini.
                  </TableCell>
                </TableRow>
              ) : (
                baris.map((b, i) => (
                  <TableRow key={i} className={b.selisih !== 0 ? "bg-amber-50/40" : undefined}>
                    <TableCell className="font-medium">{b.kelompok ?? "—"}</TableCell>
                    <TableCell className="capitalize">{b.hari}</TableCell>
                    <TableCell className="text-right tabular-nums">{rupiah(b.rantai)}</TableCell>
                    <TableCell className="text-right tabular-nums">{rupiah(b.hitung)}</TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${
                        b.selisih !== 0 ? "font-semibold text-amber-700" : "text-slate-400"
                      }`}
                    >
                      {rupiah(b.selisih)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="max-w-3xl text-xs text-slate-500">
          Hanyut besar bukan berarti data salah — rantai memang menumpuk
          pembulatan dan keluar-target yang tak seragam. Tombol recount (setel
          ulang target dari hitung) sengaja belum ada; dinyalakan nanti setelah
          angka hitung terbukti bersih lewat laporan ini.
        </p>
      </div>
    </Authenticated>
  );
};

export default TargetBayangan;
