import { a as jsx, F as Fragment, j as jsxs } from "../ssr.mjs";
import React__default, { useState, useEffect, useMemo } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "./table-8d30c177.mjs";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import dayjs from "dayjs";
import "./badge-ad1cae46.mjs";
import { B as BargeStatus } from "./BargeStatus-bdf6dba2.mjs";
import "./button-bf6cf732.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "class-variance-authority";
import "@radix-ui/react-slot";
const TableRekap = ({ setOnShowModal, setTriggeredData, datas }) => {
  const [data, setData] = useState([]);
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
  const getLastValue = (info, accessorKey) => {
    var _a, _b, _c;
    const rows = info.table.getRowModel().rows;
    const type = (_b = (_a = rows[rows.length - 1]) == null ? void 0 : _a.original) == null ? void 0 : _b.type;
    if (type === "permantri") {
      return (_c = rows[rows.length - 1]) == null ? void 0 : _c.getValue(accessorKey);
    }
  };
  const columns = useMemo(
    () => [
      {
        header: "Kelompok",
        accessorKey: "kelompok",
        cell: ({ getValue, cell }) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-3", children: /* @__PURE__ */ jsx("div", { children: cell.row.original.type == "daily" ? getValue() : dayjs(cell.row.original.tanggal).format("DD-MM") }) })
      },
      {
        header: "Drop",
        accessorKey: "drop",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.drop })
      },
      {
        header: "Jumlah Drop",
        accessorKey: "total_drop",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          getLastValue(info, "total_drop");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: totals.total_drop });
        }
      },
      {
        header: "Storting",
        accessorKey: "storting",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.storting })
      },
      {
        header: "Jumlah Storting",
        accessorKey: "total_storting",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "total_storting");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.total_storting });
        }
      },
      {
        header: "Sirkulasi",
        accessorKey: "sirkulasi",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "sirkulasi");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.sirkulasi });
        }
      },
      {
        header: "Angsuran CM",
        accessorKey: "angsuran_cm",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.angsuran_cm })
      },
      {
        header: "Jumlah CM",
        accessorKey: "total_angsuran_cm",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "total_angsuran_cm");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.total_angsuran_cm });
        }
      },
      {
        header: "Saldo CM",
        accessorKey: "saldo_cm",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "saldo_cm");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.saldo_cm });
        }
      },
      {
        header: "Angsuran MB",
        accessorKey: "angsuran_mb",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.angsuran_mb })
      },
      {
        header: "Jumlah MB",
        accessorKey: "total_angsuran_mb",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "total_angsuran_mb");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.total_angsuran_mb });
        }
      },
      {
        header: "Saldo MB",
        accessorKey: "saldo_mb",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "saldo_mb");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.saldo_mb });
        }
      },
      {
        header: "Angsuran ML",
        accessorKey: "angsuran_ml",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => /* @__PURE__ */ jsx(FormatNumbering, { value: totals.angsuran_ml })
      },
      {
        header: "Jumlah ML",
        accessorKey: "total_angsuran_ml",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "total_angsuran_ml");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.total_angsuran_ml });
        }
      },
      {
        header: "Saldo ML",
        accessorKey: "saldo_ml",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() }),
        footer: (info) => {
          const lastValue = getLastValue(info, "saldo_ml");
          return /* @__PURE__ */ jsx(FormatNumbering, { value: lastValue ?? totals.saldo_ml });
        }
      },
      {
        header: "Kasir",
        accessorKey: "status_approve_kasir",
        cell: ({ getValue, cell }) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-3", children: /* @__PURE__ */ jsx("div", { children: getValue() ? dayjs(getValue()).format("DD-MM-YY") : "" }) })
      },
      {
        header: "Pimp",
        accessorKey: "status_approve_kepala",
        cell: ({ getValue, cell }) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-3", children: /* @__PURE__ */ jsx("div", { children: getValue() ? dayjs(getValue()).format("DD-MM-YY") : "" }) })
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
  TableRekap as default
};
