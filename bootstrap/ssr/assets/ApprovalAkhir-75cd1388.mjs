import { j as jsxs, a as jsx } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-e17b5153.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-c2e72800.mjs";
import { usePage, useForm } from "@inertiajs/react";
import { L as Label } from "./label-cecd7064.mjs";
import CurrencyInput from "react-currency-input-field";
import { B as Button } from "./button-bf6cf732.mjs";
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
  const {
    server_filter: { groupId, hari }
  } = usePage().props;
  const [loading, setLoading] = useState(false);
  const { data, setData, post, reset, processing, errors } = useForm({});
  useEffect(() => {
    if (datas) {
      setData({
        hari,
        groupId,
        cm_awal: datas.cm.sirkulasi,
        cm_akhir: datas.cm.saldo,
        ccm_awal: datas.ccm.sirkulasi,
        ccm_akhir: datas.ccm.saldo,
        mb_awal: datas.mb.sirkulasi,
        mb_akhir: datas.mb.saldo,
        ml_awal: 0,
        ml_akhir: 0,
        sirkulasi_awal: 0,
        sirkulasi_akhir: 0
      });
    }
  }, [show, datas]);
  const modalIsClosed = () => {
    onClosed();
  };
  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route("adminpanel.sirkulasiAwal"), {
      onSuccess: () => {
        modalIsClosed();
      }
    });
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
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Input Sirkulasi" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: onSubmitForm, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "cm_awal", children: "CM Awal" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "cm_awal",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.cm_awal,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "cm_akhir", children: "CM Akhir" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "cm_akhir",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.cm_akhir,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "mb_awal", children: "MB Awal" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "mb_awal",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.mb_awal,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "mb_akhir", children: "MB Akhir" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "mb_akhir",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.mb_akhir,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "ml_awal", children: "ML Awal" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "ml_awal",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.ml_awal,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "ml_akhir", children: "ML Akhir" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "ml_akhir",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.ml_akhir,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "ccm_awal", children: "Calon CM" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "ccm_awal",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.ccm_awal,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "ccm_akhir", children: "ML Akhir" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "ccm_akhir",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.ccm_akhir,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "sirkulasi_awal", children: "Sirkulasi Awal" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "sirkulasi_awal",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.sirkulasi_awal,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "sirkulasi_akhir", children: "Sirkulasi Akhir" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "sirkulasi_akhir",
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.sirkulasi_akhir,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "submit", children: "Submit" })
            ] }) })
          ] })
        ]
      }
    )
  ] });
};
export {
  ApprovalAkhir as default
};
