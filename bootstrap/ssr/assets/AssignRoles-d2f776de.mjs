import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-c2e72800.mjs";
import { useForm } from "@inertiajs/react";
import { L as Label } from "./label-7289427a.mjs";
import "./input-a726a844.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
const AssignRoles = ({ userOptions, roleOptions }) => {
  const { data, setData, post, reset, processing, errors } = useForm({
    username: "",
    role: ""
  });
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const submitForm = (e) => {
    e.preventDefault();
    post(route("adminpanel.user_assign"), {
      onSuccess: () => {
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-1/2", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "User Role" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: submitForm, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5 mb-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Role Name" }),
        /* @__PURE__ */ jsx(
          SelectList,
          {
            options: userOptions,
            required: true,
            name: "username",
            onChange: handleChange,
            value: data.username,
            id: "username",
            nullvalue: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5 mb-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "role", children: "Role Name" }),
        /* @__PURE__ */ jsx(
          SelectList,
          {
            options: roleOptions,
            required: true,
            name: "role",
            onChange: handleChange,
            value: data.role,
            id: "role",
            nullvalue: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "mt-3", children: "Submit" })
    ] }) })
  ] });
};
export {
  AssignRoles as default
};
