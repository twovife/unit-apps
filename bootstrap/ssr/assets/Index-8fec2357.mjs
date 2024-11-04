import { a as jsx } from "../ssr.mjs";
import "react";
import { Head } from "@inertiajs/react";
import { M as MobileLayout } from "./MobileLayout-72f4739a.mjs";
import Angsuran from "./Angsuran-a8261ae6.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-4d37a724.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./popover-ecaf9d0d.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./AngsuranTable-b622e4b3.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "./Action-fa3a112a.mjs";
import "./dialog-e17b5153.mjs";
import "./card-c2e72800.mjs";
import "axios";
import "./badge-ad1cae46.mjs";
import "./BayarAngsuran-9bce17f5.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-5e690fc3.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-bde03131.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-128b8268.mjs";
import "./BukuStorting-7ab0bd16.mjs";
import "./ApprovalAkhir-5cc792f3.mjs";
import "./AngsuranTableMobile-73cc2bde.mjs";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: /* @__PURE__ */ jsx(
    Angsuran,
    {
      datas,
      dateOfWeek,
      sirkulasi,
      urlLink: route("mobile_apps.buku_angsuran"),
      localState: "mobile_apps.buku_angsuran"
    }
  ) });
};
export {
  Index as default
};
