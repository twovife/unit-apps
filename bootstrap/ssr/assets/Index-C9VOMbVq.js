import { jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import "./command-int9mZp7.js";
import "clsx";
import "dayjs";
import "./button-MTjEwktD.js";
import "./popover-B9xSK2Gy.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import Angsuran from "./Angsuran-CxGxqAmI.js";
import { M as MobileLayout } from "./MobileLayout-CPLPpjNm.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "tailwind-merge";
import "./input-BHD-__le.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-8a8NNlps.js";
import "@radix-ui/react-popover";
import "@headlessui/react";
import "./SearchComponent-uiqzPovZ.js";
import "./SelectComponent-DUhN-d41.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "./FilterBar-DxJSo2b4.js";
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "./AngsuranTable-BKT_3a9m.js";
import "./table-Dwx5kZ1B.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-DpQc2jIx.js";
import "./card-WipCscFv.js";
import "axios";
import "./badge-CBTu05xj.js";
import "./BayarAngsuran-Clafpzjb.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "./JenisNasabah-B8ab0q_P.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-BHWercwM.js";
import "./SelectList-DrCNDu1u.js";
import "./DeleteAngsuran-CW726sUL.js";
import "./TextInput-GCtCMl-T.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "./Pengajuan-BGZhLqwe.js";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-BL9r_Gno.js";
import "./PengajuanLama-N_52jNMR.js";
import "./SyncAngsuran-CbJogwZT.js";
import "./ButtonAngsuran-BPylzf7g.js";
import "./BukuStorting-Oq86KW-Q.js";
import "./ApprovalAkhir-CoeltRBs.js";
import "./AngsuranTableMobile-B5SR5SOw.js";
import "./BargeStatus-KjUuqjtj.js";
import "./BadgeStatus-Cj6LHx_M.js";
import "./BukuStortingMobile-CS9BISWv.js";
import "./AuthenticatedLayout-Lk4S3jcr.js";
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
