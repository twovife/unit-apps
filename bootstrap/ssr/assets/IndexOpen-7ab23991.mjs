import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-0ef3a5a8.mjs";
import { Head, Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { AiFillFilter, AiOutlineClose, AiOutlineSortAscending, AiOutlineSortDescending, AiFillEdit } from "react-icons/ai";
import "./TextInput-11198f62.mjs";
import { L as LinkButton } from "./LinkButton-c1a6bd65.mjs";
import { u as useServerFilter } from "./useServerFilter-295b27f7.mjs";
import { u as useFilterTable } from "./useFilterTable-e547dd07.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
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
const IndexOpen = ({ loans, server_filters, ...props }) => {
  const {
    transaction_date,
    serverFilters,
    onServerFilterChange,
    onServerFilterSubmit,
    loading,
    setLoading,
    mantriMantri
  } = useServerFilter(route().current(), server_filters);
  const itemsPerPage = 1e3;
  const {
    filters,
    setFilters,
    orderData,
    setOrderData,
    currentPage,
    setCurrentPage,
    displayData,
    totalPages,
    handlePageChange,
    totals
  } = useFilterTable({}, itemsPerPage, loans);
  const [showFilter, setShowFilter] = useState("");
  const [addFilter, setAddFilter] = useState({
    column: "",
    operators: "1",
    values: ""
  });
  const thisonclick = (column, format = "text") => {
    setShowFilter({ column, format });
  };
  useEffect(() => {
    const storedFilter = JSON.parse(
      localStorage.getItem("internal_storage_buku_transaksi")
    );
    if (storedFilter && Object.keys(storedFilter).length > 0) {
      setFilters(storedFilter);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "internal_storage_buku_transaksi",
      JSON.stringify(filters)
    );
  }, [filters]);
  useEffect(() => {
    const log = (e) => {
      if (e.target.className.includes("filter_trigger")) {
        thisonclick(
          e.target.getAttribute("data-item"),
          e.target.getAttribute("data-format")
        );
        setAddFilter({
          ...addFilter,
          ["column"]: e.target.getAttribute("data-item")
        });
      } else {
        thisonclick("");
      }
    };
    window.addEventListener("click", log);
    return () => {
      window.removeEventListener("click", log);
    };
  });
  const onSubmitFilter = () => {
    const updatedFilters = [...filters];
    const indexToUpdate = updatedFilters.findIndex(
      (filter) => filter.column === addFilter.column
    );
    if (indexToUpdate !== -1) {
      updatedFilters[indexToUpdate] = addFilter;
    } else {
      updatedFilters.push(addFilter);
    }
    setFilters(updatedFilters);
  };
  const decrementFilter = (column) => {
    [...filters];
    const decrementFilters = filters.filter(
      (filter) => filter.column !== column
    );
    setFilters(decrementFilters);
  };
  const handleInputFilter = (e) => {
    const { name, value, type } = e.target;
    let convertedValue = value;
    if (type === "number") {
      convertedValue = parseInt(value);
    }
    setAddFilter({
      ...addFilter,
      [name]: convertedValue
    });
  };
  const headers = [
    {
      title: ["Tanggal", "Nomor Pinjaman", "Customer"],
      column: ["transaction_date", "id", "customer_nama"],
      format: ["date", "number", "text"],
      headClass: "sticky left-0 top-0 z-40 w-1/2 md:w-1/4",
      bodyClass: "sticky left-0 top-0 z-40 w-1/2 md:w-1/4"
    },
    {
      title: ["NIK"],
      column: ["customer_nik"],
      format: ["text"]
    },
    {
      title: ["Alamat"],
      column: ["customer_alamat"],
      format: ["text"]
    },
    {
      title: ["Kel"],
      column: ["kelompok"],
      format: ["text"]
    },
    {
      title: ["Hari"],
      column: ["hari"],
      format: ["text"]
    },
    {
      title: ["Pengajuan"],
      column: ["pinjaman"],
      format: ["money"]
    },
    {
      title: ["Tanggal Drop"],
      column: ["tanggal_drop"],
      format: ["date"]
    },
    {
      title: ["Status"],
      column: ["status"],
      format: ["text"]
    },
    {
      title: ["Diperiksa"],
      column: ["tanggal_approve"],
      format: ["date"]
    },
    {
      title: ["Oleh"],
      column: ["approver"],
      format: ["text"]
    },
    {
      title: ["Mantri"],
      column: ["droper"],
      format: ["text"],
      headClass: "bg-rose-200"
    }
  ];
  const filterModal = () => {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed text-white top-1/2 left-1/2 -translate-x-1/2 w-1/3",
        onClick: (e) => e.stopPropagation(),
        children: /* @__PURE__ */ jsx("div", { className: "bg-white border border-gray-300 rounded-lg shadow-lg max-w-full w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center text-2xl px-2 py-4 flex-wrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col-reverse", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                name: "column",
                value: addFilter.column,
                onChange: (e) => setAddFilter({
                  ...addFilter,
                  column: e.target.value
                }),
                className: "border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/column"
              }
            ),
            /* @__PURE__ */ jsx("label", { className: "text-gray-400 text-xs font-semibold peer-focus/column:text-blue-500", children: "Column" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col-reverse", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "operators",
                value: addFilter.operators,
                onChange: (e) => setAddFilter({
                  ...addFilter,
                  operators: e.target.value
                }),
                className: "border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:outline-none focus:border-b-2 focus:border-b-blue-500 focus:ring-0 peer/operator",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "1", children: "contains" }),
                  /* @__PURE__ */ jsx("option", { value: "2", children: "equal" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("label", { className: "text-gray-400 text-xs font-semibold peer-focus/operator:text-blue-500", children: "Operator" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col-reverse", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: addFilter.values,
                type: showFilter.format == "number" ? "number" : showFilter.format == "date" ? "date" : showFilter.format == "money" ? "number" : "text",
                onChange: handleInputFilter,
                name: "values",
                className: "border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/value"
              }
            ),
            /* @__PURE__ */ jsx("label", { className: "text-gray-400 text-xs font-semibold peer-focus/value:text-blue-500", children: "Value" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onSubmitFilter,
                className: "text-black text-xs border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-2 rounded-lg",
                children: "Go"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setOrderData({
                  column: showFilter.column,
                  orderby: "asc"
                }),
                className: "text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-3",
                children: /* @__PURE__ */ jsx(AiOutlineSortAscending, {})
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setOrderData({
                  column: showFilter.column,
                  orderby: "desc"
                }),
                className: "text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-1",
                children: /* @__PURE__ */ jsx(AiOutlineSortDescending, {})
              }
            )
          ] })
        ] }) })
      }
    );
  };
  const tbodyGenerator = () => {
    if (displayData.length === 0) {
      return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "2", children: "Data Not Found" }) }) }) });
    }
    return /* @__PURE__ */ jsx("tbody", { children: displayData.map((item, key) => {
      return /* @__PURE__ */ jsxs(
        "tr",
        {
          className: `border-b text-xs ${item.status == "acc" ? `bg-emerald-100 hover:bg-green-300 even:bg-green-200` : item.status == "tolak" ? `bg-rose-100 hover:bg-red-300 even:bg-rose-200` : `bg-white hover:bg-blue-50 even:bg-gray-100`}`,
          children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-evenly", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1 py-1 px-4", children: key + 1 }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  as: "a",
                  href: route(
                    "transaction.show",
                    item.id
                  ),
                  className: "flex-1",
                  children: /* @__PURE__ */ jsx(AiFillEdit, {})
                }
              )
            ] }) }),
            headers.map((head, keyy) => {
              return /* @__PURE__ */ jsx(
                "td",
                {
                  className: `${head.bodyClass ? `${head.bodyClass}  bg-inherit` : ` relative z-30`}`,
                  children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: head.column.map(
                    (column, column_key) => {
                      if (head.format[column_key] == "date") {
                        return /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "flex-1 py-1 px-4",
                            children: item[column] ? dayjs(
                              item[column]
                            ).format(
                              "DD-MM-YYYY"
                            ) : ""
                          },
                          column_key
                        );
                      }
                      if (head.format[column_key] == "money") {
                        return /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "flex-1 py-1 px-4",
                            children: /* @__PURE__ */ jsx(
                              NumericFormat,
                              {
                                value: item[column],
                                displayType: "text",
                                thousandSeparator: ",",
                                prefix: "Rp. "
                              }
                            )
                          },
                          column_key
                        );
                      }
                      return /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "flex-1 py-1 px-4",
                          children: item[column]
                        },
                        column_key
                      );
                    }
                  ) })
                },
                keyy
              );
            })
          ]
        },
        key
      );
    }) });
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
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 flex justify-end items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              SelectList,
              {
                type: "date",
                className: "block w-full min-w-16 text-sm",
                id: "mantri",
                name: "mantri",
                options: mantriMantri,
                value: serverFilters.mantri,
                onChange: onServerFilterChange
              }
            ) }),
            /* @__PURE__ */ jsx(
              PrimaryButton,
              {
                color: "yellow",
                title: "Cari",
                onClick: onServerFilterSubmit
              }
            ),
            /* @__PURE__ */ jsx(
              LinkButton,
              {
                href: route("transaction.index_open"),
                title: "Refresh",
                onClick: onServerFilterSubmit
              }
            ),
            /* @__PURE__ */ jsx(
              LinkButton,
              {
                color: "blue",
                as: "a",
                href: route("transaction.create"),
                title: "Create"
              }
            )
          ] }),
          filters && /* @__PURE__ */ jsx("div", { className: "inline-block space-y-1", children: filters.map((item) => {
            if (item.column == "") {
              return null;
            }
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "border flex items-center rounded-md overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 text-lg bg-green-400 text-white", children: /* @__PURE__ */ jsx(AiFillFilter, {}) }),
                /* @__PURE__ */ jsxs("div", { className: "px-3 text-sm text-main-500", children: [
                  /* @__PURE__ */ jsx("span", { className: "mr-1 capitalize ", children: item.column }),
                  /* @__PURE__ */ jsx("span", { className: "mr-1 capitalize ", children: item.operators == 1 ? "Contains" : "=" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "'",
                    item.values,
                    "'"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "hover:border hover:bg-gray-300 hover:cursor-pointer rounded p-1 ml-2",
                  onClick: () => decrementFilter(item.column),
                  children: /* @__PURE__ */ jsx(AiOutlineClose, {})
                }
              )
            ] });
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-lg", children: "Daftar Transaksi" }),
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 overflow-auto ring-1 ring-black ring-opacity-5 rounded shadow", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left text-gray-500 relative", children: [
              /* @__PURE__ */ jsx("thead", { className: "text-gray-900 uppercase sticky top-0 whitespace-nowrap z-50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: `bg-gray-200 relative z-30`, children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "px-4 py-3 ", children: "No" }) }) }),
                headers.map((header, key) => /* @__PURE__ */ jsx(
                  "th",
                  {
                    "data-item": header.column,
                    "data-format": header.format ?? "text",
                    scope: "col",
                    className: `bg-gray-200 ${header.headClass ?? ` relative z-30`}`,
                    children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: header.title.map(
                      (titles, keyy) => {
                        return /* @__PURE__ */ jsxs(
                          "div",
                          {
                            "data-item": header.column[keyy],
                            "data-format": header.format[keyy] ?? "text",
                            className: "flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger",
                            children: [
                              titles,
                              showFilter.column == header.column[keyy] && filterModal()
                            ]
                          },
                          keyy
                        );
                      }
                    ) })
                  },
                  key
                ))
              ] }) }),
              tbodyGenerator()
            ] }) })
          ] })
        ] })
      ]
    }
  );
};
export {
  IndexOpen as default
};
