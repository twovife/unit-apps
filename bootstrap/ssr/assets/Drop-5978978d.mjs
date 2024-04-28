import { j as jsxs, a as jsx } from "../ssr.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { L as LinkButton } from "./LinkButton-3cafffab.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { S as SelectList } from "./SelectList-224f2d77.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { u as useServerFilter } from "./useServerFilter-d19c7d4b.mjs";
import { M as MobileLayout } from "./MobileLayout-adc7706e.mjs";
import { Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-dc4db3bc.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "react-icons/ai";
const Drop = ({ data, branch, server_filters, ...props }) => {
  const {
    serverFilters,
    onServerFilterChange,
    onServerFilterSubmit,
    loading,
    setLoading,
    mantriMantri
  } = useServerFilter(route().current(), server_filters);
  const mantri = server_filters.previledge == "mantri" ? [
    {
      id: 1,
      value: server_filters.kelompok,
      display: server_filters.kelompok
    }
  ] : mantriMantri;
  const [searchTerm, setSearchTerm] = useState("");
  const filterTransactions = () => {
    return data.filter((transaction) => {
      const searchValue = searchTerm.toLowerCase();
      return transaction.nik.toLowerCase().includes(searchValue) || transaction.nama.toLowerCase().includes(searchValue) || transaction.id == searchValue;
    });
  };
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return /* @__PURE__ */ jsxs(
    MobileLayout,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Drop Harians",
      loading,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "kelompok", value: "Kelompok" }),
            /* @__PURE__ */ jsx(
              SelectList,
              {
                id: "kelompok",
                type: "text",
                onChange: onServerFilterChange,
                name: "kelompok",
                value: serverFilters.kelompok,
                options: mantri,
                className: "mt-1 block w-full",
                autoComplete: "kelompok"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 w-full", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "date", value: "Tanggal Drop" }),
            /* @__PURE__ */ jsxs("div", { className: "flex text-center items-center gap-1", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "date",
                  disabled: true,
                  type: "date",
                  onChange: onServerFilterChange,
                  value: serverFilters.date,
                  name: "date",
                  className: "mt-1 block w-full"
                }
              ) }),
              /* @__PURE__ */ jsx(
                PrimaryButton,
                {
                  onClick: onServerFilterSubmit,
                  title: "Cari"
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
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full mt-3", children: /* @__PURE__ */ jsx(
            TextInput,
            {
              value: searchTerm,
              onChange: handleSearchInputChange,
              className: "w-full",
              placeHolder: "Masukkan NIK / Nama"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-auto rounded shadow-sm max-h-[50vh] border-b-2", children: /* @__PURE__ */ jsxs("table", { className: "text-sm w-full border", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-200", children: /* @__PURE__ */ jsxs("tr", { className: "text-center", children: [
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Tgl" }),
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Nasabah" }),
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Drop" }),
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Status" }),
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Mantri" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: data && filterTransactions().map((item, key) => /* @__PURE__ */ jsxs(
            "tr",
            {
              className: `even:bg-gray-100 text-xs ${item.id == props.id ? "bg-green-100" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("td", { className: "px-2 py-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm" }),
                  /* @__PURE__ */ jsxs("div", { className: "mb-1 italic font-light whitespace-nowrap", children: [
                    /* @__PURE__ */ jsxs("span", { className: "capitalize", children: [
                      item.hari,
                      ","
                    ] }),
                    item.transaction_date ? dayjs(
                      item.transaction_date
                    ).format("DD-MM-YY") : "",
                    "/"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mb-1 italic font-light", children: /* @__PURE__ */ jsxs("span", { className: "capitalize", children: [
                    "Drop : ",
                    item.tanggal_drop ? dayjs(
                      item.tanggal_drop
                    ).format("DD-MM-YY") : ""
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-2 py-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-1 font-semibold", children: item.nama }),
                  /* @__PURE__ */ jsx("div", { className: "mb-1", children: item.nik }),
                  /* @__PURE__ */ jsx("div", { className: "mb-1 font-light italic", children: item.alamat })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-end", children: /* @__PURE__ */ jsx(
                  NumericFormat,
                  {
                    value: item.drop,
                    displayType: "text",
                    thousandSeparator: ","
                  }
                ) }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-center", children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    className: "bg-blue-500 px-2 py-1.5 hover:bg-blue-700 text-white hover:cursor-pointer rounded",
                    href: route(
                      "mantriapps.show",
                      item.id
                    ),
                    children: item.status
                  }
                ) }),
                /* @__PURE__ */ jsxs("td", { className: "px-2 py-1 text-end", children: [
                  /* @__PURE__ */ jsx("div", { children: item.mantri }),
                  /* @__PURE__ */ jsx("div", { children: item.kelompok })
                ] })
              ]
            },
            key
          )) })
        ] }) })
      ]
    }
  );
};
export {
  Drop as default
};
