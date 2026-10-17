import { jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { M as MobileLayout } from "./MobileLayout-M62-uFkT.js";
import AngsuranByDate from "./AngsuranByDate-Df6XDdWP.js";
import "./AuthenticatedLayout-CLVnpQ7Y.js";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./button-MTjEwktD.js";
import "./input-BHD-__le.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-8a8NNlps.js";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./SearchComponent-uiqzPovZ.js";
import "./SelectComponent-DUhN-d41.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "./FilterBar-YtaCqrQo.js";
import "./TanggalKerja-cCQo_ce9.js";
import "./useHariLibur-C2p-tWwl.js";
import "axios";
import "./calendar-BJ3LWb_A.js";
import "react-day-picker";
import "date-fns/locale";
import "./AngsuranByDateTable-DplkrEDS.js";
import "./table-Dwx5kZ1B.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-U8hA6azL.js";
import "./card-WipCscFv.js";
import "./badge-CBTu05xj.js";
import "./BayarAngsuran-VkCNQQzB.js";
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
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "./Pengajuan-IePM5Mea.js";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-D2w6k6OI.js";
import "./PengajuanLama-CN9SY5n2.js";
import "./InputMacet-bH08IxHW.js";
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
      searchHari: true,
      type: "mobile"
    }
  ) });
};
export {
  SearchByDate as default
};
