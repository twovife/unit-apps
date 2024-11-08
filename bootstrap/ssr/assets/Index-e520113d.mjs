import { a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-8b0a686f.mjs";
import { Head } from "@inertiajs/react";
import Angsuran from "./Angsuran-842dd1a9.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-09f20e21.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-4d37a724.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./popover-ecaf9d0d.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./AngsuranTable-0d30c89e.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "./Action-834c5f6b.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "./card-a7cc8935.mjs";
import "axios";
import "./badge-ad1cae46.mjs";
import "./BayarAngsuran-d3c65c8c.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-ee724a10.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-bde03131.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-128b8268.mjs";
import "./BukuStorting-8163eb2c.mjs";
import "./ApprovalAkhir-92788d9f.mjs";
import "./AngsuranTableMobile-3346bbce.mjs";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: /* @__PURE__ */ jsx(
    Angsuran,
    {
      datas,
      dateOfWeek,
      sirkulasi,
      urlLink: route("pinjaman.index_pinjaman"),
      localState: "pinjaman_index_pinjaman"
    }
  ) });
};
export {
  Index as default
};
