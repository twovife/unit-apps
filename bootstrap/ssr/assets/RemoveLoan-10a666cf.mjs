import { j as jsxs, a as jsx } from "../ssr.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import { B as Button } from "./button-e7ccf50f.mjs";
import { useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
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
const RemoveLoan = ({ triggeredId, onClosed }) => {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  useRef();
  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors
  } = useForm();
  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };
  const cancelUserDeletion = () => {
    setTimeout(() => {
      setConfirmingUserDeletion(false);
    }, 200);
  };
  const buttonArea = useRef(null);
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("pinjaman.destroy_loan", triggeredId), {
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { ref: buttonArea, onMouseLeave: cancelUserDeletion, children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx("form", { onSubmit: deleteUser, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col overflow-hidden h-9", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `inline transition-all duration-300
            ${confirmingUserDeletion ? "translate-y-full" : "translate-y-0"}
            `,
          children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "destructiveoutline2",
              type: "button",
              onClick: confirmUserDeletion,
              children: "Hapus"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `inline transition-all duration-300
            ${confirmingUserDeletion ? "-translate-y-full" : "translate-y-0"}`,
          children: /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              variant: "destructive",
              onClick: confirmUserDeletion,
              children: "Yakin?"
            }
          )
        }
      )
    ] }) })
  ] });
};
export {
  RemoveLoan as default
};
