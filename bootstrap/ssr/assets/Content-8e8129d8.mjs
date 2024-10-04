import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { useState, useEffect } from "react";
import TableRencana from "./TableRekap-789b1fc5.mjs";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import "./Navbar-86b9f43b.mjs";
import { usePage } from "@inertiajs/react";
import "./SweetAlert-03f33995.mjs";
import "./Loading-306ada45.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { FilterIcon } from "lucide-react";
import "./tabs-f70be525.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./FormatNumbering-02c28a29.mjs";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@tanstack/react-table";
import "dayjs";
import "./badge-3e44e85b.mjs";
import "class-variance-authority";
import "./BargeStatus-e891d920.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "@radix-ui/react-icons";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
const Content = ({ urlLink, localState, triggeredData }) => {
  const { auth } = usePage().props;
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
            searchGroupingBranch: auth.permissions.includes(
              "can show branch"
            )
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
