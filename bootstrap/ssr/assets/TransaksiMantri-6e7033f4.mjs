import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent, P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-8a2cee74.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { Head } from "@inertiajs/react";
import { FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import { M as MobileLayout } from "./MobileLayout-4a49d08a.mjs";
import BukuTransaksiKepala from "./BukuTransaksiKepala-a2573bca.mjs";
import Rencana from "./Rencana-d27a45fd.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-popover";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-dialog";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "./BargeStatus-bdf6dba2.mjs";
import "./badge-ad1cae46.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./Action-6e07bcc2.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-accordion";
import "./card-c2e72800.mjs";
import "axios";
import "./RiwayatPengajuan-98e78e45.mjs";
import "@tanstack/react-table";
import "./Acc-71b4a4a0.mjs";
import "react-currency-input-field";
import "./ActionTable-1ff78795.mjs";
import "./RemoveLoan-5406e98a.mjs";
import "./ChangeDetail-be321ede.mjs";
import "./Approval-2bd69e55.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "postcss";
const TransaksiMantri = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Buku Transaki" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.buku_transaksi_kepala"),
          localState: "mobile_apps.buku_transaksi_kepala",
          searchMonth: true,
          searchHari: true,
          searchKelompok: auth.permissions.includes("can show kelompok"),
          searchGroupingBranch: auth.permissions.includes("can show branch")
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-3 lg:hidden", children: /* @__PURE__ */ jsxs(Popover, { children: [
        /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
          /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
          "Filter"
        ] }) }),
        /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
          SearchComponent,
          {
            urlLink: route("mobile_apps.buku_transaksi_kepala"),
            localState: "mobile_apps.buku_transaksi_kepala",
            searchMonth: true,
            searchHari: true,
            searchKelompok: auth.permissions.includes("can show kelompok"),
            searchGroupingBranch: auth.permissions.includes(
              "can show branch"
            )
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[80vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bukutransaksi", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukutransaksi", children: "Buku Transaksi" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "dailyTarget", children: "Rencana Drop" })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukutransaksi", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksiKepala, { datas: item }, index)) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "dailyTarget", children: /* @__PURE__ */ jsx(Rencana, { datas: buku_rencana, dataTransaksi: datas }) })
    ] }) })
  ] });
};
export {
  TransaksiMantri as default
};
