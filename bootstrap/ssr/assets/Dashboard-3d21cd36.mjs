import { j as jsxs, a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-504e4605.mjs";
import { Head } from "@inertiajs/react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
function Dashboard(props) {
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Home",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Home" }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5", children: "You're logged in!" }) })
      ]
    }
  );
}
export {
  Dashboard as default
};
