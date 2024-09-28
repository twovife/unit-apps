import { a as jsx } from "../ssr.mjs";
import * as React from "react";
import { c as cn } from "./utils-e5930d84.mjs";
const Input = React.forwardRef(
  ({ className, type, isFocused = false, ...props }, ref) => {
    const inputRef = React.useRef(null);
    React.useEffect(() => {
      var _a;
      if (isFocused) {
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      }
    }, []);
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref: inputRef,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
export {
  Input as I
};
