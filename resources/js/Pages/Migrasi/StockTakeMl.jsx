import Authenticated from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
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

const rupiah = (n) =>
  n === null || n === undefined
    ? "—"
    : new Intl.NumberFormat("id-ID").format(n);

const STATUS = {
  dibuka: {
    label: "Dibuka",
    kelas: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  ditutup: {
    label: "Ditutup",
    kelas: "bg-slate-100 text-slate-600 ring-slate-500/20",
  },
  belum_dinyatakan: {
    label: "Belum dinyatakan",
    kelas: "bg-amber-50 text-amber-800 ring-amber-600/30",
  },
};

const Lencana = ({ status }) => {
  const s = STATUS[status] ?? STATUS.ditutup;
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.kelas}`}
    >
      {s.label}
    </span>
  );
};

const Kartu = ({ judul, utama, bawah, nada = "netral" }) => {
  const nadaKelas = {
    netral: "border-slate-200",
    baik: "border-emerald-200",
    ingat: "border-amber-300",
  }[nada];

  return (
    <div className={`rounded-lg border bg-white p-4 ${nadaKelas}`}>
      <div className="text-xs font-medium tracking-wide uppercase text-slate-500">
        {judul}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
        {utama}
      </div>
      {bawah && <div className="mt-0.5 text-xs text-slate-500">{bawah}</div>}
    </div>
  );
};

const StockTakeMl = ({ datas = [], ringkasan, server_filter }) => {
  const { auth } = usePage().props;

  const gantiPeriode = (nilai) => {
    if (!nilai) return;
    router.get(
      route("migrasi.stock_take_ml"),
      { periode: `${nilai}-01` },
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <Authenticated>
      <Head title="Stock-take ML" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Stock-take ML — {server_filter?.unit}
            </h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Membandingkan <b>kuota</b> yang dinyatakan kantor (
              <code>ml_amount</code>) dengan <b>saldo ML dari data nyata</b>,
              per kelompok per hari. Laporan ini tidak mengubah apa pun — angka
              yang tidak cocok dibiarkan apa adanya.
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
                onChange={(e) => gantiPeriode(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu
            judul="Pintu dibuka"
            utama={ringkasan?.dibuka?.baris ?? 0}
            bawah={`kuota Rp ${rupiah(ringkasan?.dibuka?.kuota ?? 0)}`}
            nada="baik"
          />
          <Kartu
            judul="Pintu ditutup"
            utama={ringkasan?.ditutup?.baris ?? 0}
            bawah="kuota penuh atau data melebihi"
          />
          <Kartu
            judul="Belum dinyatakan"
            utama={ringkasan?.belum_dinyatakan?.baris ?? 0}
            bawah={
              ringkasan?.belum_dinyatakan?.baris
                ? `ada data Rp ${rupiah(ringkasan.belum_dinyatakan.data_nyata)} tanpa baris sirkulasi`
                : "semua kelompok punya baris sirkulasi"
            }
            nada={ringkasan?.belum_dinyatakan?.baris ? "ingat" : "netral"}
          />
          <Kartu
            judul="Status kantor"
            utama={server_filter?.sudah_migrasi ? "Sudah migrasi" : "Belum"}
            bawah={
              server_filter?.mulai_pendataan_baru
                ? `mulai ${dayjs(server_filter.mulai_pendataan_baru).format("DD MMM YYYY")}`
                : "masih memakai agregasi lama"
            }
          />
        </div>

        <p className="text-xs text-slate-500">
          ML dihitung dari selisih 5 bulan — pinjaman dengan tanggal drop
          sebelum <b>{dayjs(server_filter?.batas_ml).format("D MMMM YYYY")}</b>.
        </p>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kelompok</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead className="text-right">Nasabah ML</TableHead>
                <TableHead className="text-right">Data nyata</TableHead>
                <TableHead className="text-right">Kuota (ml_amount)</TableHead>
                <TableHead className="text-right">Sisa kuota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-slate-500"
                  >
                    Tidak ada data untuk periode ini.
                  </TableCell>
                </TableRow>
              )}
              {datas.map((d) => (
                <TableRow key={`${d.grouping_id}-${d.hari}`}>
                  <TableCell className="font-medium">{d.kelompok}</TableCell>
                  <TableCell className="capitalize">{d.hari}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {d.jumlah_pinjaman_ml}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(d.data_nyata)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(d.kuota_dinyatakan)}
                  </TableCell>
                  <TableCell className="font-medium text-right tabular-nums">
                    {rupiah(d.kuota_awal)}
                  </TableCell>
                  <TableCell>
                    <Lencana status={d.status} />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {d.keterangan}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600">
          <b>Cara membacanya.</b> Sisa kuota hanya ditetapkan{" "}
          <b>sekali, saat kantor migrasi</b>. Sesudah itu angkanya cuma bisa
          berkurang seiring nasabah lama diinput. Perbandingan di halaman ini
          tidak dijalankan ulang tiap bulan — kalau dijalankan ulang, pintunya
          akan terbuka lagi setiap kali nasabah ML membayar, karena data nyata
          ikut turun.
        </div>
      </div>
    </Authenticated>
  );
};

export default StockTakeMl;
