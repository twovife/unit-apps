import { jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { M as MobileLayout } from "./MobileLayout-CR7_AkuG.js";
import Angsuran from "./Angsuran-CBk3ZK0a.js";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./dropdown-menu-BEELUTJf.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./button-BgpGzoq1.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./popover-Jo-e196v.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "./AngsuranTable-CaR7dba3.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-DZNduAuk.js";
import "./dialog-5zuHJd4f.js";
import "./card-DK9akThy.js";
import "axios";
import "./StatusPinjaman-C2n31N_V.js";
import "./badge-BUI-akMw.js";
import "./BayarAngsuran-DFpNSCOA.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "./JenisNasabah-CaYZthxZ.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-BHWercwM.js";
import "./SelectList-DrCNDu1u.js";
import "./DeleteAngsuran-DSe599rI.js";
import "./TextInput-GCtCMl-T.js";
import "./DeleteLoan-Cx2cdjt9.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "./BadgeStatus-C6ArT9Zf.js";
import "./Pengajuan-cCpDOaoy.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-B7Zhrp1o.js";
import "./PengajuanLama-5LUE4ZHP.js";
import "./SyncAngsuran-D2yL4rmr.js";
import "./ButtonAngsuran-MNHl4kJ5.js";
import "./BukuStorting-DB-Czx4Q.js";
import "./Action22-DOWibcgQ.js";
import "./ApprovalAkhir-Chz0aUyz.js";
import "./AngsuranTableMobile-IrMPMjJn.js";
import "./BargeStatus-CqBrS4jm.js";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: /* @__PURE__ */ jsx(
    Angsuran,
    {
      datas,
      dateOfWeek,
      sirkulasi,
      urlLink: route("mobile_apps.buku_angsuran"),
      localState: "mobile_apps.buku_angsuran"
    }
  ) });
};
export {
  Index as default
};
