import { j as jsxs, a as jsx } from "../ssr.mjs";
import { M as MobileLayout } from "./MobileLayout-d1f5c58c.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import "./card-1314102b.mjs";
import { usePage, Link } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Layers, HandCoinsIcon, UserX } from "lucide-react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "@radix-ui/react-slot";
const Index = () => {
  const { auth } = usePage().props;
  return /* @__PURE__ */ jsxs(MobileLayout, { children: [
    /* @__PURE__ */ jsxs("fieldset", { className: "grid gap-6 p-4 border rounded-lg", children: [
      /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Mantri" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-around gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.create"), children: /* @__PURE__ */ jsx(MagnifyingGlassIcon, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Pengajuan" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.transaksi"), children: /* @__PURE__ */ jsx(Layers, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Drop" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.angsuran"), children: /* @__PURE__ */ jsx(HandCoinsIcon, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Angsuran" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.macet"), children: /* @__PURE__ */ jsx(UserX, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Macet" })
        ] })
      ] })
    ] }),
    auth.permissions.includes("can show unit") && /* @__PURE__ */ jsxs("fieldset", { className: "grid gap-6 p-4 mt-3 border rounded-lg", children: [
      /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Laporan" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-around gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "#", children: /* @__PURE__ */ jsx(MagnifyingGlassIcon, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Web Apps" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "#", children: /* @__PURE__ */ jsx(HandCoinsIcon, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Rekap" })
        ] })
      ] })
    ] })
  ] });
};
export {
  Index as default
};
