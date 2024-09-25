import { a as jsx } from "../ssr.mjs";
import "./Loading-649771fa.mjs";
import { useState } from "react";
import "./button-6facd6da.mjs";
import { D as Dialog, a as DialogContent } from "./dialog-e17b5153.mjs";
import "./input-a726a844.mjs";
import "./table-c01c1748.mjs";
import "@inertiajs/react";
import "dayjs";
import "react-currency-input-field";
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
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
const Approval = ({ show = false, onClosed, triggeredData, triggeredDate }) => {
  const [loading, setLoading] = useState(false);
  const closedModal = () => {
    onClosed();
    reset();
  };
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : closedModal(), children: /* @__PURE__ */ jsx(DialogContent, { className: "w-[90vw] h-[90vh] lg:h-auto lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: loading ? /* @__PURE__ */ jsx("div", { children: "Data Sedang Dimuat" }) : /* @__PURE__ */ jsx("div", { children: "das" }) }) });
};
export {
  Approval as default
};
