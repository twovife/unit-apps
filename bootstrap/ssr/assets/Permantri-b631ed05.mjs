import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import { useState, useEffect } from "react";
import "./Navbar-86b9f43b.mjs";
import "@inertiajs/react";
import "./SweetAlert-03f33995.mjs";
import "./Loading-306ada45.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { FilterIcon } from "lucide-react";
import TableRekap from "./TableRekap-e13a7fa8.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-f70be525.mjs";
import TableRekapKasir from "./TableRekapKasir-c21719bd.mjs";
import TunaiMantri from "./TunaiMantri-421f8de0.mjs";
import Action from "./Action-139fa2bc.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "dayjs";
import "./label-143f493c.mjs";
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
import "./FormatNumbering-02c28a29.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./badge-3e44e85b.mjs";
import "./BargeStatus-e891d920.mjs";
import "@radix-ui/react-tabs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-c743b633.mjs";
import "./dialog-1c7227a2.mjs";
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
