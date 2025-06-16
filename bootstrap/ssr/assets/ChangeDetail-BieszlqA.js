import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { N as NoEditOverlay } from "./NoEditOverlay-GIB1h_zq.js";
import { useState, useEffect } from "react";
import { u as useFrontEndPermission } from "./useFrontEndPermission-i32ufhQ2.js";
import "clsx";
import { B as Button } from "./button-StO46bLt.js";
import "./input-BH-oxdzi.js";
import { L as Label } from "./label-e-KMhPKP.js";
import { useForm } from "@inertiajs/react";
import CurrencyInput from "react-currency-input-field";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "tailwind-merge";
import "@radix-ui/react-label";
const ChangeDetail = ({ triggeredData, onClosed }) => {
  const { isUnit, isMantri, isPusat, isCreator } = useFrontEndPermission();
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
    isMantri && /* @__PURE__ */ jsx(NoEditOverlay, { value: "Hanya bisa dilakukan oleh Pimpinan / Staff" }),
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3 mb-1", children: [
      data.drop_langsung == "lama" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "request_nominal", children: "Pengajuan" }),
          /* @__PURE__ */ jsx(
            CurrencyInput,
            {
              className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
          /* @__PURE__ */ jsx(Label, { htmlFor: "approved_nominal", children: "Acc" }),
          /* @__PURE__ */ jsx(
            CurrencyInput,
            {
              className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
            className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
