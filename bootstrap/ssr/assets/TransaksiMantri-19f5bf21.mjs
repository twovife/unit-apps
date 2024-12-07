import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent, P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-657fe213.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { Head } from "@inertiajs/react";
import { FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { M as MobileLayout } from "./MobileLayout-196226fb.mjs";
import BukuTransaksiKepala from "./BukuTransaksiKepala-b3b62e4f.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-dc7360ed.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-popover";
import "@radix-ui/react-slot";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-dialog";
import "./table-8d30c177.mjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./BargeStatus-bdf6dba2.mjs";
import "./badge-ad1cae46.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./Action-91feaadf.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-accordion";
import "./card-a7cc8935.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-55ae0fa1.mjs";
import "@tanstack/react-table";
import "./Acc-4c636e8f.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "react-currency-input-field";
import "./ActionTable-3a75c53b.mjs";
import "./RemoveLoan-5406e98a.mjs";
import "./ChangeDetail-5b25fb57.mjs";
const TransaksiMantri = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  const { server_filter } = usePage().props;
  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Buku Transaksi" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.buku_transaksi_kepala"),
          localState: "mobile_apps.buku_transaksi_kepala",
          searchMonth: true,
          searchHari: true,
          searchKelompok: server_filter.userAuthorized.canShowKelompok,
          searchBranch: server_filter.userAuthorized.canShowBranch,
          searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
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
            searchKelompok: server_filter.userAuthorized.canShowKelompok,
            searchBranch: server_filter.userAuthorized.canShowBranch,
            searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[80vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksiKepala, { datas: item }, index)) })
  ] });
};
export {
  TransaksiMantri as default
};
