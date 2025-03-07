import { jsx } from "react/jsx-runtime";
import "react";
import "./Dropdown-tAzvTn5J.js";
import { Head } from "@inertiajs/react";
import "./button-Dbmjz33H.js";
import "./dropdown-menu-DA8FJBQ2.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-B4-z1fyu.js";
import "react-dom";
import { M as MobileLayout } from "./MobileLayout-DcrVxtqu.js";
import Content from "./Content-DMQ6A8K8.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@headlessui/react";
import "./SweetAlert-CPwvZdfJ.js";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./TableRekap-CX5Cx6Xh.js";
import "./table-CE18WwxH.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "dayjs";
import "./badge-3Dzo-CJq.js";
import "./BargeStatus-wWq6wWJ0.js";
import "./popover-CUWb37oo.js";
import "./SelectComponent-mFLhKw8T.js";
import "./input-Dqw8mvVY.js";
import "./label-e-KMhPKP.js";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "./tabs-fMRf3trd.js";
import "@radix-ui/react-tabs";
const Index = ({ datas, ...props }) => {
  return /* @__PURE__ */ jsx(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: /* @__PURE__ */ jsx(
    Content,
    {
      urlLink: route("mobile_apps.rencana_drop_kepala"),
      localState: "mobile_apps_rencana_drop_kepala",
      triggeredData: datas
    }
  ) });
};
export {
  Index as default
};
