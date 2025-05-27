import { jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { M as MobileLayout } from "./MobileLayout-B92D_4lk.js";
import AngsuranByDate from "./AngsuranByDate-FzxShATh.js";
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
import "./button-StO46bLt.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./popover-eMhT0muz.js";
import "@radix-ui/react-popover";
import "./SearchComponent-BPnDq_4y.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./AngsuranByDateTable-WzKTpNQo.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action22-sf0iO65J.js";
import "./dialog-5zuHJd4f.js";
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
import "./DeleteAngsuran-3Bs-fcCi.js";
import "./TextInput-GCtCMl-T.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "./InputMacet-CUPjo-67.js";
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
