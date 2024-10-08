import { j as jsxs, a as jsx } from "../ssr.mjs";
import "react";
import { A as Authenticated } from "./AuthenticatedLayout-0c3f64d9.mjs";
import { S as SearchComponent } from "./SearchComponent-ed16326c.mjs";
import { Head } from "@inertiajs/react";
import "./FormatNumbering-02c28a29.mjs";
import "dayjs";
import "./button-5b8f0147.mjs";
import "./dialog-1c7227a2.mjs";
import "./card-1314102b.mjs";
import "./badge-3e44e85b.mjs";
import "./label-143f493c.mjs";
import "./input-7eb6bb1b.mjs";
import "react-currency-input-field";
import "./Loading-306ada45.mjs";
import "./TextInput-11198f62.mjs";
import Angsuran from "./Angsuran-2b20a8c4.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-86b9f43b.mjs";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "./SelectComponent-359a9ab7.mjs";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "react-dom";
import "@headlessui/react";
import "./Action-bb5b5e91.mjs";
import "axios";
import "./StatusPinjaman-fa220d17.mjs";
import "./BayarAngsuran-e454698f.mjs";
import "./Checkbox-d7000d9c.mjs";
import "./JenisNasabah-db547033.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./DeleteAngsuran-81d092c7.mjs";
import "./DeleteLoan-3a480ddc.mjs";
const SearchByDate = ({ datas, dateOfWeek, ...props }) => {
  return /* @__PURE__ */ jsxs(Authenticated, { header: /* @__PURE__ */ jsx(Head, { children: "Cari Angsuran" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-3 lg:flex-row lg:justify-between lg:items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: "Cari Angsuran" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end flex-auto w-full", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("pinjaman.index_pinjaman_search"),
          localState: "pinjaman_index_pinjaman_search",
          searchMonth: true,
          searchHari: true,
          searchKelompok: props.select_kelompok,
          searchGroupingBranch: props.select_branch
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsx(Angsuran, { datas }) })
  ] });
};
export {
  SearchByDate as default
};
