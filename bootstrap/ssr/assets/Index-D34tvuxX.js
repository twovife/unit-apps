import { jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DZz9QSGc.js";
import Content from "./Content-DVHJ1kFl.js";
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
import "./TableRekap-BXZ_zJtu.js";
import "./table-DgsbovDN.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "dayjs";
import "./badge-BDQK5pqs.js";
import "./BargeStatus-B_JPokIk.js";
import "./SearchComponent-Eb6Mvc9B.js";
import "./SelectComponent-DUhN-d41.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./tabs-DpwcYzou.js";
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
