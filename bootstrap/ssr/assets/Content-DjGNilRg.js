import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import TableRencana from "./TableRekap-DwuJoj6R.js";
import { S as SearchComponent } from "./SearchComponent-uiqzPovZ.js";
import { usePage } from "@inertiajs/react";
import "./command-int9mZp7.js";
import { FilterIcon } from "lucide-react";
import "clsx";
import "dayjs";
import { B as Button } from "./button-MTjEwktD.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-B9xSK2Gy.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "./tabs-BAdW7Ajv.js";
import "./table-Dwx5kZ1B.js";
import "./utils-DzFuPzol.js";
import "tailwind-merge";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./badge-CBTu05xj.js";
import "class-variance-authority";
import "./BargeStatus-KjUuqjtj.js";
import "./SelectComponent-DUhN-d41.js";
import "./input-BHD-__le.js";
import "@radix-ui/react-icons";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "@radix-ui/react-slot";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "./dialog-8a8NNlps.js";
import "@radix-ui/react-popover";
import "@headlessui/react";
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
