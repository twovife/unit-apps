import { a as jsx } from "../ssr.mjs";
import { B as Badge } from "./badge-985735af.mjs";
import "./button-6facd6da.mjs";
import "react";
const variantMap = {
  open: "blue",
  acc: "green",
  success: "green",
  tolak: "destructive",
  gagal: "destructive",
  lama: "old",
  baru: "new"
};
const BadgeStatus = ({ value, onClick, ...props }) => {
  const variant = variantMap[value] || "default";
  return /* @__PURE__ */ jsx(Badge, { ...props, onClick, size: "xs", variant, children: value });
};
export {
  BadgeStatus as B
};
