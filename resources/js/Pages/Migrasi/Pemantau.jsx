import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Input } from "@/shadcn/ui/input";
import dayjs from "dayjs";

const STATUS = {
  menyeberang: {
    label: "Sudah menyeberang",
    kelas: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  siap: {
    label: "Sudah tutup buku, belum menyeberang",
    kelas: "bg-red-50 text-red-700 ring-red-600/20",
  },
  belum_tutup_buku: {
    label: "Belum tutup buku",
    kelas: "bg-amber-50 text-amber-800 ring-amber-600/30",
  },
};

const Lencana = ({ status }) => {
  const s = STATUS[status] ?? STATUS.belum_tutup_buku;
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.kelas}`}
    >
      {s.label}
    </span>
  );
};

const Kartu = ({ judul, utama, bawah, nada }) => (
  <div
    className={`rounded-lg border p-4 ${
      nada === "baik"
        ? "border-emerald-200 bg-emerald-50/40"
        : nada === "buruk"
          ? "border-red-300 bg-red-50/60"
          : "border-slate-200 bg-white"
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

const Pemantau = ({ datas = [], ringkasan }) => {
  const [cari, setCari] = useState("");
  const [saring, setSaring] = useState("semua");

  const tersaring = datas.filter((d) => {
    const cocokCari =
      !cari || d.unit.toLowerCase().includes(cari.toLowerCase());
    const cocokStatus = saring === "semua" || d.status === saring;
    return cocokCari && cocokStatus;
  });

  const persen = ringkasan?.total
    ? Math.round((ringkasan.menyeberang / ringkasan.total) * 100)
    : 0;

  return (
    <Authenticated>
      <Head title="Pemantau Migrasi" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Pemantau Migrasi
          </h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Kantor menyeberang ke alur baru dengan <b>menutup buku</b> bulan
            sebelumnya. Yang perlu dilihat bukan cuma sudah atau belum,
            melainkan apa yang kurang.
          </p>
        </div>

        {!ringkasan?.bulan_migrasi && (
          <div className="p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
            <b>Bulan migrasi belum ditetapkan.</b> Selama{" "}
            <code>AGREGASI_BULAN_MIGRASI</code> kosong, tutup buku berjalan
            seperti biasa dan tidak ada kantor yang berpindah.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu
            judul="Bulan migrasi"
            utama={
              ringkasan?.bulan_migrasi
                ? dayjs(`${ringkasan.bulan_migrasi}-01`).format("MMM YYYY")
                : "—"
            }
            bawah="dari AGREGASI_BULAN_MIGRASI"
          />
          <Kartu
            judul="Sudah menyeberang"
            utama={`${ringkasan?.menyeberang ?? 0} / ${ringkasan?.total ?? 0}`}
            bawah={`${persen}% dari seluruh kantor`}
            nada="baik"
          />
          <Kartu
            judul="Belum tutup buku"
            utama={ringkasan?.belum_tutup_buku ?? 0}
            bawah="dikejar tutup bukunya"
          />
          <Kartu
            judul="Perlu diperiksa"
            utama={ringkasan?.siap ?? 0}
            bawah="sudah tutup buku tapi belum menyeberang"
            nada={ringkasan?.siap ? "buruk" : undefined}
          />
        </div>

        {ringkasan?.siap > 0 && (
          <div className="p-3 text-xs border rounded-lg border-red-300 bg-red-50 text-red-800">
            <b>
              {ringkasan.siap} kantor sudah menutup buku tapi belum menyeberang.
            </b>{" "}
            Pendaftarannya semestinya jalan otomatis, jadi ini bukan sekadar
            belum dikerjakan — ada yang gagal. Periksa log dengan kata kunci
            <code className="mx-1">Pendaftaran migrasi gagal</code>.
          </div>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-600">
              Cari kantor
            </label>
            <Input
              className="w-56"
              placeholder="nama unit..."
              value={cari}
              onChange={(e) => setCari(e.target.value)}
            />
          </div>
          <div className="flex gap-1">
            {[
              ["semua", "Semua"],
              ["menyeberang", "Menyeberang"],
              ["belum_tutup_buku", "Belum tutup buku"],
              ["siap", "Perlu diperiksa"],
            ].map(([nilai, label]) => (
              <button
                key={nilai}
                onClick={() => setSaring(nilai)}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
                  saring === nilai
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wil</TableHead>
                <TableHead>Kantor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead className="text-right">
                  Kelompok tutup buku
                </TableHead>
                <TableHead className="text-right">Baris closing</TableHead>
                <TableHead className="text-right">Terkunci</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tersaring.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-slate-500"
                  >
                    Tidak ada kantor yang cocok.
                  </TableCell>
                </TableRow>
              )}
              {tersaring.map((d) => (
                <TableRow key={d.branch_id}>
                  <TableCell className="tabular-nums text-slate-500">
                    {d.wilayah}
                  </TableCell>
                  <TableCell className="font-medium">{d.unit}</TableCell>
                  <TableCell>
                    <Lencana status={d.status} />
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">
                    {d.mulai ? dayjs(d.mulai).format("DD MMM YYYY") : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {d.kelompok_tutup_buku || "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {d.baris_closing || "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {d.terkunci || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600">
          <b>Membaca kolomnya.</b> <i>Kelompok tutup buku</i> menghitung baris
          sirkulasi yang lahir untuk bulan migrasi — barisnya hanya ada kalau
          seseorang benar-benar menutup buku, jadi angka nol berarti kantornya
          memang belum mulai. <i>Baris closing</i> dan <i>terkunci</i>{" "}
          menunjukkan seberapa jauh kantor yang sudah menyeberang berjalan di
          alur baru.
        </div>
      </div>
    </Authenticated>
  );
};

export default Pemantau;
