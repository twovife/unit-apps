import { jsx } from "react/jsx-runtime";
import { M as MobileLayout } from "./MobileLayout-B92D_4lk.js";
import Permantri from "./Permantri-MfDdiYAq.js";
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
import "./button-StO46bLt.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./SearchComponent-BPnDq_4y.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./Dropdown-tAzvTn5J.js";
import "./popover-eMhT0muz.js";
import "@radix-ui/react-popover";
import "./table-DgsbovDN.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-CE-AKml3.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./badge-BUI-akMw.js";
import "./BargeStatus-CMHXimJD.js";
import "./TunaiMantri-B02ZRqkI.js";
import "./Action-CDU5z7S7.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-B_sbaCdL.js";
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
