import { j as jsxs, a as jsx } from "../ssr.mjs";
import { M as MobileLayout } from "./MobileLayout-6b24b031.mjs";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { IoPersonAddSharp } from "react-icons/io5";
import { BiMoneyWithdraw, BiMoney, BiLaptop, BiExit } from "react-icons/bi";
import { LuBookPlus } from "react-icons/lu";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "./button-6facd6da.mjs";
import "@radix-ui/react-slot";
import "lucide-react";
const Index = ({ ...props }) => {
  const [loading, setloading] = useState(false);
  const unitAkses = props.auth.user.permissions.some(
    (item) => item.name === "unit"
  );
  return /* @__PURE__ */ jsxs(
    MobileLayout,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Buku Transaksi",
      loading,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Halaman Utama" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-6 flex-wrap", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              as: "a",
              href: route("mantriapps.create"),
              className: "w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",
              children: [
                /* @__PURE__ */ jsx(IoPersonAddSharp, { className: "text-5xl" }),
                /* @__PURE__ */ jsx("p", { className: "text-center leading-tight", children: "Pengajuan Pinjaman" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              as: "a",
              href: route("mantriapps.drop"),
              className: "w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",
              children: [
                /* @__PURE__ */ jsx(BiMoneyWithdraw, { className: "text-5xl" }),
                /* @__PURE__ */ jsx("p", { className: "text-center leading-tight", children: "Daftar Drop Mantri" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              as: "a",
              href: route("mantriapps.angsur"),
              className: "w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",
              children: [
                /* @__PURE__ */ jsx(BiMoney, { className: "text-5xl" }),
                /* @__PURE__ */ jsx("p", { className: "text-center leading-tight", children: "Daftar Storting" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              as: "a",
              href: route("mantriapps.ml"),
              className: "w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",
              children: [
                /* @__PURE__ */ jsx(BiMoney, { className: "text-5xl" }),
                /* @__PURE__ */ jsx("p", { className: "text-center leading-tight", children: "Buku ML" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              as: "a",
              href: route("mantriapps.transaksi"),
              className: "w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",
              children: [
                /* @__PURE__ */ jsx(LuBookPlus, { className: "text-5xl" }),
                /* @__PURE__ */ jsx("p", { className: "text-center leading-tight", children: "Buku Transaksi" })
              ]
            }
          ),
          unitAkses && /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("home"),
              className: "w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",
              children: [
                /* @__PURE__ */ jsx(BiLaptop, { className: "text-5xl" }),
                /* @__PURE__ */ jsx("p", { className: "text-center leading-tight", children: "Web Apps" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("logout"),
              method: "post",
              as: "button",
              className: "w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200",
              children: [
                /* @__PURE__ */ jsx(BiExit, { className: "text-5xl" }),
                /* @__PURE__ */ jsx("p", { className: "text-center leading-tight", children: "Logout" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-9", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-50/40 backdrop-blur rounded shadow border border-gray-200 p-2 w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-start items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Nama" }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: ":" }),
            /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: props.auth.user.employee.nama_karyawan })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-start items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Wilayah / Unit" }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: ":" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-[5]", children: [
              props.auth.user.employee.branch.wilayah,
              " /",
              " ",
              props.auth.user.employee.branch.unit
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-start items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Jabatan" }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: ":" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-[5]", children: [
              props.auth.user.employee.jabatan,
              " ",
              props.auth.user.employee.area != 0
            ] })
          ] })
        ] }) })
      ]
    }
  );
};
export {
  Index as default
};
