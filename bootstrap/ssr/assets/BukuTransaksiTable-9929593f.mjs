import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import React__default, { useState, useEffect, useMemo } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "./table-7c40bdcc.mjs";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { F as FormatNumbering } from "./FormatNumbering-4e9be903.mjs";
import dayjs from "dayjs";
import Action from "./Action-c657bdc9.mjs";
import { B as BargeStatus } from "./BargeStatus-66d07388.mjs";
import { B as BadgeStatus } from "./BadgeStatus-4fb5d883.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "./dialog-1c7227a2.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-1314102b.mjs";
import "./tabs-f70be525.mjs";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-fce34f28.mjs";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./DetailRiwayat-1ae006bf.mjs";
import "./Acc-ff1cd03b.mjs";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "react-currency-input-field";
import "./Tolak-03c98234.mjs";
import "./DropJadi-a79f5698.mjs";
import "./Gagal-a001072b.mjs";
import "./DetailTableOnAction-f4a7e802.mjs";
import "./badge-3e44e85b.mjs";
import "./RemoveLoan-622848d6.mjs";
import "./ReStatus-01ffcaad.mjs";
import "./SelectList-8beaa241.mjs";
import "./ChangeDetail-b6e55d98.mjs";
import "./input-7eb6bb1b.mjs";
const BukuTransaksiTable = ({ datas }) => {
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
  BukuTransaksiTable as default
};
