import { j as jsxs, a as jsx } from "../ssr.mjs";
import { S as SweetAlert } from "./SweetAlert-565cd2f8.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import "react";
import { usePage, Head } from "@inertiajs/react";
import { A as AppSidebar } from "./AppSidebar-66e8729f.mjs";
import { S as Separator } from "./separator-6fdc070c.mjs";
import { S as Sidebar, a as SidebarHeader, b as SidebarMenu, c as SidebarMenuItem, d as SidebarMenuButton, e as SidebarContent, f as SidebarGroup, g as SidebarMenuSub, h as SidebarMenuSubItem, i as SidebarMenuSubButton, j as SidebarRail, k as SidebarProvider, l as SidebarInset, m as SidebarTrigger, D as DropdownProfile } from "./DropdownProfile-f572cff8.mjs";
import { GalleryVerticalEnd } from "lucide-react";
const data = {
  navMain: [
    {
      title: "HOME",
      url: "#",
      items: [
        {
          title: "WEB APPLICATION",
          url: "#"
        },
        {
          title: "MANTRI APPLICATION",
          url: "#"
        }
      ]
    },
    {
      title: "DATA KARYAWAN",
      url: "#"
    },
    {
      title: "#",
      url: "#",
      items: [
        {
          title: "Buku Transaksi",
          url: "#"
        },
        {
          title: "Fast Create",
          url: "#"
        },
        {
          title: "Create ML",
          url: "#"
        }
      ]
    },
    {
      title: "#",
      url: "#",
      items: [
        {
          title: "Angsuran Lancar",
          url: "#"
        },
        {
          title: "Macet",
          url: "#"
        },
        {
          title: "Perbulan",
          url: "#"
        }
      ]
    },
    {
      title: "Rekap",
      url: "#",
      items: [
        {
          title: "Rekap 1 & Tunai Mantri",
          url: "#"
        },
        {
          title: "Rekap 2",
          url: "#"
        },
        {
          title: "Rencana Drop",
          url: "#"
        },
        {
          title: "Rekap Mantri",
          url: "#"
        }
      ]
    }
  ]
};
function WebSidebar({ ...props }) {
  return /* @__PURE__ */ jsxs(Sidebar, { ...props, children: [
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "#", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground", children: /* @__PURE__ */ jsx(GalleryVerticalEnd, { className: "size-4" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 leading-none", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Documentation" }),
        /* @__PURE__ */ jsx("span", { className: "", children: "v1.0.0" })
      ] })
    ] }) }) }) }) }),
    /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: data.navMain.map((item) => {
      var _a;
      return /* @__PURE__ */ jsxs(SidebarMenuItem, { children: [
        /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, children: /* @__PURE__ */ jsx("a", { href: item.url, className: "font-medium", children: item.title }) }),
        ((_a = item.items) == null ? void 0 : _a.length) ? /* @__PURE__ */ jsx(SidebarMenuSub, { children: item.items.map((item2) => /* @__PURE__ */ jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, { asChild: true, isActive: item2.isActive, children: /* @__PURE__ */ jsx("a", { href: item2.url, children: item2.title }) }) }, item2.title)) }) : null
      ] }, item.title);
    }) }) }) }),
    /* @__PURE__ */ jsx(SidebarRail, {})
  ] });
}
function Authenticated({ title, children, loading = false }) {
  const { errors, flash, auth } = usePage().props;
  const requiredPermission = ["unit staff", "unit kasir"];
  const showSideBar = requiredPermission.some(
    (permission) => auth.permissions.includes(permission)
  );
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    Object.keys(errors).length > 0 && /* @__PURE__ */ jsx(SweetAlert, { type: "error", message: errors[0], keys: flash }),
    flash.message && /* @__PURE__ */ jsx(SweetAlert, { type: "success", message: flash.message, keys: flash }),
    /* @__PURE__ */ jsx(Loading, { show: loading }),
    showSideBar ? /* @__PURE__ */ jsx(WebSidebar, {}) : /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsx("header", { className: "flex items-center h-10 gap-2 border-b lg:h-16 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full px-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-4 mr-2" })
        ] }),
        /* @__PURE__ */ jsx(DropdownProfile, {})
      ] }) }),
      /* @__PURE__ */ jsx(Head, { title }),
      /* @__PURE__ */ jsx("div", { className: "relative p-4 antialiased max-w-screen", children })
    ] })
  ] });
}
export {
  Authenticated as A
};
