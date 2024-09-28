import { a as jsx } from "../ssr.mjs";
import "./badge-3e44e85b.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import "react";
const variantMap = {
  open: "blue",
  acc: "green",
  success: "green",
  tolak: "destructive",
  gagal: "destructive",
  lama: "outline",
  baru: "yellow",
  true: "green",
  false: "destructive"
};
const BargeStatus = ({ value, children, onClick, ...props }) => {
  const variant = variantMap[value] || "default";
  return /* @__PURE__ */ jsx(Button, { ...props, onClick, size: "xs", variant, children: value || children });
};
export {
  BargeStatus as B
};
