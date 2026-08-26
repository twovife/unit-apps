import { jsx, jsxs } from "react/jsx-runtime";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { useForm } from "@inertiajs/react";
import React__default from "react";
import dayjs from "dayjs";
import "./input-BHD-__le.js";
import { T as TanggalKerja } from "./TanggalKerja-0Ehwsu9U.js";
import { u as useHariLibur } from "./useHariLibur-Da-oW-is.js";
import { L as Label } from "./label-F4MKz6SO.js";
import { I as InputError } from "./InputError-cRVTeK4i.js";
import CurrencyInput from "react-currency-input-field";
import { B as Button } from "./button-MTjEwktD.js";
import "react-dom";
import "@headlessui/react";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "./calendar-BJ3LWb_A.js";
import "react-day-picker";
import "@radix-ui/react-icons";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "axios";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
const HARI_KE_ANGKA = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6
};
const WhiteOff = ({ triggeredId, nominalWhiteOff, hari = null }) => {
  const { mundurKeHariKerja, siap: kalenderSiap } = useHariLibur();
  const hariAngka = hari ? HARI_KE_ANGKA[String(hari).toLowerCase()] ?? null : null;
  const { data, setData, post, processing, errors } = useForm({
    id: triggeredId || "",
    transaction_date: dayjs().format("YYYY-MM-DD"),
    nominal: nominalWhiteOff || 0
  });
  React__default.useEffect(() => {
    if (hariAngka === null) return;
    let calon = dayjs();
    while (calon.day() !== hariAngka) calon = calon.subtract(1, "day");
    setData("transaction_date", mundurKeHariKerja(calon.format("YYYY-MM-DD")));
  }, [hariAngka, kalenderSiap]);
  const onHandleCurencyChange = (value) => {
    setData("nominal", value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (triggeredId) {
      post(route("pinjaman.white_off_loan", triggeredId));
    }
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "transaction_date", children: "Tanggal Pemutihan" }),
      /* @__PURE__ */ jsx(
        TanggalKerja,
        {
          name: "transaction_date",
          hariTagih: hariAngka,
          value: data.transaction_date,
          onChange: (e) => setData("transaction_date", e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.transaction_date, className: "mt-1" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "field2", children: "Nominal" }),
      /* @__PURE__ */ jsx(
        CurrencyInput,
        {
          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          name: "nominal",
          allowDecimals: false,
          prefix: "Rp. ",
          min: 0,
          required: true,
          onValueChange: onHandleCurencyChange,
          value: data.nominal,
          placeholder: "Inputkan angka tanpa sparator"
        }
      ),
      errors.field2 && /* @__PURE__ */ jsx(InputError, { children: errors.field2 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-1 mb-3", children: [
      /* @__PURE__ */ jsxs(Label, { htmlFor: "agreement", className: "leading-relaxed", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            className: "mr-3",
            id: "agreement",
            required: true,
            onChange: (e) => setData("agreement", e.target.checked)
          }
        ),
        "Saya Menyatakan Nasabah Ini Meninggal Dunia ( Dilunaskan )"
      ] }),
      errors.agreement && /* @__PURE__ */ jsx(InputError, { children: errors.agreement })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing || !triggeredId, children: "Submit" }) })
  ] }) });
};
export {
  WhiteOff as default
};
