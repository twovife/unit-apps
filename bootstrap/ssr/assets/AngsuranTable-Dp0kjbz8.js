import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CE18WwxH.js";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import dayjs from "dayjs";
import { B as Button } from "./button-Dbmjz33H.js";
import Action from "./Action-CfV2tfCT.js";
import { B as Badge } from "./badge-3Dzo-CJq.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./dialog-Bw81dxwx.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-B9cxsokM.js";
import "axios";
import "./StatusPinjaman-DqZsJoQG.js";
import "./BayarAngsuran-DboED__D.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./input-Dqw8mvVY.js";
import "react-currency-input-field";
import "./Checkbox-B46RnHis.js";
import "@inertiajs/react";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
import "./JenisNasabah-qcs_eUyi.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-D9GjR7fr.js";
import "./SelectList-B5y2fe3l.js";
import "./DeleteAngsuran-B3Umm9Ze.js";
import "./TextInput-MEjNo-OR.js";
import "./DeleteLoan-DcOzGDkz.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
import "sonner";
import "next-themes";
import "lucide-react";
import "./BadgeStatus-ulu71_5S.js";
import "./Pengajuan-vxslcii9.js";
import "./accordion-Bo7Hup67.js";
import "@radix-ui/react-accordion";
import "./WhiteOff-Bwx2jIIk.js";
import "./PengajuanLama-DsBYbMYv.js";
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
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "(MD)" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center border-x border-x-black", children: "Saldo" })
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
                  className: `bg-gray-50 hover:bg-gray-100 border-x border-x-black ${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.pemutihanThisMonth })
                }
              ),
              /* @__PURE__ */ jsx(
                TableCell,
                {
                  className: `bg-green-300 hover:bg-green-100 border-x border-x-black ${selectedId.includes(subrow.id) ? "bg-green-200 hover:bg-green-50" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: subrow.saldo })
                }
              )
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
              className: `bg-gray-50 hover:bg-gray-100 border-x border-x-black `,
              children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  value: calculateTotals(row.data, "pemutihanThisMonth")
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
          )
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
