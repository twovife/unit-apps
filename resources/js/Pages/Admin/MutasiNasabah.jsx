import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
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
import { Search, ArrowRight } from "lucide-react";

/** Satu pinjaman hasil cari: pilih kelompok tujuan + bulan berlaku. */
const BarisPinjaman = ({ loan, bulanDepan, onSimpan }) => {
  const [tujuan, setTujuan] = useState(loan.tujuan[0]?.id ?? "");
  const [bulan, setBulan] = useState(bulanDepan.slice(0, 7));
  const [alasan, setAlasan] = useState("");

  return (
    <div className="p-4 border rounded-lg border-slate-200 bg-white space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <div>
          <span className="font-medium">Pinjaman #{loan.loan_id}</span> ·{" "}
          {loan.unit} · kelompok{" "}
          <b>{loan.kelompok_efektif}</b> ·{" "}
          <span className="capitalize">{loan.hari}</span> · drop {loan.drop_date}
        </div>
      </div>

      {loan.tujuan.length === 0 ? (
        <div className="text-xs text-slate-500">
          Tidak ada kelompok lain di kantor ini untuk jadi tujuan.
        </div>
      ) : (
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex items-end gap-1">
            <span className="pb-2 text-sm text-slate-500">
              kel {loan.kelompok_efektif}
            </span>
            <ArrowRight className="w-4 h-4 mb-2 text-slate-400" />
            <div>
              <label className="text-xs text-slate-500">Kelompok tujuan</label>
              <select
                value={tujuan}
                onChange={(e) => setTujuan(Number(e.target.value))}
                className="w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input"
              >
                {loan.tujuan.map((t) => (
                  <option key={t.id} value={t.id}>
                    kelompok {t.kelompok}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500">Berlaku mulai</label>
            <Input
              type="month"
              value={bulan}
              min={bulanDepan.slice(0, 7)}
              onChange={(e) => setBulan(e.target.value)}
              className="mt-1 h-9"
            />
          </div>
          <div className="flex-1 min-w-40">
            <label className="text-xs text-slate-500">Alasan</label>
            <Input
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="mis. pindah domisili"
              className="mt-1 h-9"
            />
          </div>
          <Button
            onClick={() =>
              onSimpan(loan.loan_id, tujuan, `${bulan}-01`, alasan)
            }
          >
            Pindahkan
          </Button>
        </div>
      )}
    </div>
  );
};

const MutasiNasabah = ({ riwayat = [], server_filter }) => {
  const [nik, setNik] = useState("");
  const [loans, setLoans] = useState(null);
  const [sibuk, setSibuk] = useState(false);
  const [error, setError] = useState(null);

  const cari = (e) => {
    e?.preventDefault?.();
    if (nik.length !== 16) {
      setError("NIK harus 16 digit.");
      return;
    }
    setSibuk(true);
    setError(null);
    axios
      .post(route("mutasi_nasabah.cari"), { nik })
      .then(({ data }) => setLoans(data.loans ?? []))
      .catch((err) => setError(err.response?.data?.message || "Gagal mencari."))
      .finally(() => setSibuk(false));
  };

  const simpan = (loan_id, ke_grouping_id, berlaku_bulan, alasan) => {
    router.post(
      route("mutasi_nasabah.simpan"),
      { loan_id, ke_grouping_id, berlaku_bulan, alasan },
      { preserveScroll: true, onSuccess: () => cari() },
    );
  };

  return (
    <Authenticated>
      <Head title="Mutasi Nasabah" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Mutasi Nasabah
          </h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Memindah pinjaman antar kelompok/mantri di kantor yang sama. Yang
            direkam adalah perpindahannya — kelompok asal pinjaman tidak ditimpa,
            jadi agregat bulan-bulan lampau tidak berubah. Berlaku paling cepat
            bulan depan (tanggal 1), dan hanya superuser.
          </p>
        </div>

        <form onSubmit={cari} className="flex items-end gap-2">
          <div className="flex-1 max-w-xs">
            <label className="text-xs text-slate-500">NIK nasabah</label>
            <Input
              inputMode="numeric"
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
              placeholder="16 digit"
              className="mt-1 tabular-nums"
            />
          </div>
          <Button type="submit" disabled={sibuk}>
            <Search className="w-4 h-4 mr-1" />
            Cari
          </Button>
          {nik.length > 0 && nik.length !== 16 && (
            <span className="text-xs text-slate-500">{nik.length}/16</span>
          )}
        </form>
        {error && <div className="text-sm text-red-600">{error}</div>}

        {loans !== null && (
          <div className="space-y-3">
            {loans.length === 0 ? (
              <div className="p-3 text-sm border rounded-lg border-slate-200 text-slate-500">
                Tidak ada pinjaman aktif untuk NIK ini.
              </div>
            ) : (
              loans.map((l) => (
                <BarisPinjaman
                  key={l.loan_id}
                  loan={l}
                  bulanDepan={server_filter?.bulan_depan}
                  onSimpan={simpan}
                />
              ))
            )}
          </div>
        )}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Mutasi terbaru
          </h2>
          <div className="overflow-x-auto border rounded-lg border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pinjaman</TableHead>
                  <TableHead>Dari</TableHead>
                  <TableHead>Ke</TableHead>
                  <TableHead>Berlaku</TableHead>
                  <TableHead>Sampai</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riwayat.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center text-slate-500">
                      Belum ada mutasi.
                    </TableCell>
                  </TableRow>
                ) : (
                  riwayat.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>#{m.loan_id}</TableCell>
                      <TableCell>kel {m.dari}</TableCell>
                      <TableCell>kel {m.ke}</TableCell>
                      <TableCell className="tabular-nums">{m.berlaku_bulan}</TableCell>
                      <TableCell className="tabular-nums">
                        {m.berlaku_sampai ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-xs text-xs truncate">
                        {m.alasan}
                      </TableCell>
                      <TableCell>{m.penginput}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default MutasiNasabah;
