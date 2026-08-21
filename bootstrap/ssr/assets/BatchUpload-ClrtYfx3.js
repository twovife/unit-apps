import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import NewNasabah from "./NewNasabah-yQyYQS-j.js";
import { A as Authenticated } from "./AuthenticatedLayout-BpUiURcU.js";
import "./button-MTjEwktD.js";
import { L as LinkButton } from "./LinkButton-Cyzm0_CJ.js";
import "./InputError-cRVTeK4i.js";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./card-WipCscFv.js";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "./input-BHD-__le.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@inertiajs/react";
import "axios";
import "lucide-react";
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
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "./dialog-8a8NNlps.js";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
const BatchUpload = () => {
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(
      NewNasabah,
      {
        onClosed: () => void 0,
        generateAngsuran: true,
        typeInput: "text",
        submitUrl: route("transaction.store_buku_transaksi_batch")
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute z-20 right-2 bottom-2", children: /* @__PURE__ */ jsx(LinkButton, { href: route("transaction.fastcreatev2"), color: "outline", children: "V2" }) })
  ] });
};
export {
  BatchUpload as default
};
