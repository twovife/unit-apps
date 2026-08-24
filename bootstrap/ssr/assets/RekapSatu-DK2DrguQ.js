import { jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import "react";
import "./command-int9mZp7.js";
import "clsx";
import "dayjs";
import "./button-MTjEwktD.js";
import "./popover-B9xSK2Gy.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import { M as MobileLayout } from "./MobileLayout-CCpIOj_l.js";
import RekapContent from "./RekapContent-DfCYrFV7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "tailwind-merge";
import "./input-BHD-__le.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-8a8NNlps.js";
import "@radix-ui/react-popover";
import "@headlessui/react";
import "./AuthenticatedLayout-C3znwcHI.js";
import "./SearchComponent-uiqzPovZ.js";
import "./SelectComponent-DUhN-d41.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "./TableRekap-Cbt9FDS1.js";
import "./table-Dwx5kZ1B.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-CNoEbOQt.js";
import "@tanstack/react-table";
import "./badge-CBTu05xj.js";
import "./BargeStatus-KjUuqjtj.js";
import "./TunaiMantri-pVTng2IG.js";
import "./Action-DaTCdMbi.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-Cj6LHx_M.js";
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
