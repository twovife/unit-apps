import { a as jsx } from "../ssr.mjs";
import "react";
import { Head } from "@inertiajs/react";
import { M as MobileLayout } from "./MobileLayout-4a49d08a.mjs";
import AngsuranByDate from "./AngsuranByDate-0ca3f1a2.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-290d4aa4.mjs";
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
import "./popover-8a2cee74.mjs";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./AngsuranByDateTable-085cabcd.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "./Action-82ac0318.mjs";
import "./dialog-e17b5153.mjs";
import "./card-c2e72800.mjs";
import "axios";
import "./badge-ad1cae46.mjs";
import "./BayarAngsuran-65791d81.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-5e690fc3.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-baef50aa.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-128b8268.mjs";
const SearchByDate = ({ datas, dateOfWeek, ...props }) => {
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Cari Angsuran" }), children: /* @__PURE__ */ jsx(
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
