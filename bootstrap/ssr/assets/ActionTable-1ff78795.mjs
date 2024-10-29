import { a as jsx, j as jsxs } from "../ssr.mjs";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-23811b25.mjs";
import "./badge-ad1cae46.mjs";
import dayjs from "dayjs";
import "./button-bf6cf732.mjs";
import { B as BadgeStatus } from "./BadgeStatus-34895a82.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "class-variance-authority";
import "@radix-ui/react-slot";
const ActionTable = ({ datas }) => {
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
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "NIK" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Alamat" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Unit" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Kelompok" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tgl Drop" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Kelompok" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pinj Ke" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acc" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop Jadi" })
    ] }) }),
    data && /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
      /* @__PURE__ */ jsx(TableCell, { children: dayjs(data.request_date).format("DD/MM") }),
      /* @__PURE__ */ jsx(TableCell, { children: data.nomor_pengajuan }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(BadgeStatus, { value: data.status }) }),
      /* @__PURE__ */ jsx(TableCell, { children: data.nama }),
      /* @__PURE__ */ jsx(TableCell, { children: data.nik }),
      /* @__PURE__ */ jsx(TableCell, { children: data.alamat }),
      /* @__PURE__ */ jsx(TableCell, { children: data.unit }),
      /* @__PURE__ */ jsx(TableCell, { children: data.kelompok }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.request }) }),
      /* @__PURE__ */ jsx(TableCell, { children: dayjs(data.tanggal_drop).format("DD/MM") }),
      /* @__PURE__ */ jsx(TableCell, { children: data.kelompok }),
      /* @__PURE__ */ jsx(TableCell, { children: data.pinjaman_ke }),
      /* @__PURE__ */ jsx(TableCell, { children: data.acc }),
      /* @__PURE__ */ jsx(TableCell, { children: data.drop_jadi })
    ] }) })
  ] }) });
};
export {
  ActionTable as default
};
