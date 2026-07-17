import { a as jsx } from "../ssr.mjs";
import "./SweetAlert-565cd2f8.mjs";
import "./Loading-95bc2f77.mjs";
import "react";
import { Head } from "@inertiajs/react";
import "./DropdownProfile-f572cff8.mjs";
import "./button-e7ccf50f.mjs";
import "./separator-6fdc070c.mjs";
import { M as MobileLayout } from "./MobileLayout-a011c42b.mjs";
import RekapContent from "./RekapContent-5fc81014.mjs";
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
import "./popover-590ea694.mjs";
import "./SelectComponent-dc7360ed.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./TableRekap-d698c307.mjs";
import "./table-8d30c177.mjs";
import "@tanstack/react-table";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-070c40e0.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-c4f2d1d5.mjs";
import "./TunaiMantri-f834c108.mjs";
import "./Action-91c96d44.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-1947fb26.mjs";
import "./dialog-97d8ecd0.mjs";
import "react-currency-input-field";
const RekapSatu = ({ datas, auth, ...props }) => {
  const title = "REKAP 1 & Tunai Mantri";
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    RekapContent,
    {
      rekapData: datas,
      show: "rekapkasir",
      title,
      urlLink: route("mobile_apps.rekap_satu"),
      localState: "mobile_apps_rekap_satu"
    }
  ) });
};
export {
  RekapSatu as default
};
