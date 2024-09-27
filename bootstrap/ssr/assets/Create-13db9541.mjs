import { a as jsx, j as jsxs, F as Fragment } from "../ssr.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { M as MobileLayout } from "./MobileLayout-f5e7fa47.mjs";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import OldCustomer from "./OldCustomer-1ae6ff74.mjs";
import NewCustomer from "./NewCustomer-dd01b321.mjs";
import { u as useServerFilter } from "./useServerFilter-295b27f7.mjs";
import { L as LinkButton } from "./LinkButton-c1a6bd65.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "./button-6facd6da.mjs";
import "@radix-ui/react-slot";
import "lucide-react";
import "./SelectList-8beaa241.mjs";
import "react-currency-input-field";
const Create = ({ max_date, min_date, ...props }) => {
  var _a, _b;
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
  return /* @__PURE__ */ jsx(
    MobileLayout,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Buku Transaksi",
      loading,
      children: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "nik", value: "Input Nik Customer" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start w-full gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "nik",
                type: "text",
                name: "nik",
                required: true,
                className: "block w-full mt-1",
                autoComplete: "nik"
              }
            ) }),
            /* @__PURE__ */ jsx(
              PrimaryButton,
              {
                title: "Cari",
                as: "button",
                type: "button",
                onClick: onSubmitFindNik
              }
            ),
            /* @__PURE__ */ jsx(
              LinkButton,
              {
                color: "blue",
                as: "a",
                href: route("mantriapps.index"),
                title: "Home"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: erorAxios, className: "mt-2" })
        ] }),
        nikData && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Nama Nasabah" }),
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: (_a = nikData == null ? void 0 : nikData[0]) == null ? void 0 : _a.customer_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "NIK" }),
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: (_b = nikData == null ? void 0 : nikData[0]) == null ? void 0 : _b.nik })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-auto rounded shadow-sm max-h-[50vh] border-b-2", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm border", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-200", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: "Tgl Drop" }),
              /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: "Total Drop" }),
              /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: "Lunas" }),
              /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { children: [
              nikData && nikData.map((item, key) => /* @__PURE__ */ jsxs("tr", { className: "even:bg-gray-100", children: [
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: item.tanggal_drop ? dayjs(item.tanggal_drop).format("DD-MM-YY") : "" }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: /* @__PURE__ */ jsx(
                  NumericFormat,
                  {
                    value: item.drop,
                    displayType: "text",
                    thousandSeparator: ","
                  }
                ) }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: item.lunas }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: item.status })
              ] }, key)),
              /* @__PURE__ */ jsx("tr", {})
            ] })
          ] }) })
        ] }),
        nik ? customerData ? /* @__PURE__ */ jsx(
          OldCustomer,
          {
            setLoading,
            max_date,
            min_date,
            emps: kolompokMantri,
            nik,
            customer_id: customerData == null ? void 0 : customerData.id,
            url: route("mantriapps.store")
          }
        ) : /* @__PURE__ */ jsx(
          NewCustomer,
          {
            setLoading,
            max_date,
            min_date,
            emps: kolompokMantri,
            nik,
            url: route("mantriapps.store")
          }
        ) : ""
      ] })
    }
  );
};
export {
  Create as default
};
