import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { S as SearchComponent } from "./SearchComponent-uiqzPovZ.js";
import { B as Button } from "./button-MTjEwktD.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-B9xSK2Gy.js";
import { usePage } from "@inertiajs/react";
import { FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import TableRekap from "./TableRekap-Cbt9FDS1.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BAdW7Ajv.js";
import TableRekapKasir from "./TableRekapKasir-CNoEbOQt.js";
import TunaiMantri from "./TunaiMantri-pVTng2IG.js";
import Action from "./Action-DaTCdMbi.js";
import "./SelectComponent-DUhN-d41.js";
import "./input-BHD-__le.js";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "@radix-ui/react-icons";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-popover";
import "./table-Dwx5kZ1B.js";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "@radix-ui/react-tabs";
import "@tanstack/react-table";
import "./badge-CBTu05xj.js";
import "./BargeStatus-KjUuqjtj.js";
import "./Checkbox-DLnjqb3e.js";
import "./InputLabel-BhdXf1ED.js";
import "./BadgeStatus-Cj6LHx_M.js";
import "./dialog-8a8NNlps.js";
import "@radix-ui/react-dialog";
import "react-currency-input-field";
const RekapContent = ({
  rekapData,
  saldoAwalBulan,
  show,
  title,
  urlLink,
  localState
}) => {
  const { auth, server_filter } = usePage().props;
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    setDatas(rekapData);
  }, [rekapData]);
  const [onShowModal, setOnShowModal] = useState(false);
  const [triggeredData, setTriggeredData] = useState();
  const [triggeredType, setTriggeredType] = useState();
  const handleOnCreateShowClosed = (e) => {
    setOnShowModal(false);
    setTriggeredData();
  };
  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Action,
      {
        show: onShowModal,
        onClosed: handleOnCreateShowClosed,
        triggeredData,
        type: triggeredType
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: title }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink,
          localState,
          searchDate: true,
          searchBranch: server_filter.userAuthorized.canShowBranch,
          searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
        }
      ) }),
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
            searchDate: true,
            searchBranch: server_filter.userAuthorized.canShowBranch,
            searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      show == "rekap2" && // <div>rekap 2 show</div>
      /* @__PURE__ */ jsx(
        TableRekap,
        {
          setOnShowModal,
          setTriggeredData,
          datas,
          saldoAwalBulan
        }
      ),
      show == "rekapkasir" && /* @__PURE__ */ jsxs(Tabs, { defaultValue: "rekapkasir", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "rekapkasir", children: "Rekap 1" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "tunaimantri", children: "Tunai Mantri" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "rekapkasir", children: /* @__PURE__ */ jsx(
          TableRekapKasir,
          {
            setOnShowModal,
            setTriggeredData,
            setTriggeredType,
            datas
          }
        ) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "tunaimantri", children: /* @__PURE__ */ jsx(
          TunaiMantri,
          {
            setOnShowModal,
            setTriggeredData,
            setTriggeredType,
            datas
          }
        ) })
      ] })
    ] })
  ] });
};
export {
  RekapContent as default
};
