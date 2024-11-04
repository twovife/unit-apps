import { a as jsx } from "../ssr.mjs";
import "react";
import { M as MobileLayout } from "./MobileLayout-c6d3306d.mjs";
import NewNasabah from "./NewNasabah-601d5477.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
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
import "./InputError-3b072368.mjs";
import "./card-c2e72800.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./input-a726a844.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "axios";
import "react-currency-input-field";
import "./SelectComponent-359a9ab7.mjs";
import "./RiwayatPengajuan-d722b43c.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "dayjs";
import "./BadgeStatus-34895a82.mjs";
import "./badge-ad1cae46.mjs";
import "./Checkbox-d7000d9c.mjs";
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