import { jsx } from "react/jsx-runtime";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-C3znwcHI.js";
import { Head } from "@inertiajs/react";
import AngsuranByDate from "./AngsuranByDate-DPIgIFrI.js";
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
import "./FilterBar-DxJSo2b4.js";
import "./AngsuranByDateTable-DNKS8rBt.js";
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
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "./Pengajuan-BGZhLqwe.js";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-BL9r_Gno.js";
import "./PengajuanLama-N_52jNMR.js";
import "./InputMacet-NyI8lJt_.js";
import "react-day-picker";
import "@radix-ui/react-select";
import "date-fns";
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
