import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-BpUiURcU.js";
import "react";
import "./TextInput-GCtCMl-T.js";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./UpdatePasswordForm-RwIvHpZs.js";
import UpdateProfileInformation from "./UpdateProfileInformationForm-C_BkfLV9.js";
import { M as MobileLayout } from "./MobileLayout-BQoCFD3J.js";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./button-MTjEwktD.js";
import "./input-BHD-__le.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-8a8NNlps.js";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
function Edit({ auth, mustVerifyEmail, status }) {
  const permissionMantri = auth.roles.includes("mantri");
  const Layout = permissionMantri ? MobileLayout : Authenticated;
  return /* @__PURE__ */ jsxs(
    Layout,
    {
      auth,
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Profile" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Profile" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-white shadow-sm sm:p-8 sm:rounded-lg", children: /* @__PURE__ */ jsx(
            UpdateProfileInformation,
            {
              mustVerifyEmail,
              status,
              className: "max-w-xl"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-white shadow-sm sm:p-8 sm:rounded-lg", children: /* @__PURE__ */ jsx(UpdatePasswordForm, { className: "max-w-xl" }) })
        ] }) })
      ]
    }
  );
}
export {
  Edit as default
};
