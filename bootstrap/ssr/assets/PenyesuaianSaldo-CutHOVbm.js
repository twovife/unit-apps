import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CD_Iz6Tf.js";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { I as Input } from "./input-BHD-__le.js";
import { B as Button } from "./button-MTjEwktD.js";
import { Search, ShieldAlert } from "lucide-react";
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
const KartuPinjaman = ({ loan, jenisOpsi, bolehUbah, onSimpan }) => {
  var _a;
  const [jenis, setJenis] = useState(((_a = jenisOpsi[0]) == null ? void 0 : _a.nilai) ?? "");
  const [sisa, setSisa] = useState("");
  const selisih = sisa === "" ? null : Number(sisa) - loan.saldo;
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg border-slate-200 bg-white space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium", children: [
        "Kelompok ",
        loan.kelompok,
        " · ",
        /* @__PURE__ */ jsx("span", { className: "capitalize", children: loan.hari }),
        " · drop ",
        loan.drop_date
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-500", children: [
        "pinjaman #",
        loan.loan_id
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Pinjaman" }),
        /* @__PURE__ */ jsx("div", { className: "tabular-nums", children: rupiah(loan.pinjaman) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Angsuran" }),
        /* @__PURE__ */ jsx("div", { className: "tabular-nums", children: rupiah(loan.angsuran) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Pemutihan" }),
        /* @__PURE__ */ jsx("div", { className: "tabular-nums", children: rupiah(loan.pemutihan) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Saldo sistem" }),
        /* @__PURE__ */ jsx("div", { className: "font-semibold tabular-nums", children: rupiah(loan.saldo) })
      ] })
    ] }),
    loan.penyesuaian.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-600", children: [
      "Penyesuaian sebelumnya:",
      " ",
      loan.penyesuaian.map((p) => /* @__PURE__ */ jsxs(
        "span",
        {
          className: "inline-block mr-2 rounded bg-slate-100 px-1.5 py-0.5",
          children: [
            p.jenis,
            " ",
            rupiah(p.efek),
            p.butuh_persetujuan && !p.disetujui ? " (menunggu)" : ""
          ]
        },
        p.id
      ))
    ] }),
    bolehUbah ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-2 pt-2 border-t", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto sm:flex-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Jenis" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: jenis,
            onChange: (e) => setJenis(e.target.value),
            className: "w-full h-9 mt-1 px-2 text-sm border rounded-md bg-background border-input",
            children: jenisOpsi.map((o) => /* @__PURE__ */ jsx("option", { value: o.nilai, children: o.label }, o.nilai))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-40", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Sisa saldo (buku)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: "0",
            inputMode: "numeric",
            value: sisa,
            onChange: (e) => setSisa(e.target.value),
            placeholder: "sisa sebenarnya",
            className: "mt-1 tabular-nums"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          disabled: sisa === "" || selisih === 0,
          onClick: () => onSimpan(loan.loan_id, jenis, Number(sisa)),
          children: "Simpan"
        }
      ),
      selisih !== null && /* @__PURE__ */ jsx("div", { className: "w-full text-xs text-slate-500", children: selisih === 0 ? "Sisa = saldo sistem — tidak ada yang perlu disesuaikan." : `Perlu ${selisih > 0 ? "menambah" : "mengurangi"} saldo ${rupiah(
        Math.abs(selisih)
      )}. Pastikan jenis yang dipilih searah.` })
    ] }) : /* @__PURE__ */ jsx("div", { className: "pt-2 text-xs border-t text-slate-400", children: "Butuh izin can-edit dari superuser untuk menyesuaikan." })
  ] });
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
    axios.post(route("migrasi.penyesuaian_saldo_cari"), { nik }).then(({ data }) => setLoans(data.loans ?? [])).catch(
      (err) => {
        var _a, _b;
        return setError(((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Gagal mencari.");
      }
    ).finally(() => setSibuk(false));
  };
  const simpan = (loan_id, jenis, sisa_saldo) => {
    router.post(
      route("migrasi.penyesuaian_saldo_simpan"),
      { loan_id, jenis, sisa_saldo },
      {
        preserveScroll: true,
        onSuccess: () => cari({ preventDefault: () => {
        } })
      }
    );
  };
  const setujui = (id) => router.post(
    route("migrasi.penyesuaian_saldo_setujui", id),
    {},
    { preserveScroll: true }
  );
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Penyesuaian Saldo" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
          "Penyesuaian Saldo — ",
          server_filter == null ? void 0 : server_filter.unit
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
          "Membetulkan saldo nasabah lama tanpa menyentuh kas. Ketik ",
          /* @__PURE__ */ jsx("b", { children: "sisa saldo" }),
          ' yang tertera di buku — bukan "sudah bayar berapa" — dan sistem menghitung sendiri penyesuaiannya. Bukan lewat angsuran (uang hantu) atau pemutihan (laporan menggelembung).'
        ] })
      ] }),
      !(server_filter == null ? void 0 : server_filter.sudah_migrasi) && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700", children: "Kantor ini belum memakai alur agregasi baru, jadi belum ada jendela penyesuaian." }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600", children: [
        "Hanya pinjaman ML lama yang bisa disesuaikan: drop sebelum",
        " ",
        /* @__PURE__ */ jsx("b", { children: (server_filter == null ? void 0 : server_filter.batas) ?? "—" }),
        " (6 bulan sebelum migrasi). Himpunan ini beku sejak migrasi dan hanya mengecil."
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: cari, className: "flex items-end gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 max-w-xs", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "NIK nasabah" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
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
      loans !== null && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: loans.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-3 text-sm border rounded-lg border-slate-200 text-slate-500", children: "Tidak ada pinjaman ML lama yang memenuhi syarat untuk NIK ini." }) : loans.map((l) => /* @__PURE__ */ jsx(
        KartuPinjaman,
        {
          loan: l,
          jenisOpsi: jenis_opsi,
          bolehUbah: server_filter == null ? void 0 : server_filter.boleh_ubah,
          onSimpan: simpan
        },
        l.loan_id
      )) }),
      antrean.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "mb-2 text-sm font-semibold text-slate-900", children: [
          "Menunggu persetujuan (",
          antrean.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-2 mb-2 text-xs border rounded border-amber-300 bg-amber-50/60 text-amber-900", children: [
          /* @__PURE__ */ jsx(ShieldAlert, { className: "w-3.5 h-3.5 mt-0.5 shrink-0" }),
          "Penyetuju tidak boleh sama dengan pengaju — sistem menolaknya."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Kelompok" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Jenis" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Nominal" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Pengaju" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Catatan" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: antrean.map((a) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: a.kelompok }),
            /* @__PURE__ */ jsx(TableCell, { children: a.jenis }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(a.nominal) }),
            /* @__PURE__ */ jsx(TableCell, { children: a.penginput }),
            /* @__PURE__ */ jsx(TableCell, { className: "max-w-xs text-xs truncate", children: a.catatan }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: (server_filter == null ? void 0 : server_filter.boleh_ubah) ? /* @__PURE__ */ jsx(Button, { size: "xs", onClick: () => setujui(a.id), children: "Setujui" }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "—" }) })
          ] }, a.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "mb-2 text-sm font-semibold text-slate-900", children: [
          "Total penyesuaian per penginput — bulan ",
          server_filter == null ? void 0 : server_filter.periode
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Penginput" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Jumlah" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Total nominal" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: per_mantri.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 3, className: "py-6 text-center text-slate-500", children: "Belum ada penyesuaian bulan ini." }) }) : per_mantri.map((m) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: m.mantri }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: m.jml }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(m.total) })
          ] }, m.mantri)) })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Nasabah ML lama masih ditagih; mantri bisa menagih lalu menurunkan saldo tanpa menyetor. Laporan ini penangkalnya — penyesuaian yang menumpuk di satu nama harus terlihat." })
      ] })
    ] })
  ] });
};
export {
  PenyesuaianSaldo as default
};
