import { a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-86b9f43b.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-03f33995.mjs";
import "./Loading-306ada45.mjs";
import { M as MobileLayout } from "./MobileLayout-ec4bcca4.mjs";
import RekapContent from "./RekapContent-97bde1d2.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
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
import "./SearchComponent-ed16326c.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "dayjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "./popover-4d729ade.mjs";
import "@radix-ui/react-popover";
import "./TableRekap-e13a7fa8.mjs";
import "./FormatNumbering-02c28a29.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./badge-3e44e85b.mjs";
import "./BargeStatus-e891d920.mjs";
import "./tabs-f70be525.mjs";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-c21719bd.mjs";
import "./TunaiMantri-421f8de0.mjs";
import "./Action-a96c0e93.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-c743b633.mjs";
import "./dialog-1c7227a2.mjs";
import "react-currency-input-field";
const RekapDua = ({ datas, auth, ...props }) => {
  const title = auth.permissions.includes("unit pimpinan") ? "Rekap Pimpinan" : "Rekap 2";
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    RekapContent,
    {
      rekapData: datas,
      show: "rekap2",
      title,
      urlLink: route("mobile_apps.rekap_dua"),
      localState: "mobile_apps_rekap_dua"
    }
  ) });
};
export {
  RekapDua as default
};
