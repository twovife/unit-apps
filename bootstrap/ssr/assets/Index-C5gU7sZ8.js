import { jsx } from "react/jsx-runtime";
import "react";
import "./Dropdown-tAzvTn5J.js";
import { Head } from "@inertiajs/react";
import "./button-StO46bLt.js";
import "./dropdown-menu-BEELUTJf.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import Angsuran from "./Angsuran-BF8Y7Tdx.js";
import { M as MobileLayout } from "./MobileLayout-B92D_4lk.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@headlessui/react";
import "./SearchComponent-BPnDq_4y.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./popover-eMhT0muz.js";
import "@radix-ui/react-popover";
import "./AngsuranTable-CztnyR8i.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-Cu_Gz-ha.js";
import "./dialog-5zuHJd4f.js";
import "@radix-ui/react-dialog";
import "./card-DK9akThy.js";
import "axios";
import "./StatusPinjaman-C2n31N_V.js";
import "./badge-BUI-akMw.js";
import "./BayarAngsuran-BUsukuOx.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "./JenisNasabah-CaYZthxZ.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-BHWercwM.js";
import "./SelectList-DrCNDu1u.js";
import "./DeleteAngsuran-XJnJHzkR.js";
import "./TextInput-GCtCMl-T.js";
import "./DeleteLoan-BRMUEAf1.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "lucide-react";
import "./BadgeStatus-B_sbaCdL.js";
import "./Pengajuan-DELe_nRz.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-CmM5sBlW.js";
import "./PengajuanLama-B_1sOjhf.js";
import "./SyncAngsuran-Cka_-pn9.js";
import "./ButtonAngsuran-B3tUEJFO.js";
import "./BukuStorting-Bl9cDHU_.js";
import "./Action22-5JKdchYh.js";
import "./ApprovalAkhir-BKii_Fbh.js";
import "./AngsuranTableMobile-CPTExkRm.js";
import "./BargeStatus-CMHXimJD.js";
import "./SweetAlert-CPwvZdfJ.js";
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
