import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-0cdecced.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-504e4605.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { Head } from "@inertiajs/react";
import { PlusCircle, FilterIcon, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useState, useEffect } from "react";
import Create from "./Create-256c8915.mjs";
import BukuTransaksiTable from "./BukuTransaksiTable-a6e5b750.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-f70be525.mjs";
import Rencana from "./Rencana-2414ab64.mjs";
import "./FormatNumbering-02c28a29.mjs";
import "dayjs";
import "./dialog-1c7227a2.mjs";
import "./card-1314102b.mjs";
import "./Loading-7f1a61e6.mjs";
import "./label-143f493c.mjs";
import "react-currency-input-field";
import "./badge-3e44e85b.mjs";
import "clsx";
import "./input-7eb6bb1b.mjs";
import Approval from "./Approval-00052970.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "@radix-ui/react-icons";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "./utils-e5930d84.mjs";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./InputError-3b072368.mjs";
import "axios";
import "./RiwayatPengajuan-7a8d0fc1.mjs";
import "@tanstack/react-table";
import "./DetailRiwayat-b43ccc9d.mjs";
import "./Action-8a8a3ead.mjs";
import "./Acc-ff1cd03b.mjs";
import "./Tolak-4a7c0e59.mjs";
import "./DropJadi-a79f5698.mjs";
import "./Gagal-434b7d12.mjs";
import "./DetailTableOnAction-00a2809e.mjs";
import "./RemoveLoan-622848d6.mjs";
import "./ReStatus-01ffcaad.mjs";
import "./SelectList-8beaa241.mjs";
import "./ChangeDetail-b6e55d98.mjs";
import "./BargeStatus-66d07388.mjs";
import "./BadgeStatus-4fb5d883.mjs";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "react-number-format";
import "@radix-ui/react-dialog";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-label";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
const BukuTransaksi = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);
  const [onCreateShow, setOnCreateShow] = useState(false);
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
  };
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
  };
  const [onApprovalShow, setOnApprovalShow] = useState(false);
  const [triggeredDate, setTriggeredDate] = useState(false);
  const handleOnApprovalShowOpen = (e) => {
    setOnApprovalShow(true);
  };
  const handleOnApprovalShowClosed = (e) => {
    setOnApprovalShow(false);
  };
  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  const onNexOrPreviousTogler = (params) => {
    setNexOrPrevious(params);
  };
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsx(
      Approval,
      {
        show: onApprovalShow,
        onClosed: handleOnApprovalShowClosed,
        triggeredData: flatData,
        triggeredDate
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Buku Transaksi" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("transaction.index_buku_transaksi"),
          localState: "transaction_index_buku_transaksi",
          searchMonth: true,
          searchHari: true,
          searchKelompok: auth.permissions.includes("can show kelompok"),
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
              searchMonth: true,
              searchHari: true,
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
    /* @__PURE__ */ jsx(Create, { show: onCreateShow, onClosed: handleOnCreateShowClosed }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bukutransaksi", className: "w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "bukutransaksi", children: "Buku Transaksi" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "dailyTarget", children: "Rencana Drop" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleOnApprovalShowOpen,
            size: "sm",
            className: "mr-3",
            children: "Cek Transaksi"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukutransaksi", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksiTable, { datas: item }, index)) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "dailyTarget", children: /* @__PURE__ */ jsx(Rencana, { datas: buku_rencana, dataTransaksi: datas }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full mt-3", children: [
      /* @__PURE__ */ jsx(Button, { onClick: () => onNexOrPreviousTogler("previous"), size: "icon", children: /* @__PURE__ */ jsx(ArrowBigLeft, {}) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => onNexOrPreviousTogler("next"), size: "icon", children: /* @__PURE__ */ jsx(ArrowBigRight, {}) })
    ] })
  ] });
};
export {
  BukuTransaksi as default
};
