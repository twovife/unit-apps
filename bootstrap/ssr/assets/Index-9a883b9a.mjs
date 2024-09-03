import { a as jsx, j as jsxs } from "../ssr.mjs";
import { B as Badge } from "./badge-95a0428f.mjs";
import * as React from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-1920aef2.mjs";
import { S as SearchComponent } from "./SearchComponent-6c9e9c4b.mjs";
import { M as MobileLayout } from "./MobileLayout-5253937f.mjs";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { c as cn } from "./utils-efa289ef.mjs";
import { B as Button } from "./button-9a023ace.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-c2e72800.mjs";
import { Drawer } from "vaul";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import "@inertiajs/react";
import dayjs from "dayjs";
import { FilterIcon } from "lucide-react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "class-variance-authority";
import "react-number-format";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
const BargeStatus = ({ value }) => {
  if (value === "open") {
    return /* @__PURE__ */ jsx(Badge, { variant: "blue", children: value });
  } else if (value === "acc") {
    return /* @__PURE__ */ jsx(Badge, { variant: "green", children: value });
  } else if (value === "success") {
    return /* @__PURE__ */ jsx(Badge, { variant: "green", children: value });
  } else if (value === "tolak") {
    return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: value });
  } else if (value === "gagal") {
    return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: value });
  } else {
    return /* @__PURE__ */ jsx(Badge, { variant: "default", children: value });
  }
};
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
Drawer.Trigger;
const DrawerPortal = Drawer.Portal;
Drawer.Close;
const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer.Overlay,
  {
    ref,
    className: cn("fixed inset-0 z-40 bg-black/80", className),
    ...props
  }
));
DrawerOverlay.displayName = Drawer.Overlay.displayName;
const DrawerContent = React.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DrawerPortal, { children: [
    /* @__PURE__ */ jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs(
      Drawer.Content,
      {
        ref,
        className: cn(
          "fixed inset-x-0 bottom-0 z-40 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }),
          children
        ]
      }
    )
  ] })
);
DrawerContent.displayName = "DrawerContent";
const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DrawerTitle.displayName = Drawer.Title.displayName;
const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DrawerDescription.displayName = Drawer.Description.displayName;
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
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
  const selectedDay = props.server_filter.date;
  dayjs(selectedDay).format("YYYY-MM-DD");
  dayjs(selectedDay).subtract(1, "week").format("YYYY-MM-DD");
  return /* @__PURE__ */ jsx(MobileLayout, { children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: 0, className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsx(TabsList, { className: "grid w-auto grid-cols-2", children: data.map((header, key) => /* @__PURE__ */ jsx(TabsTrigger, { value: key, children: dayjs(header.date).format("DD-MM-YYYY") }, key)) }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:inline-block", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.pengajuan.index_pengajuan"),
          searchDate: true,
          labelDate: "Pengajuan",
          searchGroupingBranch: select_branch,
          searchKelompok: select_kelompok
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "lg:hidden", children: /* @__PURE__ */ jsxs(Popover, { children: [
        /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
          /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
          "Filter"
        ] }) }),
        /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
          SearchComponent,
          {
            urlLink: route("mobile_apps.pengajuan.index_pengajuan"),
            searchDate: true,
            labelDate: "Pengajuan",
            searchGroupingBranch: select_branch,
            searchKelompok: select_kelompok
          }
        ) })
      ] }) })
    ] }),
    data.length ? data.map((item, key) => /* @__PURE__ */ jsx(TabsContent, { value: key, children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: item.date == selectedDay ? "Pengajuan Sekarang" : "Pengajuan Sebelumnya" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          /* @__PURE__ */ jsxs("div", { children: [
            "Pengajuan Tanggal :",
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-red-500", children: [
              " ",
              dayjs(item.date).format("dddd"),
              " ,"
            ] }),
            " ",
            dayjs(item.date).format("DD MMMM YYYY")
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "Kelompok ",
            props.server_filter.kelompok ?? null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-auto scrollbar-thin", children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pengajuan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acc" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Jadi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: item.data.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(TableCell, { children: [
            /* @__PURE__ */ jsxs("p", { className: "whitespace-nowrap", children: [
              row.nama,
              " "
            ] }),
            /* @__PURE__ */ jsx("p", { children: row.alamat })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(BargeStatus, { value: row.status }) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              className: "mb-0.5 text-center",
              value: row.drop
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              className: "mb-0.5 text-center",
              value: row.request
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              className: "mb-0.5 text-center",
              value: row.acc
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              className: "mb-0.5 text-center",
              value: row.drop_jadi
            }
          ) })
        ] })) })
      ] }) }) })
    ] }) })) : "Tidak Ada data dibulan ini"
  ] }) });
};
export {
  Index as default
};
