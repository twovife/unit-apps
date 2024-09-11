import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { createContext, useState } from "react";
import "react/jsx-runtime";
import { Link, usePage } from "@inertiajs/react";
import { B as Button } from "./button-6facd6da.mjs";
import { LayoutList, GitMerge, UserRound } from "lucide-react";
import { BiSolidChevronDown } from "react-icons/bi";
import Hamburger from "hamburger-react";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem, S as SweetAlert } from "./SweetAlert-290d4aa4.mjs";
import { L as Loading } from "./Loading-649771fa.mjs";
createContext();
const DropdownButton = ({ title, items, active, className, icon }) => {
  const [isOpen, setIsOpen] = useState(active);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        type: "button",
        variant: isOpen ? "" : "outline",
        onClick: toggleDropdown,
        className: `${className} w-full flex justify-start items-center`,
        children: [
          icon ? icon : /* @__PURE__ */ jsx(LayoutList, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 w-full text-start", children: title }),
          /* @__PURE__ */ jsx(
            BiSolidChevronDown,
            {
              className: `${isOpen ? "transform rotate-180" : ""} w-5 h-5 transition-all duration-300`
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "w-full mt-2 origin-top-right rounded-md", children: /* @__PURE__ */ jsx("div", { className: "py-1 space-y-2", children: items.map((item, index) => /* @__PURE__ */ jsx(
      Button,
      {
        asChild: true,
        variant: item.active ? "destructive" : "outline",
        className: `${className} w-full flex justify-start items-center`,
        onClick: () => setIsOpen(false),
        children: /* @__PURE__ */ jsxs(Link, { href: item.link, children: [
          /* @__PURE__ */ jsx(GitMerge, { className: "w-4 h-4 mr-2" }),
          item["title"]
        ] })
      },
      index
    )) }) })
  ] });
};
const MenuButton = ({
  title = "Menu Baru",
  className,
  active,
  icon,
  href = "#"
}) => {
  return /* @__PURE__ */ jsx(
    Button,
    {
      asChild: true,
      variant: active ? "" : "outline",
      className: `${className} w-full flex justify-start items-center`,
      children: /* @__PURE__ */ jsxs(Link, { href, children: [
        icon ? icon : /* @__PURE__ */ jsx(LayoutList, { className: "mr-2 h-4 w-4" }),
        " ",
        title
      ] })
    }
  );
};
const Sidebar = ({ isOpen }) => {
  const { auth } = usePage().props;
  const unitAkses = auth.permissions.includes("unit apps");
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `bg-white text-slate-900 w-64 fixed top-16 left-0 bottom-0 z-40 transition-all ease-in-out duration-300 border-r shadow ${isOpen ? "translate-x-0" : "-translate-x-64"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "px-4 py-4 font-semibold border-b", children: "Apps Menu" }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsx(
            MenuButton,
            {
              href: route("home"),
              title: "Home",
              active: route().current("home")
            }
          ),
          unitAkses && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(MenuButton, { title: "Data Karyawan" }),
            /* @__PURE__ */ jsx(
              DropdownButton,
              {
                title: "Buku Transaksi",
                active: route().current("transaction.*"),
                items: [
                  {
                    id: 1,
                    title: "Buku Transaksi Mantri",
                    link: route("transaction.index_buku_transaksi"),
                    active: route().current("transaction.index_buku_transaksi")
                  }
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              DropdownButton,
              {
                title: "Angsuran",
                active: route().current("pinjaman.*"),
                items: [
                  {
                    id: 1,
                    title: "Angsuran Lancar",
                    link: route("pinjaman.index_pinjaman"),
                    active: route().current("pinjaman.index_pinjaman")
                  },
                  {
                    id: 2,
                    title: "Cari Angsuran / Macet",
                    link: route("pinjaman.index_pinjaman_search"),
                    active: route().current("pinjaman.index_pinjaman_search")
                  }
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            MenuButton,
            {
              url: route("mantriapps.index"),
              title: "Mantri Apps",
              active: route().current("mantriapps.*")
            }
          )
        ] })
      ]
    }
  );
};
const Sidebar$1 = Sidebar;
const Navbar = ({ toggleSidebar, isOpen, auth, header }) => {
  useState(false);
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 z-50", children: /* @__PURE__ */ jsxs("nav", { className: "font-medium flex flex-row w-full items-center gap-5 text-sm lg:gap-6", children: [
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
      /* @__PURE__ */ jsx("p", { className: "font-semibold hidden lg:block", children: "UBMI APPS" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full flex-1 flex gap-6 underline", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "#",
          className: "text-muted-foreground transition-colors hover:text-foreground",
          children: "Home"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "#",
          className: "text-muted-foreground transition-colors hover:text-foreground",
          children: "Mantri Apps"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "flex items-center justify-center gap-3 text-sm", children: [
        auth.user.username,
        /* @__PURE__ */ jsx(UserRound, { className: "h-4 w-4 animate-pulse" })
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
    ] })
  ] }) });
};
const Navbar$1 = Navbar;
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
      Navbar$1,
      {
        isOpen: isSidebarOpen,
        toggleSidebar,
        auth,
        header
      }
    ),
    /* @__PURE__ */ jsx(Sidebar$1, { isOpen: isSidebarOpen }),
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
