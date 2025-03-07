import { jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { M as MobileLayout } from "./MobileLayout-DcrVxtqu.js";
import AngsuranByDate from "./AngsuranByDate-B-67Mxn6.js";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./dropdown-menu-DA8FJBQ2.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./button-Dbmjz33H.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./popover-CUWb37oo.js";
import "./SelectComponent-mFLhKw8T.js";
import "./input-Dqw8mvVY.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./AngsuranByDateTable-D7VzQqD4.js";
import "./table-CE18WwxH.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action22-DWL0mL6U.js";
import "./dialog-Bw81dxwx.js";
import "./card-B9cxsokM.js";
import "axios";
import "./StatusPinjaman-DqZsJoQG.js";
import "./badge-3Dzo-CJq.js";
import "./BayarAngsuran-DboED__D.js";
import "react-currency-input-field";
import "./Checkbox-B46RnHis.js";
import "./JenisNasabah-qcs_eUyi.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-D9GjR7fr.js";
import "./SelectList-B5y2fe3l.js";
import "./DeleteAngsuran-B3Umm9Ze.js";
import "./TextInput-MEjNo-OR.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
const SearchByDate = ({ datas, dateOfWeek, server_filter, ...props }) => {
  const headerName = server_filter.type_show == "macet" ? "MACET" : "Cari Angsuran";
  const urlLink = server_filter.type_show == "macet" ? route("mobile_apps.byDates") : route("mobile_apps.macet");
  const localState = server_filter.type_show == "macet" ? "mobile_apps_byDates" : "mobile_apps_macet";
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
