import { j as jsxs, a as jsx } from "../ssr.mjs";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-02c28a29.mjs";
import dayjs from "dayjs";
import { B as Button } from "./button-5b8f0147.mjs";
import Action from "./Action-3bb53bb8.mjs";
import { B as Badge } from "./badge-3e44e85b.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./dialog-1c7227a2.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-1314102b.mjs";
import "axios";
import "./StatusPinjaman-fa220d17.mjs";
import "./BayarAngsuran-7852acca.mjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "./input-7eb6bb1b.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./Loading-306ada45.mjs";
import "react-dom";
import "@headlessui/react";
import "./JenisNasabah-5b778c2b.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-81d092c7.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-3a480ddc.mjs";
const AngsuranTable = ({ dateOfWeek, datas }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (datas) {
      const filterData = (data2) => {
        return data2.map((monthData) => ({
          ...monthData,
          data: monthData.data.filter((item) => !(item.lunas && !item.is_paid))
        }));
      };
      const filteredData = filterData(datas);
      setData(filteredData);
    }
  }, [datas]);
  const calculateTotals = (data2, keyToSum) => {
    const result = data2.reduce(
      (acc, item) => acc + parseInt(item[keyToSum] ?? 0),
      0
    );
    return result;
  };
  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const onCreateShowOpen = (id) => {
    setTriggeredId(id);
    setShow(true);
  };
  const onClosedShowOpen = () => {
    setShow(false);
    setTriggeredId(null);
  };
  const [selectedId, setSelectedId] = useState([]);
  const handleRowClick = (id) => {
    setSelectedId((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-auto h-[70vh] lg:h-[85vh] scrollbar-thin", children: [
    /* @__PURE__ */ jsxs(Table, { className: "text-xs rounded-lg", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 left-0 z-10", children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-200", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "No" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nasabah" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Note" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Nominal" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data ? data.map((row, i) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 17 + (dateOfWeek.length ?? 0), children: row.month }) }),
        row.data.map((subrow, i2) => /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: `${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}}`,
            children: [
              /* @__PURE__ */ jsx(TableCell, { onClick: () => handleRowClick(subrow.id), children: i2 + 1 }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center", children: [
                /* @__PURE__ */ jsx("div", { children: dayjs(subrow.tanggal_drop).format("DD-MM") }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "xs",
                    variant: subrow.lunas ? "green" : subrow.is_paid ? "blue" : "default",
                    onClick: () => onCreateShowOpen(subrow.id),
                    children: subrow.lunas ? "Lunas" : subrow.is_paid ? "Dibayar" : "Bayar"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: subrow.nama }),
                /* @__PURE__ */ jsx("div", { children: subrow.nik }),
                /* @__PURE__ */ jsx("div", { children: subrow.alamat })
              ] }),
              /* @__PURE__ */ jsxs(TableCell, { className: "text-center", children: [
                subrow.status_pinjaman == "normal" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "cm" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "mb" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "ml" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-black border rounded", children: subrow.status_pinjaman }) : /* @__PURE__ */ jsx("div", { children: subrow.status_pinjaman }),
                subrow.notes !== null ? /* @__PURE__ */ jsx(Badge, { children: subrow.notes }) : ""
              ] }),
              /* @__PURE__ */ jsxs(TableCell, { className: "border-x border-x-black", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
                  /* @__PURE__ */ jsx("div", { children: "P" }),
                  /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.pinjaman })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6 border-b-2 border-b-black ", children: [
                  /* @__PURE__ */ jsx("div", { children: "A" }),
                  /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.angsuran })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
                  /* @__PURE__ */ jsx("div", { children: "S" }),
                  /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.saldo })
                ] })
              ] })
            ]
          },
          i2
        )),
        /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-100", children: [
          /* @__PURE__ */ jsx(TableCell, { className: "py-3", colSpan: 4, children: "TOTAL" }),
          /* @__PURE__ */ jsxs(TableCell, { className: "border-x border-x-black", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
              /* @__PURE__ */ jsx("div", { children: "P" }),
              /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "pinjaman")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6 border-b-2 border-b-black ", children: [
              /* @__PURE__ */ jsx("div", { children: "A" }),
              /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "angsuran")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
              /* @__PURE__ */ jsx("div", { children: "S" }),
              /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "saldo")
                }
              )
            ] })
          ] })
        ] })
      ] }, i)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "a" }) }) })
    ] }),
    /* @__PURE__ */ jsx(
      Action,
      {
        datas: data,
        show,
        onClosed: onClosedShowOpen,
        triggeredId
      }
    )
  ] });
};
export {
  AngsuranTable as default
};
