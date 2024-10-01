import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-320c7184.mjs";
import { S as SearchComponent } from "./SearchComponent-0cdecced.mjs";
import { Head } from "@inertiajs/react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-f70be525.mjs";
import AngsuranTable from "./AngsuranTable-d06621fa.mjs";
import BukuStorting from "./BukuStorting-8589976e.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-81236a1a.mjs";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "dayjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
import "./FormatNumbering-02c28a29.mjs";
import "react-number-format";
import "./Action-aed38437.mjs";
import "./dialog-1c7227a2.mjs";
import "@radix-ui/react-dialog";
import "./card-1314102b.mjs";
import "axios";
import "./StatusPinjaman-fa220d17.mjs";
import "./badge-3e44e85b.mjs";
import "./BayarAngsuran-475f9218.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-5b778c2b.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-e46e7af5.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-5da273f8.mjs";
import "./ApprovalAkhir-4a25017a.mjs";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Angsuran Lancar" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end flex-auto w-full", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("pinjaman.index_pinjaman"),
          localState: "pinjaman_index_pinjaman",
          searchMonth: true,
          searchHari: true,
          searchKelompok: props.select_kelompok,
          searchGroupingBranch: props.select_branch
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bukuangsuran", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukuangsuran", children: "Buku Angsuran" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukustorting", children: "Buku Storting" })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukuangsuran", children: /* @__PURE__ */ jsx(AngsuranTable, { dateOfWeek, datas }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukustorting", children: /* @__PURE__ */ jsx(
        BukuStorting,
        {
          dateOfWeek,
          datas,
          sirkulasi
        }
      ) })
    ] })
  ] });
};
export {
  Index as default
};
