import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Lock, LockOpen, Check } from "lucide-react";
import dayjs from "dayjs";

const rupiah = (n) =>
  n === null || n === undefined
    ? "—"
    : new Intl.NumberFormat("id-ID").format(n);

/** Satu baris kelompok: isian manual + aksi. */
const BarisKelompok = ({ d, bolehBuka, onBuka }) => {
  const { data, setData, put, processing } = useForm({
    kasbon: d.kasbon,
    transport: d.transport,
    keluar: d.keluar,
    setoran_mantri: d.setoran_mantri ?? "",
  });

  const simpan = () =>
    put(route("closing.simpan_manual", d.id), {
      preserveScroll: true,
      // string kosong -> null: "belum dicatat" berbeda dari "nol"
      transform: (x) => ({
        ...x,
        setoran_mantri: x.setoran_mantri === "" ? null : x.setoran_mantri,
      }),
    });

  const aksi = (nama) =>
    router.post(route(nama, d.id), {}, { preserveScroll: true });

  const beku = d.terkunci;

  return (
    <TableRow className={beku ? "bg-slate-50" : ""}>
      <TableCell className="font-medium">{d.kelompok}</TableCell>

      <TableCell className="text-right tabular-nums">
        {rupiah(d.drop)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {rupiah(d.storting)}
      </TableCell>

      {["kasbon", "transport", "keluar", "setoran_mantri"].map((k) => (
        <TableCell key={k}>
          <Input
            type="number"
            disabled={beku}
            className="w-28 text-right tabular-nums"
            placeholder={k === "setoran_mantri" ? "belum" : "0"}
            value={data[k]}
            onChange={(e) => setData(k, e.target.value)}
            onBlur={() => !beku && simpan()}
          />
        </TableCell>
      ))}

      <TableCell className="text-right tabular-nums">
        {rupiah(d.tunai)}
      </TableCell>
      <TableCell
        className={`text-right font-medium tabular-nums ${
          d.selisih ? "text-red-600" : "text-slate-500"
        }`}
      >
        {rupiah(d.selisih)}
      </TableCell>

      <TableCell>
        {beku ? (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
              <Lock className="size-3" /> Terkunci
            </span>
            {bolehBuka && (
              <Button size="xs" variant="ghost" onClick={() => onBuka(d)}>
                <LockOpen className="size-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {!d.kepala_approval_at ? (
              <Button
                size="xs"
                variant="secondary"
                disabled={processing}
                onClick={() => aksi("closing.approve_kepala")}
              >
                Approve kepala
              </Button>
            ) : (
              <span
                className="inline-flex items-center gap-1 text-xs text-emerald-700"
                title={`oleh ${d.kepala_nama ?? "-"} · ${d.kepala_approval_at}`}
              >
                <Check className="size-3.5" /> kepala
              </span>
            )}

            <Button
              size="xs"
              variant="blue"
              disabled={processing || d.halangan.length > 0}
              title={d.halangan.join(" ")}
              onClick={() => aksi("closing.kunci")}
            >
              Kunci
            </Button>
          </div>
        )}

        {!beku && d.halangan.length > 0 && (
          <div className="mt-1 text-[11px] leading-tight text-amber-700">
            {d.halangan.join(" ")}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

const Harian = ({ datas = [], tertinggal = [], server_filter }) => {
  const { errors } = usePage().props;
  const [bukaUntuk, setBukaUntuk] = useState(null);
  const formBuka = useForm({ alasan: "" });

  const gantiTanggal = (nilai) =>
    nilai &&
    router.get(
      route("closing.harian"),
      { tanggal: nilai },
      { preserveState: true, preserveScroll: true },
    );

  const kirimBuka = (e) => {
    e.preventDefault();
    formBuka.post(route("closing.buka", bukaUntuk.id), {
      preserveScroll: true,
      onSuccess: () => {
        formBuka.reset();
        setBukaUntuk(null);
      },
    });
  };

  return (
    <Authenticated>
      <Head title="Closing Harian" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Closing Harian — {server_filter?.unit}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Urutannya: kepala menyetujui → kasir mencatat setoran mantri →
              kasir mengunci. Hari sebelumnya harus terkunci lebih dulu.
            </p>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-slate-600">
              Tanggal
            </label>
            <Input
              type="date"
              className="w-44"
              defaultValue={server_filter?.tanggal}
              onChange={(e) => gantiTanggal(e.target.value)}
            />
          </div>
        </div>

        {!server_filter?.sudah_migrasi && (
          <div className="p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
            <b>Kantor ini belum ditandai migrasi.</b> Layar ini bisa dipakai
            untuk uji coba, tapi angka yang dikunci di sini belum menggantikan
            rekap lama — kedua alur masih berjalan sendiri-sendiri.
          </div>
        )}

        {errors?.[0] && (
          <div className="p-3 text-sm border rounded-lg border-red-300 bg-red-50 text-red-800">
            {errors[0]}
          </div>
        )}

        {tertinggal.length > 0 && (
          <div className="p-3 border rounded-lg border-slate-200 bg-slate-50">
            <div className="mb-1 text-xs font-semibold tracking-wide uppercase text-slate-500">
              Hari terlama yang belum dikunci
            </div>
            <div className="flex flex-wrap gap-2">
              {tertinggal.map((t) => (
                <span
                  key={t.kelompok}
                  className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700"
                >
                  kel {t.kelompok}: <b>{dayjs(t.terlama).format("DD MMM")}</b>{" "}
                  <span className="text-slate-400">({t.jumlah} hari)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-white border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kel</TableHead>
                <TableHead className="text-right">Drop</TableHead>
                <TableHead className="text-right">Storting</TableHead>
                <TableHead>Kasbon</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Keluar</TableHead>
                <TableHead>Setoran mantri</TableHead>
                <TableHead className="text-right">Tunai</TableHead>
                <TableHead className="text-right">Selisih</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="py-8 text-center text-slate-500"
                  >
                    Tidak ada kelompok di kantor ini.
                  </TableCell>
                </TableRow>
              )}
              {datas.map((d) =>
                d.ada_baris ? (
                  <BarisKelompok
                    key={d.grouping_id}
                    d={d}
                    bolehBuka={server_filter?.boleh_buka}
                    onBuka={setBukaUntuk}
                  />
                ) : (
                  <TableRow key={d.grouping_id}>
                    <TableCell className="font-medium">{d.kelompok}</TableCell>
                    <TableCell colSpan={9} className="text-xs text-amber-700">
                      Baris hari ini belum dibangkitkan — jalankan
                      <code className="mx-1">closing:generate</code>
                      untuk periode ini.
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600">
          <b>Drop dan storting tidak bisa diketik.</b> Keduanya dihitung dari
          angsuran dan pinjaman, jadi selalu bisa diperiksa ulang ke sumbernya.
          Yang diisi manusia hanya kasbon, transport, keluar, dan setoran mantri
          — dan <b>selisih</b> di kolom terakhir adalah jarak antara uang yang
          benar-benar diserahkan mantri dengan tunai hasil rumus.
        </div>
      </div>

      <Dialog open={!!bukaUntuk} onOpenChange={(o) => !o && setBukaUntuk(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buka kunci kelompok {bukaUntuk?.kelompok}</DialogTitle>
          </DialogHeader>
          <form onSubmit={kirimBuka} className="space-y-3">
            <p className="text-sm text-slate-600">
              Tunai yang tercatat saat dikunci adalah{" "}
              <b>{rupiah(bukaUntuk?.tunai)}</b>. Angka itu disimpan di jejak
              sebelum kunci dibuka — setelah inputnya berubah, dia tidak bisa
              ditemukan lagi dari mana pun.
            </p>
            <Input
              autoFocus
              placeholder="Alasan membuka kunci"
              value={formBuka.data.alasan}
              onChange={(e) => formBuka.setData("alasan", e.target.value)}
            />
            {formBuka.errors.alasan && (
              <p className="text-xs text-red-600">{formBuka.errors.alasan}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setBukaUntuk(null)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={formBuka.processing}>
                Buka kunci
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Authenticated>
  );
};

export default Harian;
