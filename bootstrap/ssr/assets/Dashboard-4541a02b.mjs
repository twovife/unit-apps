import { j as jsxs, a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-be201853.mjs";
import { Head } from "@inertiajs/react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react";
import "@headlessui/react";
import "react-icons/bi";
import "hamburger-react";
import "./Loading-dc4db3bc.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
function Dashboard(props) {
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Home",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Home" }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md", children: "You're logged in!" }) })
      ]
    }
  );
}
export {
  Dashboard as default
};
