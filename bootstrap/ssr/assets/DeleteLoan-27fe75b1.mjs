import { j as jsxs, a as jsx } from "../ssr.mjs";
import { useState, useRef } from "react";
import "./TextInput-11198f62.mjs";
import { useForm } from "@inertiajs/react";
import { B as Button } from "./button-5b8f0147.mjs";
import { L as Loading } from "./Loading-306ada45.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-dom";
import "@headlessui/react";
function DeleteLoan({ id, onClosed }) {
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
    destroy(route("pinjaman.destroy_loan", id), {
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
          children: /* @__PURE__ */ jsx(Button, { type: "button", onClick: confirmUserDeletion, children: "Hapus" })
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
}
export {
  DeleteLoan as default
};
