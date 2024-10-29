import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-f18de062.mjs";
import { useState, useEffect } from "react";
import "./Navbar-842695c7.mjs";
import "@inertiajs/react";
import "./SweetAlert-290d4aa4.mjs";
import "./Loading-95bc2f77.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-84c978d2.mjs";
import { FilterIcon } from "lucide-react";
import TableRekap from "./TableRekap-f07d707d.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import TableRekapKasir from "./TableRekapKasir-c49b6915.mjs";
import TunaiMantri from "./TunaiMantri-e7610184.mjs";
import Action from "./Action-1429d5fc.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "dayjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "@radix-ui/react-popover";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "@radix-ui/react-tabs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "react-currency-input-field";
const Permantri = ({ rekapData, auth, urlLink, localState, title }) => {
  const [datas, setDatas] = useState([]);
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
            urlLink,
            localState,
            searchMonth: true,
            searchKelompok: auth.permissions.includes("can show kelompok"),
            searchGroupingBranch: auth.permissions.includes(
              "can show branch"
            )
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
