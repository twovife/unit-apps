import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-bada9d21.mjs";
import { S as SearchComponent } from "./SearchComponent-ca68d894.mjs";
import { Head } from "@inertiajs/react";
import AngsuranTable from "./AngsuranTable-bcf55c0e.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./button-6facd6da.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./SelectComponent-359a9ab7.mjs";
import "./input-a726a844.mjs";
import "dayjs";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "./FormatNumbering-1920aef2.mjs";
import "react-number-format";
import "./Action-aa1843b1.mjs";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "./card-c2e72800.mjs";
import "axios";
import "./badge-985735af.mjs";
import "./BayarAngsuran-1de30da7.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-80bf75ad.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-be0bed71.mjs";
import "./TextInput-11198f62.mjs";
const Index = ({ datas, dateOfWeek, ...props }) => {
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Angsuran Lancar" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Angsuran Lancar" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end flex-auto w-full", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("pinjaman.index_pinjaman"),
          localState: "pinjaman_index_pinjaman",
          searchMonth: true,
          searchHari: true,
          searchKelompok: props.select_kelompok,
          searchGroupingBranch: props.select_branch
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsx(AngsuranTable, { dateOfWeek, datas }) })
  ] });
};
export {
  Index as default
};
