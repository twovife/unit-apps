import { j as jsxs, a as jsx } from "../ssr.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-320c7184.mjs";
import { Head, Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { AiFillFilter, AiOutlineClose, AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { u as useServerFilter } from "./useServerFilter-295b27f7.mjs";
import { u as useFilterTable } from "./useFilterTable-e547dd07.mjs";
import { BiEditAlt } from "react-icons/bi";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Navbar-81236a1a.mjs";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
const Index = ({ loans, server_filters, dateOfWeek, ...props }) => {
  const {
    transaction_date,
    transaction_day,
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
  const filterModal = () => {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed text-white -translate-x-1/2 top-1/2 left-1/2 lg:w-1/3",
        onClick: (e) => e.stopPropagation(),
        children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-full bg-white border border-gray-300 rounded-lg shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end gap-3 px-2 py-4 text-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse flex-1", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                name: "column",
                readOnly: true,
                value: addFilter.column,
                onChange: (e) => setAddFilter({
                  ...addFilter,
                  column: e.target.value
                }),
                className: "read-only:bg-gray-200 read-only:cursor-not-allowed border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/column"
              }
            ),
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-400 peer-focus/column:text-blue-500", children: "Kolom" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse flex-1", children: [
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
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-400 peer-focus/operator:text-blue-500", children: "Operator" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse flex-1", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: addFilter.values,
                type: showFilter.format == "number" ? "number" : showFilter.format == "date" ? "date" : showFilter.format == "currency" ? "number" : "text",
                onChange: handleInputFilter,
                name: "values",
                className: "border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/value"
              }
            ),
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-gray-400 peer-focus/value:text-blue-500", children: "Kata Kunci" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center flex-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onSubmitFilter,
                className: "p-2 text-xs text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white",
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
                className: "p-1 ml-3 text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white",
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
                className: "p-1 ml-1 text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white",
                children: /* @__PURE__ */ jsx(AiOutlineSortDescending, {})
              }
            )
          ] })
        ] }) })
      }
    );
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
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end gap-3 px-6 py-4", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              TextInput,
              {
                option: transaction_date,
                type: "month",
                className: "block w-full text-sm",
                id: "transaction_date",
                name: "transaction_date",
                value: serverFilters.transaction_date,
                onChange: onServerFilterChange
              }
            ) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              SelectList,
              {
                options: transaction_day,
                type: "date",
                className: "block w-32 text-sm",
                id: "transaction_day",
                name: "transaction_day",
                value: serverFilters.transaction_day,
                onChange: onServerFilterChange
              }
            ) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              SelectList,
              {
                options: mantriMantri,
                type: "date",
                className: "block w-32 text-sm",
                id: "mantri",
                name: "mantri",
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
            )
          ] }),
          filters && /* @__PURE__ */ jsx("div", { className: "inline-block space-y-1", children: filters.map((item) => {
            if (item.column == "") {
              return null;
            }
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center overflow-hidden border rounded-md", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 text-lg text-white bg-green-400", children: /* @__PURE__ */ jsx(AiFillFilter, {}) }),
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
                  className: "p-1 ml-2 rounded hover:border hover:bg-gray-300 hover:cursor-pointer",
                  onClick: () => decrementFilter(item.column),
                  children: /* @__PURE__ */ jsx(AiOutlineClose, {})
                }
              )
            ] });
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: "Daftar Transaksi" }),
            /* @__PURE__ */ jsx("div", { className: "max-h-screen mx-auto mb-6 rounded shadow ring-1 ring-black ring-opacity-5", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto max-h-[70vh]", children: /* @__PURE__ */ jsxs("table", { className: "relative w-full text-xs text-left text-gray-500", children: [
              /* @__PURE__ */ jsx("thead", { className: "sticky top-0 z-50 text-gray-900 uppercase whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { className: "text-center bg-gray-200", children: [
                /* @__PURE__ */ jsx("th", { className: "top-0 left-0 z-40 bg-gray-200 lg:sticky", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-start gap-1 w-96", children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      "data-item": "nomor_pinjaman",
                      "data-format": "text",
                      className: "flex-1 px-4 py-3 text-center hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                      children: [
                        "Nomor",
                        orderData.column == "nomor_pinjaman" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                        showFilter.column == "nomor_pinjaman" && filterModal()
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      "data-item": "nama_customer",
                      "data-format": "text",
                      className: "flex-[2] hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger text-center",
                      children: [
                        "Nama Nasabah",
                        orderData.column == "nama_customer" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                        showFilter.column == "nama_customer" && filterModal()
                      ]
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "nik_customer",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Nik",
                      orderData.column == "nik_customer" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "nik_customer" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-item": "alamat_customer",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: "Note"
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "alamat_customer",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Alamat",
                      orderData.column == "alamat_customer" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "alamat_customer" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "kelompok",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Kelompok",
                      orderData.column == "kelompok" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "kelompok" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "hari",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Hari",
                      orderData.column == "hari" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "hari" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "tanggal_drop",
                    "data-format": "date",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Tanggal Drop",
                      orderData.column == "tanggal_drop" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "tanggal_drop" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "pinjaman_ke",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3",
                    children: [
                      "Pnj Ke",
                      orderData.column == "pinjaman_ke" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "pinjaman_ke" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "jumlah_angsuran",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3",
                    children: [
                      "jml Angsuran",
                      orderData.column == "jumlah_angsuran" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "jumlah_angsuran" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "pinjaman",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3",
                    children: [
                      "Pinjaman",
                      orderData.column == "pinjaman" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "pinjaman" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "total_angsuran_bulan_lalu",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3",
                    children: [
                      "Angs Bln Sebelumnya",
                      orderData.column == "total_angsuran_bulan_lalu" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "total_angsuran_bulan_lalu" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "total_angsuran_bulan_ini",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3",
                    children: [
                      "Saldo Sebelumnya",
                      orderData.column == "total_angsuran_bulan_ini" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "total_angsuran_bulan_ini" && filterModal()
                    ]
                  }
                ) }) }),
                dateOfWeek && dateOfWeek.map((item, key) => /* @__PURE__ */ jsx("th", { children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-3", children: dayjs(item).format("DD-MM-YY") }) }) }, key)),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "total_angsuran_bulan_ini",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3",
                    children: [
                      "Angsuran",
                      orderData.column == "total_angsuran_bulan_ini" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "total_angsuran_bulan_ini" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "saldo_bulan_ini",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3",
                    children: [
                      "Saldo",
                      orderData.column == "saldo_bulan_ini" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "saldo_bulan_ini" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "status",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Status",
                      orderData.column == "status" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "status" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "lunas",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Lunas",
                      orderData.column == "lunas" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "lunas" && filterModal()
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsx("th", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-item": "jenis_nasabah",
                    "data-format": "text",
                    className: "flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger",
                    children: [
                      "Jenis Nasabah",
                      orderData.column == "jenis_nasabah" && /* @__PURE__ */ jsx("span", { className: "ml-1 italic text-blue-400", children: orderData.orderby }),
                      showFilter.column == "jenis_nasabah" && filterModal()
                    ]
                  }
                ) }) })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: displayData && displayData.map((item, key) => /* @__PURE__ */ jsxs("tr", { className: "bg-white even:bg-blue-50", children: [
                /* @__PURE__ */ jsx("td", { className: "top-0 left-0 z-40 lg:sticky bg-inherit", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-start gap-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-1 w-full px-4 py-1", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { children: key + 1 }),
                      /* @__PURE__ */ jsx("span", { children: " | " }),
                      /* @__PURE__ */ jsx("span", { children: item.nomor_pinjaman })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("pinjaman.normal.show", item.id),
                        className: "p-1 text-sm font-semibold text-white bg-blue-400 rounded",
                        children: /* @__PURE__ */ jsx(BiEditAlt, {})
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex-[2] py-1 px-4 text-start lg:whitespace-nowrap", children: item.nama_customer })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly w-36", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.nik_customer }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly w-36", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 px-4 py-1", children: [
                  item.lunas == "lunas" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded", children: "Lunas" }) : "",
                  item.status == "normal" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs border rounded", children: item.status }) : item.status == "cm" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded", children: item.status }) : item.status == "mb" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded", children: item.status }) : item.status == "ml" ? /* @__PURE__ */ jsx("span", { className: "px-2 py-1 mr-1 text-xs text-white bg-black border rounded", children: item.status }) : /* @__PURE__ */ jsx("div", { children: item.status })
                ] }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly w-36", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.alamat_customer }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.kelompok }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.hari }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: dayjs(item.tanggal_drop).format("DD-MM-YYYY") }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.pinjaman_ke }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.jumlah_angsuran }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly whitespace-nowrap text-end", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: /* @__PURE__ */ jsx(
                  NumericFormat,
                  {
                    value: item.pinjaman,
                    displayType: "text",
                    thousandSeparator: ",",
                    prefix: "Rp. "
                  }
                ) }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly whitespace-nowrap text-end", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: /* @__PURE__ */ jsx(
                  NumericFormat,
                  {
                    value: item.total_angsuran_bulan_lalu,
                    displayType: "text",
                    thousandSeparator: ",",
                    prefix: "Rp. "
                  }
                ) }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly whitespace-nowrap text-end", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: /* @__PURE__ */ jsx(
                  NumericFormat,
                  {
                    value: item.saldo_bulan_lalu,
                    displayType: "text",
                    thousandSeparator: ",",
                    prefix: "Rp. "
                  }
                ) }) }) }),
                dateOfWeek && dateOfWeek.map((dateweek, key2) => /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly whitespace-nowrap text-end", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: (() => {
                  const results = item.angsuran.find(
                    (angs) => angs.pembayaran_date == dateweek
                  );
                  return /* @__PURE__ */ jsx(
                    NumericFormat,
                    {
                      value: results == null ? void 0 : results.jumlah,
                      displayType: "text",
                      thousandSeparator: ",",
                      prefix: "Rp. "
                    }
                  );
                })() }) }) }, key2)),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly whitespace-nowrap text-end", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: /* @__PURE__ */ jsx(
                  NumericFormat,
                  {
                    value: item.total_angsuran_bulan_ini,
                    displayType: "text",
                    thousandSeparator: ",",
                    prefix: "Rp. "
                  }
                ) }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly whitespace-nowrap text-end", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: /* @__PURE__ */ jsx(
                  NumericFormat,
                  {
                    value: item.saldo_bulan_ini,
                    displayType: "text",
                    thousandSeparator: ",",
                    prefix: "Rp. "
                  }
                ) }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.status }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.lunas }) }) }),
                /* @__PURE__ */ jsx("td", { className: "relative z-30", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-evenly", children: /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-1", children: item.loan_notes }) }) })
              ] }, key)) })
            ] }) }) })
          ] })
        ] })
      ]
    }
  );
};
export {
  Index as default
};
