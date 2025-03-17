import { jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DTyukSQh.js";
import RekapContent from "./RekapContent-Dg2Ex5KJ.js";
import { Head } from "@inertiajs/react";
import "react";
import "./Dropdown-tAzvTn5J.js";
import "./button-StO46bLt.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./dropdown-menu-BEELUTJf.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
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
import "./Action-CDU5z7S7.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-B_sbaCdL.js";
import "./dialog-5zuHJd4f.js";
import "@radix-ui/react-dialog";
import "react-currency-input-field";
const RekapSatu = ({ datas, auth, ...props }) => {
  const title = "REKAP 1 & Tunai Mantri";
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    RekapContent,
    {
      rekapData: datas,
      show: "rekapkasir",
      title,
      urlLink: route("kasir.rekap.rekap_satu"),
      localState: "kasir_rekap_rekap_satu"
    }
  ) });
};
export {
  RekapSatu as default
};
