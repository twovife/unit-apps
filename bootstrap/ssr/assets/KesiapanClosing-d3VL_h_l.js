import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-C3znwcHI.js";
import "react";
import { Head, router } from "@inertiajs/react";
import { I as Input } from "./input-BHD-__le.js";
import { Minus, Check, X } from "lucide-react";
import dayjs from "dayjs";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "./button-MTjEwktD.js";
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
const rupiah = (n) => new Intl.NumberFormat("id-ID").format(n ?? 0);
const Tanda = ({ ada }) => ada ? /* @__PURE__ */ jsx(Check, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ jsx(X, { className: "size-3.5 text-red-500" });
const Kelompok = ({ k }) => /* @__PURE__ */ jsxs("div", { className: "overflow-hidden bg-white border rounded-lg", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b bg-slate-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-slate-800", children: [
      "Kelompok ",
      k.kelompok
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-600", children: [
      k.utuh_sampai ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "rantai utuh sampai",
        " ",
        /* @__PURE__ */ jsx("b", { className: "text-emerald-700", children: dayjs(k.utuh_sampai).format("DD MMM") })
      ] }) : /* @__PURE__ */ jsx("b", { className: "text-red-600", children: "rantai putus sejak hari pertama" }),
      k.putus_di && /* @__PURE__ */ jsxs(Fragment, { children: [
        " ",
        "· putus di",
        " ",
        /* @__PURE__ */ jsx("b", { className: "text-red-600", children: dayjs(k.putus_di).format("DD MMM") })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "ml-2 text-slate-400", children: [
        "(",
        k.jumlah_lengkap,
        "/",
        k.jumlah_hari,
        " hari lengkap)"
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsx("thead", { className: "text-slate-500", children: /* @__PURE__ */ jsxs("tr", { className: "border-b", children: [
      /* @__PURE__ */ jsx("th", { className: "px-2 py-1 font-medium text-left", children: "Tgl" }),
      /* @__PURE__ */ jsx("th", { className: "px-2 py-1 font-medium text-right", children: "Drop" }),
      /* @__PURE__ */ jsx("th", { className: "px-2 py-1 font-medium text-right", children: "Storting" }),
      /* @__PURE__ */ jsx("th", { className: "px-2 py-1 font-medium text-center", children: "Kepala" }),
      /* @__PURE__ */ jsx("th", { className: "px-2 py-1 font-medium text-center", children: "Kasir" }),
      /* @__PURE__ */ jsx("th", { className: "px-2 py-1 font-medium text-left", children: "Status" })
    ] }) }),
    /* @__PURE__ */ jsxs("tbody", { children: [
      k.hari.map((h) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: `border-b last:border-0 ${h.di_luar_rantai ? "bg-slate-50 text-slate-400" : h.lengkap ? "" : "bg-red-50"}`,
          children: [
            /* @__PURE__ */ jsx("td", { className: "px-2 py-1 tabular-nums", children: dayjs(h.tanggal).format("DD ddd") }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: rupiah(h.drop) }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-right tabular-nums", children: rupiah(h.storting) }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-center", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(Tanda, { ada: h.kepala }) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-center", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(Tanda, { ada: h.kasir }) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: h.lengkap && !h.di_luar_rantai ? /* @__PURE__ */ jsx("span", { className: "text-emerald-700", children: "dalam rantai" }) : h.di_luar_rantai ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-slate-400", children: [
              /* @__PURE__ */ jsx(Minus, { className: "size-3" }),
              " di luar rantai"
            ] }) : /* @__PURE__ */ jsx("span", { className: "font-medium text-red-600", children: "RANTAI PUTUS DI SINI" }) })
          ]
        },
        h.tanggal
      )),
      k.hari.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-2 py-4 text-center text-slate-500", children: "Tidak ada baris rekap untuk periode ini." }) })
    ] })
  ] }) })
] });
const KesiapanClosing = ({ datas = [], server_filter }) => {
  const gantiPeriode = (v) => v && router.get(
    route("migrasi.kesiapan_closing"),
    { periode: `${v}-01` },
    { preserveState: true, preserveScroll: true }
  );
  const siap = datas.filter((d) => !d.putus_di).length;
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Kesiapan Closing" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
            "Kesiapan Closing — ",
            server_filter == null ? void 0 : server_filter.unit
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
            "Menelusuri rekap harian dari tanggal 1, dan berhenti di hari pertama yang approval kepala atau kasirnya belum ada. Yang perlu diketahui bukan berapa hari yang lengkap, melainkan",
            " ",
            /* @__PURE__ */ jsx("b", { children: "sampai hari ke berapa rantainya masih utuh" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-xs font-medium text-slate-600", children: "Periode" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "month",
              className: "w-40",
              defaultValue: dayjs(server_filter == null ? void 0 : server_filter.periode).format("YYYY-MM"),
              onChange: (e) => gantiPeriode(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `rounded-lg border p-3 text-xs ${siap === datas.length && datas.length > 0 ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-amber-300 bg-amber-50 text-amber-900"}`,
          children: [
            /* @__PURE__ */ jsxs("b", { children: [
              siap,
              " dari ",
              datas.length,
              " kelompok"
            ] }),
            " ",
            "rantainya utuh sebulan penuh.",
            siap < datas.length && /* @__PURE__ */ jsxs(Fragment, { children: [
              " ",
              "Sisanya putus di suatu titik — selama itu belum dibereskan, saldo berjalannya tidak bisa ditelusuri lewat rangkaian yang utuh."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3 xl:grid-cols-2", children: datas.map((k) => /* @__PURE__ */ jsx(Kelompok, { k }, k.kelompok)) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600", children: [
        /* @__PURE__ */ jsx("b", { children: "Kenapa berhenti, bukan menghitung total." }),
        ' "22 dari 27 hari terisi" terdengar bagus, padahal kalau yang bolong justru hari pertama, rantainya putus sejak awal. Hari sesudah titik putus ditandai',
        " ",
        /* @__PURE__ */ jsx("i", { children: "di luar rantai" }),
        " — angkanya belum tentu salah, tapi tidak lagi bisa ditelusuri sebagai rangkaian."
      ] })
    ] })
  ] });
};
export {
  KesiapanClosing as default
};
