import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import React__default, { useState, useEffect, useMemo } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "./table-8d30c177.mjs";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import dayjs from "dayjs";
import "./badge-ad1cae46.mjs";
import { B as BargeStatus } from "./BargeStatus-bdf6dba2.mjs";
import "./button-bf6cf732.mjs";
import { usePage } from "@inertiajs/react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "class-variance-authority";
import "@radix-ui/react-slot";
const TableRekapKasir = ({
  setOnShowModal,
  setTriggeredData,
  setTriggeredType,
  datas
}) => {
  const [data, setData] = useState([]);
  const { auth } = usePage().props;
  useEffect(() => {
    setData(datas);
  }, [datas]);
  const calculateTotals = (data2) => {
    return data2.reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        acc[key] = (acc[key] || 0) + (item[key] || 0);
      });
      return acc;
    }, {});
  };
  const totals = calculateTotals(data);
  const onClickStatusHandler = (triggeredData, type) => {
    setOnShowModal(true);
    setTriggeredData(triggeredData);
    setTriggeredType(type);
  };
  const columns = useMemo(
    () => [
      {
        header: "",
        accessorKey: "kelompok",
        cell: ({ getValue, cell }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { children: cell.row.original.type == "daily" ? getValue() : dayjs(cell.row.original.tanggal).format("DD-MM") }),
          auth.permissions.includes("can update") && /* @__PURE__ */ jsx(
            BargeStatus,
            {
              onClick: () => onClickStatusHandler(cell.row.original, 1),
              children: "Input"
            }
          )
        ] })
      },
      {
        header: "Kasbon",
        accessorKey: "kasbon",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.kasbon })
      },
      {
        header: "Storting",
        accessorKey: "storting",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.storting })
      },
      {
        header: "DO11%",
        accessorKey: "do11",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.do11 })
      },
      {
        header: "Deb",
        accessorKey: "debit",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.debit })
      },
      {
        header: "Drop",
        accessorKey: "drop",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.drop })
      },
      {
        header: "Transport",
        accessorKey: "transport",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.transport })
      },
      {
        header: "Kre",
        accessorKey: "kredit",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.kredit })
      },
      {
        header: "Tunai",
        accessorKey: "tunai",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.tunai })
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
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Table, { className: "w-full mb-3 table-auto", children: [
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
  ] }) });
};
export {
  TableRekapKasir as default
};
