import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CE18WwxH.js";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import dayjs from "dayjs";
import { B as BargeStatus } from "./BargeStatus-wWq6wWJ0.js";
import Approval from "./Approval-BmHfl7L1.js";
import { u as useFrontEndPermission } from "./useFrontEndPermission-i32ufhQ2.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "./badge-3Dzo-CJq.js";
import "class-variance-authority";
import "./button-Dbmjz33H.js";
import "@radix-ui/react-slot";
import "./Checkbox-B46RnHis.js";
import "./InputLabel-BhdXf1ED.js";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import "@headlessui/react";
import "./dialog-Bw81dxwx.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./input-Dqw8mvVY.js";
import "@inertiajs/react";
import "@radix-ui/react-label";
import "postcss";
import "react-currency-input-field";
const Rencana = ({ datas, dataTransaksi }) => {
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const { isUnit } = useFrontEndPermission();
  useEffect(() => {
    setData(datas);
    setCustomerData(dataTransaksi);
  }, [datas, dataTransaksi]);
  const [onApproveShow, setOnApproveShow] = useState(false);
  const [actionData, setActionData] = useState();
  const handleOnApproveShowOpen = (e) => {
    setOnApproveShow(true);
    setActionData(e);
  };
  const handleOnApproveShowClosed = (e) => {
    setOnApproveShow(false);
    setActionData();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Approval,
      {
        show: onApproveShow,
        onClosed: handleOnApproveShowClosed,
        staticData: customerData,
        triggeredDate: actionData,
        datas: data
      }
    ),
    /* @__PURE__ */ jsxs(Table, { className: "w-full table-auto", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-gray-100", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        isUnit && /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Action" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Kasbon" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Target" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Masuk" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Keluar" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Storting" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Baru" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Lama" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Rencana" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data.map((item, index) => /* @__PURE__ */ jsxs(TableRow, { className: `text-center`, children: [
        isUnit && /* @__PURE__ */ jsx(TableCell, { children: item.is_generated && /* @__PURE__ */ jsx(
          BargeStatus,
          {
            value: item.is_closed,
            onClick: () => handleOnApproveShowOpen(item.tanggal),
            size: "xs",
            children: "Action"
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { children: dayjs(item.tanggal).format("DD-MM-YYYY") }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.kasbon }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.target }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.masuk }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.keluar }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-blue-600 hover:bg-blue-100", children: /* @__PURE__ */ jsx(
          "a",
          {
            target: "_blank",
            href: route("pinjaman.index_pinjaman", {
              date: item.tanggal,
              kelompok: item.kelompok
            }),
            children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.storting })
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.drop }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.baru }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.lama }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.rencana }) })
      ] }, index)) })
    ] })
  ] });
};
export {
  Rencana as default
};
