import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-842695c7.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-290d4aa4.mjs";
import "./Loading-95bc2f77.mjs";
import { S as SearchComponent } from "./SearchComponent-f18de062.mjs";
import "./tabs-c148af71.mjs";
import AngsuranTable from "./AngsuranTable-13bb22bb.mjs";
import "./FormatNumbering-23811b25.mjs";
import "dayjs";
import { M as MobileLayout } from "./MobileLayout-4a49d08a.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-84c978d2.mjs";
import { FilterIcon } from "lucide-react";
import { B as Button } from "./button-bf6cf732.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-tabs";
import "./badge-ad1cae46.mjs";
import "react-number-format";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "@radix-ui/react-popover";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  const { auth } = props;
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Buku Transaksi" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.buku_angsuran"),
          localState: "mobile_apps_buku_angsuran",
          searchMonth: true,
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
            urlLink: route("mobile_apps.buku_angsuran"),
            localState: "mobile_apps_buku_angsuran",
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
    /* @__PURE__ */ jsx(AngsuranTable, { dateOfWeek, datas })
  ] });
};
export {
  Index as default
};
