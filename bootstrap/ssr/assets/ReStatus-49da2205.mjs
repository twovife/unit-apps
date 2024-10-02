import { j as jsxs, a as jsx } from "../ssr.mjs";
import { L as Loading } from "./Loading-306ada45.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { L as Label } from "./label-143f493c.mjs";
import { useForm } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
const ReStatus = ({ triggeredId, onClosed }) => {
  const { data, setData, put, processing, reset } = useForm({});
  const onChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("transaction.updateEverything", triggeredId), {
      preventDefault: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx(Label, { htmlFor: "status", children: "Status" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(
        SelectList,
        {
          onChange,
          value: data.status,
          id: "status",
          nullValue: true,
          required: true,
          name: "status",
          options: [{ id: 1, value: "open", display: "Open" }]
        }
      ),
      /* @__PURE__ */ jsx(Button, { type: "submit", children: "Ubah" })
    ] })
  ] });
};
export {
  ReStatus as default
};
