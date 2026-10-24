import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CLVnpQ7Y.js";
import "react";
import { Head, router } from "@inertiajs/react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { B as Button } from "./button-MTjEwktD.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./input-BHD-__le.js";
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
const Kartu = ({ judul, utama, bawah, nada = "netral" }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `rounded-lg border p-4 ${{
      netral: "border-slate-200 bg-white",
      ingat: "border-amber-300 bg-amber-50/60"
    }[nada]}`,
    children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium tracking-wide uppercase text-slate-500", children: judul }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-semibold tabular-nums text-slate-900", children: utama }),
      bawah && /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-slate-500", children: bawah })
    ]
  }
);
const TargetBayangan = ({ baris = [], ringkas, server_filter }) => {
  const pindah = (periode) => router.get(route("migrasi.target_bayangan"), { periode }, { preserveScroll: true });
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Target Bayangan" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
            "Target: Rantai vs Hitung — ",
            server_filter == null ? void 0 : server_filter.unit
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
            "Perbandingan ",
            /* @__PURE__ */ jsx("b", { children: "read-only" }),
            ": target ",
            /* @__PURE__ */ jsx("b", { children: "rantai" }),
            " yang tersimpan (warisan minggu lalu + drop×0,13 − keluar) berdampingan dengan target ",
            /* @__PURE__ */ jsx("b", { children: "hitung" }),
            " dari portofolio (Σ nominal_drop×0,13 atas pinjaman belum lunas di ember target). Bukan untuk mengubah apa pun — ini ukuran seberapa jauh rantai sudah hanyut, untuk menilai kapan tombol recount layak dinyalakan."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => pindah(server_filter == null ? void 0 : server_filter.sebelumnya), children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("div", { className: "min-w-[7rem] text-center text-sm font-medium tabular-nums", children: server_filter == null ? void 0 : server_filter.periode }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => pindah(server_filter == null ? void 0 : server_filter.berikutnya), children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Kartu, { judul: "Target rantai", utama: rupiah(ringkas == null ? void 0 : ringkas.rantai), bawah: "tersimpan" }),
        /* @__PURE__ */ jsx(Kartu, { judul: "Target hitung", utama: rupiah(ringkas == null ? void 0 : ringkas.hitung), bawah: "dari portofolio" }),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Hanyut (rantai − hitung)",
            utama: rupiah(ringkas == null ? void 0 : ringkas.selisih),
            nada: (ringkas == null ? void 0 : ringkas.selisih) !== 0 ? "ingat" : "netral"
          }
        ),
        /* @__PURE__ */ jsx(Kartu, { judul: "Baris meleset", utama: (ringkas == null ? void 0 : ringkas.meleset) ?? 0 })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Kelompok" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Hari" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Target rantai" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Target hitung" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Hanyut" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: baris.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "py-8 text-center text-slate-500", children: "Tidak ada data untuk periode ini." }) }) : baris.map((b, i) => /* @__PURE__ */ jsxs(TableRow, { className: b.selisih !== 0 ? "bg-amber-50/40" : void 0, children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: b.kelompok ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: b.hari }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(b.rantai) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(b.hitung) }),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: `text-right tabular-nums ${b.selisih !== 0 ? "font-semibold text-amber-700" : "text-slate-400"}`,
              children: rupiah(b.selisih)
            }
          )
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "max-w-3xl text-xs text-slate-500", children: "Hanyut besar bukan berarti data salah — rantai memang menumpuk pembulatan dan keluar-target yang tak seragam. Tombol recount (setel ulang target dari hitung) sengaja belum ada; dinyalakan nanti setelah angka hitung terbukti bersih lewat laporan ini." })
    ] })
  ] });
};
export {
  TargetBayangan as default
};
