import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { GalleryVerticalEnd, Home, Layers, HandCoinsIcon, UserX } from "lucide-react";
import { S as Sidebar, a as SidebarHeader, b as SidebarMenu, c as SidebarMenuItem, d as SidebarMenuButton, e as SidebarContent, f as SidebarGroup, j as SidebarRail } from "./DropdownProfile-f572cff8.mjs";
import { B as Button } from "./button-e7ccf50f.mjs";
import { Link } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { S as Separator } from "./separator-6fdc070c.mjs";
function AppSidebar({ ...props }) {
  return /* @__PURE__ */ jsxs(Sidebar, { ...props, children: [
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "#", children: [
      /* @__PURE__ */ jsx("div", { className: "flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground", children: /* @__PURE__ */ jsx(GalleryVerticalEnd, { className: "size-4" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 leading-none", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "UBM APPS" }),
        /* @__PURE__ */ jsx("span", { className: "", children: "DIGITAL APPS" })
      ] })
    ] }) }) }) }) }),
    /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsxs(SidebarMenu, { children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-400", children: "Menu Utama" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
      ] }),
      /* @__PURE__ */ jsx(Separator, { orientation: "horizontal", className: "mt-2 w-full" }),
      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-400", children: "Menu Laporan" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
      ] }),
      /* @__PURE__ */ jsx(Separator, { orientation: "horizontal", className: "mt-2 w-full" }),
      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-400", children: "Menu Pimpinan" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
            className: "h-16 w-full",
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
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(SidebarRail, {})
  ] });
}
export {
  AppSidebar as A
};
