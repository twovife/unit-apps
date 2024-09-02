import { j as jsxs, a as jsx } from "../ssr.mjs";
import { M as MobileLayout } from "./MobileLayout-3a3dffff.mjs";
import { B as Button } from "./button-9a023ace.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-c2e72800.mjs";
import { Link } from "@inertiajs/react";
import { Notebook } from "lucide-react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "@radix-ui/react-slot";
const Index = () => {
  return /* @__PURE__ */ jsxs(MobileLayout, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Menu" }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-start gap-3 mb-3", children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "icon2xl", variant: "destructive", children: /* @__PURE__ */ jsxs(Link, { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx(Notebook, {}),
            /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Baru" })
          ] }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              size: "icon2xl",
              variant: route().current("mobile_apps.pengajuan.*") ? "default" : "destructive",
              children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("mobile_apps.pengajuan.index_pengajuan"),
                  className: "flex flex-col",
                  children: [
                    /* @__PURE__ */ jsx(Notebook, {}),
                    /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Transaksi" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "icon2xl", variant: "destructive", children: /* @__PURE__ */ jsxs(Link, { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx(Notebook, {}),
            /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Rencana" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-start gap-3", children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "icon2xl", variant: "destructive", children: /* @__PURE__ */ jsxs(Link, { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx(Notebook, {}),
            /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Angsuran" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "icon2xl", variant: "destructive", children: /* @__PURE__ */ jsxs(Link, { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx(Notebook, {}),
            /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Macet" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "icon2xl", variant: "destructive", children: /* @__PURE__ */ jsxs(Link, { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx(Notebook, {}),
            /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Storting" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "icon2xl", variant: "destructive", children: /* @__PURE__ */ jsxs(Link, { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx(Notebook, {}),
            /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Rekap" })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Detail Mantri" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: "asd" })
    ] })
  ] });
};
export {
  Index as default
};
