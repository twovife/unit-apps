import { jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import "react";
import "./command-int9mZp7.js";
import "clsx";
import "dayjs";
import "./button-MTjEwktD.js";
import "./popover-B9xSK2Gy.js";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import { M as MobileLayout } from "./MobileLayout-CPLPpjNm.js";
import Content from "./Content-DjGNilRg.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "tailwind-merge";
import "./input-BHD-__le.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-8a8NNlps.js";
import "@radix-ui/react-popover";
import "@headlessui/react";
import "./AuthenticatedLayout-Lk4S3jcr.js";
import "./TableRekap-DwuJoj6R.js";
import "./table-Dwx5kZ1B.js";
import "@tanstack/react-table";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./badge-CBTu05xj.js";
import "./BargeStatus-KjUuqjtj.js";
import "./SearchComponent-uiqzPovZ.js";
import "./SelectComponent-DUhN-d41.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "./tabs-BAdW7Ajv.js";
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
