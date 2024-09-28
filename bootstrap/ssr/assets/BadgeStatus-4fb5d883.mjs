import { a as jsx } from "../ssr.mjs";
import { B as Badge } from "./badge-3e44e85b.mjs";
import "./button-5b8f0147.mjs";
import "react";
const variantMap = {
  open: "blue",
  acc: "green",
  success: "green",
  tolak: "destructive",
  gagal: "destructive",
  lama: "old",
  baru: "new",
  true: "green",
  false: "destructive"
};
const BadgeStatus = ({ value, onClick, children, ...props }) => {
  const variant = variantMap[value] || "default";
  return /* @__PURE__ */ jsx(Badge, { ...props, onClick, size: "xs", variant, children: value || children });
};
export {
  BadgeStatus as B
};
