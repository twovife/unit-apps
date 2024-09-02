import { a as jsx, j as jsxs } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-6c9e9c4b.mjs";
import { M as MobileLayout } from "./MobileLayout-5253937f.mjs";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { c as cn } from "./utils-efa289ef.mjs";
import { B as Badge } from "./badge-5df87682.mjs";
import "./button-9a023ace.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-c2e72800.mjs";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-c01c1748.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import "@inertiajs/react";
import dayjs from "dayjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(
        ChevronDownIcon,
        {
          className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
        }
      )
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
  SeparatorPrimitive.Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = SeparatorPrimitive.Root.displayName;
const Index = ({ data, select_kelompok, select_branch, ...props }) => {
  console.log(data);
  const dateprev = dayjs().subtract(1, "week").format("YYYY-MM-DD");
  console.log(dateprev);
  return /* @__PURE__ */ jsx(MobileLayout, { children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "prev", className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse items-end gap-3 lg:flex-row", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "prev", children: "Minggu Lalu" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "today", children: "Hari Ini" })
      ] }),
      /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.pengajuan.index_pengajuan"),
          searchDate: true,
          labelDate: "Pengajuan",
          searchGroupingBranch: select_branch,
          searchKelompok: select_kelompok
        }
      )
    ] }),
    /* @__PURE__ */ jsx(TabsContent, { value: "prev", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Pengajuan Minggu Lalu" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "Pengajuan Tanggal :",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-red-500", children: [
            " ",
            dayjs().subtract(1, "week").format("dddd"),
            " ,"
          ] }),
          " ",
          dayjs().subtract(1, "week").format("DD MMMM YYYY")
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-auto scrollbar-thin", children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pengajuan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acc" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Jadi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: data.filter((item) => item.date == dateprev).map(
          (rows) => rows.data.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              /* @__PURE__ */ jsxs("p", { children: [
                item.nama,
                " "
              ] }),
              /* @__PURE__ */ jsx("p", { children: item.alamat })
            ] }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { children: item.drop }),
              /* @__PURE__ */ jsx(Badge, { variant: "green", children: "22/3" })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { children: "1.000.000" }),
              /* @__PURE__ */ jsx("div", { className: "px-2.5 py-0.5", children: " " })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { children: "1.000.000" }),
              /* @__PURE__ */ jsx(Badge, { variant: "green", children: "Acc" })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { children: "1.000.000" }),
              /* @__PURE__ */ jsx(Badge, { variant: "green", children: "Acc" })
            ] }) })
          ] }))
        ) })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "today", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Pengajuan Minggu Lalu" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "Pengajuan Tanggal :",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-red-500", children: [
            " ",
            dayjs().format("dddd"),
            " ,"
          ] }),
          " ",
          dayjs().format("DD MMMM YYYY")
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-auto scrollbar-thin", children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pengajuan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acc" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Jadi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(TableCell, { children: [
            /* @__PURE__ */ jsx("p", { children: "AZIZ NUR IHSAN SUKOWATI " }),
            /* @__PURE__ */ jsx("p", { children: "AZIZ NUR IHSAN SUKOWATI" })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { children: "1.000.000" }),
            /* @__PURE__ */ jsx(Badge, { variant: "green", children: "22/3" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { children: "1.000.000" }),
            /* @__PURE__ */ jsx("div", { className: "px-2.5 py-0.5", children: " " })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { children: "1.000.000" }),
            /* @__PURE__ */ jsx(Badge, { variant: "green", children: "Acc" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { children: "1.000.000" }),
            /* @__PURE__ */ jsx(Badge, { variant: "green", children: "Acc" })
          ] }) })
        ] }) })
      ] }) }) })
    ] }) })
  ] }) });
};
export {
  Index as default
};
