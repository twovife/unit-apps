import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { A as AppSidebar } from "./AppSidebar-66e8729f.mjs";
import { S as Separator } from "./separator-6fdc070c.mjs";
import { k as SidebarProvider, l as SidebarInset, m as SidebarTrigger, D as DropdownProfile } from "./DropdownProfile-f572cff8.mjs";
import "./button-e7ccf50f.mjs";
const MobileLayout = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsx("header", { className: "flex items-center h-10 gap-2 border-b lg:h-16 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full px-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-4 mr-2" })
        ] }),
        /* @__PURE__ */ jsx(DropdownProfile, {})
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "relative p-4 antialiased", children })
    ] })
  ] });
};
export {
  MobileLayout as M
};
