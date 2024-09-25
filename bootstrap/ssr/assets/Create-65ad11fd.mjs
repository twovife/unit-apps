import { j as jsxs, a as jsx } from "../ssr.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { L as LinkButton } from "./LinkButton-c1a6bd65.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-bada9d21.mjs";
import { Head } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import NewCustomer from "./NewCustomer-dd01b321.mjs";
import OldCustomer from "./OldCustomer-1ae6ff74.mjs";
import { u as useServerFilter } from "./useServerFilter-295b27f7.mjs";
import { NumericFormat } from "react-number-format";
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
import "./SelectList-8beaa241.mjs";
import "react-currency-input-field";
const Create = ({ max_date, min_date, ...props }) => {
  const { emps, kolompokMantri } = useServerFilter(
    null,
    null,
    null,
    props.mantri
  );
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState();
  const [nikData, setNikData] = useState();
  const [customerData, setCustomerData] = useState();
  const [nik, setNik] = useState();
  const onSubmitFindNik = (e) => {
    const nik2 = document.getElementById("nik").value;
    setLoading(true);
    setErorAxios();
    setNikData();
    setNik();
    axios({
      method: "post",
      url: route("transaction.getnik"),
      data: {
        nik: nik2
      }
    }).then(function({ data }) {
      setNikData(data.data);
      setCustomerData(data.reqistered_customer);
      setNik(nik2);
      setLoading(false);
    }).catch(function({ response }) {
      setErorAxios(response.data.message);
      setNikData();
      setNik();
      setLoading(false);
    });
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Buku Transaksi",
      loading,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Buku Transaksi" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end px-6 py-4", children: /* @__PURE__ */ jsx(
            LinkButton,
            {
              color: "outline",
              as: "a",
              href: props.back_to_index,
              title: "Back"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "nik", value: "Input Nik Customer" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-3", children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      id: "nik",
                      type: "text",
                      name: "nik",
                      required: true,
                      className: "block mt-1",
                      autoComplete: "nik"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    PrimaryButton,
                    {
                      title: "Submit",
                      as: "button",
                      type: "button",
                      onClick: onSubmitFindNik
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: erorAxios, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: "History Pinjaman Customer" }),
                /* @__PURE__ */ jsx("div", { className: "p-4 mb-3 overflow-hidden rounded shadow", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
                  /* @__PURE__ */ jsx("thead", { className: "sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "No" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Drop" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Unit" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Kelompok" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Mantri" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nama Customer" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Drop" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Lunas" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Status" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { children: nikData ? nikData.map((element, key) => {
                    return /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: key + 1 }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(element.tanggal_drop).format(
                        "DD-MM-YYYY"
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: element.unit }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: element.kelompok }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: element.mantri_name }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: element.customer_name }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: element.drop,
                          displayType: "text",
                          thousandSeparator: ",",
                          prefix: "Rp. "
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: element.lunas }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: element.status == "normal" || element.status == "cm" ? /* @__PURE__ */ jsx("span", { className: "px-5 py-1 font-semibold text-white uppercase bg-green-400 rounded-lg", children: element.status }) : element.status == "mb" ? /* @__PURE__ */ jsx("span", { className: "px-5 py-1 font-semibold text-white uppercase bg-yellow-400 rounded-lg", children: element.status }) : /* @__PURE__ */ jsx("span", { className: "px-5 py-1 font-semibold text-white uppercase bg-red-400 rounded-lg", children: element.status }) })
                    ] }, key);
                  }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, children: "Data tidak ditemukan" }) }) })
                ] }) })
              ] })
            ] }),
            nik ? customerData ? /* @__PURE__ */ jsx(
              OldCustomer,
              {
                setLoading,
                max_date,
                min_date,
                emps: kolompokMantri,
                nik,
                customer_id: customerData == null ? void 0 : customerData.id
              }
            ) : /* @__PURE__ */ jsx(
              NewCustomer,
              {
                setLoading,
                max_date,
                min_date,
                emps: kolompokMantri,
                nik
              }
            ) : ""
          ] }) })
        ] })
      ]
    }
  );
};
export {
  Create as default
};
