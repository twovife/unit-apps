import { j as jsxs, a as jsx } from "../ssr.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { useForm } from "@inertiajs/react";
import "react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
const JenisNasabah = ({ loan }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    loan_notes: ""
  });
  const handleOnChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(route("pinjaman.normal.nasabah", loan.id));
    reset();
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
    /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "Jenis Nasabah" }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: onSubmitCreate,
        className: "overflow-hidden mb-3 rounded border border-black/5 shadow p-4 ",
        children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "status", value: "Status" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: /* @__PURE__ */ jsx(
              SelectList,
              {
                id: "loan_notes",
                type: "date",
                name: "loan_notes",
                value: data.loan_notes,
                options: [
                  {
                    id: 1,
                    value: "10L",
                    display: "10L"
                  },
                  {
                    id: 2,
                    value: "Beban Pemakaian",
                    display: "Beban Pemakaian"
                  },
                  {
                    id: 3,
                    value: "CM LUNAS",
                    display: "CM LUNAS"
                  }
                ],
                nullValue: true,
                className: "mt-1 block w-full",
                onChange: handleOnChange
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: /* @__PURE__ */ jsx(PrimaryButton, { title: "Submit", type: "submit" }) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.loan_notes, className: "mt-2" })
        ]
      }
    )
  ] });
};
export {
  JenisNasabah as default
};
