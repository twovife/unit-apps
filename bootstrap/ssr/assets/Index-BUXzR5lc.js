import { jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import "./command-BgotNnHx.js";
import "clsx";
import "./button-StO46bLt.js";
import "./popover-QnCQXRdU.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import Angsuran from "./Angsuran-B98QnP9q.js";
import { M as MobileLayout } from "./MobileLayout-DDtr65-l.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "tailwind-merge";
import "./input-BH-oxdzi.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-DqsN44pN.js";
import "@radix-ui/react-popover";
import "@headlessui/react";
import "./SearchComponent-Eb6Mvc9B.js";
import "./SelectComponent-DUhN-d41.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./AngsuranTable-Cdjh5vDC.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-DduzpCFw.js";
import "./card-DK9akThy.js";
import "axios";
import "./StatusPinjaman-BcI4A1Iw.js";
import "./badge-BDQK5pqs.js";
import "./BayarAngsuran-Daoj1Mle.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "./JenisNasabah-CaYZthxZ.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-BHWercwM.js";
import "./SelectList-DrCNDu1u.js";
import "./DeleteAngsuran-CXER3cr1.js";
import "./TextInput-GCtCMl-T.js";
import "./DeleteLoan-BRMUEAf1.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "./BadgeStatus-BDnUSm56.js";
import "./Pengajuan-CCPOcjv6.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-CmM5sBlW.js";
import "./PengajuanLama-CPWXFCy0.js";
import "./SyncAngsuran-Cizd7Nhv.js";
import "./ButtonAngsuran-B3tUEJFO.js";
import "./BukuStorting-pBhtx7gw.js";
import "./Action22-BHKijsu3.js";
import "./ApprovalAkhir-BwNfT9Nz.js";
import "./AngsuranTableMobile-9Xppv0xY.js";
import "./BargeStatus-B_JPokIk.js";
import "./BukuStortingMobile-Sq83CKoE.js";
import "./AuthenticatedLayout-DZz9QSGc.js";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: /* @__PURE__ */ jsx(
    Angsuran,
    {
      datas,
      dateOfWeek,
      sirkulasi,
      type: "mobile",
      urlLink: route("mobile_apps.angsuran"),
      localState: "mobile_apps.angsuran"
    }
  ) });
};
export {
  Index as default
};
