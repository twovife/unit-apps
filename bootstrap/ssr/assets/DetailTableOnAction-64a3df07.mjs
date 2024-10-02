import { a as jsx, j as jsxs } from "../ssr.mjs";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-02c28a29.mjs";
import { B as Badge } from "./badge-3e44e85b.mjs";
import dayjs from "dayjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "class-variance-authority";
const DetailTableOnAction = ({ datas }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(datas);
  }, [datas]);
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nomor Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nama Nasabah" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Unit" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Kelompok" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tgl Drop" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pinj Ke" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acc" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop Jadi" })
    ] }) }),
    data && /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
      /* @__PURE__ */ jsx(TableCell, { children: dayjs(data.request_date).format("DD/MM") }),
      /* @__PURE__ */ jsx(TableCell, { children: data.nomor_pengajuan }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
        Badge,
        {
          variant: data.status == "open" ? "green" : data.status == "acc" ? "yellow" : data.status == "success" ? "default" : "destructive",
          children: data.status
        }
      ) }),
      /* @__PURE__ */ jsxs(TableCell, { className: "text-left", children: [
        /* @__PURE__ */ jsx("div", { children: data.nama }),
        /* @__PURE__ */ jsx("div", { children: data.nik }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: data.alamat })
      ] }),
      /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap", children: data.unit }),
      /* @__PURE__ */ jsx(TableCell, { children: data.kelompok }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.request }) }),
      /* @__PURE__ */ jsx(TableCell, { children: dayjs(data.tanggal_drop).format("DD/MM") }),
      /* @__PURE__ */ jsx(TableCell, { children: data.pinjaman_ke }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.acc }) }),
      /* @__PURE__ */ jsxs(TableCell, { children: [
        " ",
        /* @__PURE__ */ jsx(FormatNumbering, { value: data.acc })
      ] })
    ] }) })
  ] }) });
};
export {
  DetailTableOnAction as default
};