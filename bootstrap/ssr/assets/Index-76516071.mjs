import { a as jsx } from "../ssr.mjs";
import "react";
import { M as MobileLayout } from "./MobileLayout-196226fb.mjs";
import NewNasabah from "./NewNasabah-e5fa571f.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-e5a75d04.mjs";
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
import "./InputError-3b072368.mjs";
import "./card-a7cc8935.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./input-a726a844.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "axios";
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
const Index = () => {
  return /* @__PURE__ */ jsx(MobileLayout, { children: /* @__PURE__ */ jsx(
    NewNasabah,
    {
      onClosed: () => void 0,
      submitUrl: route("transaction.store_buku_transaksi")
    }
  ) });
};
export {
  Index as default
};
