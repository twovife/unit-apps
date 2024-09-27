import { j as jsxs, a as jsx } from "../ssr.mjs";
import { L as Loading } from "./Loading-7f1a61e6.mjs";
import { B as Button } from "./button-6facd6da.mjs";
import { L as Label } from "./label-cecd7064.mjs";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
const Acc = ({ id, acc, onClosed }) => {
  const { data, setData, put, errors, processing, reset } = useForm({
    approved_nominal: "",
    status: "acc"
  });
  useEffect(() => {
    setData("approved_nominal", acc);
  }, [id, acc]);
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const accPinjaman = (e) => {
    e.preventDefault();
    put(route("transaction.action_buku_transaksi", id), {
      onFinish: () => {
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { className: "w-full", onSubmit: accPinjaman, children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx(Label, { htmlFor: "acc", children: "Nominal ACC" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
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
          value: data.approved_nominal,
          placeholder: "Inputkan angka tanpa sparator"
        }
      ),
      /* @__PURE__ */ jsx(Button, { onClick: accPinjaman, children: "ACC" })
    ] })
  ] });
};
export {
  Acc as default
};
