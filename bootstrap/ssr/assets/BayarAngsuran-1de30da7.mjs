import { j as jsxs, a as jsx } from "../ssr.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-c2e72800.mjs";
import { useEffect } from "react";
import { L as Label } from "./label-cecd7064.mjs";
import { I as Input } from "./input-a726a844.mjs";
import CurrencyInput from "react-currency-input-field";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { B as Button } from "./button-6facd6da.mjs";
import { useForm } from "@inertiajs/react";
import { L as Loading } from "./Loading-649771fa.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "react-dom";
import "@headlessui/react";
const BayarAngsuran = ({ triggeredId }) => {
  const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm({
    type_transaksi: "bayar",
    transaction_date: "",
    nominal: "",
    id: ""
  });
  useEffect(() => {
    setData("id", triggeredId);
  }, [triggeredId, recentlySuccessful]);
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route("pinjaman.bayar_pinjaman", data.id), {
      preserveScroll: true,
      onSuccess: () => {
        reset("transaction_date", "nominal");
      }
    });
  };
  return /* @__PURE__ */ jsxs(Card, { className: "relative w-full mb-3", children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Isi Angsuran" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: onSubmitForm, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "transaction_date", children: "Tanggal Pembayaran" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "date",
            name: "transaction_date",
            id: "transaction_date",
            className: "w-full",
            value: data.transaction_date,
            onChange: onInputChange
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "nominal", children: "Nominal" }),
        /* @__PURE__ */ jsx(
          CurrencyInput,
          {
            className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            name: "nominal",
            allowDecimals: false,
            prefix: "Rp. ",
            min: 1,
            required: true,
            onValueChange: onHandleCurencyChange,
            value: data.nominal,
            placeholder: "Inputkan angka tanpa sparator"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              name: "danatitipan",
              value: data.danatitipan,
              onChange: onInputChange
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Dana Titipan?" })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", children: "Submit" })
      ] })
    ] }) })
  ] });
};
export {
  BayarAngsuran as default
};
