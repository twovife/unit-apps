import { jsx } from "react/jsx-runtime";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-BpwqqJM-.js";
import { Head } from "@inertiajs/react";
import AngsuranByDate from "./AngsuranByDate-WkM7UR8E.js";
import "./Dropdown-tAzvTn5J.js";
import "./button-BgpGzoq1.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./dropdown-menu-BEELUTJf.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./SweetAlert-CPwvZdfJ.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./popover-Jo-e196v.js";
import "./SelectComponent-C78kOz17.js";
import "./input-BH-oxdzi.js";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./AngsuranByDateTable-CrxWoNAl.js";
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action22-DOWibcgQ.js";
import "./dialog-5zuHJd4f.js";
import "@radix-ui/react-dialog";
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
