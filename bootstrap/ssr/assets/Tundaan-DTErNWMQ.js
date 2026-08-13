import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-DzFuPzol.js";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { I as Input } from "./input-BHD-__le.js";
import { L as Label } from "./label-F4MKz6SO.js";
import { useForm } from "@inertiajs/react";
import dayjs from "dayjs";
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
const Tundaan = ({ id, dropDateLama, onClosed }) => {
  const [open, setOpen] = useState(false);
  const defaultTanggalBaru = dayjs(dropDateLama).add(1, "week").format("YYYY-MM-DD");
  const minTanggalBaru = dayjs(dropDateLama).add(1, "day").format("YYYY-MM-DD");
  const { data, setData, post, processing, errors, reset } = useForm({
    tanggal_drop: defaultTanggalBaru
  });
  const bukaForm = () => {
    setData("tanggal_drop", defaultTanggalBaru);
    setOpen(true);
  };
  const submit = () => {
    post(route("transaction.tundaan_pengajuan", id), {
      onSuccess: () => {
        reset();
        setOpen(false);
        onClosed == null ? void 0 : onClosed();
      }
    });
  };
  if (!open) {
    return /* @__PURE__ */ jsx(AppButton, { variant: "warningOutline", size: "sm", type: "button", onClick: bukaForm, children: "Tundaan" });
  }
  const pesanError = Object.values(errors)[0];
  return /* @__PURE__ */ jsxs("div", { className: "w-full p-3 mt-2 border rounded-md bg-muted/40", children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx(Label, { htmlFor: "tanggal_drop_tundaan", children: "Tanggal Drop Baru" }),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "date",
        id: "tanggal_drop_tundaan",
        name: "tanggal_drop",
        min: minTanggalBaru,
        required: true,
        value: data.tanggal_drop,
        onChange: (e) => setData("tanggal_drop", e.target.value)
      }
    ),
    pesanError && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs font-medium text-destructive", children: pesanError }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-2", children: [
      /* @__PURE__ */ jsx(
        AppButton,
        {
          variant: "ghost",
          size: "sm",
          type: "button",
          onClick: () => setOpen(false),
          children: "Batal"
        }
      ),
      /* @__PURE__ */ jsx(
        AppButton,
        {
          variant: "warning",
          size: "sm",
          type: "button",
          disabled: processing,
          onClick: submit,
          children: "Tunda ke Tanggal Ini"
        }
      )
    ] })
  ] });
};
const Tundaan$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tundaan
}, Symbol.toStringTag, { value: "Module" }));
export {
  AppButton as A,
  Tundaan as T,
  Tundaan$1 as a
};
