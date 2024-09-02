import { a as jsx, j as jsxs } from "../ssr.mjs";
import { L as Loading } from "./Loading-649771fa.mjs";
import { S as SweetAlert, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem } from "./SweetAlert-290d4aa4.mjs";
import { Link, usePage } from "@inertiajs/react";
import * as React from "react";
import { useState } from "react";
import Hamburger from "hamburger-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-efa289ef.mjs";
import { B as Button } from "./button-9a023ace.mjs";
import { UserRoundPlusIcon, Handshake, HandCoinsIcon, Wrench, UserRound } from "lucide-react";
const Sheet = DialogPrimitive.Root;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(DialogPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Close,
      {
        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
        children: [
          /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ]
      }
    ),
    children
  ] })
] }));
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
    ...props
  }
);
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
const SidebarMobile = ({ isOpen, setIsOpen }) => {
  return /* @__PURE__ */ jsx(
    Sheet,
    {
      open: isOpen,
      onOpenChange: (open) => open ? "" : setIsOpen(false),
      children: /* @__PURE__ */ jsx(SheetContent, { children: /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: "Menu Aplikasi" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full text-center", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                asChild: true,
                size: "iconxl",
                variant: "destructive",
                children: /* @__PURE__ */ jsx(Link, { href: route("mobile_apps.pengajuan.index_pengajuan"), children: /* @__PURE__ */ jsx(UserRoundPlusIcon, {}) })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-center", children: "Pengajuan" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full text-center", children: [
            /* @__PURE__ */ jsx(Button, { asChild: true, size: "iconxl", variant: "destructive", children: /* @__PURE__ */ jsx(Link, { children: /* @__PURE__ */ jsx(Handshake, {}) }) }),
            /* @__PURE__ */ jsx("div", { className: "text-center", children: "Transaksi" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full text-center", children: [
            /* @__PURE__ */ jsx(Button, { asChild: true, size: "iconxl", variant: "destructive", children: /* @__PURE__ */ jsx(Link, { children: /* @__PURE__ */ jsx(HandCoinsIcon, {}) }) }),
            /* @__PURE__ */ jsx("div", { className: "text-center", children: "Angsuran" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full text-center", children: [
            /* @__PURE__ */ jsx(Button, { asChild: true, size: "iconxl", variant: "destructive", children: /* @__PURE__ */ jsx(Link, { children: /* @__PURE__ */ jsx(Wrench, {}) }) }),
            /* @__PURE__ */ jsx("div", { className: "text-center", children: "User" })
          ] })
        ] }) })
      ] }) })
    }
  );
};
const MobileLayout = ({ header, children, loading = false }) => {
  const { auth } = usePage().props;
  const { errors, flash } = usePage().props;
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  return /* @__PURE__ */ jsxs("div", { className: "relative z-10 antialiased", children: [
    Object.keys(errors).length > 0 && /* @__PURE__ */ jsx(SweetAlert, { type: "error", flash: errors }),
    (flash == null ? void 0 : flash.message) && /* @__PURE__ */ jsx(SweetAlert, { type: "success", flash }),
    /* @__PURE__ */ jsx(Loading, { show: loading }),
    /* @__PURE__ */ jsxs("div", { className: "relative h-screen max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-50 flex items-center h-16 gap-4 px-3 bg-transparent", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-row items-center justify-between w-full gap-5 text-sm font-mediumlg:gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start", children: [
          /* @__PURE__ */ jsx(
            Hamburger,
            {
              distance: "md",
              toggled: isOpen,
              toggle: toggleSidebar,
              size: 16,
              rounded: true,
              color: "#020617"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "hidden font-semibold lg:block", children: "UBMI APPS" })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "flex items-center justify-center gap-3 text-sm", children: [
            auth.user.username,
            /* @__PURE__ */ jsx(UserRound, { className: "w-4 h-4 animate-pulse" })
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { children: auth.user.employee.nama_karyawan }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuItem, { children: /* @__PURE__ */ jsx(Link, { href: route("profile.edit"), children: "Profile" }) }),
            /* @__PURE__ */ jsx(DropdownMenuItem, { children: /* @__PURE__ */ jsx(
              "a",
              {
                target: "_blank",
                href: "https://www.youtube.com/watch?v=HrHDfHy0lHk",
                children: "Support"
              }
            ) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuItem, { children: /* @__PURE__ */ jsx(
              Link,
              {
                href: route("logout"),
                method: "post",
                as: "button",
                replace: "true",
                children: "Logout"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(SidebarMobile, { setIsOpen, isOpen })
      ] }) }),
      /* @__PURE__ */ jsx("div", { children })
    ] })
  ] });
};
export {
  MobileLayout as M
};
