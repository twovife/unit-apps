import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-a7cc8935.mjs";
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
const MaintenerWorker = ({ userOptions, roleOptions }) => {
  const { data, setData, post, reset, processing, errors, transform } = useForm(
    {
      username: "",
      type: ""
    }
  );
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const submitForm = (e) => {
    transform((prevState) => ({
      ...prevState,
      type: 1
      // Pastikan ini sesuai dengan logika yang ingin Anda capai
    }));
    post(route("adminpanel.giveMaintenerWorker"), {
      onSuccess: () => {
        reset();
      }
    });
  };
  const removeForm = (e) => {
    transform((prevState) => ({
      ...prevState,
      type: 2
      // Pastikan ini sesuai dengan logika yang ingin Anda capai
    }));
    post(route("adminpanel.giveMaintenerWorker"), {
      onSuccess: () => {
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "User Role" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => e.preventDefault(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5 mb-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "User Name" }),
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
      /* @__PURE__ */ jsx(Button, { onClick: submitForm, type: "submit", className: "mt-3", children: "Submit" }),
      /* @__PURE__ */ jsx(Button, { onClick: removeForm, type: "submit", className: "mt-3", children: "Remove" })
    ] }) })
  ] });
};
export {
  MaintenerWorker as default
};
