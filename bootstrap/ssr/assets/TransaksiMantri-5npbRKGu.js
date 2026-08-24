import { jsxs, jsx } from "react/jsx-runtime";
import { S as SearchComponent } from "./SearchComponent-uiqzPovZ.js";
import { F as FilterBar } from "./FilterBar-DxJSo2b4.js";
import { A as Authenticated } from "./AuthenticatedLayout-C3znwcHI.js";
import { B as Button } from "./button-MTjEwktD.js";
import { usePage, Head } from "@inertiajs/react";
import { FilterIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-B9xSK2Gy.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BAdW7Ajv.js";
import BukuTransaksi from "./BukuTransaksi-B7LdFPS8.js";
import BukuTransaksiKepala from "./BukuTransaksiKepala-DKvwYTd2.js";
import Create from "./Create-BU9WPEJw.js";
import Rencana from "./Rencana-YiCaEn-G.js";
import "./SelectComponent-DUhN-d41.js";
import "./input-BHD-__le.js";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "@radix-ui/react-icons";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "./dialog-8a8NNlps.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "./table-Dwx5kZ1B.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-BRGYrfG0.js";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "./card-WipCscFv.js";
import "axios";
import "./RiwayatPengajuan-BgwqMR0N.js";
import "./BadgeStatus-Cj6LHx_M.js";
import "./badge-CBTu05xj.js";
import "./Acc-D3ukg6cl.js";
import "./AppBadge-CfINLLYj.js";
import "./Tundaan-DTErNWMQ.js";
import "react-currency-input-field";
import "./ActionTable-C05_T-Rr.js";
import "./StatusPengajuan-BBMso_U9.js";
import "./RemoveLoan-BCXe6fgS.js";
import "./ChangeDetail-ChsDycND.js";
import "./BargeStatus-KjUuqjtj.js";
import "./NewNasabah-yQyYQS-j.js";
import "./InputError-cRVTeK4i.js";
import "./Checkbox-DLnjqb3e.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "./Approval-D9gJ0K-F.js";
import "./InputLabel-BhdXf1ED.js";
import "postcss";
const TransaksiMantri = ({ datas, buku_rencana }) => {
  const { server_filter } = usePage().props;
  const [onCreateShow, setOnCreateShow] = useState(false);
  const handleOnCreateShowOpen = () => setOnCreateShow(true);
  const handleOnCreateShowClosed = () => setOnCreateShow(false);
  const canFilterUnit = server_filter.userAuthorized.canShowBranch || server_filter.userAuthorized.canShowGroupingBranch;
  const unitExtraParams = {};
  if (server_filter.branch_id) unitExtraParams.branch_id = server_filter.branch_id;
  if (server_filter.wilayah) unitExtraParams.wilayah = server_filter.wilayah;
  const searchComponentKey = `${server_filter.hari}-${server_filter.month}-${server_filter.kelompok}`;
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Buku Transaksi" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
        canFilterUnit && /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
            /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Unit" })
          ] }) }),
          /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
            SearchComponent,
            {
              urlLink: route("transaction.index_buku_transaksi"),
              localState: "transaction_index_buku_transaksi",
              searchBranch: server_filter.userAuthorized.canShowBranch,
              searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
            },
            searchComponentKey
          ) })
        ] }),
        server_filter.userAuthorized.canCreate && /* @__PURE__ */ jsxs(Button, { type: "button", onClick: handleOnCreateShowOpen, children: [
          /* @__PURE__ */ jsx(PlusCircle, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Tambah Pengajuan" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
      FilterBar,
      {
        urlLink: route("transaction.index_buku_transaksi"),
        storageKey: "transaction.index_buku_transaksi",
        showHari: true,
        showMonth: true,
        showKelompok: server_filter.userAuthorized.canShowKelompok,
        extraParams: unitExtraParams
      }
    ) }),
    /* @__PURE__ */ jsx(Create, { show: onCreateShow, onClosed: handleOnCreateShowClosed }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bukutransaksi", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukutransaksi", children: "Buku Transaksi" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "dailyTarget", children: "Rencana Drop" })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "bukutransaksi", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden max-h-[70vh] lg:block border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksi, { datas: item }, index)) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 lg:hidden", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksiKepala, { datas: item }, index)) })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "dailyTarget", children: /* @__PURE__ */ jsx(Rencana, { datas: buku_rencana, dataTransaksi: datas }) })
    ] })
  ] });
};
export {
  TransaksiMantri as default
};
