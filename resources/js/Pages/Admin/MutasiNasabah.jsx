import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useMemo, useState } from "react";
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
import Checkbox from "@/Components/Checkbox";
import { ArrowRight } from "lucide-react";

const rupiah = (n) =>
  n === null || n === undefined ? "—" : new Intl.NumberFormat("id-ID").format(n);

const MutasiNasabah = ({ kelompok = [], hari_opsi = [], riwayat = [], server_filter }) => {
  const bulanDepan = (server_filter?.bulan_depan ?? "").slice(0, 7);

  // Asal
  const [asalKel, setAsalKel] = useState(kelompok[0]?.id ?? "");
  const [asalHari, setAsalHari] = useState(hari_opsi[0] ?? "senin");
  const [bulan, setBulan] = useState(bulanDepan);

  // Hasil + centang
  const [loans, setLoans] = useState(null);
  const [pilih, setPilih] = useState({});
  const [sibuk, setSibuk] = useState(false);
  const [error, setError] = useState(null);

  // Tujuan
  const [tujuanKel, setTujuanKel] = useState(kelompok[0]?.id ?? "");
  const [tujuanHari, setTujuanHari] = useState(hari_opsi[0] ?? "senin");
  const [alasan, setAlasan] = useState("");

  const terpilih = useMemo(
    () => Object.keys(pilih).filter((k) => pilih[k]).map(Number),
    [pilih],
  );

  const cari = () => {
    setSibuk(true);
    setError(null);
    setPilih({});
    axios
      .post(route("mutasi_nasabah.cari"), {
        grouping_id: asalKel,
        hari: asalHari,
        berlaku_bulan: `${bulan}-01`,
      })
      .then(({ data }) => setLoans(data.loans ?? []))
      .catch((err) => setError(err.response?.data?.message || "Gagal memuat."))
      .finally(() => setSibuk(false));
  };

  const semua = (on) =>
    setPilih(on ? Object.fromEntries((loans ?? []).map((l) => [l.loan_id, true])) : {});

  const pindahkan = () => {
    if (terpilih.length === 0) return;
    const namaKel = (id) => kelompok.find((k) => k.id === Number(id))?.kelompok ?? id;
    if (
      !window.confirm(
        `Pindahkan ${terpilih.length} nasabah dari kelompok ${namaKel(asalKel)} ${asalHari} ` +
          `ke kelompok ${namaKel(tujuanKel)} ${tujuanHari}, berlaku ${bulan}?`,
      )
    )
      return;

    router.post(
      route("mutasi_nasabah.simpan"),
      {
        loan_ids: terpilih,
        ke_grouping_id: tujuanKel,
        ke_hari: tujuanHari,
        berlaku_bulan: `${bulan}-01`,
        alasan,
      },
      { preserveScroll: true, onSuccess: () => cari() },
    );
  };

  const samaTujuan =
    Number(tujuanKel) === Number(asalKel) && tujuanHari === asalHari;

  return (
    <Authenticated>
      <Head title="Mutasi Nasabah" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Mutasi Nasabah — {server_filter?.unit}
          </h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Pindah borongan antar (kelompok, hari) di kantor ini — mis. kelompok
            sepi digabung ke kelompok lain, atau pindah hari tagih. Hanya nasabah
            <b> belum lunas</b> yang muncul. Berlaku selalu tanggal 1, dan
            kelompok asal pinjaman tak ditimpa (agregat lampau tak berubah).
          </p>
        </div>

        {/* Asal + bulan */}
        <div className="flex flex-wrap items-end gap-2 p-3 border rounded-lg border-slate-200 bg-slate-50">
          <div>
            <label className="text-xs text-slate-500">Kelompok asal</label>
            <select
              value={asalKel}
              onChange={(e) => setAsalKel(Number(e.target.value))}
              className="w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input"
            >
              {kelompok.map((k) => (
                <option key={k.id} value={k.id}>
                  kelompok {k.kelompok}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Hari asal</label>
            <select
              value={asalHari}
              onChange={(e) => setAsalHari(e.target.value)}
              className="h-9 mt-1 px-2 text-sm capitalize border rounded-md bg-background border-input"
            >
              {hari_opsi.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Berlaku mulai</label>
            <Input
              type="month"
              value={bulan}
              min={bulanDepan}
              onChange={(e) => setBulan(e.target.value)}
              className="mt-1 h-9"
            />
          </div>
          <Button onClick={cari} disabled={sibuk}>
            Tampilkan nasabah
          </Button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}

        {loans !== null && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {loans.length} nasabah belum lunas · {terpilih.length} dipilih
              </div>
              {loans.length > 0 && (
                <div className="flex gap-2">
                  <Button size="xs" variant="outline" onClick={() => semua(true)}>
                    Pilih semua
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => semua(false)}>
                    Kosongkan
                  </Button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto bg-white border rounded-lg border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Drop</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-slate-500">
                        Tidak ada nasabah belum lunas di kelompok/hari ini.
                      </TableCell>
                    </TableRow>
                  ) : (
                    loans.map((l) => (
                      <TableRow key={l.loan_id}>
                        <TableCell>
                          <Checkbox
                            checked={!!pilih[l.loan_id]}
                            onChange={(e) =>
                              setPilih((p) => ({ ...p, [l.loan_id]: e.target.checked }))
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{l.nama}</TableCell>
                        <TableCell className="text-xs tabular-nums">{l.nik}</TableCell>
                        <TableCell className="tabular-nums">{l.drop_date}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {rupiah(l.saldo)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Tujuan */}
            {loans.length > 0 && (
              <div className="flex flex-wrap items-end gap-2 p-3 border rounded-lg border-primary/30 bg-primary/5">
                <ArrowRight className="w-4 h-4 mb-2 text-slate-400" />
                <div>
                  <label className="text-xs text-slate-500">Kelompok tujuan</label>
                  <select
                    value={tujuanKel}
                    onChange={(e) => setTujuanKel(Number(e.target.value))}
                    className="w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input"
                  >
                    {kelompok.map((k) => (
                      <option key={k.id} value={k.id}>
                        kelompok {k.kelompok}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Hari tujuan</label>
                  <select
                    value={tujuanHari}
                    onChange={(e) => setTujuanHari(e.target.value)}
                    className="h-9 mt-1 px-2 text-sm capitalize border rounded-md bg-background border-input"
                  >
                    {hari_opsi.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-40">
                  <label className="text-xs text-slate-500">Alasan</label>
                  <Input
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    placeholder="mis. kelompok sepi, digabung"
                    className="mt-1 h-9"
                  />
                </div>
                <Button
                  onClick={pindahkan}
                  disabled={terpilih.length === 0 || samaTujuan}
                  title={samaTujuan ? "Tujuan sama dengan asal" : undefined}
                >
                  Pindahkan {terpilih.length || ""}
                </Button>
              </div>
            )}
          </>
        )}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Mutasi terbaru</h2>
          <div className="overflow-x-auto border rounded-lg border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pinjaman</TableHead>
                  <TableHead>Dari (kel/hari)</TableHead>
                  <TableHead>Ke (kel/hari)</TableHead>
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
                      <TableCell className="capitalize">{m.dari}</TableCell>
                      <TableCell className="capitalize">{m.ke}</TableCell>
                      <TableCell className="tabular-nums">{m.berlaku_bulan}</TableCell>
                      <TableCell className="tabular-nums">{m.berlaku_sampai ?? "—"}</TableCell>
                      <TableCell className="max-w-xs text-xs truncate">{m.alasan}</TableCell>
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
