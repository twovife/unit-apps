import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-B9xSK2Gy.js";
import { S as SearchComponent } from "./SearchComponent-uiqzPovZ.js";
import { F as FilterBar } from "./FilterBar-DxJSo2b4.js";
import { usePage, router } from "@inertiajs/react";
import AngsuranByDateTable from "./AngsuranByDateTable-DNKS8rBt.js";
import { B as Button } from "./button-MTjEwktD.js";
import { FilterIcon, SearchIcon } from "lucide-react";
import { L as Label } from "./label-F4MKz6SO.js";
import { I as Input } from "./input-BHD-__le.js";
import InputMacet from "./InputMacet-NyI8lJt_.js";
import "@radix-ui/react-popover";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./SelectComponent-DUhN-d41.js";
import "@radix-ui/react-icons";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./table-Dwx5kZ1B.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./Action-DpQc2jIx.js";
import "./dialog-8a8NNlps.js";
import "@radix-ui/react-dialog";
import "./card-WipCscFv.js";
import "axios";
import "./badge-CBTu05xj.js";
import "class-variance-authority";
import "./BayarAngsuran-Clafpzjb.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "@radix-ui/react-label";
import "@radix-ui/react-slot";
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
import "react-day-picker";
import "@radix-ui/react-select";
import "date-fns";
const AngsuranByDate = ({
  headerName,
  datas,
  urlLink,
  localState,
  searchMonth,
  searchHari,
  type = "desktop"
}) => {
  const { server_filter } = usePage().props;
  const [showInputMacet, setShowInputMacet] = useState(false);
  const onShowMacet = () => {
    setShowInputMacet(true);
  };
  const onCloseMacet = () => {
    setShowInputMacet(false);
  };
  const canFilterUnit = server_filter.userAuthorized.canShowBranch || server_filter.userAuthorized.canShowGroupingBranch;
  const unitExtraParams = {};
  if (server_filter.branch_id)
    unitExtraParams.branch_id = server_filter.branch_id;
  if (server_filter.wilayah) unitExtraParams.wilayah = server_filter.wilayah;
  if (server_filter.nama) unitExtraParams.nama = server_filter.nama;
  const searchComponentKey = `${server_filter.hari}-${server_filter.month}-${server_filter.kelompok}`;
  const [namaCari, setNamaCari] = useState(server_filter.nama ?? "");
  useEffect(() => {
    const nilaiAktif = server_filter.nama ?? "";
    if (namaCari === nilaiAktif) return;
    const timer = setTimeout(() => {
      router.get(
        urlLink,
        {
          hari: server_filter.hari,
          month: server_filter.month,
          kelompok: server_filter.kelompok,
          branch_id: server_filter.branch_id,
          wilayah: server_filter.wilayah,
          nama: namaCari || void 0
        },
        { preserveState: true, preserveScroll: true, replace: true }
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [namaCari]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InputMacet, { show: showInputMacet, onClosed: onCloseMacet }),
    type === "mobile" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 mb-3", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight", children: headerName }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          canFilterUnit && /* @__PURE__ */ jsxs(Popover, { children: [
            /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
              /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Unit" })
            ] }) }),
            /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
              SearchComponent,
              {
                urlLink,
                localState,
                searchBranch: server_filter.userAuthorized.canShowBranch,
                searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
              },
              searchComponentKey
            ) })
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: onShowMacet, variant: "outline", children: "Input Macet" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mb-3", children: [
        /* @__PURE__ */ jsx(SearchIcon, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: "Cari nama nasabah...",
            className: "pl-9",
            value: namaCari,
            onChange: (e) => setNamaCari(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
        FilterBar,
        {
          urlLink,
          storageKey: localState,
          showHari: searchHari,
          showMonth: searchMonth,
          showKelompok: server_filter.userAuthorized.canShowKelompok,
          extraParams: unitExtraParams
        }
      ) })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "relative mb-3 max-w-sm", children: [
        /* @__PURE__ */ jsx(SearchIcon, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: "Cari nama nasabah...",
            className: "pl-9",
            value: namaCari,
            onChange: (e) => setNamaCari(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between flex-none shrink-0 whitespace-nowrap", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: headerName }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 lg:hidden", children: [
            /* @__PURE__ */ jsxs(Popover, { children: [
              /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
                /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
                "Filter"
              ] }) }),
              /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
                SearchComponent,
                {
                  urlLink,
                  localState,
                  searchMonth,
                  searchHari,
                  searchKelompok: server_filter.userAuthorized.canShowKelompok,
                  searchBranch: server_filter.userAuthorized.canShowBranch,
                  searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: onShowMacet, color: "outline", children: "Input Macet" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: [
          /* @__PURE__ */ jsx(
            SearchComponent,
            {
              urlLink,
              localState,
              searchMonth,
              searchHari,
              searchKelompok: server_filter.userAuthorized.canShowKelompok,
              searchBranch: server_filter.userAuthorized.canShowBranch,
              searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
            /* @__PURE__ */ jsx(Label, { children: " " }),
            /* @__PURE__ */ jsx(Button, { onClick: onShowMacet, color: "outline", children: "Input Macet" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsx(AngsuranByDateTable, { datas }) })
  ] });
};
export {
  AngsuranByDate as default
};
