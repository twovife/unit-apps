import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, S as SearchComponent } from "./popover-Jo-e196v.js";
import { usePage } from "@inertiajs/react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DpwcYzou.js";
import AngsuranTable from "./AngsuranTable-CaR7dba3.js";
import BukuStorting from "./BukuStorting-DB-Czx4Q.js";
import { B as Button } from "./button-BgpGzoq1.js";
import { FilterIcon } from "lucide-react";
import AngsuranTableMobile from "./AngsuranTableMobile-IrMPMjJn.js";
import "./input-BH-oxdzi.js";
import "./SelectComponent-C78kOz17.js";
import "@radix-ui/react-icons";
import "./Loading-DPcVnbEk.js";
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
import "./table-DgsbovDN.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-DZNduAuk.js";
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
import "./DeleteLoan-Cx2cdjt9.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "./BadgeStatus-C6ArT9Zf.js";
import "./Pengajuan-cCpDOaoy.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-B7Zhrp1o.js";
import "./PengajuanLama-5LUE4ZHP.js";
import "./SyncAngsuran-D2yL4rmr.js";
import "./ButtonAngsuran-MNHl4kJ5.js";
import "./Action22-DOWibcgQ.js";
import "./ApprovalAkhir-Chz0aUyz.js";
import "@radix-ui/react-slot";
import "./BargeStatus-CqBrS4jm.js";
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
