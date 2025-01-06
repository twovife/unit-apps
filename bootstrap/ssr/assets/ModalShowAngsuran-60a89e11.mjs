import { a as jsx, j as jsxs } from "../ssr.mjs";
import { useState, useEffect } from "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-97d8ecd0.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import dayjs from "dayjs";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import { B as BargeStatus } from "./BargeStatus-070c40e0.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "./button-e7ccf50f.mjs";
import "@radix-ui/react-slot";
const ModalShowAngsuran = ({ show = false, triggeredData, onClosed }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (triggeredData) {
      setData(triggeredData);
    } else {
      setData([]);
    }
  }, [triggeredData]);
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[90vw] h-[80vh] lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { children: "Pengajuan Pinjaman Baru" }) }),
    /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsx("div", { className: "overflow-auto max-h-[70vh] scrollbar-thin", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "No" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Angsuran" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Saldo" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        data && data.map((item, key) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: key + 1 }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: dayjs(item.transaction_date).format("DD-MM-YYYY") }),
          /* @__PURE__ */ jsx(
            TableCell,
            {
              className: item.dana_titipan ? "text-red-500" : "",
              children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.nominal })
            }
          ),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.saldo }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(BargeStatus, { value: item.status }) })
        ] })),
        data.length < 1 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { className: "text-center", colspan: "5", children: "Belum Ada Angsuran" }) })
      ] })
    ] }) }) })
  ] }) });
};
export {
  ModalShowAngsuran as default
};
