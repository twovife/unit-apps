import { a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-09f20e21.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-4d37a724.mjs";
import "./Loading-95bc2f77.mjs";
import { M as MobileLayout } from "./MobileLayout-c6d3306d.mjs";
import RekapContent from "./RekapContent-25cf7050.mjs";
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
import "./popover-ecaf9d0d.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./TableRekap-d369625b.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-746decbb.mjs";
import "./TunaiMantri-e7610184.mjs";
import "./Action-63871fe7.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./dialog-e17b5153.mjs";
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