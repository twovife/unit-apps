import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-a7cc8935.mjs";
import { useForm } from "@inertiajs/react";
import { L as Label } from "./label-7289427a.mjs";
import { I as Input } from "./input-a726a844.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
const Role = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    type: "role"
  });
  const onChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("adminpanel.post_permission"), {
      onSuccess: () => {
        reset("name");
      }
    });
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-1/4", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Generate Permission" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Permission" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Role Name" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            required: true,
            name: "name",
            onChange,
            value: data.name,
            id: "name"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "mt-3", children: "Submit" })
    ] }) })
  ] });
};
export {
  Role as default
};
