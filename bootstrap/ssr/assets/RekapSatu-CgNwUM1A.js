import { jsx } from "react/jsx-runtime";
import "react";
import "./Dropdown-tAzvTn5J.js";
import { Head } from "@inertiajs/react";
import "./button-BgpGzoq1.js";
import "./dropdown-menu-BEELUTJf.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import { M as MobileLayout } from "./MobileLayout-CR7_AkuG.js";
import RekapContent from "./RekapContent-B5ImrLHq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@headlessui/react";
import "./SweetAlert-CPwvZdfJ.js";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./popover-Jo-e196v.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./TableRekap-D8lehBfC.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-D3a-jeFA.js";
import "@tanstack/react-table";
import "./badge-BUI-akMw.js";
import "./BargeStatus-CqBrS4jm.js";
import "./TunaiMantri-tgSzWzDD.js";
import "./Action-Cafumq6N.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-C6ArT9Zf.js";
import "./dialog-5zuHJd4f.js";
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
