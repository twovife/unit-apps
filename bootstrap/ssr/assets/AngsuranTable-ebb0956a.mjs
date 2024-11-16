import { j as jsxs, a as jsx } from "../ssr.mjs";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-9786ffbe.mjs";
import dayjs from "dayjs";
import { B as Button } from "./button-bf6cf732.mjs";
import Action from "./Action-9de168ed.mjs";
import { B as Badge } from "./badge-ad1cae46.mjs";
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
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-a7cc8935.mjs";
import "axios";
import "./BayarAngsuran-55c0636e.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "./input-a726a844.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./JenisNasabah-ee724a10.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-bde03131.mjs";
import "./TextInput-11198f62.mjs";
import "./DeleteLoan-128b8268.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
const AngsuranTable = ({ dateOfWeek, datas }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);
  const calculateInstalment = (data2, keyToSum) => {
    const result = data2.reduce(
      (acc, item) => {
        var _a;
        return acc + parseInt(((_a = item.instalment[keyToSum]) == null ? void 0 : _a.total_nominal) ?? 0);
      },
      0
    );
    return result;
  };
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
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin", children: [
    /* @__PURE__ */ jsxs(Table, { className: "text-xs rounded-lg", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 left-0 z-10", children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-200", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "No" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nama Nasabah" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "NIK" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Note" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Alamat" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Kelompok" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Hari" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pnj Ke" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "X Angs" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Pinjaman" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Saldo Sebelumnya" }),
        dateOfWeek.map((day, i) => /* @__PURE__ */ jsx(
          TableHead,
          {
            className: "text-center border-x border-x-black",
            children: dayjs(day).format("DD-MM-YY")
          },
          i
        )),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Angsuran" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Saldo" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Note" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data ? data.map((row, i) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 17 + (dateOfWeek.length ?? 0), children: row.month }) }),
        row.data.map((subrow, i2) => /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: `${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}}`,
            children: [
              /* @__PURE__ */ jsx(TableCell, { onClick: () => handleRowClick(subrow.id), children: i2 + 1 }),
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
              /* @__PURE__ */ jsx(TableCell, { children: subrow.nama }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: subrow.nik }),
              /* @__PURE__ */ jsxs(TableCell, { className: "text-center", children: [
                subrow.lunas ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded", children: "Lunas" }) : "",
                subrow.status_pinjaman == "normal" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "cm" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "mb" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded", children: subrow.status_pinjaman }) : subrow.status_pinjaman == "ml" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-black border rounded", children: subrow.status_pinjaman }) : /* @__PURE__ */ jsx("div", { children: subrow.status_pinjaman }),
                subrow.notes !== null ? /* @__PURE__ */ jsx(Badge, { children: subrow.notes }) : ""
              ] }),
              /* @__PURE__ */ jsx(TableCell, { children: subrow.alamat }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: subrow.kelompok }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: subrow.hari }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: subrow.pinjaman_ke }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: subrow.x_angs }),
              /* @__PURE__ */ jsx(
                TableCell,
                {
                  className: `bg-slate-200 hover:bg-slate-100 border-x border-x-black ${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.pinjaman })
                }
              ),
              /* @__PURE__ */ jsx(
                TableCell,
                {
                  className: `bg-blue-300 hover:bg-blue-100 border-x border-x-black ${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.saldo_sebelumnya })
                }
              ),
              dateOfWeek.map((day, i3) => {
                var _a, _b;
                return /* @__PURE__ */ jsx(
                  TableCell,
                  {
                    className: `border-x border-x-black ${((_a = subrow.instalment[day]) == null ? void 0 : _a.is_active) ? "text-red-500 font-semibold" : ""}`,
                    children: /* @__PURE__ */ jsx(
                      FormatNumbering,
                      {
                        value: (_b = subrow.instalment[day]) == null ? void 0 : _b.total_nominal
                      }
                    )
                  },
                  i3
                );
              }),
              /* @__PURE__ */ jsx(
                TableCell,
                {
                  className: `bg-yellow-200 hover:bg-yellow-100 border-x border-x-black ${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.angsuran })
                }
              ),
              /* @__PURE__ */ jsx(
                TableCell,
                {
                  className: `bg-green-300 hover:bg-green-100 border-x border-x-black ${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.saldo })
                }
              ),
              /* @__PURE__ */ jsx(TableCell, { children: subrow.notes })
            ]
          },
          i2
        )),
        /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-100", children: [
          /* @__PURE__ */ jsx(TableCell, { className: "py-3", colSpan: 10, children: "ini nanti total" }),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: `bg-slate-200 hover:bg-slate-100 border-x border-x-black`,
              children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "pinjaman")
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: `bg-blue-300 hover:bg-blue-100 border-x border-x-black`,
              children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "saldo_sebelumnya")
                }
              )
            }
          ),
          dateOfWeek.map((day, i2) => /* @__PURE__ */ jsx(TableCell, { className: "border-x border-x-black", children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              value: calculateInstalment(row.data, day)
            }
          ) }, i2)),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: `bg-yellow-200 hover:bg-yellow-100 border-x border-x-black `,
              children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "angsuran")
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: `bg-green-300 hover:bg-green-100 border-x border-x-black `,
              children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "saldo")
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(TableCell, {})
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
