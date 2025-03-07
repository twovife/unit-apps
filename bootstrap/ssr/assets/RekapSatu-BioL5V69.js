import { jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-B3QirsBc.js";
import RekapContent from "./RekapContent-9gx-KwO_.js";
import { Head } from "@inertiajs/react";
import "react";
import "./Dropdown-tAzvTn5J.js";
import "./button-Dbmjz33H.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./dropdown-menu-DA8FJBQ2.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
import "./popover-CUWb37oo.js";
import "./SelectComponent-mFLhKw8T.js";
import "./input-Dqw8mvVY.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./TableRekap-D79RJBqe.js";
import "./table-CE18WwxH.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./tabs-fMRf3trd.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-R2ljHVA0.js";
import "@tanstack/react-table";
import "./badge-3Dzo-CJq.js";
import "./BargeStatus-wWq6wWJ0.js";
import "./TunaiMantri-CXkoUb3O.js";
import "./Action-B8vb6-uZ.js";
import "./Checkbox-B46RnHis.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-ulu71_5S.js";
import "./dialog-Bw81dxwx.js";
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
