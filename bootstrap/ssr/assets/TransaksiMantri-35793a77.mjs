import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent, P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-590ea694.mjs";
import { B as Button } from "./button-e7ccf50f.mjs";
import { usePage } from "@inertiajs/react";
import { FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import "./DropdownProfile-f572cff8.mjs";
import "./separator-6fdc070c.mjs";
import BukuTransaksiKepala from "./BukuTransaksiKepala-30c5af50.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-1b2491b5.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-dc7360ed.mjs";
import "./input-22e7db4a.mjs";
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
import "./use-mobile-f8f7682a.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-separator";
import "./card-f356ad44.mjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./BargeStatus-070c40e0.mjs";
import "./badge-ad1cae46.mjs";
import "./BadgeStatus-1947fb26.mjs";
import "./Action-5ba4ddf7.mjs";
import "./dialog-97d8ecd0.mjs";
import "./accordion-01051f31.mjs";
import "@radix-ui/react-accordion";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-aa3b808c.mjs";
import "./table-8d30c177.mjs";
import "@tanstack/react-table";
import "./ModalShowAngsuran-60a89e11.mjs";
import "./Acc-711e7371.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "react-currency-input-field";
import "./ActionTable-f8c8e469.mjs";
import "sonner";
import "next-themes";
import "./RemoveLoan-10a666cf.mjs";
import "./ChangeDetail-387ac0d8.mjs";
import "@radix-ui/react-scroll-area";
import "./SweetAlert-565cd2f8.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "./AppSidebar-66e8729f.mjs";
const TransaksiMantri = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  const { server_filter } = usePage().props;
  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);
  return /* @__PURE__ */ jsxs(Authenticated, { title: "Daftar Drop", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "DROP" }) }),
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
    /* @__PURE__ */ jsx("div", { className: "overflow-auto rounded-lg max-h-svh lg:scrollbar-thin", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksiKepala, { datas: item }, index)) })
  ] });
};
export {
  TransaksiMantri as default
};
