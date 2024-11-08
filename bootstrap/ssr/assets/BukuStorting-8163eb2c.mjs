import { j as jsxs, a as jsx } from "../ssr.mjs";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering, f as TableFooter } from "./FormatNumbering-23811b25.mjs";
import dayjs from "dayjs";
import { B as Button } from "./button-bf6cf732.mjs";
import Action from "./Action-834c5f6b.mjs";
import "./badge-ad1cae46.mjs";
import ApprovalAkhir from "./ApprovalAkhir-92788d9f.mjs";
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
import "./BayarAngsuran-d3c65c8c.mjs";
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
const BukuStorting = ({ dateOfWeek, datas, sirkulasi }) => {
  const [data, setData] = useState([]);
  const [sirkulasiAkhir, setSirkulasiAkhir] = useState({
    ml: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0
    },
    mb: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0
    },
    ccm: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0
    },
    cm: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0
    },
    all: {
      surkulasi: 0,
      angsuran: 0,
      saldo: 0
    }
  });
  useEffect(() => {
    if (datas) {
      const mapingStortingData = datas.map((item, index) => {
        const resutl = () => {
          const instalmentsSum = {};
          const sirkulasiAwalFunction = (params) => {
            switch (params.type) {
              case "ml":
                return (sirkulasi == null ? void 0 : sirkulasi.ml_amount) ?? 0;
              case "mb":
                return (sirkulasi == null ? void 0 : sirkulasi.mb_amount) ?? 0;
              case "cm":
                return (sirkulasi == null ? void 0 : sirkulasi.cm_amount) ?? 0;
              default:
                return params.data.reduce(
                  (acc, itm) => acc + itm.saldo_sebelumnya,
                  0
                );
            }
          };
          const sirkulasiAwal = sirkulasiAwalFunction(item);
          console.log(sirkulasiAwal);
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
          setSirkulasiAkhir((prevSirkulasiAkhir) => ({
            ...prevSirkulasiAkhir,
            [item.type]: {
              sirkulasi: sirkulasiAwal,
              angsuran: totalInstalment,
              saldo: sirkulasiAwal - totalInstalment
            }
          }));
          return {
            key: item.month,
            instalment: { ...instalmentsSum },
            sirkulasi: sirkulasiAwal,
            totalInstalment,
            sirkulasiAfter: sirkulasiAwal - totalInstalment,
            type: item.type
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
  const calculateTotals = (data2, keyToSum, sumAll) => {
    const result = data2.reduce((acc, item) => {
      if (sumAll && item.type === "normal") {
        return acc;
      }
      return acc + parseInt(item[keyToSum] ?? 0);
    }, 0);
    return result;
  };
  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const onClosedShowOpen = () => {
    setShow(false);
    setTriggeredId(null);
  };
  const [showApproval, setShowApproval] = useState(false);
  const onShowApproval = (id) => {
    setShowApproval(true);
  };
  const onClosedShowApproval = () => {
    setShowApproval(false);
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
        /* @__PURE__ */ jsx(
          TableCell,
          {
            className: `${row.type == "normal" ? "bg-green-200" : ""} `,
            children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.sirkulasi })
          }
        ),
        dateOfWeek.map((day, i2) => /* @__PURE__ */ jsx(TableCell, { className: `text-center`, children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.instalment[day] }) }, i2)),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.totalInstalment }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.sirkulasiAfter }) })
      ] }) }, i)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "a" }) }) }),
      /* @__PURE__ */ jsxs(TableFooter, { children: [
        /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { rowSpan: 2, className: "text-center", children: "Total" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              value: calculateTotals(data, "sirkulasi", true)
            }
          ) }),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: "text-center",
              colspan: dateOfWeek.length + 2
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(FormatNumbering, { value: calculateTotals(data, "sirkulasi") }) }),
          dateOfWeek.map((day, i) => /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(FormatNumbering, { value: calculateInstalment(data, day) }) }, i)),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              value: calculateTotals(data, "totalInstalment")
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              value: calculateTotals(data, "sirkulasiAfter")
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 mt-6", children: [
      /* @__PURE__ */ jsx("div", { children: "Approval Akhir Bulan" }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { onClick: onShowApproval, variant: "green", size: "sm", children: "Approval" }) })
    ] }),
    /* @__PURE__ */ jsx(
      ApprovalAkhir,
      {
        show: showApproval,
        onClosed: onClosedShowApproval,
        datas: sirkulasiAkhir
      }
    ),
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
