import { j as jsxs, a as jsx } from "../ssr.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { L as LinkButton } from "./LinkButton-c1a6bd65.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { u as useServerFilter } from "./useServerFilter-295b27f7.mjs";
import { M as MobileLayout } from "./MobileLayout-f5e7fa47.mjs";
import { Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import "react/jsx-runtime";
import "react-dom/server";
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
const Storting = ({ data, server_filters, ...props }) => {
  const {
    serverFilters,
    onServerFilterChange,
    onServerFilterSubmit,
    loading,
    setLoading,
    mantriMantri,
    transaction_day
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
      header: "Angsuran Berjalan",
      loading,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:flex justify-between items-center w-full gap-1 flex-wrap", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
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
            /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "hari", value: "Hari" }),
              /* @__PURE__ */ jsxs("div", { className: "flex text-center items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                  SelectList,
                  {
                    id: "hari",
                    type: "text",
                    onChange: onServerFilterChange,
                    name: "hari",
                    value: serverFilters.hari,
                    options: transaction_day,
                    className: "mt-1 block w-full",
                    autoComplete: "hari"
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
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full mt-3", children: /* @__PURE__ */ jsx(
            TextInput,
            {
              value: searchTerm,
              onChange: handleSearchInputChange,
              className: "w-full",
              placeholder: "Masukkan NIK / Nama"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-auto rounded shadow-lg max-h-[50vh] border-b-2 border-2 border-white/50", children: /* @__PURE__ */ jsxs("table", { className: "text-sm w-full border", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-200", children: /* @__PURE__ */ jsxs("tr", { className: "text-center", children: [
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Tgl" }),
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Nasabah" }),
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Pinjaman" }),
            /* @__PURE__ */ jsx("td", { className: "p-2", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: data && filterTransactions().map((item, key) => /* @__PURE__ */ jsxs(
            "tr",
            {
              className: `text-xs ${item.is_paid ? "even:bg-green-100 bg-green-100" : "even:bg-gray-100"}`,
              children: [
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: /* @__PURE__ */ jsx("div", { className: "mb-1 italic font-light", children: /* @__PURE__ */ jsx("span", { className: "capitalize whitespace-nowrap", children: item.tanggal_drop ? dayjs(
                  item.tanggal_drop
                ).format("DD-MM") : "" }) }) }),
                /* @__PURE__ */ jsxs("td", { className: "px-2 py-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-1 font-semibold", children: item.nama }),
                  /* @__PURE__ */ jsx("div", { className: "mb-1", children: item.nik }),
                  /* @__PURE__ */ jsx("div", { className: "mb-1 font-light italic", children: item.alamat })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-end", children: /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6", children: [
                    /* @__PURE__ */ jsx("div", { children: "Pinj" }),
                    /* @__PURE__ */ jsx(
                      NumericFormat,
                      {
                        value: item.pinjaman,
                        displayType: "text",
                        thousandSeparator: ","
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1 border-b-black border-b-2", children: [
                    /* @__PURE__ */ jsx("div", { children: "Angs" }),
                    /* @__PURE__ */ jsx(
                      NumericFormat,
                      {
                        value: item.total_angsuran,
                        displayType: "text",
                        thousandSeparator: ","
                      }
                    )
                  ] }),
                  item.saldo_ansuran == 0 ? /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("div", { children: "Sisa" }),
                    /* @__PURE__ */ jsx("div", { className: "bg-green-500 font-bold px-2 py-1 rounded", children: "LUNAS" })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("div", { children: "Sisa" }),
                    /* @__PURE__ */ jsx(
                      NumericFormat,
                      {
                        value: item.saldo_ansuran,
                        displayType: "text",
                        thousandSeparator: ","
                      }
                    )
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-1 text-center", children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    className: "bg-blue-500 px-2 py-1.5 hover:bg-blue-700 text-white hover:cursor-pointer rounded",
                    href: route(
                      "mantriapps.bayar",
                      item.id
                    ),
                    children: item.status
                  }
                ) })
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
  Storting as default
};
