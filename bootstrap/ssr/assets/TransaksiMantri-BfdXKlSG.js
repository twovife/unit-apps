import { jsxs, jsx } from "react/jsx-runtime";
import { S as SearchComponent } from "./SearchComponent-Eb6Mvc9B.js";
import { A as Authenticated } from "./AuthenticatedLayout-DZz9QSGc.js";
import { B as Button } from "./button-StO46bLt.js";
import { usePage, Head } from "@inertiajs/react";
import { PlusCircle, FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-QnCQXRdU.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DpwcYzou.js";
import BukuTransaksi from "./BukuTransaksi-k6YJzkAX.js";
import Create from "./Create-CXX8akyK.js";
import Rencana from "./Rencana-C31xzvQj.js";
import "./SelectComponent-DUhN-d41.js";
import "./input-BH-oxdzi.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./command-BgotNnHx.js";
import "@radix-ui/react-slot";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "./dialog-DqsN44pN.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "./table-DgsbovDN.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-C2J8cASZ.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./card-DK9akThy.js";
import "axios";
import "./RiwayatPengajuan-C1LEAz5f.js";
import "./BadgeStatus-BDnUSm56.js";
import "./badge-BDQK5pqs.js";
import "./Acc-Da2yqG-0.js";
import "./statusVariants-kLBpdvOH.js";
import "react-currency-input-field";
import "./ActionTable-DgcU1sbJ.js";
import "./StatusPengajuan-BBMso_U9.js";
import "./RemoveLoan-EwLhVElw.js";
import "./ChangeDetail-CbB0pkrV.js";
import "./BargeStatus-B_JPokIk.js";
import "./NewNasabah-C18zRyWG.js";
import "./InputError-cRVTeK4i.js";
import "./Checkbox-DLnjqb3e.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "./Approval-DhEJMphL.js";
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
