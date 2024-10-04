import { a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-0c3f64d9.mjs";
import Permantri from "./Permantri-b631ed05.mjs";
import { Head } from "@inertiajs/react";
import "react";
import "./button-5b8f0147.mjs";
import "./input-7eb6bb1b.mjs";
import "./Loading-306ada45.mjs";
import "dayjs";
import "./label-143f493c.mjs";
import "./popover-4d729ade.mjs";
import "./FormatNumbering-02c28a29.mjs";
import "./badge-3e44e85b.mjs";
import "./tabs-f70be525.mjs";
import "./dialog-1c7227a2.mjs";
import "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-86b9f43b.mjs";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "./SearchComponent-ed16326c.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./TableRekap-e13a7fa8.mjs";
import "@tanstack/react-table";
import "./BargeStatus-e891d920.mjs";
import "react-number-format";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./TableRekapKasir-c21719bd.mjs";
import "./TunaiMantri-421f8de0.mjs";
import "./Action-139fa2bc.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./BadgeStatus-c743b633.mjs";
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
