import { a as jsx, j as jsxs } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-3dac7189.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-0ef3a5a8.mjs";
import { B as Button } from "./button-6facd6da.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-84c978d2.mjs";
import { Head } from "@inertiajs/react";
import { PlusCircle, FilterIcon } from "lucide-react";
import { useState } from "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-slot";
import "@radix-ui/react-popover";
const Index = ({ datas, auth, ...props }) => {
  const [onCreateShow, setOnCreateShow] = useState(false);
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
  };
  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Rekap Mantri" }) }),
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
  ] }) });
};
export {
  Index as default
};
