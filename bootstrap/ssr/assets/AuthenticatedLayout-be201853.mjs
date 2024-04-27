import { a as jsx, j as jsxs, F as Fragment } from "../ssr.mjs";
import { createContext, useState, useContext, Fragment as Fragment$1 } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { BiSolidChevronDown } from "react-icons/bi";
import Hamburger from "hamburger-react";
import { S as SweetAlert, L as Loading } from "./Loading-dc4db3bc.mjs";
const DropDownContext = createContext();
const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };
  return /* @__PURE__ */ jsx(DropDownContext.Provider, { value: { open, setOpen, toggleOpen }, children: /* @__PURE__ */ jsx("div", { className: "relative", children }) });
};
const Trigger = ({ children }) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { onClick: toggleOpen, children }),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40",
        onClick: () => setOpen(false)
      }
    )
  ] });
};
const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-red-500",
  children
}) => {
  const { open, setOpen } = useContext(DropDownContext);
  let alignmentClasses = "origin-top";
  if (align === "left") {
    alignmentClasses = "origin-top-left left-0";
  } else if (align === "right") {
    alignmentClasses = "origin-top-right right-0";
  }
  let widthClasses = "";
  if (width === "48") {
    widthClasses = "w-48";
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Transition,
    {
      as: Fragment$1,
      show: open,
      enter: "transition ease-out duration-200",
      enterFrom: "transform opacity-0 scale-95",
      enterTo: "transform opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "transform opacity-100 scale-100",
      leaveTo: "transform opacity-0 scale-95",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute z-50 mt-2 rounded- shadow-lg ${alignmentClasses} ${widthClasses}`,
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses,
              children
            }
          )
        }
      )
    }
  ) });
};
const DropdownLink = ({ className = "", children, ...props }) => {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: "block w-full px-4 py-2 text-left text-sm leading-5 text-gray-50 hover:bg-red-700 focus:outline-none focus:bg-red-800 transition duration-150 ease-in-out " + className,
      children
    }
  );
};
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
const DropdownButton = ({ title, items, active }) => {
  const [isOpen, setIsOpen] = useState(active);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleDropdown,
        className: `flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium transition duration-300 ease-in-out border border-transparent rounded-md focus:outline-none ${isOpen ? `bg-red-100 text-gray-900  hover:text-gray-900 hover:bg-red-100` : `text-gray-600 bg-white hover:text-gray-900 hover:bg-red-100`}`,
        children: [
          title,
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
      Link,
      {
        href: item.link,
        as: "a",
        className: `block w-full px-4 py-2 text-sm text-gray-700 text-left rounded-md ring ring-red-500 ring-opacity-5 ${item.active ? `hover:bg-red-700 bg-red-600 text-white` : `hover:bg-red-100 bg-white text-slate-900`}`,
        onClick: () => {
          setIsOpen(false);
        },
        children: item["title"]
      },
      index
    )) }) })
  ] });
};
const ButtonMenu = ({ title, active, url }) => {
  return /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
    Link,
    {
      as: "a",
      href: url,
      className: `flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium transition duration-300 ease-in-out border border-transparent rounded-md focus:outline-none ${active ? (
        // ? `bg-gray-100 text-gray-900  hover:text-gray-900 hover:bg-gray-100`
        // : `text-gray-600 bg-white  hover:text-gray-900 hover:bg-gray-100`
        `hover:bg-red-200 bg-red-600 text-white`
      ) : `hover:bg-gray-100 bg-white text-slate-900`}`,
      children: title
    }
  ) });
};
const Sidebar = ({ isOpen }) => {
  const { auth } = usePage().props;
  const unitAkses = auth.user.permissions.some(
    (item) => item.name === "unit"
  );
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `bg-slate-50 text-slate-900 w-64 fixed top-14 left-0 bottom-0 z-40 transition-all ease-in-out duration-300 ${isOpen ? "translate-x-0" : "-translate-x-64"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "py-2 px-4 font-semibold", children: "Apps Menu" }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsx(
            ButtonMenu,
            {
              url: route("home"),
              title: "Home",
              active: route().current("home")
            }
          ),
          unitAkses && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ButtonMenu,
              {
                url: route("batchupdate.batch_create"),
                title: "Batch_data",
                active: route().current("batchupdate.*")
              }
            ),
            /* @__PURE__ */ jsx(
              DropdownButton,
              {
                title: "Transaksi Drop",
                active: route().current("transaction.*"),
                items: [
                  {
                    id: 1,
                    title: "Buku Transaksi",
                    link: route("transaction.index"),
                    active: route().current("transaction.*") && !route().current(
                      "transaction.index_open"
                    )
                  },
                  {
                    id: 1,
                    title: "Open Transaksi",
                    link: route("transaction.index_open"),
                    active: route().current(
                      "transaction.index_open"
                    )
                  }
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              DropdownButton,
              {
                title: "Buku Angsuran",
                active: route().current("pinjaman.*"),
                items: [
                  {
                    id: 1,
                    title: "Angsuran Normal",
                    link: route("pinjaman.normal.index"),
                    active: route().current(
                      "pinjaman.normal.*"
                    )
                  }
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            ButtonMenu,
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
  return /* @__PURE__ */ jsx("nav", { className: "bg-red-700 p-2 px-4 sticky top-0 w-full z-50 text-white", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start", children: [
      /* @__PURE__ */ jsx(
        Hamburger,
        {
          toggled: isOpen,
          toggle: toggleSidebar,
          size: 16,
          rounded: true,
          color: "#020617"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "UBMI APPS" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "font-semibold text text-white leading-tight", children: header }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center sm:ml-6", children: /* @__PURE__ */ jsx("div", { className: "ml-3 relative", children: /* @__PURE__ */ jsxs(Dropdown, { children: [
      /* @__PURE__ */ jsx(Dropdown.Trigger, { children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-md", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "inline-flex items-center text-white border border-transparent text-sm leading-4 font-medium rounded-md bg-red-700 hover:text-gray-50 focus:outline-none transition ease-in-out duration-150",
          children: [
            auth.user.username,
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "ml-2 -mr-0.5 h-4 w-4",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                    clipRule: "evenodd"
                  }
                )
              }
            )
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxs(Dropdown.Content, { children: [
        /* @__PURE__ */ jsx(Dropdown.Link, { href: route("profile.edit"), children: "Profile" }),
        /* @__PURE__ */ jsx(
          Dropdown.Link,
          {
            href: route("logout"),
            method: "post",
            as: "button",
            children: "Log Out"
          }
        )
      ] })
    ] }) }) })
  ] }) });
};
const Navbar$1 = Navbar;
function Authenticated({
  auth,
  header,
  children,
  loading = false
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { errors, flash } = usePage().props;
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    Object.keys(errors).length > 0 && /* @__PURE__ */ jsx(SweetAlert, { type: "error", flash: errors }),
    (flash == null ? void 0 : flash.message) && /* @__PURE__ */ jsx(SweetAlert, { type: "success", flash }),
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
        className: `px-4 py-6 transition-all ease-in-out bg-slate-50 duration-300 min-h-screen ${isSidebarOpen ? "ml-64" : "ml-0"}`,
        children: /* @__PURE__ */ jsx("main", { children })
      }
    )
  ] });
}
export {
  Authenticated as A
};
