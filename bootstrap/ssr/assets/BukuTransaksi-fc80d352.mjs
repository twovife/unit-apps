import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import React__default, { useState, useEffect, useMemo } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "./table-8d30c177.mjs";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import dayjs from "dayjs";
import Action from "./Action-b50d2be1.mjs";
import { B as BargeStatus } from "./BargeStatus-bdf6dba2.mjs";
import { B as BadgeStatus } from "./BadgeStatus-34895a82.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./accordion-01051f31.mjs";
import "@radix-ui/react-accordion";
import "./card-a7cc8935.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-cd941718.mjs";
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "./Acc-355e9173.mjs";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "react-currency-input-field";
import "./ActionTable-3a75c53b.mjs";
import "./RemoveLoan-5406e98a.mjs";
import "./ChangeDetail-94619fb8.mjs";
import "./input-a726a844.mjs";
const BukuTransaksi = ({ datas }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);
  const calculateTotals = (data2) => {
    return data2.reduce(
      (acc, item) => {
        acc.request += item.request || 0;
        acc.drop += item.drop || 0;
        acc.drop_jadi += item.drop_jadi || 0;
        acc.acc += item.acc || 0;
        return acc;
      },
      {
        request: 0,
        drop: 0,
        acc: 0,
        drop_jadi: 0
      }
    );
  };
  const totals = calculateTotals(data);
  const columns = useMemo(
    () => [
      {
        header: "Tgl Drop",
        accessorKey: "tanggal_drop",
        cell: ({ getValue, cell }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-1 lg:gap-3 lg:flex-row", children: [
          /* @__PURE__ */ jsx("div", { className: "whitespace-nowrap", children: dayjs(getValue()).format("DD-MM-YY") }),
          /* @__PURE__ */ jsx(BadgeStatus, { value: cell.row.original.drop_langsung })
        ] })
      },
      {
        header: "Status",
        type: "show",
        accessorKey: "status",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Nama",
        accessorKey: "nama",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Alamat",
        accessorKey: "alamat",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "No Angt",
        accessorKey: "nomor_anggota",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Pinj ke",
        accessorKey: "pinjaman_ke",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Drop",
        accessorKey: "drop",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.drop })
      },
      {
        header: "Pengajuan",
        accessorKey: "request",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.request })
      },
      {
        header: "Acc",
        accessorKey: "acc",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.acc })
      },
      {
        header: "Drop Jadi",
        accessorKey: "drop_jadi",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.drop_jadi })
      }
    ],
    [totals]
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  });
  const [onCreateShow, setOnCreateShow] = useState(false);
  const [actionData, setActionData] = useState();
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
    setActionData(e);
  };
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
    setActionData();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Action,
      {
        show: onCreateShow,
        onClosed: handleOnCreateShowClosed,
        triggeredData: actionData
      }
    ),
    /* @__PURE__ */ jsxs(Table, { className: "w-full mb-3 text-xs table-auto", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-gray-100", children: table.getHeaderGroups().map((headerGroup, key) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header, key2) => /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: flexRender(
        header.column.columnDef.header,
        header.getContext()
      ) }, key2)) }, key)) }),
      /* @__PURE__ */ jsx(TableBody, { children: table.getRowModel().rows.length ? table.getRowModel().rows.map((row, key) => /* @__PURE__ */ jsx(React__default.Fragment, { children: /* @__PURE__ */ jsx(TableRow, { className: `text-center`, children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(
        TableCell,
        {
          className: `${cell.column.columnDef.className}`,
          children: cell.column.columnDef.type == "show" ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2", children: /* @__PURE__ */ jsx(
            BargeStatus,
            {
              value: cell.row.original.status,
              onClick: () => handleOnCreateShowOpen(cell.row.original)
            }
          ) }) : flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          )
        },
        cell.id
      )) }, key) }, key)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: "4", children: "Belum Ada Catatan Pinjaman" }) }) }),
      /* @__PURE__ */ jsx(TableFooter, { children: table.getFooterGroups().map((headerGroup) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header) => {
        return /* @__PURE__ */ jsx(
          TableHead,
          {
            className: "text-center text-black bg-gray-100",
            children: flexRender(
              header.column.columnDef.footer,
              header.getContext()
            )
          },
          header.id
        );
      }) }, headerGroup.id)) })
    ] })
  ] });
};
export {
  BukuTransaksi as default
};
