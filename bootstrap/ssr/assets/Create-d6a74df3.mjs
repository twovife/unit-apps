import { a as jsx, j as jsxs } from "../ssr.mjs";
import "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-e17b5153.mjs";
import "./Loading-95bc2f77.mjs";
import NewNasabah from "./NewNasabah-3505edca.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-dom";
import "@headlessui/react";
import "./InputError-3b072368.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./card-c2e72800.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "./input-a726a844.mjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "axios";
import "lucide-react";
import "react-currency-input-field";
import "./SelectComponent-359a9ab7.mjs";
import "./RiwayatPengajuan-98e78e45.mjs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "dayjs";
import "./BadgeStatus-34895a82.mjs";
import "./badge-ad1cae46.mjs";
const Create = ({ show = false, onClosed }) => {
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { children: "Pengajuan Pinjaman Baru" }) }),
    /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsx(NewNasabah, { onClosed }) })
  ] }) });
};
export {
  Create as default
};
