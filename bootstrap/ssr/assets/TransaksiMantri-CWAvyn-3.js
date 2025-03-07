import { jsxs, jsx } from "react/jsx-runtime";
import { S as SearchComponent, P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-CUWb37oo.js";
import { A as Authenticated } from "./AuthenticatedLayout-B3QirsBc.js";
import { B as Button } from "./button-Dbmjz33H.js";
import { usePage, Head } from "@inertiajs/react";
import { PlusCircle, FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-fMRf3trd.js";
import BukuTransaksi from "./BukuTransaksi-XkIX0li2.js";
import Create from "./Create-ZgDUA1if.js";
import Rencana from "./Rencana-lPL3k9Vs.js";
import "./SelectComponent-mFLhKw8T.js";
import "./input-Dqw8mvVY.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-popover";
import "./Dropdown-tAzvTn5J.js";
import "react-icons/bi";
import "hamburger-react";
import "./dropdown-menu-DA8FJBQ2.js";
import "@radix-ui/react-dropdown-menu";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "./table-CE18WwxH.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-D_wyjaxB.js";
import "./dialog-Bw81dxwx.js";
import "@radix-ui/react-dialog";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./card-B9cxsokM.js";
import "axios";
import "./RiwayatPengajuan-DH1Rqly1.js";
import "./BadgeStatus-ulu71_5S.js";
import "./badge-3Dzo-CJq.js";
import "./Acc-BIiPUmgN.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "react-currency-input-field";
import "./ActionTable-CZ57df38.js";
import "./RemoveLoan-BZw7GKks.js";
import "./ChangeDetail-CRIy4pMs.js";
import "./BargeStatus-wWq6wWJ0.js";
import "./NewNasabah-CYzqO7bD.js";
import "./InputError-cRVTeK4i.js";
import "./Checkbox-B46RnHis.js";
import "./Approval-BmHfl7L1.js";
import "./InputLabel-BhdXf1ED.js";
import "postcss";
const TransaksiMantri = ({ datas, buku_rencana, auth, ...props }) => {
  const { server_filter } = usePage().props;
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
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Buku Transaksi" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("transaction.index_buku_transaksi"),
          localState: "transaction_index_buku_transaksi",
          searchMonth: true,
          searchHari: true,
          searchKelompok: server_filter.userAuthorized.canShowKelompok,
          searchBranch: server_filter.userAuthorized.canShowBranch,
          searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch,
          children: server_filter.userAuthorized.canCreate && /* @__PURE__ */ jsxs(Button, { type: "button", onClick: handleOnCreateShowOpen, children: [
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
              searchKelompok: server_filter.userAuthorized.canShowKelompok,
              searchBranch: server_filter.userAuthorized.canShowBranch,
              searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
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
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukutransaksi", children: "Buku Transaksi" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "dailyTarget", children: "Rencana Drop" })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukutransaksi", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksi, { datas: item }, index)) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "dailyTarget", children: /* @__PURE__ */ jsx(Rencana, { datas: buku_rencana, dataTransaksi: datas }) })
    ] }) })
  ] });
};
export {
  TransaksiMantri as default
};
