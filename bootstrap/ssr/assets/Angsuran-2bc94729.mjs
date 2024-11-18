import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, S as SearchComponent } from "./popover-ecaf9d0d.mjs";
import { usePage } from "@inertiajs/react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import AngsuranTable from "./AngsuranTable-ebb0956a.mjs";
import BukuStorting from "./BukuStorting-c99a362d.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { FilterIcon } from "lucide-react";
import AngsuranTableMobile from "./AngsuranTableMobile-2e6b954f.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "./FormatNumbering-9786ffbe.mjs";
import "react-number-format";
import "./Action-9de168ed.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "./card-a7cc8935.mjs";
import "axios";
import "./badge-ad1cae46.mjs";
import "./BayarAngsuran-55c0636e.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-ee724a10.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-bde03131.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-128b8268.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "./ApprovalAkhir-001a805c.mjs";
import "@radix-ui/react-slot";
import "./BargeStatus-bdf6dba2.mjs";
const Angsuran = ({
  datas,
  dateOfWeek,
  sirkulasi,
  urlLink,
  localState,
  type = "desktop"
}) => {
  const { auth } = usePage().props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between flex-none shrink-0 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Angsuran Lancar" }),
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
              searchHari: true,
              searchKelompok: auth.permissions.includes(
                "can show kelompok"
              ),
              searchGroupingBranch: auth.permissions.includes(
                "can show branch"
              )
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink,
          localState,
          searchMonth: true,
          searchHari: true,
          searchKelompok: auth.permissions.includes("can show kelompok"),
          searchGroupingBranch: auth.permissions.includes("can show branch")
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bukuangsuran", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukuangsuran", children: "Buku Angsuran" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukustorting", children: "Buku Storting" })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "bukuangsuran", children: [
        type === "mobile" && /* @__PURE__ */ jsx(AngsuranTableMobile, { dateOfWeek, datas }),
        type === "desktop" && /* @__PURE__ */ jsx(AngsuranTable, { dateOfWeek, datas })
      ] }),
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
  Angsuran as default
};