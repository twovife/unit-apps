import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-8a8NNlps.js";
import NewNasabah from "./NewNasabah-BU2MZYjW.js";
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
import "./RiwayatPengajuan-xZzAsLuI.js";
import "./table-Dwx5kZ1B.js";
import "@tanstack/react-table";
import "./BadgeStatus-Cj6LHx_M.js";
import "./badge-CBTu05xj.js";
import "./Checkbox-DLnjqb3e.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./NoEditOverlay-GIB1h_zq.js";
import "./TanggalKerja-cCQo_ce9.js";
import "./useHariLibur-C2p-tWwl.js";
import "./calendar-BJ3LWb_A.js";
import "react-day-picker";
import "@radix-ui/react-icons";
import "date-fns/locale";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
const Create = ({ show = false, onClosed }) => {
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "flex h-[92vh] w-[95vw] max-w-[95vw] flex-col gap-0 p-0 sm:max-w-[95vw]", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "px-5 pt-5 pb-3 space-y-1 border-b shrink-0", children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-base", children: "Pengajuan Pinjaman Baru" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Mulai dengan mencari NIK nasabah. Riwayat pengajuannya muncul di sebelah kanan sebagai bahan pertimbangan." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 px-5 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent", children: /* @__PURE__ */ jsx(
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
