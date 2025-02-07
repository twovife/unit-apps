import { a as jsx } from "../ssr.mjs";
import "react";
import NewNasabah from "./NewNasabah-e5fa571f.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-fd246ae3.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./InputError-3b072368.mjs";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./card-a7cc8935.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./input-a726a844.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "axios";
import "lucide-react";
import "react-currency-input-field";
import "./SelectComponent-dc7360ed.mjs";
import "./RiwayatPengajuan-cd941718.mjs";
import "./table-8d30c177.mjs";
import "@tanstack/react-table";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "dayjs";
import "./BadgeStatus-34895a82.mjs";
import "./badge-ad1cae46.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "./Navbar-6bb941e8.mjs";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
const BatchUpload = () => {
  return /* @__PURE__ */ jsx(Authenticated, { children: /* @__PURE__ */ jsx(
    NewNasabah,
    {
      onClosed: () => void 0,
      generateAngsuran: true,
      typeInput: "text",
      submitUrl: route("transaction.store_buku_transaksi_batch")
    }
  ) });
};
export {
  BatchUpload as default
};
