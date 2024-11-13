import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import React__default, { useState, useEffect, useMemo } from "react";
import { F as FormatNumbering, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./FormatNumbering-9786ffbe.mjs";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import "./button-bf6cf732.mjs";
import dayjs from "dayjs";
import { B as BadgeStatus } from "./BadgeStatus-34895a82.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./badge-ad1cae46.mjs";
const RiwayatPengajuan = ({ data }) => {
  const [customerData, setCustomerData] = useState([]);
  useEffect(() => {
    setCustomerData(data ?? []);
  }, [data]);
  useState();
  const columns = useMemo(
    () => [
      {
        accessorKey: "kelompok",
        header: "Kelompok",
        cell: ({ row, getValue }) => /* @__PURE__ */ jsxs("div", { children: [
          row.original.unit,
          " - Kel ",
          getValue()
        ] })
      },
      {
        accessorKey: "drop_date",
        header: "Tanggal Drop",
        cell: ({ row, getValue }) => /* @__PURE__ */ jsx("div", { children: dayjs(getValue()).format("DD-MM-YYYY") })
      },
      {
        accessorKey: "pinjaman",
        header: "Pinjaman",
        cell: ({ row, getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() })
      },
      {
        accessorKey: "lunas",
        header: "Lunas",
        cell: ({ row, getValue }) => /* @__PURE__ */ jsx("div", { children: getValue() ? "Lunas" : "Belum" })
      },
      {
        accessorKey: "status",
        header: "status",
        cell: ({ row, getValue }) => /* @__PURE__ */ jsx(BadgeStatus, { value: getValue() })
      }
    ],
    []
  );
  const table = useReactTable({
    data: customerData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  });
  return /* @__PURE__ */ jsxs(Table, { className: "w-full table-auto", children: [
    /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-gray-100", children: table.getHeaderGroups().map((headerGroup, key) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header, key2) => /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: flexRender(
      header.column.columnDef.header,
      header.getContext()
    ) }, key2)) }, key)) }),
    /* @__PURE__ */ jsx(TableBody, { children: table.getRowModel().rows.length ? table.getRowModel().rows.map((row, key) => /* @__PURE__ */ jsx(React__default.Fragment, { children: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(TableRow, { className: `text-center`, children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(
      TableCell,
      {
        className: `${cell.column.columnDef.className}`,
        children: flexRender(
          cell.column.columnDef.cell,
          cell.getContext()
        )
      },
      cell.id
    )) }, key) }) }, key)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: "4", children: "Belum Ada Catatan Pinjaman" }) }) })
  ] });
};
export {
  RiwayatPengajuan as default
};
