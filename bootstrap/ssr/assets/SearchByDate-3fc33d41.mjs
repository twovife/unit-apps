import { a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-4797da35.mjs";
import { Head } from "@inertiajs/react";
import "./button-bf6cf732.mjs";
import "./input-a726a844.mjs";
import "./Loading-95bc2f77.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import AngsuranByDate from "./AngsuranByDate-53317e1c.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-b30a186e.mjs";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-label";
import "./popover-ecaf9d0d.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "@radix-ui/react-popover";
import "./AngsuranByDateTable-0f7b2bd2.mjs";
import "./FormatNumbering-9786ffbe.mjs";
import "react-number-format";
import "./Action-9de168ed.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "./card-a7cc8935.mjs";
import "axios";
import "./badge-ad1cae46.mjs";
import "./BayarAngsuran-55c0636e.mjs";
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
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
const SearchByDate = ({ datas, dateOfWeek, ...props }) => {
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Cari Angsuran" }), children: /* @__PURE__ */ jsx(
    AngsuranByDate,
    {
      datas,
      dateOfWeek,
      urlLink: route("pinjaman.index_pinjaman_search"),
      localState: "pinjaman_index_pinjaman_search",
      searchMonth: true,
      searchHari: true
    }
  ) });
};
export {
  SearchByDate as default
};