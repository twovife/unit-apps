import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import { Head } from "@inertiajs/react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-f70be525.mjs";
import AngsuranTable from "./AngsuranTable-51a50646.mjs";
import BukuStorting from "./BukuStorting-6949f117.mjs";
import { M as MobileLayout } from "./MobileLayout-ec4bcca4.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { FilterIcon } from "lucide-react";
import { B as Button } from "./button-5b8f0147.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-306ada45.mjs";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-tabs";
import "./FormatNumbering-02c28a29.mjs";
import "react-number-format";
import "./Action-e53ad35e.mjs";
import "./dialog-1c7227a2.mjs";
import "@radix-ui/react-dialog";
import "./card-1314102b.mjs";
import "axios";
import "./StatusPinjaman-fa220d17.mjs";
import "./badge-3e44e85b.mjs";
import "./BayarAngsuran-f8f7c907.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "@radix-ui/react-slot";
import "./JenisNasabah-5b778c2b.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-81d092c7.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-27fe75b1.mjs";
import "./ApprovalAkhir-ea30cb98.mjs";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-popover";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  const { auth } = props;
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Angsuran Lancar" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.angsuran"),
          localState: "mobile_apps_angsuran",
          searchHari: true,
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
            urlLink: route("mobile_apps.angsuran"),
            localState: "mobile_apps_angsuran",
            searchMonth: true,
            searchHari: true,
            searchKelompok: auth.permissions.includes("can show kelompok"),
            searchGroupingBranch: auth.permissions.includes(
              "can show branch"
            )
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bukuangsuran", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukuangsuran", children: "Buku Angsuran" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukustorting", children: "Buku Storting" })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukuangsuran", children: /* @__PURE__ */ jsx(AngsuranTable, { dateOfWeek, datas }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukustorting", children: /* @__PURE__ */ jsx(
        BukuStorting,
        {
          dateOfWeek,
          datas,
          sirkulasi
        }
      ) })
    ] })
  ] });
};
export {
  Index as default
};
