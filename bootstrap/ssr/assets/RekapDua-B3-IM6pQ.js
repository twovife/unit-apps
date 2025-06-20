import { jsx } from "react/jsx-runtime";
import "react";
import "./Dropdown-tAzvTn5J.js";
import { Head } from "@inertiajs/react";
import "./button-StO46bLt.js";
import "./dropdown-menu-BEELUTJf.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import { M as MobileLayout } from "./MobileLayout-B92D_4lk.js";
import RekapContent from "./RekapContent-JQaK659-.js";
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
import "./SearchComponent-BPnDq_4y.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./popover-eMhT0muz.js";
import "@radix-ui/react-popover";
import "./TableRekap-D8lehBfC.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-CE-AKml3.js";
import "@tanstack/react-table";
import "./badge-BUI-akMw.js";
import "./BargeStatus-CMHXimJD.js";
import "./TunaiMantri-B02ZRqkI.js";
import "./Action-I0AG_ol5.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-B_sbaCdL.js";
import "./dialog-5zuHJd4f.js";
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
