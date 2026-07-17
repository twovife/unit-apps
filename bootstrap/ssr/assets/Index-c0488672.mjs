import { a as jsx } from "../ssr.mjs";
import "./SweetAlert-565cd2f8.mjs";
import "./Loading-95bc2f77.mjs";
import "react";
import { Head } from "@inertiajs/react";
import "./DropdownProfile-f572cff8.mjs";
import "./button-e7ccf50f.mjs";
import "./separator-6fdc070c.mjs";
import { M as MobileLayout } from "./MobileLayout-a011c42b.mjs";
import Content from "./Content-9aaae314.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./use-mobile-f8f7682a.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./input-22e7db4a.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "lucide-react";
import "@radix-ui/react-separator";
import "./AppSidebar-66e8729f.mjs";
import "./TableRekap-a62714e3.mjs";
import "./table-8d30c177.mjs";
import "@tanstack/react-table";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "dayjs";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-070c40e0.mjs";
import "./popover-590ea694.mjs";
import "./SelectComponent-dc7360ed.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
const Index = ({ datas, ...props }) => {
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: /* @__PURE__ */ jsx(
    Content,
    {
      urlLink: route("mobile_apps.rencana_drop_kepala"),
      localState: "mobile_apps_rencana_drop_kepala",
      triggeredData: datas
    }
  ) });
};
export {
  Index as default
};
