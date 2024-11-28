import { j as jsxs, a as jsx } from "../ssr.mjs";
import { useState } from "react";
import { N as Navbar, S as Sidebar } from "./Navbar-065cc1f1.mjs";
import { usePage } from "@inertiajs/react";
import { S as SweetAlert } from "./SweetAlert-e5a75d04.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
function Authenticated({ header, children, loading = false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { errors, flash, auth } = usePage().props;
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    Object.keys(errors).length > 0 && /* @__PURE__ */ jsx(SweetAlert, { type: "error", message: errors[0], keys: flash }),
    flash.message && /* @__PURE__ */ jsx(SweetAlert, { type: "success", message: flash.message, keys: flash }),
    /* @__PURE__ */ jsx(Loading, { show: loading }),
    /* @__PURE__ */ jsx(
      Navbar,
      {
        isOpen: isSidebarOpen,
        toggleSidebar,
        auth,
        header
      }
    ),
    /* @__PURE__ */ jsx(Sidebar, { isOpen: isSidebarOpen }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `px-4 py-6 transition-all ease-in-out  duration-300 h-auto bg-white min-h-[calc(100vh-4rem)]  ${isSidebarOpen ? "ml-64" : "ml-0"}`,
        children: /* @__PURE__ */ jsx("main", { children })
      }
    )
  ] });
}
export {
  Authenticated as A
};
