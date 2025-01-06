import { a as jsx, j as jsxs } from "../ssr.mjs";
import "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-97d8ecd0.mjs";
import NewNasabah from "./NewNasabah-5e43010f.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./InputError-3b072368.mjs";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./button-e7ccf50f.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./card-f356ad44.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./input-22e7db4a.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "axios";
import "lucide-react";
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
import "./Checkbox-d7000d9c.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
const Create = ({ show = false, onClosed }) => {
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[80vw] h-[80vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { children: "Pengajuan Pinjaman Baru" }) }),
    /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsx(
      NewNasabah,
      {
        onClosed,
        submitUrl: route("transaction.store_buku_transaksi")
      }
    ) })
  ] }) });
};
export {
  Create as default
};
