import { j as jsxs, a as jsx } from "../ssr.mjs";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering, f as TableFooter } from "./FormatNumbering-23811b25.mjs";
import dayjs from "dayjs";
import "./button-6facd6da.mjs";
import Action from "./Action-cef447a0.mjs";
import "./badge-ad1cae46.mjs";
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
import "./card-c2e72800.mjs";
import "axios";
import "./BayarAngsuran-a92717ae.mjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "./input-a726a844.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./JenisNasabah-80bf75ad.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-be0bed71.mjs";
import "./TextInput-11198f62.mjs";
const BukuStorting = ({ dateOfWeek, datas, sirkulasi }) => {
  const [data, setData] = useState([]);
  const [saldoSirkulas, setSaldoSirkulas] = useState(0);
  useEffect(() => {
    if (datas) {
      const mapingStortingData = datas.map((item, index) => {
        const resutl = () => {
          var _a;
          const instalmentsSum = {};
          const getMaxMinDateObjects = (data2) => {
            if (Array.isArray(data2)) {
              if (data2.length === 0) {
                return { max: {}, min: {} };
              } else if (data2.length === 1) {
                return { max: {}, min: data2[0] };
              } else {
                return data2.reduce(
                  (result, current) => {
                    const currentDate = new Date(current.date);
                    const minDate = new Date(result.min.date);
                    const maxDate = new Date(result.max.date);
                    if (currentDate < minDate)
                      result.min = current;
                    if (currentDate > maxDate)
                      result.max = current;
                    return result;
                  },
                  { max: data2[0], min: data2[0] }
                );
              }
            } else {
              return { max: {}, min: {} };
            }
          };
          const getSirkulasi = getMaxMinDateObjects(sirkulasi);
          setSaldoSirkulas(((_a = getSirkulasi.max) == null ? void 0 : _a.amount) ?? 0);
          const sirkulasiBefore = (item2) => {
            var _a2, _b, _c;
            switch (item2.type) {
              case "ml":
                return ((_a2 = getSirkulasi.min) == null ? void 0 : _a2.ml_amount) ?? 0;
              case "mb":
                return ((_b = getSirkulasi.min) == null ? void 0 : _b.mb_amount) ?? 0;
              case "cm":
                return ((_c = getSirkulasi.min) == null ? void 0 : _c.cm_amount) ?? 0;
              default:
                return item2.data.reduce(
                  (acc, item3) => acc + item3.saldo_sebelumnya,
                  0
                );
            }
          };
          const sirkulasiAwalOnDatabase = sirkulasiBefore(item);
          dateOfWeek.forEach((date) => {
            instalmentsSum[date] = 0;
          });
          let totalInstalment = 0;
          item.data.forEach((data2) => {
            dateOfWeek.forEach((date) => {
              if (data2.instalment[date] !== void 0) {
                totalInstalment += data2.instalment[date];
                instalmentsSum[date] += data2.instalment[date];
              }
            });
          });
          return {
            key: item.month,
            instalment: { ...instalmentsSum },
            sirkulasi: sirkulasiAwalOnDatabase,
            totalInstalment,
            sirkulasiAfter: sirkulasiAwalOnDatabase - totalInstalment
          };
        };
        return resutl();
      });
      setData(mapingStortingData);
    }
  }, [datas]);
  const calculateInstalment = (data2, keyToSum) => {
    const result = data2.reduce(
      (acc, item) => acc + parseInt(item.instalment[keyToSum] ?? 0),
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
  const onClosedShowOpen = () => {
    setShow(false);
    setTriggeredId(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin", children: [
    /* @__PURE__ */ jsxs(Table, { className: "text-xs rounded-lg", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 left-0 z-10", children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-200", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Bulan" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Sirkulasi" }),
        dateOfWeek.map((day, i) => /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: dayjs(day).format("DD-MM-YY") }, i)),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Angsuran" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Saldo" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data ? data.map((row, i) => /* @__PURE__ */ jsx(React__default.Fragment, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: row.key }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.sirkulasi }) }),
        dateOfWeek.map((day, i2) => /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.instalment[day] }) }, i2)),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.totalInstalment }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.sirkulasiAfter }) })
      ] }) }, i)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "a" }) }) }),
      /* @__PURE__ */ jsxs(TableFooter, { children: [
        /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { rowSpan: 2, className: "text-center", children: "Total" }),
          /* @__PURE__ */ jsx(TableCell, { rowSpan: 2, className: "text-center", children: /* @__PURE__ */ jsx(FormatNumbering, { value: calculateTotals(data, "sirkulasi") }) }),
          dateOfWeek.map((day, i) => /* @__PURE__ */ jsx(TableCell, { rowSpan: 2, className: "text-center", children: /* @__PURE__ */ jsx(FormatNumbering, { value: calculateInstalment(data, day) }) }, i)),
          /* @__PURE__ */ jsx(TableCell, { rowSpan: 2, className: "text-center", children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              value: calculateTotals(data, "totalInstalment")
            }
          ) }),
          calculateTotals(data, "sirkulasiAfter") == saldoSirkulas ? /* @__PURE__ */ jsx(TableCell, { rowSpan: 2, className: "text-center", children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              value: calculateTotals(data, "sirkulasiAfter")
            }
          ) }) : /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              value: calculateTotals(data, "sirkulasiAfter")
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(TableRow, { children: saldoSirkulas && calculateTotals(data, "sirkulasiAfter") != saldoSirkulas ? /* @__PURE__ */ jsx(TableCell, { className: "text-center bg-red-500", children: /* @__PURE__ */ jsx(FormatNumbering, { value: saldoSirkulas }) }) : "" })
      ] })
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
  BukuStorting as default
};
