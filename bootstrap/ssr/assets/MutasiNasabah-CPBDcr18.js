import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CLVnpQ7Y.js";
import { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { I as Input } from "./input-BHD-__le.js";
import { B as Button } from "./button-MTjEwktD.js";
import { C as Checkbox } from "./Checkbox-DLnjqb3e.js";
import { ArrowRight } from "lucide-react";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "./dialog-8a8NNlps.js";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
const rupiah = (n) => n === null || n === void 0 ? "—" : new Intl.NumberFormat("id-ID").format(n);
const MutasiNasabah = ({ kelompok = [], hari_opsi = [], riwayat = [], server_filter }) => {
  var _a, _b;
  const bulanDepan = ((server_filter == null ? void 0 : server_filter.bulan_depan) ?? "").slice(0, 7);
  const [asalKel, setAsalKel] = useState(((_a = kelompok[0]) == null ? void 0 : _a.id) ?? "");
  const [asalHari, setAsalHari] = useState(hari_opsi[0] ?? "senin");
  const [bulan, setBulan] = useState(bulanDepan);
  const [loans, setLoans] = useState(null);
  const [pilih, setPilih] = useState({});
  const [sibuk, setSibuk] = useState(false);
  const [error, setError] = useState(null);
  const [tujuanKel, setTujuanKel] = useState(((_b = kelompok[0]) == null ? void 0 : _b.id) ?? "");
  const [tujuanHari, setTujuanHari] = useState(hari_opsi[0] ?? "senin");
  const [alasan, setAlasan] = useState("");
  const terpilih = useMemo(
    () => Object.keys(pilih).filter((k) => pilih[k]).map(Number),
    [pilih]
  );
  const cari = () => {
    setSibuk(true);
    setError(null);
    setPilih({});
    axios.post(route("mutasi_nasabah.cari"), {
      grouping_id: asalKel,
      hari: asalHari,
      berlaku_bulan: `${bulan}-01`
    }).then(({ data }) => setLoans(data.loans ?? [])).catch((err) => {
      var _a2, _b2;
      return setError(((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Gagal memuat.");
    }).finally(() => setSibuk(false));
  };
  const semua = (on) => setPilih(on ? Object.fromEntries((loans ?? []).map((l) => [l.loan_id, true])) : {});
  const pindahkan = () => {
    if (terpilih.length === 0) return;
    const namaKel = (id) => {
      var _a2;
      return ((_a2 = kelompok.find((k) => k.id === Number(id))) == null ? void 0 : _a2.kelompok) ?? id;
    };
    if (!window.confirm(
      `Pindahkan ${terpilih.length} nasabah dari kelompok ${namaKel(asalKel)} ${asalHari} ke kelompok ${namaKel(tujuanKel)} ${tujuanHari}, berlaku ${bulan}?`
    ))
      return;
    router.post(
      route("mutasi_nasabah.simpan"),
      {
        loan_ids: terpilih,
        ke_grouping_id: tujuanKel,
        ke_hari: tujuanHari,
        berlaku_bulan: `${bulan}-01`,
        alasan
      },
      { preserveScroll: true, onSuccess: () => cari() }
    );
  };
  const samaTujuan = Number(tujuanKel) === Number(asalKel) && tujuanHari === asalHari;
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Mutasi Nasabah" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
          "Mutasi Nasabah — ",
          server_filter == null ? void 0 : server_filter.unit
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
          "Pindah borongan antar (kelompok, hari) di kantor ini — mis. kelompok sepi digabung ke kelompok lain, atau pindah hari tagih. Hanya nasabah",
          /* @__PURE__ */ jsx("b", { children: " belum lunas" }),
          " yang muncul. Berlaku selalu tanggal 1, dan kelompok asal pinjaman tak ditimpa (agregat lampau tak berubah)."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-2 p-3 border rounded-lg border-slate-200 bg-slate-50", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Kelompok asal" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: asalKel,
              onChange: (e) => setAsalKel(Number(e.target.value)),
              className: "w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input",
              children: kelompok.map((k) => /* @__PURE__ */ jsxs("option", { value: k.id, children: [
                "kelompok ",
                k.kelompok
              ] }, k.id))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Hari asal" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: asalHari,
              onChange: (e) => setAsalHari(e.target.value),
              className: "h-9 mt-1 px-2 text-sm capitalize border rounded-md bg-background border-input",
              children: hari_opsi.map((h) => /* @__PURE__ */ jsx("option", { value: h, children: h }, h))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Berlaku mulai" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "month",
              value: bulan,
              min: bulanDepan,
              onChange: (e) => setBulan(e.target.value),
              className: "mt-1 h-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: cari, disabled: sibuk, children: "Tampilkan nasabah" })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "text-sm text-red-600", children: error }),
      loans !== null && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-600", children: [
            loans.length,
            " nasabah belum lunas · ",
            terpilih.length,
            " dipilih"
          ] }),
          loans.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { size: "xs", variant: "outline", onClick: () => semua(true), children: "Pilih semua" }),
            /* @__PURE__ */ jsx(Button, { size: "xs", variant: "outline", onClick: () => semua(false), children: "Kosongkan" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-10" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
            /* @__PURE__ */ jsx(TableHead, { children: "NIK" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Drop" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Saldo" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: loans.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "py-6 text-center text-slate-500", children: "Tidak ada nasabah belum lunas di kelompok/hari ini." }) }) : loans.map((l) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                checked: !!pilih[l.loan_id],
                onChange: (e) => setPilih((p) => ({ ...p, [l.loan_id]: e.target.checked }))
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: l.nama }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs tabular-nums", children: l.nik }),
            /* @__PURE__ */ jsx(TableCell, { className: "tabular-nums", children: l.drop_date }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(l.saldo) })
          ] }, l.loan_id)) })
        ] }) }),
        loans.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-2 p-3 border rounded-lg border-primary/30 bg-primary/5", children: [
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 mb-2 text-slate-400" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Kelompok tujuan" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: tujuanKel,
                onChange: (e) => setTujuanKel(Number(e.target.value)),
                className: "w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input",
                children: kelompok.map((k) => /* @__PURE__ */ jsxs("option", { value: k.id, children: [
                  "kelompok ",
                  k.kelompok
                ] }, k.id))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Hari tujuan" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: tujuanHari,
                onChange: (e) => setTujuanHari(e.target.value),
                className: "h-9 mt-1 px-2 text-sm capitalize border rounded-md bg-background border-input",
                children: hari_opsi.map((h) => /* @__PURE__ */ jsx("option", { value: h, children: h }, h))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-40", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Alasan" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: alasan,
                onChange: (e) => setAlasan(e.target.value),
                placeholder: "mis. kelompok sepi, digabung",
                className: "mt-1 h-9"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: pindahkan,
              disabled: terpilih.length === 0 || samaTujuan,
              title: samaTujuan ? "Tujuan sama dengan asal" : void 0,
              children: [
                "Pindahkan ",
                terpilih.length || ""
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-sm font-semibold text-slate-900", children: "Mutasi terbaru" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Pinjaman" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Dari (kel/hari)" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Ke (kel/hari)" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Berlaku" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Sampai" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Alasan" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Oleh" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: riwayat.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "py-6 text-center text-slate-500", children: "Belum ada mutasi." }) }) : riwayat.map((m) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              "#",
              m.loan_id
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: m.dari }),
            /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: m.ke }),
            /* @__PURE__ */ jsx(TableCell, { className: "tabular-nums", children: m.berlaku_bulan }),
            /* @__PURE__ */ jsx(TableCell, { className: "tabular-nums", children: m.berlaku_sampai ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "max-w-xs text-xs truncate", children: m.alasan }),
            /* @__PURE__ */ jsx(TableCell, { children: m.penginput })
          ] }, m.id)) })
        ] }) })
      ] })
    ] })
  ] });
};
export {
  MutasiNasabah as default
};
