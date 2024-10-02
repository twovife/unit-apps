import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-81236a1a.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-03f33995.mjs";
import "./Loading-306ada45.mjs";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import "./tabs-f70be525.mjs";
import AngsuranTable from "./AngsuranTable-f987b3f0.mjs";
import "./FormatNumbering-02c28a29.mjs";
import "dayjs";
import { M as MobileLayout } from "./MobileLayout-2614584c.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { FilterIcon } from "lucide-react";
import { B as Button } from "./button-5b8f0147.mjs";
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
import "./input-7eb6bb1b.mjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-tabs";
import "./badge-3e44e85b.mjs";
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
