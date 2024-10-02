import { j as jsxs, a as jsx } from "../ssr.mjs";
import { M as MobileLayout } from "./MobileLayout-2614584c.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import "./card-1314102b.mjs";
import { usePage, Link } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Layers, HandCoinsIcon, UserX, BookA, BookCheck, BookMarked } from "lucide-react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-306ada45.mjs";
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
    /* @__PURE__ */ jsxs("fieldset", { className: "grid gap-6 p-4 mt-3 border rounded-lg", children: [
      /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Laporan" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-around gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.buku_angsuran"), children: /* @__PURE__ */ jsx(BookA, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Buku Angsuran" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.buku_storting"), children: /* @__PURE__ */ jsx(BookCheck, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Buku Storting" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.buku_rekap"), children: /* @__PURE__ */ jsx(HandCoinsIcon, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Rekap Mantri" })
        ] })
      ] })
    ] }),
    auth.permissions.includes("can update") && /* @__PURE__ */ jsxs("fieldset", { className: "grid gap-6 p-4 mt-3 border rounded-lg", children: [
      /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Menu Kepala & Pimpinan" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-around gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("home"), children: /* @__PURE__ */ jsx(MagnifyingGlassIcon, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Web Apps" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Button, { size: "icon2xl", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.buku_transaksi_kepala"), children: /* @__PURE__ */ jsx(BookMarked, { className: "h-7 w-7" }) }) }),
          /* @__PURE__ */ jsx("div", { children: "Buku Transaksi" })
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
