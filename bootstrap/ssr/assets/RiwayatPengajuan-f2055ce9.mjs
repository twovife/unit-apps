import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import React__default, { useState, useEffect, useMemo } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./FormatNumbering-1920aef2.mjs";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { B as Button } from "./button-6facd6da.mjs";
import { Play } from "lucide-react";
import DetailRiwayat from "./DetailRiwayat-1f0bb428.mjs";
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
import "dayjs";
const RiwayatPengajuan = ({ data }) => {
  const [customerData, setCustomerData] = useState([]);
  useEffect(() => {
    setCustomerData(data);
  }, [data]);
  const [expanded, setExpanded] = useState();
  const handleExpandedTogled = (value) => {
    setExpanded((prevId) => prevId === value ? null : value);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "unit",
        header: "unit",
        type: "show",
        cell: ({ row, getValue }) => getValue()
      },
      {
        accessorKey: "kelompok",
        header: "Kelompok",
        cell: ({ row, getValue }) => getValue()
      },
      {
        accessorKey: "jumlah_pengajuan",
        header: "TTL Pengajuan",
        cell: ({ row, getValue }) => getValue()
      },
      {
        accessorKey: "jumlah_pinjaman",
        header: "TTL Pinjaman",
        cell: ({ row, getValue }) => getValue()
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
    /* @__PURE__ */ jsx(TableBody, { children: table.getRowModel().rows.length ? table.getRowModel().rows.map((row, key) => /* @__PURE__ */ jsx(React__default.Fragment, { children: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        TableRow,
        {
          className: `${expanded == row.original.id ? "border-b-0" : ""} text-center`,
          children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(
            TableCell,
            {
              className: `${cell.column.columnDef.className}`,
              children: cell.column.columnDef.type == "show" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => handleExpandedTogled(cell.row.original.id),
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: `${expanded == row.original.id ? "rotate-90 text-green-700 bg-gradient-to-br from-green-50 to-green-100" : ""}`,
                    children: /* @__PURE__ */ jsx(
                      Play,
                      {
                        className: `h-4 w-auto transition-all duration-150`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("div", { children: flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                ) })
              ] }) : flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )
            },
            cell.id
          ))
        },
        key
      ),
      expanded == row.original.id && /* @__PURE__ */ jsx(
        TableRow,
        {
          className: "p-0 hover:bg-transparent",
          children: /* @__PURE__ */ jsx(TableCell, { colSpan: "4", className: "p-0 border-0", children: /* @__PURE__ */ jsx(DetailRiwayat, { detailData: row.original.pinjaman }) })
        },
        `newrow${key}`
      )
    ] }) }, key)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: "4", children: "Belum Ada Catatan Pinjaman" }) }) })
  ] });
};
export {
  RiwayatPengajuan as default
};
