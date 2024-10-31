import { a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-456cb78b.mjs";
import Permantri from "./Permantri-1f3963f9.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-842695c7.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./popover-8a2cee74.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./TableRekap-d369625b.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-bdf6dba2.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./TableRekapKasir-c49b6915.mjs";
import "./TunaiMantri-e7610184.mjs";
import "./Action-1429d5fc.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-34895a82.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "react-currency-input-field";
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