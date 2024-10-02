import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import { useState, useEffect } from "react";
import "./Navbar-81236a1a.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-03f33995.mjs";
import "./Loading-306ada45.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { FilterIcon } from "lucide-react";
import Create from "./Create-9b48bea2.mjs";
import BukuTransaksiTable from "./BukuTransaksiTable-82318c82.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-f70be525.mjs";
import Rencana from "./Rencana-23073abb.mjs";
import "./FormatNumbering-02c28a29.mjs";
import "dayjs";
import "./dialog-1c7227a2.mjs";
import "./card-1314102b.mjs";
import "./label-143f493c.mjs";
import "react-currency-input-field";
import "./badge-3e44e85b.mjs";
import "clsx";
import "./input-7eb6bb1b.mjs";
import Approval from "./Approval-7c6c5669.mjs";
import { M as MobileLayout } from "./MobileLayout-2614584c.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "@radix-ui/react-icons";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "./utils-e5930d84.mjs";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./InputError-3b072368.mjs";
import "axios";
import "./RiwayatPengajuan-7a8d0fc1.mjs";
import "@tanstack/react-table";
import "./DetailRiwayat-dde788e1.mjs";
import "./Action-91f63003.mjs";
import "./Acc-3b6e6369.mjs";
import "./DropJadi-b01967ae.mjs";
import "./Gagal-ff4d95fe.mjs";
import "./DetailTableOnAction-ce80c62c.mjs";
import "./RemoveLoan-6e165887.mjs";
import "./ReStatus-205e02f3.mjs";
import "./SelectList-8beaa241.mjs";
import "./ChangeDetail-b4731033.mjs";
import "./BargeStatus-e891d920.mjs";
import "./BadgeStatus-c743b633.mjs";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "react-number-format";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "postcss";
const BukuTransaksi = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);
  const [onCreateShow, setOnCreateShow] = useState(false);
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
  useState(null);
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
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
          urlLink: route("mobile_apps.buku_transaksi_kepala"),
          localState: "mobile_apps_buku_transaksi_kepala",
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
            localState: "mobile_apps_buku_transaksi_kepala",
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
    ] }) })
  ] });
};
export {
  BukuTransaksi as default
};
