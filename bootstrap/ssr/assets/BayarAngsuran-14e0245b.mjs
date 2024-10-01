import { j as jsxs, a as jsx } from "../ssr.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-1314102b.mjs";
import { useEffect, useState } from "react";
import { L as Label } from "./label-143f493c.mjs";
import { I as Input } from "./input-7eb6bb1b.mjs";
import CurrencyInput from "react-currency-input-field";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { usePage, useForm } from "@inertiajs/react";
import { L as Loading } from "./Loading-7f1a61e6.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "react-dom";
import "@headlessui/react";
const BayarAngsuran = ({ triggeredId, triggeredPinjaman, instalment }) => {
  const {
    server_filter: { closed_transaction }
  } = usePage().props;
  const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm({
    type_transaksi: "bayar",
    transaction_date: "",
    nominal: 0,
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
  const buttonValueClick = (e) => {
    const value = e.target.getAttribute("data-value");
    setData("nominal", value);
  };
  const buttonAddNominal = (e) => {
    const nominal = parseInt(data.nominal);
    const value = parseInt(e.target.getAttribute("data-value"));
    setData("nominal", value + nominal);
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
  const [pelunasan, setPelunasan] = useState(0);
  useEffect(() => {
    var _a;
    const pelunasan2 = ((_a = instalment == null ? void 0 : instalment.sort((a, b) => a.saldo - b.saldo)[0]) == null ? void 0 : _a.saldo) ?? 0;
    setPelunasan(pelunasan2);
  }, [instalment]);
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
            min: closed_transaction,
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
            min: 0,
            required: true,
            onValueChange: onHandleCurencyChange,
            value: data.nominal,
            placeholder: "Inputkan angka tanpa sparator"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonAddNominal,
            "data-value": 5e3,
            children: "+5 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonAddNominal,
            "data-value": 1e4,
            children: "+10 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 5e4,
            children: "50 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 52e3,
            children: "52 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 6e4,
            children: "60 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 65e3,
            children: "65 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 1e5,
            children: "100 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 13e4,
            children: "130 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 195e3,
            children: "195 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 26e4,
            children: "260 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": 39e4,
            children: "390 Rb"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            onClick: buttonValueClick,
            "data-value": pelunasan,
            children: pelunasan
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6", children: [
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
