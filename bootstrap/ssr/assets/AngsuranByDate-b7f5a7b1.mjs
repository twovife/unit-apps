import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, S as SearchComponent } from "./popover-657fe213.mjs";
import { usePage } from "@inertiajs/react";
import AngsuranByDateTable from "./AngsuranByDateTable-14aa6bd6.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { FilterIcon } from "lucide-react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-dc7360ed.mjs";
import "./input-a726a844.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "dayjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-popover";
import "./table-8d30c177.mjs";
import "./FormatNumbering-47cfa339.mjs";
import "react-number-format";
import "./Action22-cc1f1d12.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "./card-a7cc8935.mjs";
import "axios";
import "./StatusPinjaman-b6a160c0.mjs";
import "./badge-ad1cae46.mjs";
import "./BayarAngsuran-55c0636e.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "@radix-ui/react-slot";
import "./JenisNasabah-ee724a10.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-bde03131.mjs";
import "./TextInput-11198f62.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
const AngsuranByDate = ({
  headerName,
  datas,
  urlLink,
  localState,
  searchMonth,
  searchHari
}) => {
  const { auth, server_filter } = usePage().props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between flex-none shrink-0 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: headerName }),
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
              searchMonth,
              searchHari,
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
          searchMonth,
          searchHari,
          searchKelompok: server_filter.userAuthorized.canShowKelompok,
          searchBranch: server_filter.userAuthorized.canShowBranch,
          searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsx(AngsuranByDateTable, { datas }) })
  ] });
};
export {
  AngsuranByDate as default
};
