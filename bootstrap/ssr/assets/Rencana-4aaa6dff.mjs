import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-23811b25.mjs";
import dayjs from "dayjs";
import "./dialog-e17b5153.mjs";
import "./card-c2e72800.mjs";
import "./tabs-c148af71.mjs";
import "./button-6facd6da.mjs";
import "./badge-ad1cae46.mjs";
import "./Loading-7f1a61e6.mjs";
import "./label-cecd7064.mjs";
import "@inertiajs/react";
import "react-currency-input-field";
import { B as BargeStatus } from "./BargeStatus-463d8151.mjs";
import Approval from "./Approval-2d57b149.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tabs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-label";
import "./Checkbox-d7000d9c.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./input-a726a844.mjs";
const Rencana = ({ datas, dataTransaksi }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);
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
        z: true,
        staticData: dataTransaksi,
        triggeredData: actionData
      }
    ),
    /* @__PURE__ */ jsxs(Table, { className: "w-full table-auto", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-gray-100", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Action" }),
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
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          BargeStatus,
          {
            value: item.is_approved ? "acc" : "open",
            onClick: () => handleOnApproveShowOpen(item),
            size: "xs"
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
