import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import { useState, useEffect } from "react";
import "./Navbar-81236a1a.mjs";
import { Head } from "@inertiajs/react";
import "./SweetAlert-03f33995.mjs";
import "./Loading-306ada45.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { FilterIcon } from "lucide-react";
import "./card-1314102b.mjs";
import "./dialog-1c7227a2.mjs";
import "./tabs-f70be525.mjs";
import "./input-7eb6bb1b.mjs";
import "./label-143f493c.mjs";
import "react-currency-input-field";
import "./FormatNumbering-02c28a29.mjs";
import dayjs from "dayjs";
import BukuTransaksiTable from "./BukuTransaksiTable-35bc7539.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import "./badge-3e44e85b.mjs";
import "clsx";
import "postcss";
import { M as MobileLayout } from "./MobileLayout-2614584c.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SelectComponent-359a9ab7.mjs";
import "@radix-ui/react-icons";
import "react-icons/bi";
import "hamburger-react";
import "@radix-ui/react-dropdown-menu";
import "./utils-e5930d84.mjs";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tabs";
import "@radix-ui/react-label";
import "react-number-format";
import "./Action-91f63003.mjs";
import "axios";
import "./Acc-f343f136.mjs";
import "./DropJadi-e9b0d685.mjs";
import "./Gagal-ff4d95fe.mjs";
import "./DetailTableOnAction-ce80c62c.mjs";
import "./RemoveLoan-6e165887.mjs";
import "./ReStatus-205e02f3.mjs";
import "./SelectList-8beaa241.mjs";
import "./ChangeDetail-b4731033.mjs";
import "./BargeStatus-e891d920.mjs";
import "@radix-ui/react-popover";
const Index = ({ datas, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);
  const [nexOrPrevious, setNexOrPrevious] = useState(null);
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Buku Transaksi" }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("mobile_apps.transaksi"),
          localState: "mobile_apps_transaksi",
          searchMonth: true,
          searchHari: true,
          searchKelompok: auth.permissions.includes("can show kelompok"),
          searchGroupingBranch: auth.permissions.includes("can show branch"),
          nexOrPrevious,
          setNexOrPrevious
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
            urlLink: route("mobile_apps.transaksi"),
            localState: "mobile_apps_transaksi",
            searchMonth: true,
            searchHari: true,
            searchKelompok: auth.permissions.includes("can show kelompok"),
            searchGroupingBranch: auth.permissions.includes(
              "can show branch"
            ),
            nexOrPrevious,
            setNexOrPrevious
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: datas && datas.map((item, index) => {
      var _a;
      console.log(item);
      return /* @__PURE__ */ jsxs("div", { className: "mb-3 border rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-1 px-2 text-sm", children: [
          "Transaksi Tanggal :",
          dayjs((_a = item[0]) == null ? void 0 : _a.tanggal_drop).format("DD-MM-YYYY")
        ] }),
        /* @__PURE__ */ jsx(BukuTransaksiTable, { datas: item }, index)
      ] });
    }) })
  ] });
};
export {
  Index as default
};
