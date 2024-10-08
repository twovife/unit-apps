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
      className: `flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-` + className,
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
