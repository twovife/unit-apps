import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "./table-DgsbovDN.js";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import dayjs from "dayjs";
import { B as Button } from "./button-BgpGzoq1.js";
import xAction from "./Action22-DOWibcgQ.js";
import "./badge-BUI-akMw.js";
import ApprovalAkhir from "./ApprovalAkhir-Chz0aUyz.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./dialog-5zuHJd4f.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-DK9akThy.js";
import "axios";
import "./StatusPinjaman-C2n31N_V.js";
import "./BayarAngsuran-DFpNSCOA.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "./input-BH-oxdzi.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "@inertiajs/react";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./JenisNasabah-CaYZthxZ.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-BHWercwM.js";
import "./SelectList-DrCNDu1u.js";
import "./DeleteAngsuran-DSe599rI.js";
import "./TextInput-GCtCMl-T.js";
import "./useFrontEndPermission-i32ufhQ2.js";
import "./NoEditOverlay-GIB1h_zq.js";
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
              default:
                return params.data.reduce(
                  (acc, itm) => acc + itm.saldo_sebelumnya,
                  0
                );
            }
          };
          const sirkulasiAwal = sirkulasiAwalFunction(item);
          dateOfWeek.forEach((date) => {
            instalmentsSum[date] = 0;
          });
          let totalInstalment = 0;
          const totalPemutihan = item.data.reduce(
            (total, item2) => total + item2.pemutihanThisMonth,
            0
          );
          item.data.forEach((data2) => {
            dateOfWeek.forEach((date) => {
              if (data2.instalment[date] !== void 0) {
                totalInstalment += data2.instalment[date].total_nominal;
                instalmentsSum[date] += data2.instalment[date].total_nominal;
              }
            });
          });
          setSirkulasiAkhir((prevSirkulasiAkhir) => ({
            ...prevSirkulasiAkhir,
            [item.type]: {
              sirkulasi: sirkulasiAwal,
              angsuran: totalInstalment,
              saldo: sirkulasiAwal - (totalInstalment + totalPemutihan)
            }
          }));
          return {
            key: item.month,
            instalment: { ...instalmentsSum },
            sirkulasi: sirkulasiAwal,
            totalInstalment,
            totalPemutihan,
            sirkulasiAfter: sirkulasiAwal - (totalInstalment + totalPemutihan),
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
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "MD" }),
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
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: row.totalPemutihan }) }),
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
              colspan: dateOfWeek.length + 3
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
              value: calculateTotals(data, "totalPemutihan")
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
      xAction,
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
