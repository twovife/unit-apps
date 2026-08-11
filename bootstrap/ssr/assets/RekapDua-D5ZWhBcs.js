import { jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import "react";
import "./command-BgotNnHx.js";
import "clsx";
import "./button-StO46bLt.js";
import "./popover-QnCQXRdU.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import { M as MobileLayout } from "./MobileLayout-DDtr65-l.js";
import RekapContent from "./RekapContent-CGu7flJO.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "tailwind-merge";
import "./input-BH-oxdzi.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-DqsN44pN.js";
import "@radix-ui/react-popover";
import "@headlessui/react";
import "./AuthenticatedLayout-DZz9QSGc.js";
import "./SearchComponent-Eb6Mvc9B.js";
import "./SelectComponent-DUhN-d41.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./TableRekap-D8lehBfC.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-D1hP0HXY.js";
import "@tanstack/react-table";
import "./badge-BDQK5pqs.js";
import "./BargeStatus-B_JPokIk.js";
import "./TunaiMantri-Cd1XmTmd.js";
import "./Action-CrIqHAjP.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-BDnUSm56.js";
import "react-currency-input-field";
const RekapDua = ({ datas, saldoAwalBulan, auth, ...props }) => {
  const title = auth.roles.includes("pimpinan") ? "Rekap Pimpinan" : "Rekap 2";
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
