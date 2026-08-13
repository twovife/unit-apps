import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import "./AppBadge-CfINLLYj.js";
import { A as AppButton, T as Tundaan } from "./Tundaan-DTErNWMQ.js";
import { L as Label } from "./label-F4MKz6SO.js";
import { useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./input-BHD-__le.js";
import "@radix-ui/react-label";
const Acc = ({ id, acc, onClosed, triggeredData }) => {
  var _a;
  const { data, setData, put, errors, processing, reset, transform } = useForm({
    approved_nominal: "",
    status: "",
    drop: ""
  });
  const { auth } = usePage().props;
  const canApprove = (_a = auth == null ? void 0 : auth.permissions) == null ? void 0 : _a.includes("can-approve");
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      approved_nominal: (triggeredData == null ? void 0 : triggeredData.acc) ?? (triggeredData == null ? void 0 : triggeredData.request),
      drop: triggeredData == null ? void 0 : triggeredData.acc
    }));
  }, [id, acc]);
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const accPinjaman = (status) => {
    transform((data2) => ({
      ...data2,
      status
    }));
    put(route("transaction.action_buku_transaksi", id), {
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { className: "relative w-full", onSubmit: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "open" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "approved_nominal", children: "Nominal ACC" }),
      /* @__PURE__ */ jsx(
        CurrencyInput,
        {
          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          name: "approved_nominal",
          allowDecimals: false,
          prefix: "Rp. ",
          min: 1,
          required: true,
          disabled: !canApprove,
          onValueChange: onHandleCurencyChange,
          value: data.approved_nominal,
          placeholder: "Inputkan angka tanpa sparator"
        }
      ),
      !canApprove && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-medium text-amber-600", children: "Tunggu Pimpinan / KM meng-ACC terlebih dahulu." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 mt-2", children: [
        /* @__PURE__ */ jsx(
          AppButton,
          {
            variant: "submission",
            size: "sm",
            disabled: !canApprove,
            onClick: () => accPinjaman("acc"),
            children: "ACC"
          }
        ),
        /* @__PURE__ */ jsx(
          AppButton,
          {
            variant: "danger",
            size: "sm",
            disabled: !canApprove,
            onClick: () => accPinjaman("tolak"),
            children: "Tolak"
          }
        )
      ] })
    ] }) }),
    (triggeredData == null ? void 0 : triggeredData.status) !== "open" && /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "acc" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "drop", className: "whitespace-normal", children: "Drop Jadi" }),
      /* @__PURE__ */ jsx(
        CurrencyInput,
        {
          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          name: "drop",
          allowDecimals: false,
          prefix: "Rp. ",
          min: 1,
          required: true,
          disabled: !canApprove,
          onValueChange: onHandleCurencyChange,
          value: data.drop,
          placeholder: "Inputkan angka tanpa sparator"
        }
      ),
      !canApprove && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-medium text-amber-600", children: "Hanya Pimpinan / KM / Kasir yang bisa menutup pencairan." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end gap-3 mt-2", children: [
        canApprove && /* @__PURE__ */ jsx(
          Tundaan,
          {
            id,
            dropDateLama: triggeredData == null ? void 0 : triggeredData.tanggal_drop,
            onClosed
          }
        ),
        /* @__PURE__ */ jsx(
          AppButton,
          {
            variant: "submission",
            size: "sm",
            disabled: !canApprove,
            onClick: () => accPinjaman("success"),
            children: "DROP"
          }
        ),
        /* @__PURE__ */ jsx(
          AppButton,
          {
            variant: "danger",
            size: "sm",
            disabled: !canApprove,
            onClick: () => accPinjaman("gagal"),
            children: "GAGAL"
          }
        )
      ] })
    ] }) })
  ] });
};
export {
  Acc as default
};
