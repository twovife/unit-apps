import { a as jsx } from "../ssr.mjs";
import "react";
import "./DropdownProfile-f572cff8.mjs";
import "./button-e7ccf50f.mjs";
import "@inertiajs/react";
import "./separator-6fdc070c.mjs";
import NewNasabah from "./NewNasabah-5e43010f.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-1b2491b5.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./use-mobile-f8f7682a.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./input-22e7db4a.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "lucide-react";
import "@radix-ui/react-separator";
import "./InputError-3b072368.mjs";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./card-f356ad44.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "axios";
import "react-currency-input-field";
import "./SelectComponent-dc7360ed.mjs";
import "./RiwayatPengajuan-aa3b808c.mjs";
import "./table-8d30c177.mjs";
import "@tanstack/react-table";
import "dayjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./badge-ad1cae46.mjs";
import "./BargeStatus-070c40e0.mjs";
import "./ModalShowAngsuran-60a89e11.mjs";
import "./dialog-97d8ecd0.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "./SweetAlert-565cd2f8.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "./AppSidebar-66e8729f.mjs";
const Index = () => {
  return /* @__PURE__ */ jsx(Authenticated, { children: /* @__PURE__ */ jsx(
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
