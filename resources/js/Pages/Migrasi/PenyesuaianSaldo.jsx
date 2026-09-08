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
import { Search, ShieldAlert } from "lucide-react";

const rupiah = (n) =>
  n === null || n === undefined ? "—" : new Intl.NumberFormat("id-ID").format(n);

const Kartu = ({ judul, utama, bawah, nada = "netral" }) => (
  <div
    className={`rounded-lg border p-4 ${
      { netral: "border-slate-200 bg-white", ingat: "border-amber-300 bg-amber-50/60" }[
        nada
      ]
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

/** Satu pinjaman hasil cari: saldo sistem + form sisa saldo. */
const KartuPinjaman = ({ loan, jenisOpsi, bolehUbah, onSimpan }) => {
  const [jenis, setJenis] = useState(jenisOpsi[0]?.nilai ?? "");
  const [sisa, setSisa] = useState("");

  const selisih = sisa === "" ? null : Number(sisa) - loan.saldo;

  return (
    <div className="p-4 border rounded-lg border-slate-200 bg-white space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-medium">
          Kelompok {loan.kelompok} · <span className="capitalize">{loan.hari}</span> ·
          drop {loan.drop_date}
        </div>
        <div className="text-xs text-slate-500">pinjaman #{loan.loan_id}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div>
          <div className="text-xs text-slate-500">Pinjaman</div>
          <div className="tabular-nums">{rupiah(loan.pinjaman)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Angsuran</div>
          <div className="tabular-nums">{rupiah(loan.angsuran)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Pemutihan</div>
          <div className="tabular-nums">{rupiah(loan.pemutihan)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Saldo sistem</div>
          <div className="font-semibold tabular-nums">{rupiah(loan.saldo)}</div>
        </div>
      </div>

      {loan.penyesuaian.length > 0 && (
        <div className="text-xs text-slate-600">
          Penyesuaian sebelumnya:{" "}
          {loan.penyesuaian.map((p) => (
            <span
              key={p.id}
              className="inline-block mr-2 rounded bg-slate-100 px-1.5 py-0.5"
            >
              {p.jenis} {rupiah(p.efek)}
              {p.butuh_persetujuan && !p.disetujui ? " (menunggu)" : ""}
            </span>
          ))}
        </div>
      )}

      {bolehUbah ? (
        <div className="flex flex-wrap items-end gap-2 pt-2 border-t">
          <div className="w-full sm:w-auto sm:flex-1">
            <label className="text-xs text-slate-500">Jenis</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input"
            >
              {jenisOpsi.map((o) => (
                <option key={o.nilai} value={o.nilai}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-slate-500">Sisa saldo (buku)</label>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={sisa}
              onChange={(e) => setSisa(e.target.value)}
              placeholder="sisa sebenarnya"
              className="mt-1 tabular-nums"
            />
          </div>
          <Button
            disabled={sisa === "" || selisih === 0}
            onClick={() => onSimpan(loan.loan_id, jenis, Number(sisa))}
          >
            Simpan
          </Button>
          {selisih !== null && (
            <div className="w-full text-xs text-slate-500">
              {selisih === 0
                ? "Sisa = saldo sistem — tidak ada yang perlu disesuaikan."
                : `Perlu ${selisih > 0 ? "menambah" : "mengurangi"} saldo ${rupiah(
                    Math.abs(selisih),
                  )}. Pastikan jenis yang dipilih searah.`}
            </div>
          )}
        </div>
      ) : (
        <div className="pt-2 text-xs border-t text-slate-400">
          Butuh izin can-edit dari superuser untuk menyesuaikan.
        </div>
      )}
    </div>
  );
};

const PenyesuaianSaldo = ({ antrean = [], per_mantri = [], server_filter, jenis_opsi }) => {
  const [nik, setNik] = useState("");
  const [loans, setLoans] = useState(null);
  const [sibuk, setSibuk] = useState(false);
  const [error, setError] = useState(null);

  const cari = (e) => {
    e.preventDefault();
    if (nik.length !== 16) {
      setError("NIK harus 16 digit.");
      return;
    }
    setSibuk(true);
    setError(null);
    axios
      .post(route("migrasi.penyesuaian_saldo_cari"), { nik })
      .then(({ data }) => setLoans(data.loans ?? []))
      .catch((err) =>
        setError(err.response?.data?.message || "Gagal mencari."),
      )
      .finally(() => setSibuk(false));
  };

  const simpan = (loan_id, jenis, sisa_saldo) => {
    router.post(
      route("migrasi.penyesuaian_saldo_simpan"),
      { loan_id, jenis, sisa_saldo },
      {
        preserveScroll: true,
        onSuccess: () => cari({ preventDefault: () => {} }),
      },
    );
  };

  const setujui = (id) =>
    router.post(
      route("migrasi.penyesuaian_saldo_setujui", id),
      {},
      { preserveScroll: true },
    );

  return (
    <Authenticated>
      <Head title="Penyesuaian Saldo" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Penyesuaian Saldo — {server_filter?.unit}
          </h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Membetulkan saldo nasabah lama tanpa menyentuh kas. Ketik <b>sisa
            saldo</b> yang tertera di buku — bukan "sudah bayar berapa" — dan
            sistem menghitung sendiri penyesuaiannya. Bukan lewat angsuran (uang
            hantu) atau pemutihan (laporan menggelembung).
          </p>
        </div>

        {!server_filter?.sudah_migrasi && (
          <div className="p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700">
            Kantor ini belum memakai alur agregasi baru, jadi belum ada jendela
            penyesuaian.
          </div>
        )}

        <div className="p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600">
          Hanya pinjaman ML lama yang bisa disesuaikan: drop sebelum{" "}
          <b>{server_filter?.batas ?? "—"}</b> (6 bulan sebelum migrasi).
          Himpunan ini beku sejak migrasi dan hanya mengecil.
        </div>

        {/* Cari NIK */}
        <form onSubmit={cari} className="flex items-end gap-2">
          <div className="flex-1 max-w-xs">
            <label className="text-xs text-slate-500">NIK nasabah</label>
            <Input
              type="text"
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
                Tidak ada pinjaman ML lama yang memenuhi syarat untuk NIK ini.
              </div>
            ) : (
              loans.map((l) => (
                <KartuPinjaman
                  key={l.loan_id}
                  loan={l}
                  jenisOpsi={jenis_opsi}
                  bolehUbah={server_filter?.boleh_ubah}
                  onSimpan={simpan}
                />
              ))
            )}
          </div>
        )}

        {/* Antrean persetujuan */}
        {antrean.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Menunggu persetujuan ({antrean.length})
            </h2>
            <div className="flex items-start gap-2 p-2 mb-2 text-xs border rounded border-amber-300 bg-amber-50/60 text-amber-900">
              <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Penyetuju tidak boleh sama dengan pengaju — sistem menolaknya.
            </div>
            <div className="overflow-x-auto border rounded-lg border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelompok</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead>Pengaju</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {antrean.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.kelompok}</TableCell>
                      <TableCell>{a.jenis}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {rupiah(a.nominal)}
                      </TableCell>
                      <TableCell>{a.penginput}</TableCell>
                      <TableCell className="max-w-xs text-xs truncate">
                        {a.catatan}
                      </TableCell>
                      <TableCell className="text-right">
                        {server_filter?.boleh_ubah ? (
                          <Button size="xs" onClick={() => setujui(a.id)}>
                            Setujui
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Laporan per mantri */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Total penyesuaian per penginput — bulan {server_filter?.periode}
          </h2>
          <div className="overflow-x-auto border rounded-lg border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penginput</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Total nominal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {per_mantri.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-6 text-center text-slate-500">
                      Belum ada penyesuaian bulan ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  per_mantri.map((m) => (
                    <TableRow key={m.mantri}>
                      <TableCell>{m.mantri}</TableCell>
                      <TableCell className="text-right tabular-nums">{m.jml}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {rupiah(m.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Nasabah ML lama masih ditagih; mantri bisa menagih lalu menurunkan
            saldo tanpa menyetor. Laporan ini penangkalnya — penyesuaian yang
            menumpuk di satu nama harus terlihat.
          </p>
        </div>
      </div>
    </Authenticated>
  );
};

export default PenyesuaianSaldo;
