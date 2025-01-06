import { a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-1b2491b5.mjs";
import RekapContent from "./RekapContent-5fc81014.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SweetAlert-565cd2f8.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./AppSidebar-66e8729f.mjs";
import "lucide-react";
import "./DropdownProfile-f572cff8.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./use-mobile-f8f7682a.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./button-e7ccf50f.mjs";
import "./input-22e7db4a.mjs";
import "./separator-6fdc070c.mjs";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
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
const RekapDua = ({ datas, auth, ...props }) => {
  const title = auth.permissions.includes("unit pimpinan") ? "Rekap Pimpinan" : "Rekap 2";
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    RekapContent,
    {
      rekapData: datas,
      show: "rekap2",
      title,
      urlLink: route("kasir.rekap.rekap_dua"),
      localState: "kasir_rekap_rekap_dua"
    }
  ) });
};
export {
  RekapDua as default
};
