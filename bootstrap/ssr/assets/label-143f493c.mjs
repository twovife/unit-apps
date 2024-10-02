import { j as jsxs, a as jsx } from "../ssr.mjs";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-e5930d84.mjs";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, optional, ...props }, ref) => /* @__PURE__ */ jsxs("div", { className: "flex items-end mb-1", children: [
  /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      ref,
      className: cn(labelVariants(), className),
      ...props
    }
  ),
  /* @__PURE__ */ jsx("small", { className: `${optional && "text-gray-300 italic"} text-xs ml-2`, children: optional && `(optional)` })
] }));
Label.displayName = LabelPrimitive.Root.displayName;
export {
  Label as L
};
