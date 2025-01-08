import { a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-1b2491b5.mjs";
import { Head } from "@inertiajs/react";
import AngsuranByDate from "./AngsuranByDate-4351f8ec.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SweetAlert-565cd2f8.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./AppSidebar-66e8729f.mjs";
import "lucide-react";
import "./DropdownProfile-f572cff8.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./use-mobile-f8f7682a.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./button-e7ccf50f.mjs";
import "./input-22e7db4a.mjs";
import "./separator-6fdc070c.mjs";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "./popover-590ea694.mjs";
import "./SelectComponent-dc7360ed.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./AngsuranByDateTable-ab84aaa4.mjs";
import "./table-8d30c177.mjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./Action-7e54924d.mjs";
import "./dialog-97d8ecd0.mjs";
import "./card-f356ad44.mjs";
import "axios";
import "./badge-ad1cae46.mjs";
import "./BayarAngsuran-12102b3a.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-255e5d7a.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-aac95183.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-53e22530.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "sonner";
import "./sonner-0ca6cfec.mjs";
import "next-themes";
import "./BadgeStatus-1947fb26.mjs";
const SearchByDate = ({ datas, dateOfWeek, server_filter, ...props }) => {
  const headerName = server_filter.type_show == "macet" ? "MACET" : "Cari Angsuran";
  const urlLink = server_filter.type_show == "macet" ? route("pinjaman.index_pinjaman_macet") : route("pinjaman.index_pinjaman_search");
  const localState = server_filter.type_show == "macet" ? "pinjaman_index_pinjaman_macet" : "pinjaman_index_pinjaman_search";
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: headerName }), children: /* @__PURE__ */ jsx(
    AngsuranByDate,
    {
      headerName,
      datas,
      dateOfWeek,
      urlLink,
      localState,
      searchMonth: server_filter.searchMonth,
      searchHari: true
    }
  ) });
};
export {
  SearchByDate as default
};
