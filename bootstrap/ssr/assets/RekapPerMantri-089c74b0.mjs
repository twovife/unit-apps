import { a as jsx } from "../ssr.mjs";
import { M as MobileLayout } from "./MobileLayout-196226fb.mjs";
import Permantri from "./Permantri-96bd14b4.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./popover-ecaf9d0d.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./Navbar-b30a186e.mjs";
import "react-icons/bi";
import "hamburger-react";
import "./TableRekap-413a7ae8.mjs";
import "./FormatNumbering-9786ffbe.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-cd3ce98c.mjs";
import "./TunaiMantri-a74b2255.mjs";
import "./Action-7a5331e3.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./dialog-e17b5153.mjs";
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
