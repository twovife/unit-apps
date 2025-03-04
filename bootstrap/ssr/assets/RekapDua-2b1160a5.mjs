import { a as jsx } from "../ssr.mjs";
import "react";
import "./Navbar-6bb941e8.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-e5a75d04.mjs";
import "./Loading-95bc2f77.mjs";
import { M as MobileLayout } from "./MobileLayout-196226fb.mjs";
import RekapContent from "./RekapContent-29c56b1c.mjs";
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
import "./popover-657fe213.mjs";
import "./SelectComponent-dc7360ed.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./TableRekap-a2f448dd.mjs";
import "./table-8d30c177.mjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./accordion-01051f31.mjs";
import "@radix-ui/react-accordion";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-3dfd0907.mjs";
import "@tanstack/react-table";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "./TunaiMantri-2cf6af70.mjs";
import "./Action-7a5331e3.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./dialog-e17b5153.mjs";
import "react-currency-input-field";
const RekapDua = ({ datas, saldoAwalBulan, auth, ...props }) => {
  const title = auth.permissions.includes("unit pimpinan") ? "Rekap Pimpinan" : "Rekap 2";
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    RekapContent,
    {
      rekapData: datas,
      saldoAwalBulan,
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
