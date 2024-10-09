import { a as jsx } from "../ssr.mjs";
import { M as MobileLayout } from "./MobileLayout-ec4bcca4.mjs";
import Permantri from "./Permantri-db3e5046.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-306ada45.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "lucide-react";
import "./SearchComponent-ed16326c.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "dayjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "./Navbar-86b9f43b.mjs";
import "react-icons/bi";
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
const RekapPerMantri = ({ datas, auth, ...props }) => {
  const title = "Rekap Mantri";
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    Permantri,
    {
      rekapData: datas,
      auth,
      title,
      urlLink: route("mobile_apps.rekap_permantri"),
      localState: "mobile_apps_rekap_permantri"
    }
  ) });
};
export {
  RekapPerMantri as default
};
