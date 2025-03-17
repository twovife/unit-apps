import { jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DTyukSQh.js";
import Content from "./Content-D7omP8IS.js";
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
import "./TableRekap-f8FWYbeL.js";
import "./table-DgsbovDN.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "dayjs";
import "./badge-BUI-akMw.js";
import "./BargeStatus-CMHXimJD.js";
import "./SearchComponent-BPnDq_4y.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./popover-eMhT0muz.js";
import "@radix-ui/react-popover";
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
