import { j as jsxs, a as jsx } from "../ssr.mjs";
import { L as LinkButton } from "./LinkButton-3cafffab.mjs";
import { useForm, Head } from "@inertiajs/react";
import dayjs from "dayjs";
import "react";
import { NumericFormat } from "react-number-format";
import { M as MobileLayout } from "./MobileLayout-c4f7ad08.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import CurrencyInput from "react-currency-input-field";
import { S as SelectList } from "./SelectList-224f2d77.mjs";
import { u as useServerFilter } from "./useServerFilter-d19c7d4b.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-dc4db3bc.mjs";
import "sweetalert2";
import "sweetalert2-react-content";
import "react-dom";
import "@headlessui/react";
import "react-icons/ai";
const Bayar = ({ loan, ...props }) => {
  var _a;
  const { status_angsuran } = useServerFilter();
  const statusAngsuran = status_angsuran.filter(
    (item) => item.value >= loan.status
  );
  const { data, setData, post, processing, errors, reset } = useForm({
    danatitipan: false,
    jumlah: 0,
    status: loan.status,
    pembayaran_date: ""
  });
  console.log(errors);
  const handleOnChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, parseInt(value));
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(route("mantriapps.bayarpost", loan.id), {
      onSuccess: () => reset()
    });
  };
  let pinjaman = loan.pinjaman;
  return /* @__PURE__ */ jsxs(
    MobileLayout,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Buku Transaksi",
      loading: processing,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Buku Transaksi" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/30 rounded shadow w-full p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full justify-between items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Bayar Angsuran" }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: /* @__PURE__ */ jsx(
              LinkButton,
              {
                as: "a",
                href: props.back_button,
                color: "blue",
                title: "Back"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "overflow-auto", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Nasabah" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: loan.customer.nama })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Alamat" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: loan.customer.alamat })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "NIK" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: loan.customer.nik })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Kelompok | Mantri" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
                  loan.kelompok,
                  " | ",
                  loan.droper.nama_karyawan
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Tanggal Drop" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: dayjs(loan.tanggal_drop).format("DD-MM-YYYY") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Pinjaman" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
                  /* @__PURE__ */ jsx(
                    NumericFormat,
                    {
                      value: loan.pinjaman,
                      displayType: "text",
                      thousandSeparator: ",",
                      prefix: "Rp. "
                    }
                  ),
                  "| ",
                  loan.status
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx("div", { className: "shadow text-xs rounded overflow-auto border max-h-[50vh]", children: /* @__PURE__ */ jsxs("table", { className: "w-full bg-white", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "No" }),
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "Tanggal Angsur" }),
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "Jumlah" }),
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "Saldo" }),
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: (_a = loan.angsuran) == null ? void 0 : _a.map((item, key) => {
                pinjaman = pinjaman - item.jumlah;
                return /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    className: "odd:bg-gray-200",
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: key + 1 }),
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: dayjs(
                        item.pembayaran_date
                      ).format("DD-MM-YY") }),
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: item.jumlah,
                          displayType: "text",
                          thousandSeparator: ",",
                          prefix: "Rp. "
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: pinjaman,
                          displayType: "text",
                          thousandSeparator: ",",
                          prefix: "Rp. "
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: item.status == 1 ? "Normal" : item.status == 2 ? "CM" : item.status == 3 ? "MB" : "ML" })
                    ]
                  },
                  key
                );
              }) })
            ] }) }) }),
            /* @__PURE__ */ jsxs("form", { onSubmit: onSubmitCreate, className: "mt-3", children: [
              /* @__PURE__ */ jsx("div", { children: "Input Data" }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 flex-wrap", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Tanggal" }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "date",
                      onChange: handleOnChange,
                      max: props.batasan.maxdate,
                      min: props.batasan.mindate,
                      className: "block mt-1 w-full",
                      id: "pembayaran_date",
                      name: "pembayaran_date",
                      value: data.pembayaran_date
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: errors.pembayaran_date,
                      className: "mt-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Jumlah" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      name: "jumlah",
                      id: "jumlah",
                      className: `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full mt-1`,
                      allowDecimals: false,
                      prefix: "Rp. ",
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
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Status" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
                    /* @__PURE__ */ jsx(
                      SelectList,
                      {
                        onChange: handleOnChange,
                        options: statusAngsuran,
                        className: "block mt-1 w-full",
                        id: "status",
                        name: "status",
                        value: data.status
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: errors.status,
                        className: "mt-2"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx(
                      Checkbox,
                      {
                        name: "danatitipan",
                        value: data.danatitipan,
                        onChange: handleOnChange
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Dana Titipan?" })
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(PrimaryButton, { title: "Submit", type: "submit" }) })
            ] })
          ] })
        ] })
      ]
    }
  );
};
export {
  Bayar as default
};
