import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { A as AppBadge, v as varianStatus } from "./statusVariants-kLBpdvOH.js";
import * as React from "react";
import { useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-H80jjgLf.js";
import { L as Label } from "./label-e-KMhPKP.js";
import { useForm, usePage } from "@inertiajs/react";
import CurrencyInput from "react-currency-input-field";
import "react-dom";
import "@headlessui/react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
const appButtonVariants = cva(
  // Basis: `[&_svg:not([class*='size-'])]:size-4` membuat ikon otomatis 16px
  // kecuali kelas size- diberikan manual. `has-[>svg]:px-*` merapatkan padding
  // saat isinya cuma ikon. Dua-duanya mengikuti app_laravel.
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:cursor-pointer",
  {
    variants: {
      variant: {
        /* ---------- SOLID (gradasi) ---------- */
        primary: "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:from-blue-600 hover:to-indigo-700 focus-visible:ring-blue-500/20",
        submission: "bg-linear-to-r from-emerald-400 to-teal-500 text-white shadow-md hover:from-emerald-500 hover:to-teal-600 focus-visible:ring-emerald-500/20",
        warning: "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md hover:from-amber-500 hover:to-orange-600 focus-visible:ring-amber-500/20",
        danger: "bg-linear-to-r from-red-500 to-rose-600 text-white shadow-md hover:from-red-600 hover:to-rose-700 focus-visible:ring-red-500/20",
        black: "bg-linear-to-r from-zinc-700 to-zinc-900 text-white shadow-md hover:from-zinc-800 hover:to-zinc-950 focus-visible:ring-zinc-500/20 dark:from-zinc-200 dark:to-white dark:text-zinc-900 dark:hover:from-zinc-100 dark:hover:to-white",
        /* ---------- OUTLINE ----------
           Warna identitas sudah terlihat saat diam (border + teks), lalu terisi
           tipis saat hover. Border 2px mengikuti app_laravel. */
        primaryOutline: "border-2 border-blue-500 bg-transparent text-blue-600 shadow-sm hover:bg-blue-50 hover:border-indigo-600 hover:text-indigo-700 focus-visible:ring-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300",
        submissionOutline: "border-2 border-emerald-500 bg-transparent text-emerald-600 shadow-sm hover:bg-emerald-50 hover:border-teal-500 hover:text-teal-700 focus-visible:ring-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300",
        warningOutline: "border-2 border-amber-500 bg-transparent text-amber-600 shadow-sm hover:bg-amber-50 hover:border-orange-500 hover:text-orange-700 focus-visible:ring-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-950/50 dark:hover:text-amber-300",
        dangerOutline: "border-2 border-red-500 bg-transparent text-red-600 shadow-sm hover:bg-red-50 hover:border-rose-600 hover:text-rose-700 focus-visible:ring-red-500/20 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300",
        blackOutline: "border-2 border-zinc-800 bg-transparent text-zinc-800 shadow-sm hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-zinc-500/20 dark:border-zinc-300 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white",
        /* ---------- GHOST ---------- */
        ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-500/20 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      },
      size: {
        xs: "h-7 gap-1.5 rounded-md px-2.5 text-xs has-[>svg]:px-2",
        sm: "h-8 rounded-md px-3 text-xs has-[>svg]:px-2.5",
        base: "h-9 rounded-md px-4 py-2 text-sm has-[>svg]:px-3",
        lg: "h-10 rounded-md px-6 text-sm has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6 [&_svg:not([class*='size-'])]:size-5",
        /* ---------- IKON (bujur sangkar, tanpa teks) ---------- */
        iconXs: "size-7 rounded-md",
        iconSm: "size-8 rounded-md",
        icon: "size-9 rounded-md",
        iconLg: "size-10 rounded-md",
        iconXl: "size-12 rounded-lg [&_svg:not([class*='size-'])]:size-5"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "base"
    }
  }
);
const AppButton = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-slot": "button",
        className: cn(appButtonVariants({ variant, size, className })),
        ...props
      }
    );
  }
);
AppButton.displayName = "AppButton";
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
    /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "open" ? /* @__PURE__ */ jsxs(Fragment, { children: [
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
    ] }) : /* @__PURE__ */ jsxs(AppBadge, { variant: varianStatus(triggeredData == null ? void 0 : triggeredData.status), size: "lg", children: [
      triggeredData == null ? void 0 : triggeredData.status,
      (triggeredData == null ? void 0 : triggeredData.check_date) ? ` · ${triggeredData.check_date}` : ""
    ] }) }),
    (triggeredData == null ? void 0 : triggeredData.status) !== "open" && /* @__PURE__ */ jsx("div", { className: "mb-3", children: (triggeredData == null ? void 0 : triggeredData.status) === "acc" ? /* @__PURE__ */ jsxs(Fragment, { children: [
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
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 mt-2", children: [
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
    ] }) : /* @__PURE__ */ jsxs(AppBadge, { variant: varianStatus(triggeredData == null ? void 0 : triggeredData.status), size: "lg", children: [
      triggeredData == null ? void 0 : triggeredData.status,
      (triggeredData == null ? void 0 : triggeredData.check_date) ? ` · ${triggeredData.check_date}` : ""
    ] }) })
  ] });
};
export {
  Acc as default
};
