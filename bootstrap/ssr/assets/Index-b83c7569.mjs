import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-0cdecced.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-504e4605.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { Head } from "@inertiajs/react";
import { PlusCircle, FilterIcon } from "lucide-react";
import { useState } from "react";
import "./tabs-f70be525.mjs";
import TableRencana from "./TableRekap-99bcab5f.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-slot";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "./FormatNumbering-02c28a29.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./badge-3e44e85b.mjs";
import "./BargeStatus-66d07388.mjs";
const Index = ({ datas, auth, ...props }) => {
  const [onShowModal, setOnShowModal] = useState(false);
  useState();
  const handleOnCreateShowOpen = (e) => {
    setOnShowModal(true);
  };
  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Rekap Data Harian" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("kasir.rekap.rekap_index"),
          localState: "kasir_rekap_rekap_index",
          searchDate: true,
          searchGroupingBranch: auth.permissions.includes("can show branch"),
          nexOrPrevious,
          setNexOrPrevious,
          children: auth.permissions.includes("can create") && /* @__PURE__ */ jsxs(Button, { type: "button", onClick: handleOnCreateShowOpen, children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Tambah Pengajuan" })
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 lg:hidden", children: [
        /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
            /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
            "Filter"
          ] }) }),
          /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
            SearchComponent,
            {
              urlLink: route("transaction.index_buku_transaksi"),
              localState: "transaction_index_buku_transaksi",
              searchDate: true,
              searchKelompok: auth.permissions.includes("can show kelompok"),
              searchGroupingBranch: auth.permissions.includes(
                "can show branch"
              ),
              nexOrPrevious,
              setNexOrPrevious
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "button", onClick: handleOnCreateShowOpen, children: [
          /* @__PURE__ */ jsx(PlusCircle, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Tambah Pengajuan" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: datas.map((data) => /* @__PURE__ */ jsx(TableRencana, { datas: data })) })
  ] });
};
export {
  Index as default
};
