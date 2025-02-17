import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { useState, useEffect } from "react";
import TableRencana from "./TableRekap-a53ace15.mjs";
import { S as SearchComponent, P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-657fe213.mjs";
import "./Navbar-6bb941e8.mjs";
import { usePage } from "@inertiajs/react";
import "./SweetAlert-e5a75d04.mjs";
import "./Loading-95bc2f77.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { FilterIcon } from "lucide-react";
import "./tabs-c148af71.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./table-8d30c177.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "dayjs";
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "./BargeStatus-bdf6dba2.mjs";
import "./SelectComponent-dc7360ed.mjs";
import "./input-a726a844.mjs";
import "@radix-ui/react-icons";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
const Content = ({ urlLink, localState, triggeredData }) => {
  const { auth, server_filter } = usePage().props;
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    setDatas(triggeredData);
  }, [triggeredData]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Rekap Data Harian" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink,
          localState,
          searchMonth: true,
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
            searchBranch: server_filter.userAuthorized.canShowBranch,
            searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: datas.map((data, i) => /* @__PURE__ */ jsx(TableRencana, { datas: data }, i)) })
  ] });
};
export {
  Content as default
};
