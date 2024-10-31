import { a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-f2148aae.mjs";
import Content from "./Content-3cc9bd6f.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-1bf9f9af.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./TableRekap-e1ccdb1e.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "dayjs";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "./popover-8a2cee74.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
const Index = ({ datas, ...props }) => {
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: /* @__PURE__ */ jsx(
    Content,
    {
      urlLink: route("kasir.rekap.rencana_drop"),
      localState: "kasir_rekap_rencana_drop",
      triggeredData: datas
    }
  ) });
};
export {
  Index as default
};
