import { a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-6bb941e8.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-e5a75d04.mjs";
import "./Loading-95bc2f77.mjs";
import { M as MobileLayout } from "./MobileLayout-196226fb.mjs";
import Content from "./Content-8c75ca85.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-dialog";
import "./TableRekap-a53ace15.mjs";
import "./table-8d30c177.mjs";
import "@tanstack/react-table";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "dayjs";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "./popover-657fe213.mjs";
import "./SelectComponent-dc7360ed.mjs";
import "./input-a726a844.mjs";
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
