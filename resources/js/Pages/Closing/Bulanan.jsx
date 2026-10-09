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
import { Lock, LockOpen, Check, ChevronLeft, ChevronRight } from "lucide-react";

const rupiah = (n) =>
  n === null || n === undefined
    ? "—"
    : new Intl.NumberFormat("id-ID").format(n);

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

const Baris = ({ d, bolehBuka }) => {
  const aksi = (nama) =>
    router.post(route(nama, d.id), {}, { preserveScroll: true });

  const buka = () => {
    const alasan = window.prompt(
      "Alasan membuka kunci bulan ini (tercatat):",
    );
    if (alasan && alasan.trim().length >= 5) {
      router.post(
        route("closing.bulanan.buka", d.id),
        { alasan },
        { preserveScroll: true },
      );
    } else if (alasan !== null) {
      window.alert("Alasan terlalu pendek.");
    }
  };

  return (
    <TableRow className={d.terkunci ? "bg-emerald-50/40" : undefined}>
      <TableCell className="font-medium">{d.kelompok ?? "—"}</TableCell>
      <TableCell className="capitalize">{d.hari}</TableCell>
      <TableCell className="text-center">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${
            d.lengkap
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {d.hari_terkunci}/{d.hari_kerja}
        </span>
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {rupiah(d.awal_total)}
      </TableCell>
      <TableCell className="text-right tabular-nums">{rupiah(d.drop)}</TableCell>
      <TableCell className="text-right tabular-nums">
        {rupiah(d.storting)}
      </TableCell>
      <TableCell className="text-right tabular-nums font-medium">
        {rupiah(d.akhir_total)}
      </TableCell>
      <TableCell>
        {d.terkunci ? (
          <div className="text-xs">
            <div className="flex items-center gap-1 font-medium text-emerald-700">
              <Lock className="w-3 h-3" /> Terkunci
            </div>
            <div className="text-slate-500">{d.kasir_nama}</div>
          </div>
        ) : d.kepala_approval_at ? (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Check className="w-3 h-3 text-sky-600" /> Kepala setuju
          </div>
        ) : (
          <span className="text-xs text-slate-400">belum diperiksa</span>
        )}
        {d.diperbarui_at && (
          <div
            title={d.diperbarui_alasan ?? ''}
            className="mt-1 inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800"
          >
            diperbarui {new Date(d.diperbarui_at.replace(' ', 'T')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        {d.terkunci ? (
          bolehBuka ? (
            <Button size="xs" variant="ghost" onClick={buka}>
              <LockOpen className="w-3 h-3 mr-1" /> Buka
            </Button>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )
        ) : (
          <div className="flex justify-end gap-1">
            {!d.kepala_approval_at && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => aksi("closing.bulanan.approve_kepala")}
              >
                Setujui
              </Button>
            )}
            <Button
              size="xs"
              disabled={d.halangan.length > 0}
              title={d.halangan.join(" ") || undefined}
              onClick={() => aksi("closing.bulanan.kunci")}
            >
              Kunci
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

const Bulanan = ({ datas = [], server_filter }) => {
  const pindah = (periode) =>
    router.get(
      route("closing.bulanan.index"),
      { periode },
      { preserveScroll: true },
    );

  const total = datas.length;
  const terkunci = datas.filter((d) => d.terkunci).length;
  const siap = datas.filter((d) => !d.terkunci && d.halangan.length === 0).length;
  const belumLengkap = datas.filter((d) => !d.lengkap).length;

  return (
    <Authenticated>
      <Head title="Closing Bulanan" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Closing Bulanan — {server_filter?.unit}
            </h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Tanda tangan akhir bulan. Angkanya tidak dihitung di sini — sudah
              tersusun tiap hari dikunci. Kasir <b>tidak bisa</b> mengunci bulan
              selama masih ada hari kerja yang belum terkunci; itulah yang
              membuat lupa tutup buku mustahil lolos.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => pindah(server_filter?.sebelumnya)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[9rem] text-center text-sm font-medium">
              {server_filter?.nama_periode}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pindah(server_filter?.berikutnya)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!server_filter?.sudah_migrasi && (
          <div className="p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
            Kantor ini belum memakai alur agregasi baru, jadi belum ada closing
            bulanan untuk ditandatangani.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu judul="Baris" utama={total} bawah="kelompok × hari tagih" />
          <Kartu
            judul="Sudah dikunci"
            utama={terkunci}
            nada={total > 0 && terkunci === total ? "baik" : "netral"}
          />
          <Kartu
            judul="Siap dikunci"
            utama={siap}
            bawah="lengkap & disetujui"
            nada={siap > 0 ? "baik" : "netral"}
          />
          <Kartu
            judul="Belum lengkap"
            utama={belumLengkap}
            bawah="masih ada hari belum terkunci"
            nada={belumLengkap > 0 ? "ingat" : "baik"}
          />
        </div>

        <div className="overflow-x-auto bg-white border rounded-lg border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kelompok</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead className="text-center">Hari terkunci</TableHead>
                <TableHead className="text-right">Saldo awal</TableHead>
                <TableHead className="text-right">Drop</TableHead>
                <TableHead className="text-right">Storting</TableHead>
                <TableHead className="text-right">Saldo akhir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-slate-500"
                  >
                    Belum ada baris bulanan untuk periode ini.
                  </TableCell>
                </TableRow>
              )}
              {datas.map((d) => (
                <Baris key={d.id} d={d} bolehBuka={server_filter?.boleh_buka} />
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="max-w-3xl text-xs text-slate-500">
          <b>Hari terkunci</b> hijau berarti setiap hari kerja bulan itu sudah
          dikunci lewat Buku Transaksi → ACC KM. Selama masih kuning (mis. 23/24), tombol
          Kunci mati — arahkan kursor ke tombolnya untuk melihat apa yang
          menahan. Membuka kunci bulan yang sudah diteken hanya bisa lewat
          stafkontrol/pusat/superuser yang berizin <code>can-edit</code>, dan
          alasannya tercatat.
        </p>
      </div>
    </Authenticated>
  );
};

export default Bulanan;
