import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-842695c7.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-290d4aa4.mjs";
import "./Loading-95bc2f77.mjs";
import { S as SearchComponent } from "./SearchComponent-f18de062.mjs";
import "./FormatNumbering-23811b25.mjs";
import "dayjs";
import { B as Button } from "./button-bf6cf732.mjs";
import "./dialog-e17b5153.mjs";
import "./card-c2e72800.mjs";
import "./badge-ad1cae46.mjs";
import "./label-cecd7064.mjs";
import "./input-a726a844.mjs";
import "react-currency-input-field";
import "./TextInput-11198f62.mjs";
import Angsuran from "./Angsuran-5d178a30.mjs";
import { M as MobileLayout } from "./MobileLayout-4a49d08a.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-84c978d2.mjs";
import { FilterIcon } from "lucide-react";
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
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "./Action-01d775a2.mjs";
import "axios";
import "./StatusPinjaman-b6a160c0.mjs";
import "./BayarAngsuran-61aaa747.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-6217c9b1.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-86487c4b.mjs";
import "./DeleteLoan-7dad4029.mjs";
import "@radix-ui/react-popover";
const SearchByDate = ({ datas, dateOfWeek, ...props }) => {
  const { auth } = props;
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Cari Angsuran" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Cari Angsuran By Date" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.macet"),
          localState: "mobile_apps_macet",
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
            urlLink: route("mobile_apps.macet"),
            localState: "mobile_apps_macet",
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
    /* @__PURE__ */ jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsx(Angsuran, { datas }) })
  ] });
};
export {
  SearchByDate as default
};
