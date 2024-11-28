import { j as jsxs, a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-e9837d3f.mjs";
import "react";
import "./TextInput-11198f62.mjs";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./UpdatePasswordForm-d31a10e3.mjs";
import UpdateProfileInformation from "./UpdateProfileInformationForm-fdb709e6.mjs";
import { M as MobileLayout } from "./MobileLayout-196226fb.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-065cc1f1.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "@radix-ui/react-dialog";
function Edit({ auth, mustVerifyEmail, status }) {
  const permissionMantri = auth.permissions.includes("unit mantri");
  const Layout = permissionMantri ? MobileLayout : Authenticated;
  return /* @__PURE__ */ jsxs(
    Layout,
    {
      auth,
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Profile" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Profile" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-white shadow sm:p-8 sm:rounded-lg", children: /* @__PURE__ */ jsx(
            UpdateProfileInformation,
            {
              mustVerifyEmail,
              status,
              className: "max-w-xl"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-white shadow sm:p-8 sm:rounded-lg", children: /* @__PURE__ */ jsx(UpdatePasswordForm, { className: "max-w-xl" }) })
        ] }) })
      ]
    }
  );
}
export {
  Edit as default
};
