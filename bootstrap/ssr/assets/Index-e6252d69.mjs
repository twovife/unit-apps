import { j as jsxs, a as jsx } from "../ssr.mjs";
import { B as BargeStatus } from "./BargeStatus-66d07388.mjs";
import { F as FormatNumbering } from "./FormatNumbering-4e9be903.mjs";
import { S as SearchComponent } from "./SearchComponent-0cdecced.mjs";
import { M as MobileLayout } from "./MobileLayout-e5e11ef2.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-1314102b.mjs";
import { D as Dialog } from "./dialog-1c7227a2.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-4d729ade.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-7c40bdcc.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-f70be525.mjs";
import dayjs from "dayjs";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import Action from "./Action-05acb07f.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./badge-3e44e85b.mjs";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "./SelectComponent-359a9ab7.mjs";
import "./input-7eb6bb1b.mjs";
import "@radix-ui/react-icons";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-561e2ee3.mjs";
import "@tanstack/react-table";
import "./DetailRiwayat-fae5eaf1.mjs";
import "./Acc-ff1cd03b.mjs";
import "react-currency-input-field";
import "./Tolak-4a7c0e59.mjs";
import "./DropJadi-a79f5698.mjs";
import "./Gagal-2810684e.mjs";
const Index = ({ data, select_kelompok, select_branch, ...props }) => {
  const selectedDay = props.server_filter.date;
  dayjs(selectedDay).format("YYYY-MM-DD");
  dayjs(selectedDay).subtract(1, "week").format("YYYY-MM-DD");
  const [actionPengajuan, setActionPengajuan] = useState(false);
  const [actionPengajuanTriggeredData, setActionPengajuanTriggeredData] = useState();
  const onOpenActionPengajuan = (id) => {
    setActionPengajuan(true);
    setActionPengajuanTriggeredData(id);
  };
  const onClosedActionPengajuan = () => {
    setActionPengajuan(false);
    setActionPengajuanTriggeredData();
  };
  return /* @__PURE__ */ jsxs(MobileLayout, { children: [
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: 0, className: "w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsx(TabsList, { className: "grid w-auto grid-cols-2", children: data.map((header, key) => /* @__PURE__ */ jsx(TabsTrigger, { value: key, children: dayjs(header.date).format("DD-MM-YYYY") }, key)) }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:inline-block", children: /* @__PURE__ */ jsx(
          SearchComponent,
          {
            urlLink: route("mobile_apps.pengajuan.index_pengajuan"),
            searchDate: true,
            labelDate: "Pengajuan",
            searchGroupingBranch: select_branch,
            searchKelompok: select_kelompok
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "lg:hidden", children: /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
            /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
            "Filter"
          ] }) }),
          /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
            SearchComponent,
            {
              urlLink: route("mobile_apps.pengajuan.index_pengajuan"),
              searchDate: true,
              labelDate: "Pengajuan",
              searchGroupingBranch: select_branch,
              searchKelompok: select_kelompok
            }
          ) })
        ] }) })
      ] }),
      data.length ? data.map((item, key) => /* @__PURE__ */ jsx(TabsContent, { value: key, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: item.date == selectedDay ? "Pengajuan Sekarang" : "Pengajuan Sebelumnya" }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              "Pengajuan Tanggal :",
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-red-500", children: [
                " ",
                dayjs(item.date).format("dddd"),
                " ,"
              ] }),
              " ",
              dayjs(item.date).format("DD MMMM YYYY")
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              "Kelompok ",
              props.server_filter.kelompok ?? null
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-auto scrollbar-thin", children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pengajuan" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acc" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Jadi" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: item.data.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              /* @__PURE__ */ jsxs("p", { className: "whitespace-nowrap", children: [
                row.nama,
                " "
              ] }),
              /* @__PURE__ */ jsx("p", { children: row.alamat })
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(
              BargeStatus,
              {
                onClick: () => onOpenActionPengajuan(row),
                value: row.status
              }
            ) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              FormatNumbering,
              {
                className: "mb-0.5 text-center",
                value: row.drop
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              FormatNumbering,
              {
                className: "mb-0.5 text-center",
                value: row.request
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              FormatNumbering,
              {
                className: "mb-0.5 text-center",
                value: row.acc
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              FormatNumbering,
              {
                className: "mb-0.5 text-center",
                value: row.drop_jadi
              }
            ) })
          ] })) })
        ] }) }) })
      ] }) })) : "Tidak Ada data dibulan ini"
    ] }),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: actionPengajuan,
        onOpenChange: (open) => open ? "" : onClosedActionPengajuan(),
        children: /* @__PURE__ */ jsx(
          Action,
          {
            show: actionPengajuan,
            onClosed: onClosedActionPengajuan,
            triggeredData: actionPengajuanTriggeredData
          }
        )
      }
    )
  ] });
};
export {
  Index as default
};
