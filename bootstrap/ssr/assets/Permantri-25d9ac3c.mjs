import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { S as SearchComponent, P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-657fe213.mjs";
import { useState, useEffect } from "react";
import "./Navbar-6bb941e8.mjs";
import { usePage } from "@inertiajs/react";
import "./SweetAlert-e5a75d04.mjs";
import "./Loading-95bc2f77.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { FilterIcon } from "lucide-react";
import TableRekap from "./TableRekap-a2f448dd.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import TableRekapKasir from "./TableRekapKasir-3dfd0907.mjs";
import TunaiMantri from "./TunaiMantri-2cf6af70.mjs";
import Action from "./Action-7a5331e3.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-dc7360ed.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-popover";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "./table-8d30c177.mjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./accordion-01051f31.mjs";
import "@radix-ui/react-accordion";
import "@radix-ui/react-tabs";
import "@tanstack/react-table";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "react-currency-input-field";
const Permantri = ({ rekapData, auth, urlLink, localState, title }) => {
  const [datas, setDatas] = useState([]);
  const { server_filter } = usePage().props;
  useEffect(() => {
    setDatas(rekapData);
  }, [rekapData]);
  const [onShowModal, setOnShowModal] = useState(false);
  const [triggeredData, setTriggeredData] = useState();
  const handleOnCreateShowClosed = (e) => {
    setOnShowModal(false);
    setTriggeredData();
  };
  useState(null);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Action,
      {
        show: onShowModal,
        onClosed: handleOnCreateShowClosed,
        triggeredData
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: title }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink,
          localState,
          searchMonth: true,
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
            urlLink,
            localState,
            searchMonth: true,
            searchKelompok: server_filter.userAuthorized.canShowKelompok,
            searchBranch: server_filter.userAuthorized.canShowBranch,
            searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "rekappimpinan", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "rekappimpinan", children: "Rekap Mantri" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "rekapkasir", children: "Rekap Kasir Mantri" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "tunaimantri", children: "Tunai Mantri" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "rekappimpinan", children: /* @__PURE__ */ jsx(
        TableRekap,
        {
          setOnShowModal,
          setTriggeredData,
          datas
        }
      ) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "rekapkasir", children: /* @__PURE__ */ jsx(TableRekapKasir, { datas }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "tunaimantri", children: /* @__PURE__ */ jsx(TunaiMantri, { datas }) })
    ] }) })
  ] });
};
export {
  Permantri as default
};
