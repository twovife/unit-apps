import { a as jsx, j as jsxs, F as Fragment } from "../ssr.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import { useMemo, useEffect } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { B as Badge } from "./badge-ad1cae46.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { L as Label } from "./label-7289427a.mjs";
import CurrencyInput from "react-currency-input-field";
const NoEditOverlay = ({ value = "User Tidak Bisa Melakukan Edit" }) => {
  return /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-full bg-white/0 opacity-0 hover:bg-white/30 hover:opacity-100 hover:cursor-not-allowed duration-200 transition-all ease-in", children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "font-black text-3xl", children: value }) }) });
};
function useFrontEndPermission() {
  const { auth } = usePage().props;
  const { permissions } = auth;
  const permissionStatus = useMemo(() => {
    const isUnit = permissions.includes("unit");
    const isMantri = permissions.includes("area");
    const isPusat = permissions.includes("pusat");
    const isCreator = permissions.includes("can create");
    return {
      isUnit,
      isMantri,
      isPusat,
      isCreator
    };
  }, [permissions]);
  return permissionStatus;
}
const Acc = ({ id, acc, onClosed, triggeredData }) => {
  const { data, setData, put, errors, processing, reset, transform } = useForm({
    approved_nominal: "",
    status: "",
    drop: ""
  });
  const { isUnit, isMantri, isPusat, isCreator } = useFrontEndPermission();
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
      onFinish: () => {
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { className: "w-full", onSubmit: (e) => e.preventDefault(), children: [
    !isCreator && /* @__PURE__ */ jsx(NoEditOverlay, { value: "User Tidak Dapat Digunakan Untuk Mengedit" }),
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "open" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      isMantri && /* @__PURE__ */ jsx(NoEditOverlay, { value: "Tunggu Pimpinan Acc Terlebih Dahulu" }),
      /* @__PURE__ */ jsx(Label, { htmlFor: "approved_nominal", children: "Nominal ACC" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
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
        ),
        /* @__PURE__ */ jsx(Button, { variant: "green", onClick: () => accPinjaman("acc"), children: "ACC" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            onClick: () => accPinjaman("tolak"),
            children: "Tolak"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs(Badge, { size: "lg", variant: "green", children: [
      "Status Pengajuan = ",
      triggeredData == null ? void 0 : triggeredData.status,
      ", Pada Tanggal",
      triggeredData == null ? void 0 : triggeredData.check_date
    ] }) }),
    (triggeredData == null ? void 0 : triggeredData.status) !== "open" && /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "acc" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "drop", className: "whitespace-normal", children: "Drop Jadi" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx(
          CurrencyInput,
          {
            className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            name: "drop",
            allowDecimals: false,
            prefix: "Rp. ",
            min: 1,
            required: true,
            onValueChange: onHandleCurencyChange,
            value: data.drop,
            placeholder: "Inputkan angka tanpa sparator"
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "green", onClick: () => accPinjaman("success"), children: "DROP" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            onClick: () => accPinjaman("gagal"),
            children: "GAGAL"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs(Badge, { size: "lg", variant: "green", children: [
      "Status Pengajuan = ",
      triggeredData == null ? void 0 : triggeredData.status,
      ", Tanggal",
      triggeredData == null ? void 0 : triggeredData.check_date
    ] }) })
  ] });
};
const Acc$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Acc
}, Symbol.toStringTag, { value: "Module" }));
export {
  Acc as A,
  NoEditOverlay as N,
  Acc$1 as a,
  useFrontEndPermission as u
};
