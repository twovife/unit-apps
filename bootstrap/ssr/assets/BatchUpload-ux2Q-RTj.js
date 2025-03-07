import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import NewNasabah from "./NewNasabah-CYzqO7bD.js";
import { A as Authenticated } from "./AuthenticatedLayout-B3QirsBc.js";
import "./button-Dbmjz33H.js";
import { L as LinkButton } from "./LinkButton-BvrcunJY.js";
import "./InputError-cRVTeK4i.js";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
import "./card-B9cxsokM.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./tabs-fMRf3trd.js";
import "@radix-ui/react-tabs";
import "./input-Dqw8mvVY.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@inertiajs/react";
import "axios";
import "lucide-react";
import "react-currency-input-field";
import "./SelectComponent-mFLhKw8T.js";
import "./RiwayatPengajuan-DH1Rqly1.js";
import "./table-CE18WwxH.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "dayjs";
import "./BadgeStatus-ulu71_5S.js";
import "./badge-3Dzo-CJq.js";
import "@radix-ui/react-slot";
import "./Checkbox-B46RnHis.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "./Dropdown-tAzvTn5J.js";
import "react-icons/bi";
import "hamburger-react";
import "./dropdown-menu-DA8FJBQ2.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./SweetAlert-CPwvZdfJ.js";
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
