import { j as jsxs, a as jsx } from "../ssr.mjs";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import dayjs from "dayjs";
import { B as Button } from "./button-e7ccf50f.mjs";
import Action from "./Action-dd15eaa0.mjs";
import "./badge-ad1cae46.mjs";
import { B as BargeStatus } from "./BargeStatus-070c40e0.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { X, Check } from "lucide-react";
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
import "./dialog-97d8ecd0.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-f356ad44.mjs";
import "axios";
import "./BayarAngsuran-7f0bb562.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "./input-22e7db4a.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./JenisNasabah-255e5d7a.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-aac95183.mjs";
import "./DeleteLoan-53e22530.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
const AngsuranTableMobile = ({ dateOfWeek, datas }) => {
  const [data, setData] = useState([]);
  const [filterName, setFilterName] = useState("");
  useEffect(() => {
    if (datas) {
      const filterData = (data2) => {
        return data2.map((monthData) => ({
          ...monthData,
          data: monthData.data.filter(
            (item2) => !(item2.lunas && !item2.is_paid) && (!filterName || item2.nama.toLowerCase().includes(filterName.toLowerCase()))
          )
        }));
      };
      const filteredData = filterData(datas);
      setData(filteredData);
    }
  }, [datas, filterName]);
  const calculateTotals = (data2, keyToSum) => {
    const result = data2.reduce(
      (acc2, item2) => acc2 + parseInt(item2[keyToSum] ?? 0),
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
  useState([]);
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-scroll h-[70vh] lg:h-[85vh] ", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full mb-2 lg:w-auto lg:max-w-60", children: [
      /* @__PURE__ */ jsx(
        TextInput,
        {
          type: "text",
          placeholder: "Cari Nama",
          value: filterName,
          onChange: (e) => setFilterName(e.target.value),
          className: "w-full text-xs"
        }
      ),
      /* @__PURE__ */ jsx(
        X,
        {
          className: "absolute right-0 w-auto h-5 text-gray-400 -translate-x-1/2 -translate-y-1/2 top-1/2",
          onClick: (e) => setFilterName("")
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Table, { className: "text-[0.6rem]/tight sm:text-xs/tight", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 left-0 z-10", children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-200", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nasabah" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Nominal" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data ? data.map((row, i) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 17 + (dateOfWeek.length ?? 0), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(BargeStatus, { value: row.type2 }),
          " ",
          /* @__PURE__ */ jsx("div", { children: row.month })
        ] }) }) }),
        row.data.map((subrow, i2) => /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: `${subrow.is_paid ? "bg-green-200 hover:bg-green-50" : ""}}`,
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "p-1", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center", children: [
                /* @__PURE__ */ jsx("div", { children: dayjs(subrow.tanggal_drop).format("DD-MM") }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "xs",
                    variant: subrow.lunas ? "green" : subrow.is_paid ? "blue" : "default",
                    onClick: () => onCreateShowOpen(subrow.id),
                    children: subrow.lunas ? /* @__PURE__ */ jsx(Check, { className: "text-xs" }) : subrow.is_paid ? "Paid" : "Pay"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxs(TableCell, { className: "p-1", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: subrow.nama }),
                /* @__PURE__ */ jsx("div", { children: subrow.nik }),
                /* @__PURE__ */ jsx("div", { className: "text-ellipsis overflow-hidden ...", children: subrow.alamat })
              ] }),
              /* @__PURE__ */ jsxs(TableCell, { className: "p-1 border-x border-x-black", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
                  /* @__PURE__ */ jsx("div", { children: "P" }),
                  /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.pinjaman })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6 border-b-2 border-b-black ", children: [
                  /* @__PURE__ */ jsx("div", { children: "A" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "italic whitespace-nowrap", children: /* @__PURE__ */ jsx(
                      FormatNumbering,
                      {
                        value: subrow.angs_today,
                        prefix: "(",
                        suffix: ")"
                      }
                    ) }),
                    /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.angsuran })
                  ] })
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
          /* @__PURE__ */ jsx(TableCell, { className: "py-3", colSpan: 2, children: "TOTAL" }),
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
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "italic whitespace-nowrap", children: /* @__PURE__ */ jsx(
                  FormatNumbering,
                  {
                    value: calculateTotals(row.data, "angs_today"),
                    prefix: "(",
                    suffix: ")"
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  FormatNumbering,
                  {
                    value: calculateTotals(row.data, "angsuran")
                  }
                )
              ] })
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
  AngsuranTableMobile as default
};
