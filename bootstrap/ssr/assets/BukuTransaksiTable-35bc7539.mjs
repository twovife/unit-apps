import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering, f as TableFooter } from "./FormatNumbering-02c28a29.mjs";
import "dayjs";
import Action from "./Action-91f63003.mjs";
import { B as BargeStatus } from "./BargeStatus-e891d920.mjs";
import "./badge-3e44e85b.mjs";
import "./button-5b8f0147.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "./dialog-1c7227a2.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-1314102b.mjs";
import "./tabs-f70be525.mjs";
import "@radix-ui/react-tabs";
import "axios";
import "./Acc-f343f136.mjs";
import "./Loading-306ada45.mjs";
import "react-dom";
import "@headlessui/react";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "class-variance-authority";
import "react-currency-input-field";
import "./DropJadi-e9b0d685.mjs";
import "./Gagal-ff4d95fe.mjs";
import "./DetailTableOnAction-ce80c62c.mjs";
import "./RemoveLoan-6e165887.mjs";
import "./ReStatus-205e02f3.mjs";
import "./SelectList-8beaa241.mjs";
import "./ChangeDetail-b4731033.mjs";
import "./input-7eb6bb1b.mjs";
import "@radix-ui/react-slot";
const BukuTransaksiTable = ({ datas }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);
  const calculateTotals = (data2) => {
    return data2.reduce(
      (acc, item) => {
        acc.request += item.request || 0;
        acc.drop += item.drop || 0;
        acc.drop_jadi += item.drop_jadi || 0;
        acc.acc += item.acc || 0;
        return acc;
      },
      {
        request: 0,
        drop: 0,
        acc: 0,
        drop_jadi: 0
      }
    );
  };
  const totals = calculateTotals(data);
  const [onCreateShow, setOnCreateShow] = useState(false);
  const [actionData, setActionData] = useState();
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
    setActionData(e);
  };
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
    setActionData();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Action,
      {
        show: onCreateShow,
        onClosed: handleOnCreateShowClosed,
        triggeredData: actionData
      }
    ),
    /* @__PURE__ */ jsxs(Table, { className: "w-full mb-3 text-xs table-auto", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-gray-100", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, {}),
        /* @__PURE__ */ jsx(TableHead, { children: "Nasabah" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Drop" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data && data.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "w-0", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2", children: /* @__PURE__ */ jsx(
          BargeStatus,
          {
            value: item.status,
            onClick: () => handleOnCreateShowOpen(item)
          }
        ) }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: item.nama }),
          /* @__PURE__ */ jsx("div", { children: item.nik }),
          /* @__PURE__ */ jsx("div", { children: item.alamat })
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.drop_jadi }) })
      ] }, item.id)) }),
      /* @__PURE__ */ jsx(TableFooter, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, {}),
        /* @__PURE__ */ jsx(TableCell, { children: "Total Drop Jadi" }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: totals.drop_jadi }) })
      ] }) })
    ] })
  ] });
};
export {
  BukuTransaksiTable as default
};
