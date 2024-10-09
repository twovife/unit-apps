import { j as jsxs, a as jsx } from "../ssr.mjs";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-02c28a29.mjs";
import dayjs from "dayjs";
import { B as Button } from "./button-5b8f0147.mjs";
import Action from "./Action-51f7a042.mjs";
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
import "./BayarAngsuran-f8f7c907.mjs";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "./input-7eb6bb1b.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./Loading-306ada45.mjs";
import "react-dom";
import "@headlessui/react";
import "./JenisNasabah-c91b6df3.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-92011ff6.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-27fe75b1.mjs";
const Angsuran = ({ datas }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
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
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-auto h-[70vh] lg:h-[85vh]", children: [
    /* @__PURE__ */ jsxs(Table, { className: "text-xs rounded-lg", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 left-0 z-10", children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-200", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nama Nasabah" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Note" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Pinjaman" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data ? data.map((row, i) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 16, children: row.month }) }),
        row.data.map((subrow, i2) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx("div", { children: dayjs(subrow.tanggal_drop).format("DD-MM") }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              Button,
              {
                size: "xs",
                onClick: () => onCreateShowOpen(subrow.id),
                children: "Pay"
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            /* @__PURE__ */ jsx("div", { children: subrow.nama }),
            /* @__PURE__ */ jsx("div", { children: subrow.nik }),
            /* @__PURE__ */ jsx("div", { children: subrow.alamat })
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "flex flex-row items-center justify-center text-center", children: [
            subrow.lunas ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded", children: "Lunas" }) : "",
            subrow.status_pinjaman == "normal" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "cm" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "mb" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "ml" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-black border rounded", children: subrow.status_pinjaman }) : /* @__PURE__ */ jsx("div", { children: subrow.status_pinjaman }),
            subrow.notes !== null ? /* @__PURE__ */ jsx(Badge, { children: subrow.notes }) : ""
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "border-x border-x-black", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
              /* @__PURE__ */ jsx("div", { children: "P" }),
              /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.pinjaman })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
              /* @__PURE__ */ jsx("div", { children: "A" }),
              /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.angsuran })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
              /* @__PURE__ */ jsx("div", { children: "S" }),
              /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.saldo })
            ] })
          ] })
        ] }, i2)),
        /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-100", children: [
          /* @__PURE__ */ jsx(TableCell, { className: "py-3", colSpan: 3, children: /* @__PURE__ */ jsx("b", { children: "Total" }) }),
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
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
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
  Angsuran as default
};
