import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { L as Loading } from "./Loading-306ada45.mjs";
import { useState, useEffect } from "react";
import { B as BadgeStatus } from "./BadgeStatus-c743b633.mjs";
import "./badge-3e44e85b.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-1c7227a2.mjs";
import { I as Input } from "./input-7eb6bb1b.mjs";
import { useForm } from "@inertiajs/react";
import { Label } from "@radix-ui/react-label";
import CurrencyInput from "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
const Action = ({ show = false, onClosed, triggeredData, type }) => {
  const { data, setData, post, reset, errors, processing } = useForm({
    id: "",
    kelompok: "",
    date: "",
    kasbon: "",
    transport: "",
    type: "1"
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (triggeredData) {
      setData({
        id: triggeredData.id,
        kelompok: triggeredData.kelompok,
        date: triggeredData.tanggal,
        kasbon: triggeredData.kasbon,
        transport: triggeredData.transport,
        type,
        tunai: type == 1 ? 0 : triggeredData.tunai
      });
    }
  }, [triggeredData]);
  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const closedModal = () => {
    onClosed();
    reset();
  };
  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route("kasir.rekap.rekap_post"), {
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: show, onOpenChange: (open) => open ? "" : closedModal(), children: [
    /* @__PURE__ */ jsx(Loading, { show: loading || processing }),
    /* @__PURE__ */ jsx(DialogContent, { className: "w-[90vw] h-[90vh] lg:h-auto lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: loading ? /* @__PURE__ */ jsx("div", { children: "Data Sedang Dimuat" }) : /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: type == 1 ? "Input Kasbon & Transport" : "Cek Tunai Mantri" }),
      (triggeredData == null ? void 0 : triggeredData.status_dayly_approval) ? /* @__PURE__ */ jsx(DialogDescription, { children: "'Data Sudah DiSetujui Kasid & Pimpinan, Data Pada Tanggal Ini Telah Ditutup'" }) : /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsxs("form", { onSubmit: onSubmitForm, children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "date", children: "Tanggal" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              readOnly: true,
              name: "date",
              type: "date",
              required: true,
              onChange: onInputChange,
              value: data.date
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "kasbon", children: "Kasbon" }),
          /* @__PURE__ */ jsx(
            CurrencyInput,
            {
              className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              name: "kasbon",
              readOnly: data.status_dayly_approval,
              allowDecimals: false,
              prefix: "Rp. ",
              min: 1,
              required: true,
              onValueChange: onHandleCurencyChange,
              value: data.kasbon,
              placeholder: "Inputkan angka tanpa sparator"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "transport", children: "Transport" }),
          /* @__PURE__ */ jsx(
            CurrencyInput,
            {
              className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              name: "transport",
              allowDecimals: false,
              readOnly: data.status_dayly_approval,
              prefix: "Rp. ",
              min: 1,
              required: true,
              onValueChange: onHandleCurencyChange,
              value: data.transport,
              placeholder: "Inputkan angka tanpa sparator"
            }
          )
        ] }),
        (triggeredData == null ? void 0 : triggeredData.status_approve_kepala) && /* @__PURE__ */ jsx(BadgeStatus, { className: "mb-3", value: "acc", children: "Kepala Sudah Aprov" }),
        (triggeredData == null ? void 0 : triggeredData.status_approve_kepala) && type == 2 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start flex-1 gap-3 mb-1 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                placeholder: "Select Permission",
                id: "daily_kepala_approval",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "daily_kepala_approval", children: "Konfirmasi Jika Sudah Benar Semua" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-3 text-right", children: /* @__PURE__ */ jsx(Button, { type: "submit", children: "Submit" }) })
        ] }),
        type == 1 && /* @__PURE__ */ jsx("div", { className: "mb-3 text-right", children: /* @__PURE__ */ jsx(Button, { type: "submit", children: "Submit" }) })
      ] }) })
    ] }) })
  ] });
};
export {
  Action as default
};
