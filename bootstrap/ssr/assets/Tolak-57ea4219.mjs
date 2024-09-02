import { j as jsxs, a as jsx } from "../ssr.mjs";
import { L as Loading } from "./Loading-649771fa.mjs";
import { B as Button } from "./button-9a023ace.mjs";
import { useForm } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
const Tolak = ({ id, onClosed }) => {
  const { data, setData, put, errors, processing, reset } = useForm({
    status: "tolak"
  });
  const tolakPinjaman = (e) => {
    e.preventDefault();
    put(route("transaction.action_buku_transaksi", id), {
      onFinish: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: tolakPinjaman, children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx(Button, { onClick: tolakPinjaman, variant: "destructive", children: "TOLAK" })
  ] });
};
export {
  Tolak as default
};
