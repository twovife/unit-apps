import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, S as SearchComponent } from "./popover-CUWb37oo.js";
import { usePage } from "@inertiajs/react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-fMRf3trd.js";
import AngsuranTable from "./AngsuranTable-Dp0kjbz8.js";
import BukuStorting from "./BukuStorting-CTfe3ZtW.js";
import { B as Button } from "./button-Dbmjz33H.js";
import { FilterIcon } from "lucide-react";
import AngsuranTableMobile from "./AngsuranTableMobile-wz7baXiU.js";
import "./input-Dqw8mvVY.js";
import "./SelectComponent-mFLhKw8T.js";
import "@radix-ui/react-icons";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "./table-CE18WwxH.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-CfV2tfCT.js";
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
import "./DeleteLoan-DcOzGDkz.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "./BadgeStatus-ulu71_5S.js";
import "./Pengajuan-vxslcii9.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-Bwx2jIIk.js";
import "./PengajuanLama-DsBYbMYv.js";
import "./Action22-DWL0mL6U.js";
import "./ApprovalAkhir-Blauzft4.js";
import "@radix-ui/react-slot";
import "./BargeStatus-wWq6wWJ0.js";
const Angsuran = ({
  datas,
  dateOfWeek,
  sirkulasi,
  urlLink,
  localState,
  type = "desktop"
}) => {
  const { auth, server_filter } = usePage().props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between flex-none shrink-0 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Angsuran Lancar" }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-3 lg:hidden", children: /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
            /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
            "Filter"
          ] }) }),
          /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
            SearchComponent,
            {
              urlLink,
              localState,
              searchMonth: true,
              searchHari: true,
              searchKelompok: server_filter.userAuthorized.canShowKelompok,
              searchBranch: server_filter.userAuthorized.canShowBranch,
              searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink,
          localState,
          searchMonth: true,
          searchHari: true,
          searchKelompok: server_filter.userAuthorized.canShowKelompok,
          searchBranch: server_filter.userAuthorized.canShowBranch,
          searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bukuangsuran", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukuangsuran", children: "Buku Angsuran" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bukustorting", children: "Buku Storting" })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "bukuangsuran", children: [
        type === "mobile" && /* @__PURE__ */ jsx(AngsuranTableMobile, { dateOfWeek, datas }),
        type === "desktop" && /* @__PURE__ */ jsx(AngsuranTable, { dateOfWeek, datas })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bukustorting", children: /* @__PURE__ */ jsx(
        BukuStorting,
        {
          dateOfWeek,
          datas,
          sirkulasi
        }
      ) })
    ] })
  ] });
};
export {
  Angsuran as default
};
