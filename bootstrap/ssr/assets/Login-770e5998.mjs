import { j as jsxs, a as jsx } from "../ssr.mjs";
import { useEffect } from "react";
import { G as Guest } from "./GuestLayout-bc78d94e.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { useForm, Head } from "@inertiajs/react";
import { I as Input } from "./input-7eb6bb1b.mjs";
import { L as Label } from "./label-143f493c.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-1314102b.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { L as Loading } from "./Loading-7f1a61e6.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "react-dom";
import "@headlessui/react";
function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    password: "",
    remember: ""
  });
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Log in" }),
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsxs(Card, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Login" }),
        /* @__PURE__ */ jsx(CardDescription, { children: status ? status : "Enter your username below to login to your account" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { className: "grid gap-4", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              name: "username",
              type: "text",
              placeholder: "username",
              required: true,
              autoComplete: "username",
              isFocused: true,
              value: data.username,
              onChange: (e) => setData("username", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.username, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              name: "password",
              type: "password",
              required: true,
              value: data.password,
              onChange: (e) => setData("password", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Login" })
      ] }) })
    ] })
  ] });
}
export {
  Login as default
};
