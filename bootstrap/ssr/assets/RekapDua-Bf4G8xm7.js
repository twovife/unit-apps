import { jsx } from "react/jsx-runtime";
import "react";
import "./Dropdown-tAzvTn5J.js";
import { Head } from "@inertiajs/react";
import "./button-Dbmjz33H.js";
import "./dropdown-menu-DA8FJBQ2.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import { M as MobileLayout } from "./MobileLayout-DcrVxtqu.js";
import RekapContent from "./RekapContent-9gx-KwO_.js";
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
