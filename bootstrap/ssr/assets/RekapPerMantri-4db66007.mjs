import { a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-456cb78b.mjs";
import Permantri from "./Permantri-f1f0d8e2.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "./button-bf6cf732.mjs";
import "./input-a726a844.mjs";
import "./Loading-95bc2f77.mjs";
import "dayjs";
import "./label-cecd7064.mjs";
import "./popover-84c978d2.mjs";
import "./FormatNumbering-23811b25.mjs";
import "./badge-ad1cae46.mjs";
import "./tabs-c148af71.mjs";
import "./dialog-e17b5153.mjs";
import "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-842695c7.mjs";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "./SearchComponent-f18de062.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./TableRekap-f07d707d.mjs";
import "@tanstack/react-table";
import "./BargeStatus-bdf6dba2.mjs";
import "react-number-format";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./TableRekapKasir-c49b6915.mjs";
import "./TunaiMantri-e7610184.mjs";
import "./Action-1429d5fc.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-34895a82.mjs";
import "@radix-ui/react-label";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-dialog";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
const RekapPerMantri = ({ datas, auth, ...props }) => {
  const title = "Rekap Mantri";
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: title }), children: /* @__PURE__ */ jsx(
    Permantri,
    {
      rekapData: datas,
      auth,
      title,
      urlLink: route("kasir.rekap.rekap_permantri"),
      localState: "kasir_rekap_rekap_permantri"
    }
  ) });
};
export {
  RekapPerMantri as default
};
