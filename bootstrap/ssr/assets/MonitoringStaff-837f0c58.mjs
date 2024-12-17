import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-073f82d1.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-01051f31.mjs";
import { useState, useEffect } from "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./Navbar-7b9474d1.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-accordion";
const MonitoringStaff = ({ datas, ...props }) => {
  const [data, setData] = useState();
  useEffect(() => {
    setData(datas);
  }, [datas]);
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx("div", { children: "List Input" }),
    /* @__PURE__ */ jsx("div", { className: "w-full overflow-auto h-[80vh]", children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, children: data && data.map((item, key) => /* @__PURE__ */ jsxs(AccordionItem, { value: item.branch, children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { children: item.branch }),
      /* @__PURE__ */ jsx(AccordionContent, { className: "px-6", children: item.days && item.days.map((warehouse, _key) => /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, children: /* @__PURE__ */ jsxs(
        AccordionItem,
        {
          value: item.branch + warehouse.day,
          children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-blue-500", children: warehouse.day }),
            /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableHead, { children: "Kelompok" }) }) }),
              /* @__PURE__ */ jsx(TableBody, { children: warehouse.data && warehouse.data.map((hayshack, __key) => /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: hayshack.kelompok }) }),
                /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Table, { children: [
                  /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                    /* @__PURE__ */ jsx(TableHead, { children: "Bulan" }),
                    /* @__PURE__ */ jsx(TableHead, { children: "Count" })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableBody, { children: hayshack.data && hayshack.data.map(
                    (nidle, key2) => /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                      /* @__PURE__ */ jsx(TableCell, { children: nidle.month }),
                      /* @__PURE__ */ jsx(TableCell, { children: nidle.count })
                    ] }) })
                  ) })
                ] }) }) })
              ] })) })
            ] }) })
          ]
        },
        _key
      ) })) })
    ] }, key)) }) })
  ] });
};
export {
  MonitoringStaff as default
};
