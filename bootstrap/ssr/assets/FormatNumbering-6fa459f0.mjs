import { a as jsx } from "../ssr.mjs";
import "react";
import { NumericFormat } from "react-number-format";
const FormatNumbering = ({ value = 0, prefix }) => {
  return /* @__PURE__ */ jsx("div", { className: "text-end", children: /* @__PURE__ */ jsx(
    NumericFormat,
    {
      value,
      displayType: "text",
      thousandSeparator: ",",
      prefix: prefix ?? ""
    }
  ) });
};
export {
  FormatNumbering as F
};
