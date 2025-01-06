import { j as jsxs, a as jsx } from "../ssr.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-1b2491b5.mjs";
import "react";
import "./TextInput-11198f62.mjs";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./UpdatePasswordForm-31130472.mjs";
import UpdateProfileInformation from "./UpdateProfileInformationForm-fdb709e6.mjs";
import { M as MobileLayout } from "./MobileLayout-a011c42b.mjs";
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
import "lucide-react";
import "./DropdownProfile-f572cff8.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./use-mobile-f8f7682a.mjs";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./button-e7ccf50f.mjs";
import "./input-22e7db4a.mjs";
import "./separator-6fdc070c.mjs";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
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
