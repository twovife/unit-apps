import { jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-B3QirsBc.js";
import Content from "./Content-DMQ6A8K8.js";
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
import "./TableRekap-CX5Cx6Xh.js";
import "./table-CE18WwxH.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "dayjs";
import "./badge-3Dzo-CJq.js";
import "./BargeStatus-wWq6wWJ0.js";
import "./popover-CUWb37oo.js";
import "./SelectComponent-mFLhKw8T.js";
import "./input-Dqw8mvVY.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-fMRf3trd.js";
import "@radix-ui/react-tabs";
const Index = ({ datas, ...props }) => {
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: /* @__PURE__ */ jsx(
    Content,
    {
      urlLink: route("kasir.rekap.rencana_drop"),
      localState: "kasir_rekap_rencana_drop",
      triggeredData: datas
    }
  ) });
};
export {
  Index as default
};
