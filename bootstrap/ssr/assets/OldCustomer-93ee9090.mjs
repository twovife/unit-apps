import { j as jsxs, a as jsx } from "../ssr.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { S as SelectList } from "./SelectList-224f2d77.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { useForm } from "@inertiajs/react";
import "react";
import CurrencyInput from "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
const OldCustomer = ({
  setLoading,
  max_date,
  min_date,
  emps,
  customer_id,
  nik,
  url = route("transaction.store")
}) => {
  const { data, setData, post, processing, errors } = useForm({
    transaction_date: max_date,
    tanggal_drop: "",
    customer_id,
    nik,
    mantri: "",
    pinjaman: "",
    type_create: "2",
    droplangsung: false
  });
  const handleOnChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(url);
    setLoading(processing);
  };
  return /* @__PURE__ */ jsxs("form", { className: "flex-1", onSubmit: onSubmitCreate, children: [
    /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: "Permintaan Pinjaman Baru (Nasabah Lama)" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-2 mb-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "transaction_date",
              value: "Tanggal Pengajuan"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "transaction_date",
              type: "date",
              name: "transaction_date",
              max: max_date,
              value: data.transaction_date,
              className: "mt-1 block w-full",
              onChange: handleOnChange
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.transaction_date,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(
            InputLabel,
            {
              htmlFor: "tanggal_drop",
              value: "Tanggal Drop"
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "tanggal_drop",
              type: "date",
              name: "tanggal_drop",
              min: min_date,
              value: data.tanggal_drop,
              className: "mt-1 block w-full",
              onChange: handleOnChange
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.tanggal_drop,
              className: "mt-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "nik", value: "NIK Customer" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "nik",
            type: "text",
            name: "nik",
            value: data.nik,
            className: "mt-1 block w-full",
            readOnly: true,
            onChange: handleOnChange
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.nik, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "mantri", value: "Mantri" }),
        /* @__PURE__ */ jsx(
          SelectList,
          {
            id: "mantri",
            type: "text",
            name: "mantri",
            options: emps,
            nullValue: true,
            value: data.mantri,
            className: "mt-1 block w-full",
            onChange: handleOnChange
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.mantri, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "pinjaman",
            value: "Nominal Pinjaman",
            className: "mb-1"
          }
        ),
        /* @__PURE__ */ jsx(
          CurrencyInput,
          {
            name: "pinjaman",
            id: "pinjaman",
            className: `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2`,
            allowDecimals: false,
            prefix: "Rp. ",
            min: 1,
            required: true,
            onValueChange: onHandleCurencyChange,
            value: data.pinjaman,
            placeholder: "Inputkan angka tanpa sparator"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.pinjaman, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "block mt-4", children: /* @__PURE__ */ jsx(
        PrimaryButton,
        {
          type: "submit",
          title: "Submit",
          color: "green"
        }
      ) })
    ] })
  ] });
};
export {
  OldCustomer as default
};
