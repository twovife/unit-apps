import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { L as LinkButton } from "./LinkButton-c1a6bd65.mjs";
import { usePage, Head, router } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { M as MobileLayout } from "./MobileLayout-e5e11ef2.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-03f33995.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "lucide-react";
const Show = ({
  requesttoApprove,
  loanHistory,
  requestHistory,
  can_edit,
  ...props
}) => {
  const { progress } = usePage();
  console.log(progress);
  const [loading, setLoading] = useState(false);
  const handleAction = (params) => {
    router.put(
      route("mantriapps.update", requesttoApprove.id),
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
    MobileLayout,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Buku Transaksi",
      loading,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Buku Transaksi" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-3 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold underline ", children: "Pengajuan Pinjaman" }),
            /* @__PURE__ */ jsx(
              LinkButton,
              {
                color: "blue",
                as: "a",
                href: props.back_to_index,
                title: "Back"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Hari, Tanggal Pengajuan" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-[5]", children: [
                /* @__PURE__ */ jsx("span", { className: "capitalize", children: requesttoApprove.hari }),
                ", ",
                dayjs(requesttoApprove.tanggal_pengajuan).format(
                  "DD-MM-YYYY"
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Hari, Tanggal Drop" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-[5]", children: [
                /* @__PURE__ */ jsx("span", { className: "capitalize", children: requesttoApprove.hari }),
                ", ",
                dayjs(requesttoApprove.tanggal_drop).format(
                  "DD-MM-YYYY"
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Nomor Pinjaman" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: requesttoApprove.id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Nomor Nasabah" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-[5]", children: [
                requesttoApprove.customer_name,
                /* @__PURE__ */ jsxs("span", { className: "font-light italic text-gray-500", children: [
                  " (",
                  requesttoApprove.customer_nik,
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Alamat" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: requesttoApprove.customer_alamat })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Permintaan Drop" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: /* @__PURE__ */ jsx(
                NumericFormat,
                {
                  value: requesttoApprove.drop,
                  displayType: "text",
                  thousandSeparator: ",",
                  prefix: "Rp. "
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Unit / Kelompok" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-[5]", children: [
                requesttoApprove.unit,
                " / Kelompok ",
                requesttoApprove.kelompok
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Mantri" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: requesttoApprove.mantri_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Pengajuan Ke" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: requesttoApprove.pengajuan_ke })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-[3]", children: "Status" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[1]", children: ":" }),
              /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded border ${requesttoApprove.status == "open" ? `bg-gray-200` : requesttoApprove.status == "acc" ? "bg-green-200" : requesttoApprove.status == "tolak" ? "bg-red-200" : "bg-gray-200"}`,
                  children: requesttoApprove.status
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end items-center", children: can_edit && requesttoApprove.status == "open" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "bg-green-200 py-1 px-2 rounded hover:bg-green-300 border border-green-300",
                type: "button",
                onClick: () => handleAction(1),
                children: "Terima"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "bg-red-200 py-1 px-2 rounded hover:bg-red-300 border border-red-300",
                type: "button",
                onClick: () => handleAction(2),
                children: "Tolak"
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2", children: requesttoApprove.status == "acc" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-green-600", children: "Acc" }),
            requesttoApprove.instalment == 0 && /* @__PURE__ */ jsx(
              "button",
              {
                className: "bg-red-200 py-1 px-2 rounded hover:bg-red-300 border border-red-300",
                type: "button",
                onClick: () => handleAction(3),
                children: "Batalkan"
              }
            )
          ] }) : requesttoApprove.status == "tolak" ? /* @__PURE__ */ jsx("div", { children: "ditolak" }) : "" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mb-2", children: "History Pinjaman" }),
            /* @__PURE__ */ jsx("div", { className: "overflow-hidden mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left text-gray-500", children: [
              /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-1 py-1", children: "No" }),
                /* @__PURE__ */ jsx("th", { className: "px-1 py-1", children: "Tanggal Drop" }),
                /* @__PURE__ */ jsx("th", { className: "px-1 py-1", children: "Unit / Mantri" }),
                /* @__PURE__ */ jsx("th", { className: "px-1 py-1", children: "Drop" }),
                /* @__PURE__ */ jsx("th", { className: "px-1 py-1", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: loanHistory ? loanHistory.map((item, key) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "even:bg-gray-50 hover:bg-gray-200",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-1 py-1", children: item.id }),
                    /* @__PURE__ */ jsx("td", { className: "px-1 py-1 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "capitalize mb-1", children: [
                      item.hari,
                      ", ",
                      dayjs(
                        item.tanggal_drop
                      ).format(
                        "DD-MM-YY"
                      )
                    ] }) }),
                    /* @__PURE__ */ jsxs("td", { className: "px-1 py-1 whitespace-nowrap", children: [
                      /* @__PURE__ */ jsx("div", { children: item.unit }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        item.mantri_name,
                        " ",
                        item.kelompok
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-1 py-1 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                      NumericFormat,
                      {
                        value: item.drop,
                        displayType: "text",
                        thousandSeparator: ","
                      }
                    ) }),
                    /* @__PURE__ */ jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx("div", { className: "overflow-hidden mb-3 rounded border border-black/5 shadow p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500", children: [
              /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "No" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Tanggal Drop" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Unit" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Mantri" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Drop" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: requestHistory ? requestHistory.map((item, key) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "even:bg-gray-50 hover:bg-gray-200 text-xs",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: item.id }),
                    /* @__PURE__ */ jsxs("td", { className: "px-3 py-2", children: [
                      item.hari,
                      ", ",
                      dayjs(
                        item.tanggal_pengajuan
                      ).format("DD-MM-YYYY")
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: item.unit }),
                    /* @__PURE__ */ jsxs("td", { className: "px-3 py-2", children: [
                      item.mantri_name,
                      " -",
                      " ",
                      item.kelompok
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                      NumericFormat,
                      {
                        value: item.drop,
                        displayType: "text",
                        thousandSeparator: ","
                      }
                    ) }),
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
        ] }) }) })
      ]
    }
  );
};
export {
  Show as default
};
