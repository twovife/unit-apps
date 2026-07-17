import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-1b2491b5.mjs";
import "./button-e7ccf50f.mjs";
import { usePage, Head } from "@inertiajs/react";
import MantriDashboard from "./MantriDashboard-dbe8b322.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./SweetAlert-565cd2f8.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./AppSidebar-66e8729f.mjs";
import "lucide-react";
import "./DropdownProfile-f572cff8.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./use-mobile-f8f7682a.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./input-22e7db4a.mjs";
import "./separator-6fdc070c.mjs";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
function Dashboard(props) {
  const { auth } = usePage().props;
  const requiredPermission = ["unit staff", "unit kasir"];
  const showSideBar = requiredPermission.some(
    (permission) => auth.permissions.includes(permission)
  );
  return /* @__PURE__ */ jsxs(Authenticated, { auth: props.auth, errors: props.errors, header: "Home", children: [
    /* @__PURE__ */ jsx(Head, { title: "Home" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-1 gap-4", children: showSideBar ? "" : /* @__PURE__ */ jsx(MantriDashboard, {}) })
  ] });
}
export {
  Dashboard as default
};
