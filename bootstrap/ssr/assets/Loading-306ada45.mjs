import { a as jsx } from "../ssr.mjs";
import "react";
import ReactDOM from "react-dom";
import { Transition } from "@headlessui/react";
const loader = "";
const Loading = ({ show }) => {
  const loadingRoot = document.getElementById("loading");
  return ReactDOM.createPortal(
    /* @__PURE__ */ jsx(
      Transition,
      {
        show,
        enter: "transition-opacity duration-200",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "transition-opacity duration-200",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx("div", { className: "w-full h-screen bg-white/20 fixed top-0 left-0 z-[100] flex justify-center items-center backdrop-blur-[1px]", children: /* @__PURE__ */ jsx("div", { className: "custom-loader" }) })
      }
    ),
    loadingRoot
  );
};
const Loading$1 = Loading;
export {
  Loading$1 as L
};
