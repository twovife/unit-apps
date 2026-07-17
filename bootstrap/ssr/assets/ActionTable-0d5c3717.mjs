import { j as jsxs, a as jsx } from "../ssr.mjs";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import "./badge-ad1cae46.mjs";
import dayjs from "dayjs";
import "./button-e7ccf50f.mjs";
import { B as BadgeStatus } from "./BadgeStatus-1947fb26.mjs";
import { u as useIsMobile } from "./use-mobile-f8f7682a.mjs";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { T as Toaster } from "./sonner-0ca6cfec.mjs";
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
import "next-themes";
const ActionTable = ({ datas }) => {
  const isMobile = useIsMobile();
  const [data, setData] = useState({});
  useEffect(() => {
    setData(datas || {});
  }, [datas]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Toaster, {}),
    isMobile ? /* @__PURE__ */ jsx(MobileCardList, { data }) : /* @__PURE__ */ jsx(WebTable, { data })
  ] });
};
const WebTable = ({ data }) => {
  const sooners = (value) => {
    toast("Nik Telah Dicopy");
    navigator.clipboard.writeText(value);
  };
  return /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nomor Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nama Nasabah" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "NIK" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Alamat" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Unit" }),
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
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "NIK: ",
          data.nik
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-blue-500 hover:cursor-pointer",
            onClick: () => sooners(data.nik),
            children: /* @__PURE__ */ jsx(Copy, { className: "h-4" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(TableCell, { children: data.alamat }),
      /* @__PURE__ */ jsx(TableCell, { children: data.unit }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.request }) }),
      /* @__PURE__ */ jsx(TableCell, { children: dayjs(data.tanggal_drop).format("DD/MM") }),
      /* @__PURE__ */ jsx(TableCell, { children: data.kelompok }),
      /* @__PURE__ */ jsx(TableCell, { children: data.pinjaman_ke }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.acc }) }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.drop_jadi }) })
    ] }) })
  ] });
};
const MobileCardList = ({ data }) => {
  const sooners = (value) => {
    toast("Nik Telah Dicopy");
    navigator.clipboard.writeText(value);
  };
  if (!data || data.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "text-center text-muted", children: "Data tidak tersedia." });
  }
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "pb-4 border-b", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-red-500", children: data.nama }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "NIK: ",
          data.nik
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-blue-500", onClick: () => sooners(data.nik), children: /* @__PURE__ */ jsx(Copy, { className: "h-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Nomor Pengajuan:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: data.nomor_pengajuan })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Status:" }),
        /* @__PURE__ */ jsx(BadgeStatus, { value: data.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Alamat:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800 text-end", children: data.alamat })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Unit:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: data.unit })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Kelompok:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: data.kelompok })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Jumlah Permintaan:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: /* @__PURE__ */ jsx(FormatNumbering, { className: "text-center", value: data.request }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Tanggal Drop:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: dayjs(data.tanggal_drop).format("DD-MM-YYYY") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Pinjaman ke:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: data.pinjaman_ke })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "ACC:" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `font-bold ${data.acc === "Ya" ? "text-green-600" : "text-red-600"}`,
            children: /* @__PURE__ */ jsx(FormatNumbering, { className: "text-center", value: data.acc })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Drop Jadi:" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `font-bold ${data.drop_jadi === "Ya" ? "text-green-600" : "text-red-600"}`,
            children: /* @__PURE__ */ jsx(FormatNumbering, { className: "text-center", value: data.drop_jadi })
          }
        )
      ] })
    ] })
  ] }) });
};
export {
  ActionTable as default
};
