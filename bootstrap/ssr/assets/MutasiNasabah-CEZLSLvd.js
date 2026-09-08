import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-BTjvMW7z.js";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { I as Input } from "./input-BHD-__le.js";
import { B as Button } from "./button-MTjEwktD.js";
import { Search, ArrowRight } from "lucide-react";
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
const BarisPinjaman = ({ loan, bulanDepan, onSimpan }) => {
  var _a;
  const [tujuan, setTujuan] = useState(((_a = loan.tujuan[0]) == null ? void 0 : _a.id) ?? "");
  const [bulan, setBulan] = useState(bulanDepan.slice(0, 7));
  const [alasan, setAlasan] = useState("");
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg border-slate-200 bg-white space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-baseline justify-between gap-2 text-sm", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        "Pinjaman #",
        loan.loan_id
      ] }),
      " ·",
      " ",
      loan.unit,
      " · kelompok",
      " ",
      /* @__PURE__ */ jsx("b", { children: loan.kelompok_efektif }),
      " ·",
      " ",
      /* @__PURE__ */ jsx("span", { className: "capitalize", children: loan.hari }),
      " · drop ",
      loan.drop_date
    ] }) }),
    loan.tujuan.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Tidak ada kelompok lain di kantor ini untuk jadi tujuan." }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "pb-2 text-sm text-slate-500", children: [
          "kel ",
          loan.kelompok_efektif
        ] }),
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 mb-2 text-slate-400" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Kelompok tujuan" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: tujuan,
              onChange: (e) => setTujuan(Number(e.target.value)),
              className: "w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input",
              children: loan.tujuan.map((t) => /* @__PURE__ */ jsxs("option", { value: t.id, children: [
                "kelompok ",
                t.kelompok
              ] }, t.id))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Berlaku mulai" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "month",
            value: bulan,
            min: bulanDepan.slice(0, 7),
            onChange: (e) => setBulan(e.target.value),
            className: "mt-1 h-9"
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
            placeholder: "mis. pindah domisili",
            className: "mt-1 h-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => onSimpan(loan.loan_id, tujuan, `${bulan}-01`, alasan),
          children: "Pindahkan"
        }
      )
    ] })
  ] });
};
const MutasiNasabah = ({ riwayat = [], server_filter }) => {
  const [nik, setNik] = useState("");
  const [loans, setLoans] = useState(null);
  const [sibuk, setSibuk] = useState(false);
  const [error, setError] = useState(null);
  const cari = (e) => {
    var _a;
    (_a = e == null ? void 0 : e.preventDefault) == null ? void 0 : _a.call(e);
    if (nik.length !== 16) {
      setError("NIK harus 16 digit.");
      return;
    }
    setSibuk(true);
    setError(null);
    axios.post(route("mutasi_nasabah.cari"), { nik }).then(({ data }) => setLoans(data.loans ?? [])).catch((err) => {
      var _a2, _b;
      return setError(((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || "Gagal mencari.");
    }).finally(() => setSibuk(false));
  };
  const simpan = (loan_id, ke_grouping_id, berlaku_bulan, alasan) => {
    router.post(
      route("mutasi_nasabah.simpan"),
      { loan_id, ke_grouping_id, berlaku_bulan, alasan },
      { preserveScroll: true, onSuccess: () => cari() }
    );
  };
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Mutasi Nasabah" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-slate-900", children: "Mutasi Nasabah" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: "Memindah pinjaman antar kelompok/mantri di kantor yang sama. Yang direkam adalah perpindahannya — kelompok asal pinjaman tidak ditimpa, jadi agregat bulan-bulan lampau tidak berubah. Berlaku paling cepat bulan depan (tanggal 1), dan hanya superuser." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: cari, className: "flex items-end gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 max-w-xs", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "NIK nasabah" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              inputMode: "numeric",
              value: nik,
              onChange: (e) => setNik(e.target.value.replace(/\D/g, "")),
              placeholder: "16 digit",
              className: "mt-1 tabular-nums"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: sibuk, children: [
          /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 mr-1" }),
          "Cari"
        ] }),
        nik.length > 0 && nik.length !== 16 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
          nik.length,
          "/16"
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "text-sm text-red-600", children: error }),
      loans !== null && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: loans.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-3 text-sm border rounded-lg border-slate-200 text-slate-500", children: "Tidak ada pinjaman aktif untuk NIK ini." }) : loans.map((l) => /* @__PURE__ */ jsx(
        BarisPinjaman,
        {
          loan: l,
          bulanDepan: server_filter == null ? void 0 : server_filter.bulan_depan,
          onSimpan: simpan
        },
        l.loan_id
      )) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-sm font-semibold text-slate-900", children: "Mutasi terbaru" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Pinjaman" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Dari" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Ke" }),
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
            /* @__PURE__ */ jsxs(TableCell, { children: [
              "kel ",
              m.dari
            ] }),
            /* @__PURE__ */ jsxs(TableCell, { children: [
              "kel ",
              m.ke
            ] }),
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
