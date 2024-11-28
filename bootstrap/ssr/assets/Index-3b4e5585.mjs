import { j as jsxs, a as jsx } from "../ssr.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-a7cc8935.mjs";
import "react";
import Permission from "./Permission-2a1944ce.mjs";
import Role from "./Role-45bba40b.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-4797da35.mjs";
import { L as Label } from "./label-7289427a.mjs";
import "./input-a726a844.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { useForm } from "@inertiajs/react";
import AssignRoles from "./AssignRoles-31826e9f.mjs";
import { B as BadgeStatus } from "./BadgeStatus-34895a82.mjs";
import MaintenerWorker from "./MaintenerWorker-35ef252f.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "./Navbar-b30a186e.mjs";
import "lucide-react";
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-e5a75d04.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./badge-ad1cae46.mjs";
const Index = ({ role, permission, user, maintenen_workers, ...props }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    role: "",
    permission: []
  });
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };
  const onCheckboxChange = (e) => {
    const checkboxes = document.querySelectorAll(
      '.checkbox-group input[type="checkbox"]'
    );
    const selectedPermissions = Array.from(checkboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.name);
    setData((prevState) => ({
      ...prevState,
      permission: selectedPermissions
    }));
  };
  const roleOptions = role.map((role2) => {
    return {
      display: role2.name,
      value: role2.id,
      id: role2.id
    };
  });
  console.log(role);
  const userOptions = user.map((emp) => {
    return {
      display: emp.username,
      value: emp.id,
      id: emp.id
    };
  });
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("adminpanel.role_assign"), {
      onSuccess: () => {
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3 mb-3", children: [
      /* @__PURE__ */ jsx(Permission, {}),
      /* @__PURE__ */ jsx(Role, {}),
      /* @__PURE__ */ jsxs(Card, { className: "w-1/2", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Generate Permission" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Permission" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5 mb-3", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "role", children: "Role Name" }),
            /* @__PURE__ */ jsx(
              SelectList,
              {
                options: roleOptions,
                label: "Role",
                placeholder: "Select Role",
                required: true,
                name: "role",
                onChange: handleChange,
                value: data.role,
                id: "role",
                nullvalue: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 checkbox-group", children: data.role && permission.map((pemit, key) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center flex-1 gap-3 whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    name: pemit.name,
                    onChange: onCheckboxChange,
                    placeholder: "Select Permission",
                    id: pemit.name
                  }
                ),
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: pemit.name, children: pemit.name })
              ]
            },
            key
          )) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "mt-3", children: "Submit" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3", children: [
      /* @__PURE__ */ jsx(AssignRoles, { userOptions, roleOptions }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "User Role" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: permission && permission.map((pemit, key) => /* @__PURE__ */ jsx(BadgeStatus, { value: pemit.name }, key)) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "User Role" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "h-[50vh] overflow-auto space-y-3", children: role && role.map((roole) => {
        return /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: /* @__PURE__ */ jsx(BadgeStatus, { value: "normal", children: roole.name }) }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "flex gap-1", children: roole.permissions.map((permit) => {
            return /* @__PURE__ */ jsx(BadgeStatus, { value: permit.name, children: permit.name });
          }) })
        ] });
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-3 mt-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
        MaintenerWorker,
        {
          userOptions,
          roleOptions
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "User Role" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "No" }),
            /* @__PURE__ */ jsx(TableHead, { children: "User" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Unit" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: maintenen_workers && maintenen_workers.map((worker, key) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: key + 1 }),
            /* @__PURE__ */ jsx(TableCell, { children: worker.username }),
            /* @__PURE__ */ jsx(TableCell, { children: worker.employee.nama_karyawan }),
            /* @__PURE__ */ jsx(TableCell, { children: worker.branch.unit })
          ] }, key)) })
        ] }) })
      ] }) })
    ] })
  ] });
};
export {
  Index as default
};
