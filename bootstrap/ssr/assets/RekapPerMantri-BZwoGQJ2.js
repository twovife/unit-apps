import { jsx } from "react/jsx-runtime";
import { M as MobileLayout } from "./MobileLayout-CR7_AkuG.js";
import Permantri from "./Permantri-Bb4yGn1a.js";
import { Head } from "@inertiajs/react";
import "react";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./dropdown-menu-BEELUTJf.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./button-BgpGzoq1.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./popover-Jo-e196v.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./Dropdown-tAzvTn5J.js";
import "./table-DgsbovDN.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-D3a-jeFA.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./badge-BUI-akMw.js";
import "./BargeStatus-CqBrS4jm.js";
import "./TunaiMantri-tgSzWzDD.js";
import "./Action-Cafumq6N.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-C6ArT9Zf.js";
import "./dialog-5zuHJd4f.js";
import "react-currency-input-field";
import "./TableRekapPerMantri-BNQdYg-I.js";
const RekapPerMantri = ({ datas, saldoAwalBulan, auth, ...props }) => {
  const title = "Rekap Mantri";
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    Permantri,
    {
      rekapData: datas,
      saldoAwalBulan,
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
