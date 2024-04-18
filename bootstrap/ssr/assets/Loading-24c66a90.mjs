import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { a as jsx } from "../ssr.mjs";
import ReactDOM from "react-dom";
import { Transition } from "@headlessui/react";
const SweetAlert = ({ type, message }) => {
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    if (type === "error") {
      MySwal.fire({
        position: "top-end",
        icon: "error",
        title: message || "Terjadi Kesalahan Silahkan hub IT.",
        showConfirmButton: false,
        timer: 1500
      });
    } else if (type === "success") {
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: message || "Anda Telah Melakukan Perubahan",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }, [type, message]);
  return null;
};
const SweetAlert$1 = SweetAlert;
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
  Loading$1 as L,
  SweetAlert$1 as S
};
