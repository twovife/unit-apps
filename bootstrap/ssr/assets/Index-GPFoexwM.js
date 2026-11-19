import { jsx } from "react/jsx-runtime";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-CLVnpQ7Y.js";
import { Head } from "@inertiajs/react";
import Angsuran from "./Angsuran-DvPsAxov.js";
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
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "./AngsuranTable-CIS8kO1V.js";
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
import "./Pengajuan-IePM5Mea.js";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-D2w6k6OI.js";
import "./PengajuanLama-CN9SY5n2.js";
import "./SyncAngsuran-CbJogwZT.js";
import "./ButtonAngsuran-BPylzf7g.js";
import "./BukuStorting-CE3ao_cI.js";
import "./ApprovalAkhir-CoeltRBs.js";
import "./AngsuranTableMobile-CbQurAHB.js";
import "./BargeStatus-KjUuqjtj.js";
import "./BadgeStatus-Cj6LHx_M.js";
import "./BukuStortingMobile-rpwcO2hY.js";
const Index = ({ datas, dateOfWeek, sirkulasi, ...props }) => {
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: /* @__PURE__ */ jsx(
    Angsuran,
    {
      datas,
      dateOfWeek,
      sirkulasi,
      urlLink: route("pinjaman.index_pinjaman"),
      localState: "pinjaman_index_pinjaman"
    }
  ) });
};
export {
  Index as default
};
