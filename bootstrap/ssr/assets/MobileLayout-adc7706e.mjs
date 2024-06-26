import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SweetAlert, L as Loading } from "./Loading-dc4db3bc.mjs";
import { usePage } from "@inertiajs/react";
import "react";
import { AiFillHome } from "react-icons/ai";
const MobileLayout = ({ auth, header, children, loading = false }) => {
  const { errors, flash } = usePage().props;
  console.log(errors);
  return /* @__PURE__ */ jsxs("div", { className: "antialiased relative z-10", children: [
    Object.keys(errors).length > 0 && /* @__PURE__ */ jsx(SweetAlert, { type: "error", flash: errors }),
    (flash == null ? void 0 : flash.message) && /* @__PURE__ */ jsx(SweetAlert, { type: "success", flash }),
    /* @__PURE__ */ jsx(Loading, { show: loading }),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-xl mx-auto h-screen", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/18529.jpg",
          className: "fixed z-0 h-screen w-full top-0 left-1/2 -translate-x-1/2 opacity-70"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-10 bg-red-500 text-white", children: /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-between py-2 px-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-start items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(AiFillHome, {}) }),
          /* @__PURE__ */ jsx("span", { children: header })
        ] }),
        /* @__PURE__ */ jsx("div", { children: auth.user.username })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-4 relative", children })
    ] })
  ] });
};
export {
  MobileLayout as M
};
