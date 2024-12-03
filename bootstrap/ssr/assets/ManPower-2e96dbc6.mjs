import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { B as BadgeStatus } from "./BadgeStatus-34895a82.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
const ManPower = ({ datas, title }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Data Karyawan" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Nomor" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Nama Karaywan" }),
        /* @__PURE__ */ jsx(TableHead, { children: "NIK" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Alamat" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Jabatan" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Tanggal Masuk" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Date Resign" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: datas && datas.map((data, key) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: key + 1 }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(BadgeStatus, { value: data.isActive, children: data.isActive ? "Active" : "Non Active" }) })
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: data.employee_name }),
        /* @__PURE__ */ jsx(TableCell, { children: data.identity_id }),
        /* @__PURE__ */ jsx(TableCell, { children: data.address }),
        /* @__PURE__ */ jsx(TableCell, { children: data.employment }),
        /* @__PURE__ */ jsx(TableCell, { children: data.hire_date }),
        /* @__PURE__ */ jsx(TableCell, { children: data.resign_date })
      ] }, key)) })
    ] }) })
  ] });
};
export {
  ManPower as default
};
