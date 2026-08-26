import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
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
import { ArrowRightLeft, Lock, ShieldAlert, ShieldCheck } from "lucide-react";

const rupiah = (n) =>
  n === null || n === undefined ? "—" : new Intl.NumberFormat("id-ID").format(n);

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

const SelZ = ({ baris, bolehUbah }) => {
  const [nilai, setNilai] = useState(baris.z ?? "");
  const [sibuk, setSibuk] = useState(false);

  if (baris.sudah_serah_terima) {
    return (
      <span className="inline-flex items-center gap-1 tabular-nums">
        {rupiah(baris.z)}
        <Lock className="w-3 h-3 text-slate-400" />
      </span>
    );
  }

  if (!bolehUbah || !baris.monthly_id) {
    return <span className="tabular-nums">{rupiah(baris.z)}</span>;
  }

  const simpan = () => {
    const bersih = nilai === "" ? null : Number(nilai);
    if (bersih === (baris.z ?? null)) return;

    setSibuk(true);
    router.put(
      route("migrasi.serah_terima_z", baris.monthly_id),
      { z: bersih },
      {
        preserveScroll: true,
        preserveState: false,
        onFinish: () => setSibuk(false),
      },
    );
  };

  return (
    <Input
      type="number"
      min="0"
      inputMode="numeric"
      disabled={sibuk}
      value={nilai}
      placeholder="belum diisi"
      onChange={(e) => setNilai(e.target.value)}
      onBlur={simpan}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      className={`h-8 w-32 text-right tabular-nums ${
        baris.z === null ? "border-amber-400 bg-amber-50/60" : ""
      }`}
    />
  );
};

const SerahTerima = ({ hasil, server_filter }) => {
  const bolehUbah = !!server_filter?.boleh_ubah;
  const rincian = hasil?.rincian ?? [];
  const cocok = hasil?.beda === 0 && rincian.length > 0;
  const siap = hasil?.z_belum_ditetapkan === 0 && rincian.length > 0;

  const sahkan = () => {
    if (
      !window.confirm(
        "Sahkan serah terima?\n\n" +
          "Sesudah ini saldo awal periode ini tidak akan pernah dihitung ulang, " +
          "dan Z tidak bisa diubah lagi. Nama Anda tercatat sebagai yang menerimanya.",
      )
    )
      return;

    router.post(
      route("migrasi.serah_terima_sahkan"),
      { periode: server_filter?.periode },
      { preserveScroll: true },
    );
  };

  return (
    <Authenticated>
      <Head title="Serah Terima Saldo Awal" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Serah Terima Saldo Awal — {hasil?.unit}
          </h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Satu-satunya kali sistem lama dan sistem baru bertemu, sekali seumur
            hidup per kantor. Dua angka dibandingkan, dan yang penting keduanya
            tiba <b>sendiri-sendiri</b>: kiri dari tutup buku sistem lama, kanan
            dihitung langsung dari pinjaman dan angsuran tanpa pernah membaca
            tabel sirkulasi.
          </p>
        </div>

        {!hasil?.sudah_migrasi && (
          <div className="p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
            Kantor ini belum memakai alur agregasi baru. Serah terima terjadi
            otomatis saat tutup buku pertama.
          </div>
        )}

        {hasil?.sudah_migrasi && !hasil?.bulan_serah_terima && (
          <div className="p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
            Periode ini bukan bulan serah terima. Kantor ini mulai memakai alur
            baru <b>{hasil?.periode_migrasi}</b> — hanya bulan itu yang punya
            saldo awal warisan sistem lama. Bulan sesudahnya saldo awalnya lahir
            dari bulan sebelumnya di sistem yang sama.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu
            judul="Saldo awal (sistem baru)"
            utama={rupiah(hasil?.awal_total)}
            bawah="dari pinjaman & angsuran"
          />
          <Kartu
            judul="Tutup buku (sistem lama)"
            utama={rupiah(hasil?.sirkulasi_total)}
            bawah="dari transaction_sirculations"
          />
          <Kartu
            judul="Selisih"
            utama={rupiah(hasil?.selisih_total)}
            bawah={`${hasil?.beda ?? 0} baris tidak cocok`}
            nada={cocok ? "baik" : "buruk"}
          />
          <Kartu
            judul="Z belum ditetapkan"
            utama={hasil?.z_belum_ditetapkan ?? 0}
            bawah={siap ? "semua baris sudah diisi" : "wajib diisi sebelum diteken"}
            nada={siap ? "baik" : "ingat"}
          />
        </div>

        {hasil?.sudah_serah_terima ? (
          <div className="flex items-start gap-2 p-3 text-sm border rounded-lg border-emerald-300 bg-emerald-50/60 text-emerald-900">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <b>Sudah diserahterimakan</b> pada {hasil?.serah_terima_at}. Saldo
              awal periode ini tidak akan dihitung ulang lagi, walaupun ada
              pinjaman bertanggal mundur yang disisipkan ke bulan sebelumnya.
              Sisipan seperti itu tetap terlihat — tapi sebagai selisih pada{" "}
              <span className="font-medium">saldo akhir</span>, bukan sebagai
              saldo awal yang diam-diam berubah.
            </div>
          </div>
        ) : (
          hasil?.bulan_serah_terima && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 border rounded-lg border-slate-300 bg-slate-50">
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <ArrowRightLeft className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="max-w-2xl">
                  Selisih <b>tidak memblokir</b> tombol ini — kantorlah yang
                  memutuskan apakah selisihnya bisa dipertanggungjawabkan. Kalau
                  selisih memblokir, orang akan menyetel Z sampai nol supaya
                  bisa lanjut, dan Z berhenti berarti apa pun. Yang menahan
                  bukan sistem, melainkan tanda tangan yang tercatat namanya.
                </div>
              </div>
              <Button
                onClick={sahkan}
                disabled={!bolehUbah || !siap}
                title={
                  !bolehUbah
                    ? "Butuh izin can-edit dari superuser"
                    : !siap
                      ? "Masih ada Z yang belum ditetapkan"
                      : undefined
                }
              >
                Sahkan serah terima
              </Button>
            </div>
          )
        )}

        {!cocok && rincian.length > 0 && (
          <div className="flex items-start gap-2 p-3 text-sm border rounded-lg border-red-300 bg-red-50/60 text-red-900">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <b>{hasil?.beda} baris meleset.</b> Tidak ada tombol untuk
              menyamakannya, dan itu disengaja — kalau salah satu angka boleh
              disetel mengikuti yang lain, tidak ada yang pernah salah dan tidak
              ada yang pernah ketahuan. Yang benar adalah menelusuri sebabnya:
              biasanya tutup buku lama yang belum lengkap, atau pinjaman yang
              embernya melompat. Kalau tidak ketemu, tunda serah terimanya.
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-white border rounded-lg border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kelompok</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead className="text-right">Sistem lama</TableHead>
                <TableHead className="text-right">Sistem baru</TableHead>
                <TableHead className="text-right">Selisih</TableHead>
                <TableHead className="text-right">month2</TableHead>
                <TableHead className="text-right">ccm</TableHead>
                <TableHead className="text-right">cm</TableHead>
                <TableHead className="text-right">mb</TableHead>
                <TableHead className="text-right">ml</TableHead>
                <TableHead className="text-right">ML belum terinput</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rincian.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="py-8 text-center text-slate-500">
                    Tidak ada baris untuk periode ini.
                  </TableCell>
                </TableRow>
              )}

              {rincian.map((r) => (
                <TableRow
                  key={`${r.grouping_id}|${r.hari}`}
                  className={r.selisih !== 0 ? "bg-red-50/50" : undefined}
                >
                  <TableCell className="font-medium">{r.kelompok ?? "—"}</TableCell>
                  <TableCell className="capitalize">{r.hari}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(r.sirkulasi_total)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(r.awal_total)}
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums ${
                      r.selisih !== 0 ? "font-semibold text-red-700" : "text-slate-400"
                    }`}
                  >
                    {rupiah(r.selisih)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(r.awal_month2)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(r.awal_ccm)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(r.awal_cm)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(r.awal_mb)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {rupiah(r.awal_ml)}
                  </TableCell>
                  <TableCell className="text-right">
                    <SelZ baris={r} bolehUbah={bolehUbah} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="max-w-3xl text-xs text-slate-500">
          <b>ML belum terinput (Z)</b> adalah saldo nasabah macet lama yang belum
          pernah masuk sistem. Diketik kantor, bukan diturunkan dari{" "}
          <code>ml_amount</code> lama — angka itu sendiri sudah terbukti
          melenceng ke dua arah, jadi menurunkan Z darinya berarti mewarisi
          kesalahannya dengan wajah meyakinkan. Kolom kosong berarti{" "}
          <b>belum ditetapkan</b>; ketik <b>0</b> kalau kantor sudah memeriksa
          dan memang tidak ada. Dua hal itu berbeda, dan hanya yang kedua yang
          membuat kantor siap diteken.
        </p>
      </div>
    </Authenticated>
  );
};

export default SerahTerima;
