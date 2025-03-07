import { jsxs, jsx } from "react/jsx-runtime";
import { L as Loading } from "./Loading-B4-z1fyu.js";
import { B as Button } from "./button-Dbmjz33H.js";
import { useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
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
