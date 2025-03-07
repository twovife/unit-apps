import { jsx } from "react/jsx-runtime";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-B3QirsBc.js";
import { Head } from "@inertiajs/react";
import AngsuranByDate from "./AngsuranByDate-B-67Mxn6.js";
import "./Dropdown-tAzvTn5J.js";
import "./button-Dbmjz33H.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./dropdown-menu-DA8FJBQ2.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
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
import "@radix-ui/react-dialog";
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
  const urlLink = server_filter.type_show == "macet" ? route("pinjaman.index_pinjaman_macet") : route("pinjaman.index_pinjaman_search");
  const localState = server_filter.type_show == "macet" ? "pinjaman_index_pinjaman_macet" : "pinjaman_index_pinjaman_search";
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: headerName }), children: /* @__PURE__ */ jsx(
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
