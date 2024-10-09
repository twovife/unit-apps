import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-86b9f43b.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-03f33995.mjs";
import "./Loading-306ada45.mjs";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import "./FormatNumbering-02c28a29.mjs";
import "dayjs";
import { B as Button } from "./button-5b8f0147.mjs";
import "./dialog-1c7227a2.mjs";
import "./card-1314102b.mjs";
import "./badge-3e44e85b.mjs";
import "./label-143f493c.mjs";
import "./input-7eb6bb1b.mjs";
import "react-currency-input-field";
import "./TextInput-11198f62.mjs";
import Angsuran from "./Angsuran-fa73dcb3.mjs";
import { M as MobileLayout } from "./MobileLayout-ec4bcca4.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { FilterIcon } from "lucide-react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
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
import "./Action-51f7a042.mjs";
import "axios";
import "./StatusPinjaman-fa220d17.mjs";
import "./BayarAngsuran-f8f7c907.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-c91b6df3.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-92011ff6.mjs";
import "./DeleteLoan-27fe75b1.mjs";
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
