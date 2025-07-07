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
import Angsuran from "./Angsuran-mJR2qxjO.js";
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
import "./AngsuranTable-DY5M3w1w.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-Bl8cFSfF.js";
import "./dialog-5zuHJd4f.js";
import "@radix-ui/react-dialog";
import "./card-DK9akThy.js";
import "axios";
import "./StatusPinjaman-C2n31N_V.js";
import "./badge-BUI-akMw.js";
import "./BayarAngsuran-Daoj1Mle.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "./JenisNasabah-CaYZthxZ.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-BHWercwM.js";
import "./SelectList-DrCNDu1u.js";
import "./DeleteAngsuran-3Bs-fcCi.js";
import "./TextInput-GCtCMl-T.js";
import "./DeleteLoan-BRMUEAf1.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "lucide-react";
import "./BadgeStatus-B_sbaCdL.js";
import "./Pengajuan-CCPOcjv6.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-CmM5sBlW.js";
import "./PengajuanLama-CPWXFCy0.js";
import "./SyncAngsuran-DEL4wamB.js";
import "./ButtonAngsuran-B3tUEJFO.js";
import "./BukuStorting-D7RPY01q.js";
import "./Action22-LlCo2DX0.js";
import "./ApprovalAkhir-BKii_Fbh.js";
import "./AngsuranTableMobile-BJspv6Me.js";
import "./BargeStatus-CMHXimJD.js";
import "./BukuStortingMobile-CW1cFR3j.js";
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
