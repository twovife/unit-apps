import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import { useState, useEffect } from "react";
import "clsx";
import { B as Button } from "./button-bf6cf732.mjs";
import { I as Input } from "./input-a726a844.mjs";
import { L as Label } from "./label-cecd7064.mjs";
import { useForm } from "@inertiajs/react";
import CurrencyInput from "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "tailwind-merge";
import "@radix-ui/react-label";
const ChangeDetail = ({ triggeredData, onClosed }) => {
  const { data, setData, put, processing, reset, transform, errors } = useForm({
    request_date: "",
    drop_date: "",
    request_nominal: "",
    approved_nominal: "",
    nominal_drop: "",
    drop_langsung: ""
  });
  const [errorClient, setErrorClient] = useState(null);
  useEffect(() => {
    if (triggeredData) {
      setData((prevData) => ({
        ...prevData,
        request_date: triggeredData.request_date,
        drop_date: triggeredData.tanggal_drop,
        drop_langsung: triggeredData.drop_langsung,
        request_nominal: triggeredData.drop_langsung == "baru" ? triggeredData.drop_jadi : triggeredData.request,
        approved_nominal: triggeredData.acc,
        nominal_drop: triggeredData.drop_jadi
      }));
    }
  }, [triggeredData]);
  const onDateChange = (e) => {
    setErrorClient(null);
    const { name, value } = e.target;
    const isRequestDate = name === "request_date" && data.drop_date === value;
    const isDropDate = name === "drop_date" && data.request_date === value;
    const istrue = isRequestDate || isDropDate;
    const statusBefore = (triggeredData == null ? void 0 : triggeredData.status) == "gagal" || (triggeredData == null ? void 0 : triggeredData.status) == "tolak";
    if (istrue && statusBefore) {
      setErrorClient(
        "Status GAGAL / TOLAK tidak bisa diubah ke drop Langsung / Pengajuan"
      );
      return null;
    }
    setData((prevData) => ({
      ...prevData,
      [name]: value,
      drop_langsung: istrue ? "baru" : "lama",
      request_nominal: istrue ? null : triggeredData.drop_langsung == "baru" ? triggeredData.drop_jadi : triggeredData.request,
      approved_nominal: istrue ? null : triggeredData.drop_langsung == "baru" ? triggeredData.drop_jadi : triggeredData.acc,
      nominal_drop: istrue ? triggeredData.drop_langsung == "baru" ? triggeredData.drop_jadi : triggeredData.request : triggeredData.status == "success" ? triggeredData.drop_jadi : null
    }));
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const handleSubmit = (status) => {
    transform((data2) => ({
      ...data2,
      updateType: status
    }));
    put(route("transaction.updateEverything", triggeredData == null ? void 0 : triggeredData.nomor_pengajuan), {
      preventDefault: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsxs("div", { className: "mb-1 ", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "request_date", children: "Tanggal Pengajuan" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              onChange: onDateChange,
              value: data.request_date,
              id: "request_date",
              max: data.drop_date,
              required: true,
              name: "request_date"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "drop_date", children: "Tanggal Drop" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              onChange: onDateChange,
              value: data.drop_date,
              id: "drop_date",
              min: data.request_date,
              required: true,
              name: "drop_date"
            }
          )
        ] })
      ] }),
      errorClient ? /* @__PURE__ */ jsx("div", { className: "font-semibold text-red-500", children: errorClient }) : data.drop_langsung == "baru" ? /* @__PURE__ */ jsx("div", { className: "text-red-500 w-fullfont-semibold", children: "DROP BARU" }) : /* @__PURE__ */ jsx("div", { className: "w-full font-semibold text-red-500", children: "PENGAJUAN DROP" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-blue-500", children: "Perubahan Tanggal Mempengaruhi Perolehan Drop dan Rencana Drop" }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
        "Jika ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-blue-500", children: "Drop Baru" }),
        " ",
        "diubah ke",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-blue-500", children: "Drop Lama / Pengajuan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3 mb-1", children: [
      data.drop_langsung == "lama" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "request_nominal", children: "Nominal Pengajuan" }),
          /* @__PURE__ */ jsx(
            CurrencyInput,
            {
              className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              name: "request_nominal",
              allowDecimals: false,
              prefix: "Rp. ",
              min: 1,
              required: true,
              onValueChange: onHandleCurencyChange,
              value: data.request_nominal,
              placeholder: "Inputkan angka tanpa sparator"
            }
          )
        ] }),
        data.approved_nominal && /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "approved_nominal", children: "Nominal Acc" }),
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
          )
        ] })
      ] }),
      data.nominal_drop && /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "nominal_drop", children: "Drop Jadi" }),
        /* @__PURE__ */ jsx(
          CurrencyInput,
          {
            className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            name: "nominal_drop",
            allowDecimals: false,
            prefix: "Rp. ",
            min: 1,
            required: true,
            onValueChange: onHandleCurencyChange,
            value: data.nominal_drop,
            placeholder: "Inputkan angka tanpa sparator"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-blue-500", children: "Perubahan Nominal Mempengaruhi Perolehan Drop dan Rencana Drop" }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-yellow-500", children: "Reset Pinjaman akan menghilangkan semua data angsuran pada pinjaman ini" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Button, { onClick: () => handleSubmit("detailchange"), type: "submit", children: "Ubah" }),
      (triggeredData == null ? void 0 : triggeredData.drop_langsung) == "lama" && /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => handleSubmit("resetdata"),
          variant: "yellow",
          type: "submit",
          children: "Reset Pinjaman"
        }
      )
    ] })
  ] });
};
export {
  ChangeDetail as default
};
