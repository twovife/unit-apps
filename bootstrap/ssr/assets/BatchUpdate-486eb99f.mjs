import { j as jsxs, a as jsx } from "../ssr.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { Head, Link } from "@inertiajs/react";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-df51dfbd.mjs";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { u as useServerFilter } from "./useServerFilter-d19c7d4b.mjs";
import { NumericFormat } from "react-number-format";
import OldCustomer from "./OldCustomer-1b76dc8e.mjs";
import NewCustomer from "./NewCustomer-a9ad1914.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@headlessui/react";
import "react-icons/bi";
import "hamburger-react";
import "./Loading-24c66a90.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "./Checkbox-d7000d9c.mjs";
import "./SelectList-224f2d77.mjs";
import "react-currency-input-field";
const BatchUpdate = ({ max_date, min_date, ...props }) => {
  const { emps, status_angsuran } = useServerFilter(
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
        /* @__PURE__ */ jsx(Head, { title: "Batch Upload" }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "p-4 flex", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  htmlFor: "nik",
                  value: "Input Nik Customer"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-3 mt-1", children: [
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "nik",
                    type: "text",
                    name: "nik",
                    required: true,
                    className: "block",
                    autoComplete: "nik"
                  }
                ),
                /* @__PURE__ */ jsx(
                  PrimaryButton,
                  {
                    title: "Cek",
                    as: "button",
                    type: "button",
                    onClick: onSubmitFindNik
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(InputError, { message: erorAxios, className: "mt-2" })
            ] }),
            nik ? customerData ? /* @__PURE__ */ jsx(
              OldCustomer,
              {
                status: status_angsuran,
                setLoading,
                max_date,
                min_date,
                emps,
                nik,
                url: route("batchupdate.batch_post"),
                customer_id: customerData == null ? void 0 : customerData.id
              }
            ) : /* @__PURE__ */ jsx(
              NewCustomer,
              {
                status: status_angsuran,
                setLoading,
                max_date,
                min_date,
                emps,
                nik,
                url: route("batchupdate.batch_post")
              }
            ) : "",
            /* @__PURE__ */ jsx("div", { className: "mb-3" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: "History Pinjaman Customer" }),
            /* @__PURE__ */ jsx("div", { className: "overflow-hidden mb-3 rounded shadow p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
              /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { children: [
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
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(
                    element.tanggal_drop
                  ).format(
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
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: element.status == "normal" || element.status == "cm" ? /* @__PURE__ */ jsx(
                    Link,
                    {
                      as: "a",
                      href: route(
                        "pinjaman.normal.show",
                        element.id
                      ),
                      className: "bg-green-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",
                      children: element.status
                    }
                  ) : element.status == "mb" ? /* @__PURE__ */ jsx(
                    Link,
                    {
                      as: "a",
                      href: route(
                        "pinjaman.normal.show",
                        element.id
                      ),
                      className: "bg-yellow-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",
                      children: element.status
                    }
                  ) : /* @__PURE__ */ jsx(
                    Link,
                    {
                      as: "a",
                      href: route(
                        "pinjaman.normal.show",
                        element.id
                      ),
                      className: "bg-red-400 px-5 py-1 uppercase rounded-lg text-white font-semibold",
                      children: element.status
                    }
                  ) })
                ] }, key);
              }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, children: "Data tidak ditemukan" }) }) })
            ] }) })
          ] }) })
        ] }) })
      ]
    }
  );
};
export {
  BatchUpdate as default
};
