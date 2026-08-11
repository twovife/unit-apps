import { jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DZz9QSGc.js";
import Permantri from "./Permantri-DTxseENp.js";
import { Head } from "@inertiajs/react";
import "react";
import "./command-BgotNnHx.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./button-StO46bLt.js";
import "./input-BH-oxdzi.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-DqsN44pN.js";
import "./popover-QnCQXRdU.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./SearchComponent-Eb6Mvc9B.js";
import "./SelectComponent-DUhN-d41.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./table-DgsbovDN.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-D1hP0HXY.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./badge-BDQK5pqs.js";
import "./BargeStatus-B_JPokIk.js";
import "./TunaiMantri-Cd1XmTmd.js";
import "./Action-CrIqHAjP.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-BDnUSm56.js";
import "react-currency-input-field";
import "./TableRekapPerMantri-BNQdYg-I.js";
const RekapPerMantri = ({ datas, saldoAwalBulan, auth, ...props }) => {
  const title = "Rekap Mantri";
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    Permantri,
    {
      rekapData: datas,
      auth,
      saldoAwalBulan,
      title,
      urlLink: route("kasir.rekap.rekap_permantri"),
      localState: "kasir_rekap_rekap_permantri"
    }
  ) });
};
export {
  RekapPerMantri as default
};
