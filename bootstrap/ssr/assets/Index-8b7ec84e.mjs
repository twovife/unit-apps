import { a as jsx, j as jsxs } from "../ssr.mjs";
import "@inertiajs/react";
import * as React from "react";
import "./button-9a023ace.mjs";
import "./input-a726a844.mjs";
import "./Loading-649771fa.mjs";
import "dayjs";
import { M as MobileLayout } from "./MobileLayout-3a3dffff.mjs";
import { B as Badge } from "./badge-5df87682.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-c2e72800.mjs";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { c as cn } from "./utils-efa289ef.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-c01c1748.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
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
  return /* @__PURE__ */ jsx(MobileLayout, { children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "prev", className: "w-full", children: [
    /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
      /* @__PURE__ */ jsx(TabsTrigger, { value: "prev", children: "Minggu Lalu" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "today", children: "Hari Ini" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "select", children: "Select" })
    ] }),
    /* @__PURE__ */ jsx(TabsContent, { value: "prev", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Pengajuan Minggu Lalu" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Pengajuan Tanggal : 22-Agustus-2024" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Tgl Drop" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Drop" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Pengajuan" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acc" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Jadi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: "AZIZ NUR IHSAN SUKOWATI" }),
          /* @__PURE__ */ jsx(TableCell, { children: "1.000" }),
          /* @__PURE__ */ jsx(TableCell, { children: "500" }),
          /* @__PURE__ */ jsx(TableCell, { children: "500" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { children: "500" }),
            /* @__PURE__ */ jsx(Badge, { variant: "green", children: "Acc" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: "500" })
        ] }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "today", children: "Change your password here." }),
    /* @__PURE__ */ jsx(TabsContent, { value: "select", children: "Change your password here." })
  ] }) });
};
export {
  Index as default
};
