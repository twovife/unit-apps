import { a as jsx } from "../ssr.mjs";
import "react";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-efa289ef.mjs";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        green: "border-transparent bg-green-500 text-white shadow hover:bg-green-500/80",
        yellow: "border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80",
        blue: "border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
export {
  Badge as B
};
