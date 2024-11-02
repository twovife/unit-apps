import { j as jsxs, a as jsx } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-e17b5153.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-c2e72800.mjs";
import { usePage, useForm } from "@inertiajs/react";
import { L as Label } from "./label-cecd7064.mjs";
import CurrencyInput from "react-currency-input-field";
import "./button-bf6cf732.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "react-dom";
import "@headlessui/react";
const ApprovalAkhir = ({ datas, show = false, onClosed }) => {
  const { sirkulasi } = usePage().props;
  const [loading, setLoading] = useState(false);
  const { data, setData, post, reset, processing, errors } = useForm({
    ml_amount: "",
    mb_amount: "",
    cm_amount: "",
    amount: ""
  });
  useEffect(() => {
    setData({
      ml_amount: sirkulasi.ml_amount ?? 0,
      mb_amount: sirkulasi.mb_amount ?? 0,
      cm_amount: sirkulasi.cm_amount ?? 0,
      amount: sirkulasi.amount ?? 0
    });
  }, [sirkulasi]);
  const modalIsClosed = () => {
    onClosed();
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: show, onOpenChange: (open) => open ? "" : modalIsClosed(), children: [
    /* @__PURE__ */ jsx(Loading, { show: loading || processing }),
    /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: `w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin`,
        children: [
          /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { children: "Isi Angsuran" }) }),
          /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Sirkulasi" }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs(Card, { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Sirkulasi Awal" }) }),
                  /* @__PURE__ */ jsxs(CardContent, { children: [
                    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "amount", children: "Sirkulasi Awal" }),
                      /* @__PURE__ */ jsx(
                        CurrencyInput,
                        {
                          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                          name: "amount",
                          allowDecimals: false,
                          prefix: "Rp. ",
                          min: 0,
                          required: true,
                          readOnly: true,
                          onValueChange: onHandleCurencyChange,
                          value: data.amount,
                          placeholder: "Inputkan angka tanpa sparator"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "ml_amount", children: "Saldo Awal (ML)" }),
                      /* @__PURE__ */ jsx(
                        CurrencyInput,
                        {
                          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                          name: "ml_amount",
                          allowDecimals: false,
                          prefix: "Rp. ",
                          min: 0,
                          required: true,
                          readOnly: true,
                          onValueChange: onHandleCurencyChange,
                          value: data.ml_amount,
                          placeholder: "Inputkan angka tanpa sparator"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "mb_amount", children: "Saldo Awal (MB)" }),
                      /* @__PURE__ */ jsx(
                        CurrencyInput,
                        {
                          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                          name: "mb_amount",
                          allowDecimals: false,
                          prefix: "Rp. ",
                          min: 0,
                          required: true,
                          readOnly: true,
                          onValueChange: onHandleCurencyChange,
                          value: data.mb_amount,
                          placeholder: "Inputkan angka tanpa sparator"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "cm_amount", children: "Saldo Awal (CM)" }),
                      /* @__PURE__ */ jsx(
                        CurrencyInput,
                        {
                          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                          name: "cm_amount",
                          allowDecimals: false,
                          prefix: "Rp. ",
                          min: 0,
                          required: true,
                          readOnly: true,
                          onValueChange: onHandleCurencyChange,
                          value: data.cm_amount,
                          placeholder: "Inputkan angka tanpa sparator"
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("div", { children: "Sirkulasi Akhir" }) }),
                /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("div", { children: "Sirkulasi Awal Bulan Depan" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardContent, {})
          ] })
        ]
      }
    )
  ] });
};
export {
  ApprovalAkhir as default
};
