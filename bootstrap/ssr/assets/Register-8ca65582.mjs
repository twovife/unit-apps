import { j as jsxs, a as jsx } from "../ssr.mjs";
import { useEffect, useState } from "react";
import { useForm, usePage, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-fd246ae3.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-6bb941e8.mjs";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
function Register({ employees }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    employee_id: "",
    password: "",
    password_confirmation: ""
  });
  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);
  const { auth } = usePage().props;
  const superman = auth.permissions.includes("can update pusat");
  console.log(superman);
  const handleOnChange = (event) => {
    setData(
      event.target.name,
      event.target.type === "checkbox" ? event.target.checked : event.target.value
    );
  };
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    const empopt = employees.map((item) => {
      return {
        id: item.id,
        display: `${item.nama_karyawan} - ${item.jabatan} - ${item.area}`,
        value: item.id
      };
    });
    setEmployee(empopt);
  }, [employees]);
  const submit = (e) => {
    e.preventDefault();
    post(route("register"));
  };
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx(Head, { title: "Register" }),
    superman && /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "employee_id", value: "Nama Karyawan" }),
        /* @__PURE__ */ jsx(
          SelectList,
          {
            id: "employee_id",
            name: "employee_id",
            value: data.employee_id,
            className: "mt-1 block w-full",
            options: employee,
            nullvalue: true,
            onChange: handleOnChange,
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.employee_id, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "username", value: "username" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "username",
            name: "username",
            value: data.username,
            className: "mt-1 block w-full",
            autoComplete: "username",
            onChange: handleOnChange,
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.username, className: "mt-2" })
      ] }),
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
            autoComplete: "new-password",
            onChange: handleOnChange,
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "password_confirmation",
            value: "Confirm Password"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password_confirmation",
            type: "password",
            name: "password_confirmation",
            value: data.password_confirmation,
            className: "mt-1 block w-full",
            autoComplete: "new-password",
            onChange: handleOnChange,
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.password_confirmation,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end mt-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("login"),
            className: "underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            children: "Already registered?"
          }
        ),
        /* @__PURE__ */ jsx(Button, { className: "ml-4", disabled: processing, children: "Register" })
      ] })
    ] })
  ] });
}
export {
  Register as default
};
