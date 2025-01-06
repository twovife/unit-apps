import { a as jsx } from "../ssr.mjs";
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { c as cn } from "./utils-efa289ef.mjs";
const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
  SeparatorPrimitive.Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = SeparatorPrimitive.Root.displayName;
export {
  Separator as S
};
