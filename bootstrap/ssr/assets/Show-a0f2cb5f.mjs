import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { L as LinkButton } from "./LinkButton-3cafffab.mjs";
import { usePage, Head, router } from "@inertiajs/react";
import { useState } from "react";
import "./TextInput-11198f62.mjs";
import { A as Authenticated } from "./AuthenticatedLayout-be201853.mjs";
import dayjs from "dayjs";
import "react-currency-input-field";
import { NumericFormat } from "react-number-format";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@headlessui/react";
import "react-icons/bi";
import "hamburger-react";
import "./Loading-dc4db3bc.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
const Show = ({ requesttoApprove, loanHistory, requestHistory, ...props }) => {
  usePage();
  const [loading, setLoading] = useState(false);
  const handleAction = (params) => {
    router.put(
      route("transaction.update", requesttoApprove.id),
      {
        action: params
      },
      // { only: requesttoApprove },
      {
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false)
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
          /* @__PURE__ */ jsx("div", { className: "px-6 py-4 flex justify-end items-center", children: /* @__PURE__ */ jsx(
            LinkButton,
            {
              color: "outline",
              as: "a",
              href: props.back_to_index,
              title: "Back"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "Pengajuan Pinjaman" }),
              /* @__PURE__ */ jsx("div", { className: "overflow-auto mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
                /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Pengajuan" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nomor Pinjaman" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nama Customer" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "NIK" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Alamat" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Unit" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Kelompok" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Hari" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Drop" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Drop" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nama Mantri" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Pengajuan Ke" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: requesttoApprove ? /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(
                    requesttoApprove.tanggal_pengajuan
                  ).format("DD-MM-YYYY") }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: requesttoApprove.id }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: requesttoApprove.customer_name }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: requesttoApprove.customer_nik }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 max-w-36", children: requesttoApprove.customer_alamat }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: requesttoApprove.unit }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: requesttoApprove.kelompok }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: requesttoApprove.hari }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                    NumericFormat,
                    {
                      value: requesttoApprove.drop,
                      displayType: "text",
                      thousandSeparator: ",",
                      prefix: "Rp. "
                    }
                  ) }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(
                    requesttoApprove.tanggal_drop
                  ).format("DD-MM-YYYY") }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: requesttoApprove.mantri_name }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: requesttoApprove.pengajuan_ke }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: requesttoApprove.status == "open" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "bg-green-200 py-1 px-2 rounded text-xs hover:bg-green-300",
                        type: "button",
                        onClick: () => handleAction(
                          1
                        ),
                        children: "Terima"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "bg-red-200 py-1 px-2 rounded text-xs hover:bg-red-300",
                        type: "button",
                        onClick: () => handleAction(
                          2
                        ),
                        children: "Tolak"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2", children: requesttoApprove.status == "acc" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-green-600", children: "Acc" }),
                    requesttoApprove.instalment == 0 && /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "bg-red-200 py-1 px-2 rounded text-xs hover:bg-red-300",
                        type: "button",
                        onClick: () => handleAction(
                          3
                        ),
                        children: "Batalkan"
                      }
                    )
                  ] }) : requesttoApprove.status == "tolak" ? /* @__PURE__ */ jsx("div", { children: "ditolak" }) : "" }) })
                ] }, requesttoApprove.id) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, children: "Data tidak ditemukan" }) }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "History Pinjaman" }),
              /* @__PURE__ */ jsx("div", { className: "overflow-auto mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
                /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nomor Pinjaman" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Drop" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Hari" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Unit" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Kelompok" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Mantri" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Drop" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Pinjaman" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "JML Angsuran" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Saldo" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Pinjaman Ke" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: loanHistory ? loanHistory.map((item, key) => /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    className: "even:bg-gray-50 hover:bg-gray-200",
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.id }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(
                        item.tanggal_pengajuan
                      ).format("DD-MM-YYYY") }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.hari }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.unit }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.kelompok }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.mantri_name }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: item.drop,
                          displayType: "text",
                          thousandSeparator: ",",
                          prefix: "Rp. "
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: item.pinjaman,
                          displayType: "text",
                          thousandSeparator: ",",
                          prefix: "Rp. "
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.juml_pembayaran }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: item.saldo,
                          displayType: "text",
                          thousandSeparator: ",",
                          prefix: "Rp. "
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.pinjaman_ke }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `px-2 py-1 rounded ${item.status == "normal" || item.status == "cm" ? `bg-green-200` : item.status == "mb" ? "bg-yellow-200" : item.status == "ml" ? "bg-red-200" : ""}`,
                          children: item.status
                        }
                      ) })
                    ]
                  },
                  item.key
                )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, children: "Data tidak ditemukan" }) }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "History Pengajuan Sebelumnya" }),
              /* @__PURE__ */ jsx("div", { className: "overflow-auto mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
                /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Nomor Pinjaman" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Drop" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Hari" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Unit" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Kelompok" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Mantri" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Drop" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Pinjaman Ke" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: requestHistory ? requestHistory.map((item, key) => /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    className: "even:bg-gray-50 hover:bg-gray-200",
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.id }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: dayjs(
                        item.tanggal_pengajuan
                      ).format("DD-MM-YYYY") }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.hari }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.unit }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.kelompok }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.mantri_name }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: item.drop,
                          displayType: "text",
                          thousandSeparator: ",",
                          prefix: "Rp. "
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.pengajuan_ke }),
                      /* @__PURE__ */ jsx("td", { className: `px-3 py-2`, children: /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `px-2 py-1 rounded ${item.status == "acc" ? `bg-green-200` : item.status == "tolak" ? "bg-red-200" : ""}`,
                          children: item.status
                        }
                      ) })
                    ]
                  },
                  item.key
                )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, children: "Data tidak ditemukan" }) }) })
              ] }) })
            ] })
          ] }) })
        ] })
      ]
    }
  );
};
export {
  Show as default
};
