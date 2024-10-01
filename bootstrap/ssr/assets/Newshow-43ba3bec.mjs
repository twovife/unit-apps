import { j as jsxs, a as jsx } from "../ssr.mjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { L as LinkButton } from "./LinkButton-c1a6bd65.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { S as SelectList } from "./SelectList-8beaa241.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import { u as useServerFilter } from "./useServerFilter-295b27f7.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-320c7184.mjs";
import { useForm, Head } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { NumericFormat } from "react-number-format";
import JenisNasabah from "./JenisNasabah-a7a23335.mjs";
import ModalHapus from "./ModalHapus-7f64f800.mjs";
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
import "react-icons/bi";
import "hamburger-react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
const Newshow = ({ loan, instalment, ...props }) => {
  const { emps } = useServerFilter(null, null, null, props.mantri);
  useServerFilter();
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletUrl, setDeletUrl] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    tanggal_pembayaran: "",
    jumlah: "",
    mantri: loan.mantri_id,
    danatitipan: false
  });
  const handleOnChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(route("pinjaman.normal.update", loan.id));
    reset();
  };
  const onClickDelete = (params) => {
    setShowDelete(true);
    setDeletUrl(params);
  };
  const onHideDelete = () => {
    setShowDelete(false);
    setDeletUrl(null);
  };
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Buku Transaksi",
      loading: processing || loading,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Buku Transaksi" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onClickDelete(
                  route("pinjaman.normal.deleteLoan", loan.id)
                ),
                className: "border border-red-500 text-red-500 px-2 py-1 text-xs rounded",
                children: "Hapus Pinjaman"
              }
            ),
            /* @__PURE__ */ jsx(
              LinkButton,
              {
                color: "outline",
                as: "a",
                href: props.back_to_index,
                title: "Back"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "Pengajuan Pinjaman" }),
              /* @__PURE__ */ jsx("div", { className: "overflow-auto mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
                /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap text-center", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nomor Pinjaman" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nama Nasabah" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "NIK" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Unit" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Kelompok" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Hari" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Drop" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Pinjaman" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nama Mantri" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Status" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Jenis Nasabah" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Lunas" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "text-center", children: loan ? /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: loan.nomor_pinjaman }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: loan.nama_customer }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: loan.nik_customer }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: loan.unit }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: loan.kelompok }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: loan.hari }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(
                    loan.tanggal_drop
                  ).format("DD-MM-YYYY") }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                    NumericFormat,
                    {
                      value: loan.pinjaman,
                      displayType: "text",
                      thousandSeparator: ","
                    }
                  ) }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: loan.mantri }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: loan.status }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: loan.loan_notes }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: loan.lunas })
                ] }, loan.nomor_pinjaman) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, children: "Data tidak ditemukan" }) }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3 lg:flex justify-between w-full gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex-[2] ", children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "History Pembayaran" }),
                /* @__PURE__ */ jsx("div", { className: "overflow-hidden mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsx("div", { className: "max-h-[50vh] overflow-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
                  /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap z-20 text-center", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Action" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Pembayaran" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Jumlah" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Saldo" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Dana titipan" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Mantri" }),
                    /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Status" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "relative z-10 text-center", children: instalment ? instalment.map(
                    (item, key) => /* @__PURE__ */ jsxs(
                      "tr",
                      {
                        className: "even:bg-gray-50 hover:bg-gray-200",
                        children: [
                          /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: () => onClickDelete(
                                route(
                                  "pinjaman.normal.deleteAngsuran",
                                  item.id
                                )
                              ),
                              className: "bg-red-400 px-2 py-1 rounded text-white",
                              children: "Hapus"
                            }
                          ) }),
                          /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(
                            item.tanggal_pembayaran
                          ).format(
                            "DD-MM-YYYY"
                          ) }),
                          /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-end", children: /* @__PURE__ */ jsx(
                            NumericFormat,
                            {
                              value: item.jumlah,
                              displayType: "text",
                              thousandSeparator: ","
                            }
                          ) }),
                          /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-end", children: /* @__PURE__ */ jsx(
                            NumericFormat,
                            {
                              value: item.saldo,
                              displayType: "text",
                              thousandSeparator: ","
                            }
                          ) }),
                          /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.danatitipan }),
                          /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.mantri }),
                          /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.status })
                        ]
                      },
                      key
                    )
                  ) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, children: "Belum Ada Pembayaran Ditemukan" }) }) })
                ] }) }) })
              ] }),
              /* @__PURE__ */ jsx(
                ModalHapus,
                {
                  show: showDelete,
                  setShow: onHideDelete,
                  url: deletUrl,
                  loading,
                  setLoading
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "Pembayaran Angsuran" }),
                  /* @__PURE__ */ jsx("div", { className: "overflow-hidden mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsxs(
                    "form",
                    {
                      onSubmit: onSubmitCreate,
                      className: "max-h-[50vh] overflow-auto",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
                          /* @__PURE__ */ jsx(
                            InputLabel,
                            {
                              htmlFor: "tanggal_pembayaran",
                              value: "Tanggal Pembayaran"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            TextInput,
                            {
                              id: "tanggal_pembayaran",
                              type: "date",
                              name: "tanggal_pembayaran",
                              value: data.tanggal_pembayaran,
                              min: props.min_date,
                              max: props.max_date,
                              className: "mt-1 block w-full",
                              autoComplete: "tanggal_pembayaran",
                              isFocused: true,
                              onChange: handleOnChange
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            InputError,
                            {
                              message: errors.tanggal_pembayaran,
                              className: "mt-2"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
                          /* @__PURE__ */ jsx(
                            InputLabel,
                            {
                              htmlFor: "jumlah",
                              value: "Nominal jumlah",
                              className: "mb-1"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            CurrencyInput,
                            {
                              name: "jumlah",
                              id: "jumlah",
                              className: `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2`,
                              allowDecimals: false,
                              prefix: "Rp. ",
                              min: 1,
                              required: true,
                              onValueChange: onHandleCurencyChange,
                              value: data.jumlah,
                              placeholder: "Inputkan angka tanpa sparator"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            InputError,
                            {
                              message: errors.jumlah,
                              className: "mt-2"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
                          /* @__PURE__ */ jsx(
                            InputLabel,
                            {
                              htmlFor: "mantri",
                              value: "Mantri"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            SelectList,
                            {
                              id: "mantri",
                              type: "text",
                              name: "mantri",
                              options: emps,
                              nullValue: true,
                              value: data.mantri,
                              className: "mt-1 block w-full",
                              onChange: handleOnChange
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            InputError,
                            {
                              message: errors.mantri,
                              className: "mt-2"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "mb-1 mt-3 flex justify-between items-center", children: [
                          /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
                            /* @__PURE__ */ jsx(
                              Checkbox,
                              {
                                name: "danatitipan",
                                value: data.danatitipan,
                                onChange: handleOnChange
                              }
                            ),
                            /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Dana Titipan?" })
                          ] }),
                          /* @__PURE__ */ jsx(
                            PrimaryButton,
                            {
                              title: "Submit",
                              type: "submit"
                            }
                          )
                        ] })
                      ]
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx(JenisNasabah, { loan })
              ] })
            ] })
          ] }) })
        ] })
      ]
    }
  );
};
export {
  Newshow as default
};
