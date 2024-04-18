import { a as jsx, j as jsxs, F as Fragment } from "../ssr.mjs";
import "react";
function SelectList({
  name,
  value,
  className,
  required = true,
  handleChange,
  options,
  nullValue,
  nullvalue,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "select",
    {
      name,
      value,
      className: `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 ` + className,
      required,
      ...props,
      children: options ? /* @__PURE__ */ jsxs(Fragment, { children: [
        nullValue || nullvalue ? /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Salah Satu" }) : null,
        options.map((opt) => /* @__PURE__ */ jsx(
          "option",
          {
            value: opt.value,
            children: opt.display
          },
          opt.id
        ))
      ] }) : /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Salah Satu" })
    }
  );
}
export {
  SelectList as S
};
