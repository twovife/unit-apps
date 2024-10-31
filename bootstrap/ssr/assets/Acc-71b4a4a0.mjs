import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import { B as Badge } from "./badge-ad1cae46.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { L as Label } from "./label-cecd7064.mjs";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const Acc = ({ id, acc, onClosed, triggeredData }) => {
  const { data, setData, put, errors, processing, reset, transform } = useForm({
    approved_nominal: "",
    status: "",
    drop: ""
  });
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      approved_nominal: (triggeredData == null ? void 0 : triggeredData.acc) ?? (triggeredData == null ? void 0 : triggeredData.request),
      drop: triggeredData == null ? void 0 : triggeredData.acc
    }));
  }, [id, acc]);
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const accPinjaman = (status) => {
    transform((data2) => ({
      ...data2,
      status
    }));
    put(route("transaction.action_buku_transaksi", id), {
      onFinish: () => {
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { className: "w-full", onSubmit: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "open" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "approved_nominal", children: "Nominal ACC" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx(
          CurrencyInput,
          {
            className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            name: "approved_nominal",
            allowDecimals: false,
            prefix: "Rp. ",
            min: 1,
            required: true,
            onValueChange: onHandleCurencyChange,
            value: data.approved_nominal,
            placeholder: "Inputkan angka tanpa sparator"
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "green", onClick: () => accPinjaman("acc"), children: "ACC" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            onClick: () => accPinjaman("tolak"),
            children: "Tolak"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs(Badge, { size: "lg", variant: "green", children: [
      "Status Pengajuan = ",
      triggeredData == null ? void 0 : triggeredData.status,
      ", Pada Tanggal",
      triggeredData == null ? void 0 : triggeredData.check_date
    ] }) }),
    (triggeredData == null ? void 0 : triggeredData.status) !== "open" && /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "acc" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "drop", className: "whitespace-normal", children: "Drop Jadi" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx(
          CurrencyInput,
          {
            className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            name: "drop",
            allowDecimals: false,
            prefix: "Rp. ",
            min: 1,
            required: true,
            onValueChange: onHandleCurencyChange,
            value: data.drop,
            placeholder: "Inputkan angka tanpa sparator"
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "green", onClick: () => accPinjaman("success"), children: "DROP" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            onClick: () => accPinjaman("gagal"),
            children: "GAGAL"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs(Badge, { size: "lg", variant: "green", children: [
      "Status Pengajuan = ",
      triggeredData == null ? void 0 : triggeredData.status,
      ", Tanggal",
      triggeredData == null ? void 0 : triggeredData.check_date
    ] }) })
  ] });
};
export {
  Acc as default
};
