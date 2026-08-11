import { jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { M as MobileLayout } from "./MobileLayout-DDtr65-l.js";
import AngsuranByDate from "./AngsuranByDate-ePJHrCaA.js";
import "./AuthenticatedLayout-DZz9QSGc.js";
import "./command-BgotNnHx.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./button-StO46bLt.js";
import "./input-BH-oxdzi.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-DqsN44pN.js";
import "./popover-QnCQXRdU.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./SearchComponent-Eb6Mvc9B.js";
import "./SelectComponent-DUhN-d41.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./AngsuranByDateTable-BZA3s7eI.js";
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
import "./InputMacet-DpUAFdPM.js";
import "./tabs-DpwcYzou.js";
import "@radix-ui/react-tabs";
import "react-day-picker";
import "@radix-ui/react-select";
import "date-fns";
const SearchByDate = ({ datas, dateOfWeek, server_filter, ...props }) => {
  const headerName = server_filter.type_show == "macet" ? "MACET" : "Cari Angsuran";
  const urlLink = server_filter.type_show == "macet" ? route("mobile_apps.macet") : route("mobile_apps.byDates");
  const localState = server_filter.type_show == "macet" ? "mobile_apps_macet" : "mobile_apps_byDates";
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: headerName }), children: /* @__PURE__ */ jsx(
    AngsuranByDate,
    {
      headerName,
      datas,
      dateOfWeek,
      urlLink,
      localState,
      searchMonth: server_filter.searchMonth,
      searchHari: true
    }
  ) });
};
export {
  SearchByDate as default
};
