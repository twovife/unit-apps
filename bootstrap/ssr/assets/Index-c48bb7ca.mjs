import { j as jsxs, a as jsx } from "../ssr.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-c2e72800.mjs";
import "react";
import Permission from "./Permission-02b1b439.mjs";
import Role from "./Role-3021e056.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-f2148aae.mjs";
import { L as Label } from "./label-cecd7064.mjs";
import "./input-a726a844.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { useForm } from "@inertiajs/react";
import AssignRoles from "./AssignRoles-fb9d7d69.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./Navbar-1bf9f9af.mjs";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
const Index = ({ role, permission, user, ...props }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    role: "",
    permission: []
  });
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const onCheckboxChange = (e) => {
    const checkboxes = document.querySelectorAll(
      '.checkbox-group input[type="checkbox"]'
    );
    const selectedPermissions = Array.from(checkboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.name);
    setData((prevState) => ({
      ...prevState,
      permission: selectedPermissions
    }));
  };
  const roleOptions = role.map((role2) => {
    return {
      display: role2.name,
      value: role2.id,
      id: role2.id
    };
  });
  console.log(roleOptions);
  const userOptions = user.map((emp) => {
    return {
      display: emp.username,
      value: emp.id,
      id: emp.id
    };
  });
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("adminpanel.role_assign"), {
      onSuccess: () => {
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3 mb-3", children: [
      /* @__PURE__ */ jsx(Permission, {}),
      /* @__PURE__ */ jsx(Role, {}),
      /* @__PURE__ */ jsxs(Card, { className: "w-1/2", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Generate Permission" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Permission" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5 mb-3", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "role", children: "Role Name" }),
            /* @__PURE__ */ jsx(
              SelectList,
              {
                options: roleOptions,
                label: "Role",
                placeholder: "Select Role",
                required: true,
                name: "role",
                onChange: handleChange,
                value: data.role,
                id: "role",
                nullvalue: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 checkbox-group", children: data.role && permission.map((pemit, key) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center flex-1 gap-3 whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    name: pemit.name,
                    onChange: onCheckboxChange,
                    placeholder: "Select Permission",
                    id: pemit.name
                  }
                ),
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: pemit.name, children: pemit.name })
              ]
            },
            key
          )) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "mt-3", children: "Submit" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full gap-3", children: /* @__PURE__ */ jsx(AssignRoles, { userOptions, roleOptions }) })
  ] });
};
export {
  Index as default
};
