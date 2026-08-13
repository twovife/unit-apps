import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-8a8NNlps.js";
import NewNasabah from "./NewNasabah-yQyYQS-j.js";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./InputError-cRVTeK4i.js";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./button-MTjEwktD.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./card-WipCscFv.js";
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "./input-BHD-__le.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "@inertiajs/react";
import "axios";
import "react-currency-input-field";
import "./SelectComponent-DUhN-d41.js";
import "./RiwayatPengajuan-BgwqMR0N.js";
import "./table-Dwx5kZ1B.js";
import "@tanstack/react-table";
import "./BadgeStatus-Cj6LHx_M.js";
import "./badge-CBTu05xj.js";
import "./Checkbox-DLnjqb3e.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./NoEditOverlay-GIB1h_zq.js";
const Create = ({ show = false, onClosed }) => {
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
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
