import { j as jsxs, a as jsx } from "../ssr.mjs";
import { useEffect } from "react";
import { G as Guest } from "./GuestLayout-bc78d94e.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { useForm, Head } from "@inertiajs/react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: ""
  });
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const handleOnChange = (event) => {
    setData(event.target.name, event.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("password.confirm"));
  };
  return /* @__PURE__ */ jsxs(Guest, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Confirm Password" }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: "This is a secure area of the application. Please confirm your password before continuing." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "Password" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password",
            type: "password",
            name: "password",
            value: data.password,
            className: "mt-1 block w-full",
            isFocused: true,
            onChange: handleOnChange
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end mt-4", children: /* @__PURE__ */ jsx(PrimaryButton, { className: "ml-4", disabled: processing, children: "Confirm" }) })
    ] })
  ] });
}
export {
  ConfirmPassword as default
};
