import { a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-0c3f64d9.mjs";
import Content from "./Content-8e8129d8.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-86b9f43b.mjs";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-306ada45.mjs";
import "react-dom";
import "@headlessui/react";
import "./TableRekap-789b1fc5.mjs";
import "./FormatNumbering-02c28a29.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "dayjs";
import "./badge-3e44e85b.mjs";
import "./BargeStatus-e891d920.mjs";
import "./SearchComponent-ed16326c.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "./popover-4d729ade.mjs";
import "@radix-ui/react-popover";
import "./tabs-f70be525.mjs";
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
