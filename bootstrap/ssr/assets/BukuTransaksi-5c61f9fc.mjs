import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-6c9e9c4b.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-f6fc55f2.mjs";
import { B as Button } from "./button-9a023ace.mjs";
import { Head } from "@inertiajs/react";
import { PlusCircle, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useState } from "react";
import Create from "./Create-cc775e73.mjs";
import BukuTransaksiTable from "./BukuTransaksiTable-46419d9d.mjs";
import "./dialog-e17b5153.mjs";
import "./card-c2e72800.mjs";
import "./tabs-c148af71.mjs";
import "./table-c01c1748.mjs";
import "dayjs";
import "./badge-5df87682.mjs";
import "./Loading-649771fa.mjs";
import "./label-cecd7064.mjs";
import "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./InputError-3b072368.mjs";
import "axios";
import "./RiwayatPengajuan-a0ae3b4b.mjs";
import "@tanstack/react-table";
import "./DetailRiwayat-2c83f6c9.mjs";
import "./FormatNumbering-6fa459f0.mjs";
import "react-number-format";
import "./Action-5f23b1bd.mjs";
import "./Acc-ed0ce8f3.mjs";
import "./Tolak-57ea4219.mjs";
import "./DropJadi-7429db17.mjs";
import "./Gagal-2f4e643d.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tabs";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-label";
const BukuTransaksi = ({ datas, ...props }) => {
  const [onCreateShow, setOnCreateShow] = useState(false);
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
  };
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
  };
  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  const onNexOrPreviousTogler = (params) => {
    setNexOrPrevious(params);
  };
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Buku Transaksi" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end flex-auto w-full", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("transaction.index_buku_transaksi"),
          localState: "transaction_index_buku_transaksi",
          searchDate: true,
          searchKelompok: props.select_kelompok,
          searchGroupingBranch: props.select_branch,
          nexOrPrevious,
          setNexOrPrevious,
          children: /* @__PURE__ */ jsxs(Button, { type: "button", onClick: handleOnCreateShowOpen, children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Tambah Pengajuan" })
          ] })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(Create, { show: onCreateShow, onClosed: handleOnCreateShowClosed }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(BukuTransaksiTable, { datas }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full mt-3", children: [
      /* @__PURE__ */ jsx(Button, { onClick: () => onNexOrPreviousTogler("previous"), size: "icon", children: /* @__PURE__ */ jsx(ArrowBigLeft, {}) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => onNexOrPreviousTogler("next"), size: "icon", children: /* @__PURE__ */ jsx(ArrowBigRight, {}) })
    ] })
  ] });
};
export {
  BukuTransaksi as default
};
