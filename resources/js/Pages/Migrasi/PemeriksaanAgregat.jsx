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
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import dayjs from "dayjs";

const rupiah = (n) => new Intl.NumberFormat("id-ID").format(n ?? 0);

const Kartu = ({ judul, utama, bawah, nada = "netral" }) => (
  <div
    className={`rounded-lg border p-4 ${
      {
        netral: "border-slate-200 bg-white",
        baik: "border-emerald-200 bg-emerald-50/40",
        ingat: "border-amber-300 bg-amber-50/60",
        buruk: "border-red-300 bg-red-50/60",
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

const PemeriksaanAgregat = ({ hasil, server_filter }) => {
  const bersih = !hasil?.beda_terkunci && !hasil?.beda_bulanan;
  const adaBaris = (hasil?.baris ?? 0) > 0;

  const periksaUlang = (periode) =>
    router.get(
      route("migrasi.pemeriksaan"),
      { periode: periode ?? server_filter?.periode },
      { preserveScroll: true },
    );

  return (
    <Authenticated>
      <Head title="Pemeriksaan Agregat" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Pemeriksaan Agregat — {server_filter?.unit}
            </h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Menghitung ulang dari angsuran dan pinjaman, lalu membandingkannya
              dengan angka yang tersimpan. Ini satu-satunya cara{" "}
              <b>membuktikan</b> — bukan menganggap — bahwa agregat masih cocok
              dengan detail inputannya.
            </p>
          </div>

          <div className="flex items-end gap-2">
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-600">
                Periode
              </label>
              <Input
                type="month"
                className="w-40"
                defaultValue={dayjs(server_filter?.periode).format("YYYY-MM")}
                onChange={(e) => periksaUlang(`${e.target.value}-01`)}
              />
            </div>
            <Button variant="secondary" onClick={() => periksaUlang()}>
              <RefreshCw className="size-4" /> Periksa ulang
            </Button>
          </div>
        </div>

        {!server_filter?.sudah_migrasi && (
          <div className="p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
            <b>Kantor ini belum migrasi.</b> Belum ada agregat baru yang perlu
            diperiksa — angka yang berlaku masih dari rekap lama.
          </div>
        )}

        {adaBaris && (
          <div
            className={`flex items-start gap-3 rounded-lg border p-4 ${
              bersih
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-red-300 bg-red-50 text-red-900"
            }`}
          >
            {bersih ? (
              <ShieldCheck className="mt-0.5 size-5 shrink-0" />
            ) : (
              <ShieldAlert className="mt-0.5 size-5 shrink-0" />
            )}
            <div className="text-sm">
              {bersih ? (
                <>
                  <b>Bersih.</b> Seluruh angka yang sudah dikunci cocok dengan
                  sumbernya.
                </>
              ) : (
                <>
                  <b>Ada yang tidak cocok.</b> Rinciannya di bawah.
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu
            judul="Baris diperiksa"
            utama={hasil?.baris ?? 0}
            bawah={`${hasil?.terkunci ?? 0} sudah dikunci`}
          />
          <Kartu
            judul="Hari terkunci meleset"
            utama={hasil?.beda_terkunci ?? 0}
            bawah="angka bertanda tangan vs sumbernya"
            nada={hasil?.beda_terkunci ? "buruk" : "baik"}
          />
          <Kartu
            judul="Bulanan meleset"
            utama={hasil?.beda_bulanan ?? 0}
            bawah="bulanan vs jumlah hariannya"
            nada={hasil?.beda_bulanan ? "ingat" : "baik"}
          />
          <Kartu
            judul="Belum ditetapkan"
            utama={hasil?.belum_final ?? 0}
            bawah="wajar — belum dikunci"
          />
        </div>

        {hasil?.beda_terkunci > 0 && (
          <div className="p-3 text-xs border rounded-lg border-red-300 bg-red-50 text-red-800">
            <b>Hari yang sudah dikunci semestinya mustahil berubah</b> — trigger
            database menolak perubahan sumbernya. Kalau tetap meleset, berarti
            kuncinya pernah dibuka lalu sumbernya diubah tanpa hitung ulang,
            atau angka tersimpannya ditulis salah sejak awal.
          </div>
        )}

        {hasil?.beda_bulanan > 0 && hasil?.beda_terkunci === 0 && (
          <div className="p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
            Ada hari yang berubah setelah baris bulanannya disusun. Biasanya
            hilang sendiri begitu salah satu hari di bulan itu dikunci ulang.
          </div>
        )}

        {hasil?.rincian?.length > 0 && (
          <div className="overflow-x-auto bg-white border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kelompok</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kolom</TableHead>
                  <TableHead className="text-right">Tersimpan</TableHead>
                  <TableHead className="text-right">Seharusnya</TableHead>
                  <TableHead className="text-right">Selisih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasil.rincian.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.kelompok}</TableCell>
                    <TableCell className="tabular-nums">
                      {dayjs(r.tanggal).format("DD MMM")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {r.kolom}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {rupiah(r.tersimpan)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {rupiah(r.harusnya)}
                    </TableCell>
                    <TableCell className="font-medium text-right text-red-600 tabular-nums">
                      {rupiah(r.tersimpan - r.harusnya)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!adaBaris && server_filter?.sudah_migrasi && (
          <div className="p-8 text-sm text-center bg-white border rounded-lg text-slate-500">
            Belum ada baris agregat untuk periode ini.
          </div>
        )}

        <div className="p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600">
          <b>Tidak ada tombol "perbaiki", dan itu disengaja.</b> Memperbaiki
          diam-diam menghapus buktinya, dan pemeriksaan yang menyembuhkan
          dirinya sendiri tidak pernah melaporkan bahwa ada yang salah. Kalau
          angka terkunci meleset, yang benar adalah membuka kuncinya lewat jalur
          resmi — beralasan dan tercatat — lalu menguncinya ulang.
        </div>
      </div>
    </Authenticated>
  );
};

export default PemeriksaanAgregat;
