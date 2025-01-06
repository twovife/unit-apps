import { a as jsx, j as jsxs } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-1b2491b5.mjs";
import "react";
import { Home, Layers, HandCoinsIcon, UserX } from "lucide-react";
import "./DropdownProfile-f572cff8.mjs";
import { B as Button } from "./button-e7ccf50f.mjs";
import { usePage, Link } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import "./separator-6fdc070c.mjs";
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
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./use-mobile-f8f7682a.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./input-22e7db4a.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-separator";
const Index = () => {
  usePage().props;
  return /* @__PURE__ */ jsx(Authenticated, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 auto-rows-min md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 font-sans rounded-xl aspect-21/9", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center flex-1 h-full p-4 bg-red-600 rounded-lg shadow ", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold tracking-wider text-gray-200", children: "RENCANA" }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-gray-200", children: "Rp. 4.000.000" }),
          /* @__PURE__ */ jsx("div", { className: "text-end", children: /* @__PURE__ */ jsx(Button, { variant: "destructiveoutline2", size: "xs", children: "Go" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center flex-1 h-full p-4 rounded-lg shadow bg-gray-200/20", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold tracking-wider text-gray-800", children: "DROP" }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-red-600", children: "Rp. 4.000.000" }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs leading-4 text-gray-500", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: "Baru" }),
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[4]", children: "2.000.000" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: "Lama" }),
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[4]", children: "2.000.000" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 font-sans rounded-xl aspect-21/9", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center flex-1 h-full p-4 rounded-lg shadow bg-gray-200/20", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold tracking-wider text-gray-800", children: "TARGET" }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-red-600", children: "Rp. 4.000.000" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center flex-1 h-full p-4 rounded-lg shadow bg-gray-200/20", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold tracking-wider text-gray-800", children: "STORTING" }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-red-600", children: "Rp. 4.000.000" }),
          /* @__PURE__ */ jsx("div", { className: "text-end", children: /* @__PURE__ */ jsx(Button, { variant: "destructiveoutline2", size: "xs", children: "Go" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "items-start hidden gap-3 p-4 font-sans shadow xl:flex rounded-xl xl:aspect-21/9" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 rounded-xl bg-muted/50 md:min-h-min", children: /* @__PURE__ */ jsxs("div", { className: "grid w-full grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          className: "w-full h-16",
          asChild: true,
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              className: "flex flex-col justify-center",
              href: route("mobile_apps.index"),
              children: [
                /* @__PURE__ */ jsx(Home, {}),
                /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Home" })
              ]
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          className: "w-full h-16",
          asChild: true,
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              className: "flex flex-col justify-center",
              href: route("mobile_apps.create"),
              children: [
                /* @__PURE__ */ jsx(MagnifyingGlassIcon, { className: "h-7 w-7" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Pengajuan" })
              ]
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          className: "w-full h-16",
          asChild: true,
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              className: "flex flex-col justify-center",
              href: route("mobile_apps.transaksi"),
              children: [
                /* @__PURE__ */ jsx(Layers, { className: "h-7 w-7" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Drop" })
              ]
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          className: "w-full h-16",
          asChild: true,
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              className: "flex flex-col justify-center",
              href: route("mobile_apps.angsuran"),
              children: [
                /* @__PURE__ */ jsx(HandCoinsIcon, { className: "h-7 w-7" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Angsuran" })
              ]
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          className: "w-full h-16",
          asChild: true,
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              className: "flex flex-col justify-center",
              href: route("mobile_apps.macet"),
              children: [
                /* @__PURE__ */ jsx(UserX, { className: "h-7 w-7" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Macet" })
              ]
            }
          )
        }
      ) })
    ] }) })
  ] }) });
};
export {
  Index as default
};
