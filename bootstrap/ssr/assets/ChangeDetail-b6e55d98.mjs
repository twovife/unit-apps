import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { L as Loading } from "./Loading-7f1a61e6.mjs";
import { useEffect } from "react";
import { s as showNominalByStatus } from "./utils-e5930d84.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { I as Input } from "./input-7eb6bb1b.mjs";
import { L as Label } from "./label-143f493c.mjs";
import { useForm } from "@inertiajs/react";
import CurrencyInput from "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
const ChangeDetail = ({ triggeredData, onClosed }) => {
  const { data, setData, put, processing, reset } = useForm({});
  useEffect(() => {
    if (triggeredData) {
      setData({
        request_date: triggeredData.request_date,
        drop_date: triggeredData.tanggal_drop,
        request_nominal: triggeredData.drop_langsung == "lama" ? triggeredData.request : triggeredData.drop_jadi,
        approved_nominal: triggeredData.drop_langsung == "lama" ? triggeredData.acc : triggeredData.drop_jadi,
        nominal_drop: triggeredData.drop_jadi
      });
    }
  }, [triggeredData]);
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const onChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("transaction.updateEverything", triggeredData == null ? void 0 : triggeredData.nomor_pengajuan), {
      preventDefault: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3 mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "request_date", children: "Tanggal Pengajuan" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "date",
            onChange,
            value: data.request_date,
            id: "request_date",
            required: true,
            name: "request_date"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "drop_date", children: "Tanggal Pengajuan" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "date",
            onChange,
            value: data.drop_date,
            id: "drop_date",
            required: true,
            name: "drop_date"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("small", { children: "Perubahan Tanggal Mempengaruhi Perolehan Drop dan Rencana Drop" }),
    data.request_date == data.drop_date ? /* @__PURE__ */ jsx("div", { className: "w-full mb-3 font-semibold text-red-500", children: "DROP BARU" }) : /* @__PURE__ */ jsx("div", { className: "w-full mb-3 font-semibold text-red-500", children: "PENGAJUAN DROP" }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3 mb-3", children: [
      (triggeredData == null ? void 0 : triggeredData.drop_langsung) == "lama" && /* @__PURE__ */ jsxs(Fragment, { children: [
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
        showNominalByStatus("acc", triggeredData == null ? void 0 : triggeredData.status) && /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
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
      showNominalByStatus("nominal_drop", triggeredData == null ? void 0 : triggeredData.status) && /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
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
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { type: "submit", children: "Ubah" }) })
  ] });
};
export {
  ChangeDetail as default
};
