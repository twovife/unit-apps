import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-DqsN44pN.js";
import NewNasabah from "./NewNasabah-C18zRyWG.js";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./InputError-cRVTeK4i.js";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./button-StO46bLt.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./card-DK9akThy.js";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./input-BH-oxdzi.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@inertiajs/react";
import "axios";
import "react-currency-input-field";
import "./SelectComponent-DUhN-d41.js";
import "./RiwayatPengajuan-C1LEAz5f.js";
import "./table-DgsbovDN.js";
import "@tanstack/react-table";
import "dayjs";
import "./BadgeStatus-BDnUSm56.js";
import "./badge-BDQK5pqs.js";
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
