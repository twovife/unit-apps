import { j as jsxs, a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-bada9d21.mjs";
import { Head } from "@inertiajs/react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react";
import "./button-6facd6da.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-649771fa.mjs";
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
