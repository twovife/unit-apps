import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { B as BadgeStatus } from "./BadgeStatus-1947fb26.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import { useState } from "react";
import GenerateUser from "./GenerateUser-3acd037d.mjs";
import dayjs from "dayjs";
import { B as BargeStatus } from "./BargeStatus-070c40e0.mjs";
import { usePage } from "@inertiajs/react";
import { S as SearchComponent, P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-590ea694.mjs";
import { B as Button } from "./button-e7ccf50f.mjs";
import { FilterIcon } from "lucide-react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./SelectList-8beaa241.mjs";
import "./dialog-97d8ecd0.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./input-22e7db4a.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "@radix-ui/react-slot";
import "./SelectComponent-dc7360ed.mjs";
import "@radix-ui/react-popover";
const ManPower = ({ datas, title }) => {
  const { auth, server_filter } = usePage().props;
  const [onShowCreateUser, setOnShowCreateUser] = useState(false);
  const [paramsData, setParamsData] = useState(null);
  const handleOnCreateUserOpen = (params) => {
    setParamsData(params);
    setOnShowCreateUser(true);
  };
  const handleOnCreateUserClosed = () => {
    setParamsData(null);
    setOnShowCreateUser(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      GenerateUser,
      {
        show: onShowCreateUser,
        triggeredData: paramsData,
        onClosed: handleOnCreateUserClosed
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-none shrink-0 whitespace-nowrap", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight ", children: title }) }),
      /* @__PURE__ */ jsx("div", { className: "items-center justify-end flex-auto hidden w-full lg:flex", children: /* @__PURE__ */ jsx(
        SearchComponent,
        {
          urlLink: route("administrasi.manpower.index"),
          localState: "administrasi_manpower_store",
          searchBranch: server_filter.userAuthorized.canShowBranch,
          searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-3 lg:hidden", children: /* @__PURE__ */ jsxs(Popover, { children: [
        /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
          /* @__PURE__ */ jsx(FilterIcon, { className: "h-4" }),
          "Filter"
        ] }) }),
        /* @__PURE__ */ jsx(PopoverContent, { children: /* @__PURE__ */ jsx(
          SearchComponent,
          {
            urlLink: route("administrasi.manpower.index"),
            localState: "administrasi_manpower_store",
            searchBranch: server_filter.userAuthorized.canShowBranch,
            searchGroupingBranch: server_filter.userAuthorized.canShowGroupingBranch
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Nomor" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Nama Karaywan" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Username" }),
        /* @__PURE__ */ jsx(TableHead, { children: "NIK" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Alamat" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Jabatan" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Tanggal Masuk" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Date Resign" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: datas && datas.map((data, key) => {
        var _a;
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "hidden lg:flex-1 lg:block", children: key + 1 }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: auth.permissions.includes("superuser") ? /* @__PURE__ */ jsx(
              BargeStatus,
              {
                onClick: () => handleOnCreateUserOpen(data),
                value: data.isActive,
                children: data.isActive ? "Act" : "Non Act"
              }
            ) : /* @__PURE__ */ jsx(BadgeStatus, { value: data.isActive, children: data.isActive ? "Act" : "Non Act" }) })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: data.employee_name }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            /* @__PURE__ */ jsx(
              BadgeStatus,
              {
                value: data.username_status == 1 ? true : false,
                children: data.username
              }
            ),
            auth.permissions.includes("superuser") && /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: (_a = data.rolelist) == null ? void 0 : _a.map((item) => /* @__PURE__ */ jsx("span", { children: item.name })) })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: data.identity_id }),
          /* @__PURE__ */ jsx(TableCell, { children: data.address }),
          /* @__PURE__ */ jsx(TableCell, { children: data.employment }),
          /* @__PURE__ */ jsx(TableCell, { children: data.hire_date ? dayjs(data.hire_date).format("DD-MM-YYYY") : "" }),
          /* @__PURE__ */ jsx(TableCell, { children: data.resign_date ? dayjs(data.resign_date).format("DD-MM-YYYY") : "" })
        ] }, key);
      }) })
    ] }) })
  ] });
};
export {
  ManPower as default
};
