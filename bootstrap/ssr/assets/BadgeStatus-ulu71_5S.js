import { jsx } from "react/jsx-runtime";
import { B as Badge } from "./badge-3Dzo-CJq.js";
import "./button-Dbmjz33H.js";
import "react";
const variantMap = {
  open: "blue",
  acc: "yellow",
  success: "green",
  tolak: "default",
  gagal: "destructive",
  lama: "outline",
  baru: "yellow",
  true: "green",
  false: "destructive",
  ml: "default",
  mb: "destructive",
  cm: "yellow",
  normal: "green"
};
const BadgeStatus = ({ value, onClick, children, ...props }) => {
  const variant = variantMap[value] || "default";
  return /* @__PURE__ */ jsx(Badge, { ...props, onClick, size: "xs", variant, children: children ?? value });
};
export {
  BadgeStatus as B
};
