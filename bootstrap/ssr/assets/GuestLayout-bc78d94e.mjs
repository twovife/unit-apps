import { a as jsx } from "../ssr.mjs";
import "@inertiajs/react";
function Guest({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-screen min-h-screen", children });
}
export {
  Guest as G
};
