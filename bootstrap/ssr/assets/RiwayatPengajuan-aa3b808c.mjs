import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import React__default, { useState, useEffect, useMemo } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import "./button-e7ccf50f.mjs";
import dayjs from "dayjs";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import "./badge-ad1cae46.mjs";
import { B as BargeStatus } from "./BargeStatus-070c40e0.mjs";
import axios from "axios";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import ModalShowAngsuran from "./ModalShowAngsuran-60a89e11.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-number-format";
import "react-dom";
import "@headlessui/react";
import "./dialog-97d8ecd0.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
const RiwayatPengajuan = ({ data }) => {
  const [customerData, setCustomerData] = useState([]);
  useEffect(() => {
    setCustomerData(data ?? []);
  }, [data]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [triggeredData, setTriggeredData] = useState(null);
  const handleExpandedTogled = async (id) => {
    setLoading(true);
    setShowModal(false);
    try {
      const response = await axios.post(
        route("transaction.get_instalment_nasabah", id)
      );
      setTriggeredData(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const onClosedModal = () => {
    setShowModal(false);
    setTriggeredData(null);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "kelompok",
        header: "Kelompok",
        cell: ({ row, getValue }) => /* @__PURE__ */ jsxs("div", { className: "text-start", children: [
          /* @__PURE__ */ jsx("div", { children: row.original.unit }),
          /* @__PURE__ */ jsxs("div", { children: [
            "Kel ",
            getValue()
          ] })
        ] })
      },
      {
        accessorKey: "drop_date",
        header: "Tgl Drop",
        cell: ({ row, getValue }) => /* @__PURE__ */ jsxs("div", { className: "text-start", children: [
          /* @__PURE__ */ jsx("div", { children: row.original.hari }),
          /* @__PURE__ */ jsx("div", { children: dayjs(getValue()).format("DD-MM-YY") })
        ] })
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
        cell: ({ row, getValue }) => /* @__PURE__ */ jsx(
          BargeStatus,
          {
            onClick: (e) => handleExpandedTogled(row.original.id),
            value: getValue()
          }
        )
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
    /* @__PURE__ */ jsx(Loading, { show: loading }),
    /* @__PURE__ */ jsx(
      ModalShowAngsuran,
      {
        show: showModal,
        triggeredData,
        onClosed: onClosedModal
      }
    ),
    /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-gray-100", children: table.getHeaderGroups().map((headerGroup, key) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header, key2) => /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: flexRender(
      header.column.columnDef.header,
      header.getContext()
    ) }, key2)) }, key)) }),
    /* @__PURE__ */ jsx(TableBody, { children: table.getRowModel().rows.length ? table.getRowModel().rows.map((row, key) => /* @__PURE__ */ jsx(React__default.Fragment, { children: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
      TableRow,
      {
        className: `text-center ${row.original.lunas ? "bg-green-100 hover:bg-green-50" : ""}`,
        children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(
          TableCell,
          {
            className: `${cell.column.columnDef.className}`,
            children: flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )
          },
          cell.id
        ))
      },
      key
    ) }) }, key)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: "5", children: "Belum Ada Catatan Pinjaman" }) }) })
  ] });
};
export {
  RiwayatPengajuan as default
};
