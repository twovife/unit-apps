import { a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-fd246ae3.mjs";
import { Head } from "@inertiajs/react";
import Angsuran from "./Angsuran-17f390ae.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-6bb941e8.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./popover-657fe213.mjs";
import "./SelectComponent-dc7360ed.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./AngsuranTable-e28a2ed0.mjs";
import "./table-8d30c177.mjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./Action-5b090f92.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "./card-a7cc8935.mjs";
import "axios";
import "./StatusPinjaman-b6a160c0.mjs";
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
import "sonner";
import "next-themes";
import "./BadgeStatus-34895a82.mjs";
import "./Pengajuan-071d9175.mjs";
import "./accordion-01051f31.mjs";
import "@radix-ui/react-accordion";
import "./WhiteOff-86c8031e.mjs";
import "./PengajuanLama-ee984643.mjs";
import "./BukuStorting-7c505b98.mjs";
import "./Action22-cc1f1d12.mjs";
import "./ApprovalAkhir-f4508be1.mjs";
import "./AngsuranTableMobile-f3649ed7.mjs";
import "./BargeStatus-bdf6dba2.mjs";
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
